"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const lease_routes_1 = __importDefault(require("./routes/lease.routes"));
const leasePayment_routes_1 = __importDefault(require("./routes/leasePayment.routes"));
const leaseRenewal_routes_1 = __importDefault(require("./routes/leaseRenewal.routes"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const reservation_routes_1 = __importDefault(require("./routes/reservation.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const leaseAgreement_routes_1 = __importDefault(require("./routes/leaseAgreement.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Routes
app.use("/api/leases", lease_routes_1.default);
app.use("/api/lease-payments", leasePayment_routes_1.default);
app.use("/api/lease-renewals", leaseRenewal_routes_1.default);
app.use("/api/applications", application_routes_1.default);
app.use("/api/reservations", reservation_routes_1.default);
app.use("/api/payments", payment_routes_1.default);
app.use("/api/lease-agreements", leaseAgreement_routes_1.default);
// Catch all unknown routes
app.use((req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.default);
exports.default = app;
