import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import config from "../config/config.js";

let firebaseApp;
let storage;

// Initialize firebase and generate reference to the storage service
const initializeStorage = async () => {
    try {
        firebaseApp = initializeApp(config.firebaseStorage);
        storage = getStorage(firebaseApp);
        return storage;
    } catch (error) {
        throw error;
    }
};

// Upload a file to the storage service
const uploadFile = async (fileData, newFileName) => {
    try {
        // Check if the storage reference has been generated
        if (!storage) {
            initializeApp();
        }
        const fileToUpload = processFileData(fileData, newFileName);
        const storageRef = ref(storage, fileToUpload.name);
        await uploadBytes(storageRef, fileToUpload);

    } catch (error) {
        throw error;
    }
};

// Download a file from the storage service
const downloadFile = async (newFileName) => {
    try {
        // Check if the storage reference has been generated
        if (!storage) {
            initializeApp();
        }
        const fileToDownload = 'event_' + newFileName + '.jpeg';
        const storageRef = ref(storage, fileToDownload);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        throw error;
    }
};

// Delete a file from the storage service
const deleteFile = async (newFileName) => {
    try {
        // Check if the storage reference has been generated
        if (!storage) {
            initializeApp();
        }
        const fileToDelete = 'event_' + newFileName + '.jpeg';
        const storageRef = ref(storage, fileToDelete);
        await deleteObject(storageRef);
    } catch (error) {
        throw error;
    }
};


// Auxiliary function to process file data and generate a file object
const processFileData = (fileData, newFileName) => {
    const fileName = 'event_' + newFileName + '.' + fileData.mimetype.split("/")[1];
    return new File([fileData.buffer], fileName, { type: fileData.mimetype});
};

// Export
const firebaseStorage = {
    initializeStorage,
    uploadFile,
    downloadFile,
    deleteFile,
};

export default firebaseStorage;
