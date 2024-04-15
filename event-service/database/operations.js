// Create a new document in the database
const createDocument = async (model, data, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const newDocument = model.create(data);

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('createDocument from ../database/operations.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([newDocument, timeoutPromise]);

        return newDocument;

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return createDocument(model, data, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Read a single document from the database
const readDocument = async (model, id, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const document = model.findById(id);

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('readDocument from ../database/operations.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([document, timeoutPromise]);

        return document;

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return readDocument(model, id, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Read all documents from the database, accepting optional query parameters
const readAllDocuments = async (model, query = {}, limit = 25, offset = 0, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        let allDocuments;
        if (Object.keys(query).length === 0) {
            allDocuments = model.find().limit(limit).skip(offset);
        }
        else {
            allDocuments = model.find(query).limit(limit).skip(offset);
        }

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('readAllDocuments from ../database/operations.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([allDocuments, timeoutPromise]);

        return allDocuments;

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return readAllDocuments(model, query, limit, offset, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Update a single document in the database
const updateDocument = async (model, id, data, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const updatedDocument = model.findByIdAndUpdate(id, data, { new: true });

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('updateDocument from ../database/operations.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([updatedDocument, timeoutPromise]);

        return updatedDocument;

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return updateDocument(model, id, data, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Delete a single document from the database
const deleteDocument = async (model, id, maxRetries = 2, retryDelay = 250, timeout = 7500) => {
    try {
        const deletedDocument = model.findByIdAndDelete(id);

        // Wait for either the response or the timeout to occur
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const timeoutError = new Error('deleteDocument from ../database/operations.js timed out');
                timeoutError.code = 'ETIMEOUT';
                reject(timeoutError);
            }, timeout);
        });
        await Promise.race([deletedDocument, timeoutPromise]);

        return deletedDocument;

    } catch (error) {
        if (maxRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return deleteDocument(model, id, maxRetries - 1, retryDelay + 250, timeout);
        }
        else {
            throw error;
        }
    }
};

// Export
const dbOperation = {
    createDocument,
    readDocument,
    readAllDocuments,
    updateDocument,
    deleteDocument
};

export default dbOperation;
