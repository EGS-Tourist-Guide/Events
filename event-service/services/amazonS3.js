import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import config from "../config/config.js";

// Create credentials structure
const cred = {
    credentials: {
        accessKeyId: config.amazonS3.accessKeyId,
        secretAccessKey: config.amazonS3.secretAccessKey,
    },
    region: config.amazonS3.region,
    endpoint: config.amazonS3.url,
    forcePathStyle: config.amazonS3.forcePathStyle
}

// Upload a file to the storage service
const uploadFile = async (fileData, newFileName, maxRetries = 2, retryDelay = 250, timeout = 30000) => {
    try {
        // Generate the file name
        const fileName = 'event_' + newFileName + '.jpeg';

        // Upload the file
        const client = new S3Client(cred);
        const response = client.send(new PutObjectCommand({
            Body: fileData.buffer,
            Bucket: config.amazonS3.bucket,
            Key: fileName,
        }));

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('uploadFile from ../services/amazonS3.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([response, timeoutPromise]);

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return uploadFile(fileData, newFileName, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Download a file from the storage service
const downloadFile = async (newFileName, maxRetries = 2, retryDelay = 250, timeout = 30000) => {
    try {
        // Generate the file name
        const fileName = 'event_' + newFileName + '.jpeg';

        // Download the file data
        const client = new S3Client(cred);
        const response = client.send(new GetObjectCommand({
            Bucket: config.amazonS3.bucket,
            Key: fileName,
        }));

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('downloadFile from ../services/amazonS3.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([response, timeoutPromise]);

        // Convert the file data to a buffer and return it
        const chunks = [];
        for await (const chunk of result.Body) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        return {
            buffer: buffer,
            name: fileName,
            type: 'image/jpeg'
        };


    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return downloadFile(newFileName, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Delete a file from the storage service
const deleteFile = async (fileName, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        // Generate the file name
        const fileToDelete = 'event_' + fileName + '.jpeg';

        // Delete the file
        const client = new S3Client(cred);
        const response = client.send(new DeleteObjectCommand({
            Bucket: config.amazonS3.bucket,
            Key: fileToDelete,
        }));

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('deleteFile from ../services/amazonS3.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([response, timeoutPromise]);

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return deleteFile(fileName, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Export
const amazonS3 = {
    uploadFile,
    downloadFile,
    deleteFile
};

export default amazonS3;
