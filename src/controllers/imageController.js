import firebaseStorage from '../services/firebaseStorage.js';

// Upload a file to the storage
const uploadFile = async (req, res) => {
    try {

        // Upload the file to the storage
        await firebaseStorage.uploadFile(req.files[0], req.params.uuid);

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

// Get the file download url from the storage
const downloadFile = async (req, res) => {
    try {

        // Get the file download url from the storage
        const url = await firebaseStorage.downloadFile(req.params.uuid);

        // Return the status code and the file download url
        return res.status(200).json({
            downloadUrl: url
        });

    } catch (error) {
        if (error.code === 'storage/object-not-found') {
            return res.status(404).json({
                error: {
                    code: '404',
                    message: 'Not Found',
                    details: 'The requested resource does not exist'
                }
            });
        }
        else {
            return res.status(500).json({
                error: {
                    code: '500',
                    message: 'Internal Server Error',
                    details: 'An unexpected error has occurred. Please try again later'
                }
            });
        }
    }
};

// Delete a file from the storage
const deleteFile = async (req, res) => {
    try {

        // Delete the file from the storage
        await firebaseStorage.deleteFile(req.params.uuid);

        // Return the status code
        return res.status(204).end();

    } catch (error) {
        // If a file with the UUID was not found, the return status code should still be 204 (No Content)
        if (error.code === 'storage/object-not-found') {
            return res.status(204).end();
        }
        else {
            return res.status(500).json({
                error: {
                    code: '500',
                    message: 'Internal Server Error',
                    details: 'An unexpected error has occurred. Please try again later'
                }
            });
        }
    }
};

const imageController = {
    uploadFile,
    downloadFile,
    deleteFile
};

export default imageController;
