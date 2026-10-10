"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = __importDefault(require("../utils/appError"));
const extractUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(new appError_1.default("Authorization header missing", 401));
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return next(new appError_1.default("No token in header", 401));
        }
        // Decode without verification - Kong already verified it
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.id) {
            return next(new appError_1.default("Invalid token format", 401));
        }
        // Attach userId to request
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        console.error("Error in extractUser middleware:", error);
        next(new appError_1.default("Token processing failed", 401));
    }
};
exports.extractUser = extractUser;
