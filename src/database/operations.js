// Read all documents from the database, accepting optional query parameters
const readAllDocuments = async (model, query = {}, limit = 25, offset = 0) => {
    try {
        let allDocuments;
        if (Object.keys(query).length === 0) {
            allDocuments = await model.find().limit(limit).skip(offset);
        }
        else {
            allDocuments = await model.find(query).limit(limit).skip(offset);
        }
        return allDocuments;
    } catch (error) {
        throw error;
    }
};

// Read a single document from the database
const readDocument = async (model, id) => {
    try {
        const document = await model.findById(id);
        return document;
    } catch (error) {
        throw error;
    }
};

// Create a new document in the database
const createDocument = async (model, data) => {
    try {
        const newDocument = await model.create(data);
        return newDocument;
    } catch (error) {
        throw error;
    }
};

// Update a single document in the database
const updateDocument = async (model, id, data) => {
    try {
        const updatedDocument = await model.findByIdAndUpdate(id, data, { new: true });
        return updatedDocument;
    }
    catch (error) {
        throw error;
    }
};

// Delete a single document from the database
const deleteDocument = async (model, id) => {
    try {
        const deletedDocument = await model.findByIdAndDelete(id);
        return deletedDocument;
    }
    catch (error) {
        throw error;
    }
};

// Export
const dbOperation = {
    readAllDocuments,
    readDocument,
    createDocument,
    updateDocument,
    deleteDocument
};

export default dbOperation;
