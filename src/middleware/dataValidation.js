// Import necessary dependencies
import validator from 'validator';

// Verify if input is a valid UUIDv4
const isValidUUID = (uuid) => {
    if (typeof uuid !== 'string') {
        return false;
    }
    return validator.isUUID(uuid, 4);
};

// Verify if input is a valid email
const isValidEmail = (email) => {
    if (typeof email !== 'string') {
        return false;
    }
    return validator.isEmail(email);
};

// Verify if input is a date in the RFC 3339 format
const isValidDate = (date) => {
    if (typeof date !== 'string') {
        return false;
    }
    return validator.isRFC3339(date);
};

// Verify if input is a valid category
const isValidCategory = (category) => {
    if (typeof category !== 'string') {
        return false;
    }
    const options = [business, conference, culture, networking, technology, sports, wellness, workshop];
    return validator.isIn(category.toLowerCase(), options);
};

// Verify if input follows the required format for price
const isValidPrice = (price) => {
    if (typeof price !== 'string') {
        return false;
    }
    const pattern = /^(EUR|USD|GBP)\d+\.\d{2}$/;
    return pattern.test(price);
};

// Verify if input is a valid capacity (non-negative integer)
const isValidCapacity = (capacity) => {
    if (typeof capacity !== 'number') {
        return false;
    }
    return Number.isInteger(capacity) && capacity >= 0;
};

// Verify if input is a valid description string (non-empty string with no leading/trailing whitespace)
const isValidString = (description) => {
    if (typeof description !== 'string') {
        return false;
    }
    return description.trim().length > 0;
};

// Export functions
module.exports = {
    isValidUUID,
    isValidEmail,
    isValidDate,
    isValidCategory,
    isValidPrice,
    isValidCapacity,
    isValidString,
};
