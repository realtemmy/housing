"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Higher-order function to handle async route handlers
 * Wraps async functions and passes errors to Express error handler
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
