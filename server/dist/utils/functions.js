"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRandomString = createRandomString;
exports.createResponseMessage = createResponseMessage;
function createRandomString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function createResponseMessage(success, message, data = {}) {
    const response = {
        success,
        message,
        data,
    };
    return JSON.stringify(response);
}
