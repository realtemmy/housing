"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListings = exports.updateListing = exports.getListing = void 0;
const listing_service_1 = __importDefault(require("../services/listing.service"));
const listing_validators_1 = require("../validators/listing.validators");
const appError_1 = __importDefault(require("../utils/appError"));
const getListing = async (req, res, next) => {
    try {
        const { type, id } = req.params;
        const listingType = type;
        // Validate listing type
        if (!['property', 'unit', 'room', 'bed'].includes(listingType)) {
            throw new appError_1.default("Invalid listing type. Must be property, unit, room, or bed", 400);
        }
        const listing = await listing_service_1.default.getListing(listingType, id);
        res.status(200).json({
            status: "success",
            data: listing,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getListing = getListing;
const updateListing = async (req, res, next) => {
    try {
        const { type, id } = req.params;
        const listingType = type;
        // Validate listing type
        if (!['property', 'unit', 'room', 'bed'].includes(listingType)) {
            throw new appError_1.default("Invalid listing type. Must be property, unit, room, or bed", 400);
        }
        const validatedData = listing_validators_1.listingValidator.parse(req.body);
        const listing = await listing_service_1.default.updateListing(listingType, id, validatedData);
        res.status(200).json({
            status: "success",
            data: listing,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateListing = updateListing;
const getListings = async (req, res, next) => {
    try {
        const { type } = req.query;
        const listingType = type === 'property' || type === 'unit' || type === 'room' || type === 'bed'
            ? type
            : undefined;
        const options = {
            page: req.query.page ? parseInt(req.query.page, 10) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit, 10) : undefined,
            listingStatus: req.query.listingStatus,
            isFeatured: req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined,
            minViews: req.query.minViews ? parseInt(req.query.minViews, 10) : undefined,
        };
        const result = await listing_service_1.default.getListings(listingType, options);
        res.status(200).json({
            status: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getListings = getListings;
