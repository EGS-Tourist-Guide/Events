import mongoose from 'mongoose';
import amazon_S3 from '../services/amazon_S3.js';
import dbConnection from '../database/connection.js';
import dbOperation from '../database/operations.js';
import Event from '../models/event.js';

// Upload a file to the storage
const uploadFile = async (req, res) => {
    try {
        // Check if event with the given uuid exists
        if (mongoose.connection.readyState === 0) {
            await dbConnection.connect();
        }

        const event = await dbOperation.readDocument(Event, req.params.uuid);

        // If the event does not exist
        if (!event) {
            return res.status(404).json({
                error: {
                    code: '403',
                    message: 'Forbidden',
                    details: 'You cannot associate an image to a non-existing event'
                }
            });
        }

        // Upload the file to the storage
        await amazon_S3.uploadFile(req.files[0], req.params.uuid);

        // Return the status code and the location header with the uri of the created event
        return res.status(201).setHeader('Location', `v1/images/${req.params.uuid}`).end();

    } catch (error) {
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal Server Error',
                details: 'An unexpected error has occurred. Please try again later'
            }
        });
    }
};

// Download a file from the storage
const downloadFile = async (req, res) => {
    try {
        // Get the file from the storage
        const file = await amazon_S3.downloadFile(req.params.uuid);

        // Return the status code, headers and file
        res.setHeader('Content-Type', file.type);
        res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
        return res.status(200).send(file.buffer);

    } catch (error) {
        if (error.Code === 'NoSuchKey') {
            return res.status(404).json({
                error: {
                    code: '404',
                    message: 'Not Found',
                    details: 'The requested resource does not exist',
                }
            });
        }
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal Server Error',
                details: 'An unexpected error has occurred. Please try again later'
            }
        }
        );
    };
};

// Delete a file from the storage
const deleteFile = async (req, res) => {
    try {
        // Delete the file from the storage
        await amazon_S3.deleteFile(req.params.uuid);

        // Return the status code
        return res.status(204).end();

    } catch (error) {
        return res.status(500).json({
            error: {
                code: '500',
                message: 'Internal Server Error',
                details: 'An unexpected error has occurred. Please try again later'
            }
        });
    }
};

const imageController = {
    uploadFile,
    downloadFile,
    deleteFile
};

export default imageController;
