"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const appError_1 = __importDefault(require("./utils/appError"));
const error_controller_1 = __importDefault(require("./controllers/error.controller"));
const property_routes_1 = __importDefault(require("./routes/property.routes"));
const building_routes_1 = __importDefault(require("./routes/building.routes"));
const unit_routes_1 = __importDefault(require("./routes/unit.routes"));
const room_routes_1 = __importDefault(require("./routes/room.routes"));
const bed_routes_1 = __importDefault(require("./routes/bed.routes"));
const listing_routes_1 = __importDefault(require("./routes/listing.routes"));
const moveIn_routes_1 = __importDefault(require("./routes/moveIn.routes"));
const reserved_check_jobs_1 = __importDefault(require("./jobs/reserved-check.jobs"));
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
// Start background jobs
reserved_check_jobs_1.default.start();
// Routes
app.use("/api/properties", property_routes_1.default);
app.use("/api/buildings", building_routes_1.default);
app.use("/api/units", unit_routes_1.default);
app.use("/api/rooms", room_routes_1.default);
app.use("/api/beds", bed_routes_1.default);
app.use("/api/listings", listing_routes_1.default);
app.use("/api/move-in-handover", moveIn_routes_1.default);
// Catch all unknown routes
app.use((req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(error_controller_1.default);
exports.default = app;
