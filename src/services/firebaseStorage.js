import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import config from "../config/config.js";

let firebaseApp;
let storageRef;

// Initialize firebase and generate reference to the storage service
const initializeStorage = async () => {
    try {
        firebaseApp = initializeApp(config.firebaseStorage);
        storageRef = getStorage(firebaseApp);
        return storageRef;
    } catch (error) {
        throw error;
    }
};

// Upload a file to the storage service
const updloadFile = async (fileData, remoteFileName) => {
    try {
        const fileRef = ref(storageRef, remoteFileName);
        await uploadBytes(fileRef, fileData);
    } catch (error) {
        throw error;
    }
};

// Download a file from the storage service
const downloadFile = async (remoteFileName) => {
    try {
        const fileRef = ref(storageRef, remoteFileName);
        const url = await getDownloadURL(fileRef);
        return url;
    } catch (error) {
        throw error;
    }
};

// Delete a file from the storage service
const deleteFile = async (remoteFileName) => {
    try {
        const fileRef = ref(storageRef, remoteFileName);
        await deleteObject(fileRef);
    } catch (error) {
        throw error;
    }
};

// Export
const firebaseStorage = {
    initializeStorage,
    updloadFile,
    downloadFile,
    deleteFile,
};

export default firebaseStorage;
