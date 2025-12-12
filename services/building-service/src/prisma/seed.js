"use strict";
// import { PrismaClient, BuildingType, AvailableStatus } from "../../generated/prisma";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("./../generated/prisma/client");
var prisma_1 = require("../lib/prisma");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var property, hostel, flat1, roomA, bedsData, _i, bedsData_1, bed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🌱 Starting seed...");
                    return [4 /*yield*/, prisma_1.prisma.property.create({
                            data: {
                                title: "Sunshine Student Lodge",
                                description: "Premium student accommodation near Unilag.",
                                ownerId: "owner-user-123", // Mock Owner ID
                                verified: true,
                                isActive: true,
                            },
                        })];
                case 1:
                    property = _a.sent();
                    console.log("Created Property: ".concat(property.title));
                    return [4 /*yield*/, prisma_1.prisma.building.create({
                            data: {
                                name: "Block A - The Hive",
                                description: "Main hostel block with shared amenities.",
                                type: client_1.BuildingType.HOSTEL, // <--- IMPORTANT: Flags this as a Hostel
                                propertyId: property.id,
                                floors: 2,
                                address: {
                                    create: {
                                        street: "15 Akoka Road",
                                        city: "Yaba",
                                        state: "Lagos",
                                        postalCode: "100001",
                                        country: "Nigeria",
                                    },
                                },
                            },
                        })];
                case 2:
                    hostel = _a.sent();
                    console.log("Created Building: ".concat(hostel.name));
                    return [4 /*yield*/, prisma_1.prisma.unit.create({
                            data: {
                                unitNumber: "Flat 1",
                                summary: "3-Bedroom Ground Floor Flat",
                                floor: 0,
                                bedrooms: 3,
                                bathrooms: 2,
                                type: "3-bedroom-shared",
                                buildingId: hostel.id,
                                status: client_1.AvailableStatus.AVAILABLE,
                                // Note: rentAmount is null here because we bill by the BED, not the unit.
                            },
                        })];
                case 3:
                    flat1 = _a.sent();
                    console.log("Created Unit: ".concat(flat1.unitNumber));
                    return [4 /*yield*/, prisma_1.prisma.room.create({
                            data: {
                                name: "Room A (Male Wing)",
                                size: 200, // sqft
                                unitId: flat1.id,
                                status: client_1.AvailableStatus.AVAILABLE,
                                // rentAmount is null here too, because we are billing beds.
                            },
                        })];
                case 4:
                    roomA = _a.sent();
                    bedsData = [
                        { label: "Bunk 1 - Top", price: 150000, deposit: 20000 },
                        { label: "Bunk 1 - Bottom", price: 180000, deposit: 20000 }, // Bottom is usually more expensive
                        { label: "Bunk 2 - Top", price: 150000, deposit: 20000 },
                        { label: "Bunk 2 - Bottom", price: 180000, deposit: 20000 },
                    ];
                    _i = 0, bedsData_1 = bedsData;
                    _a.label = 5;
                case 5:
                    if (!(_i < bedsData_1.length)) return [3 /*break*/, 8];
                    bed = bedsData_1[_i];
                    return [4 /*yield*/, prisma_1.prisma.bed.create({
                            data: {
                                label: bed.label,
                                rentAmount: bed.price,
                                depositAmount: bed.deposit,
                                status: client_1.AvailableStatus.AVAILABLE,
                                roomId: roomA.id,
                            },
                        })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log("Created ".concat(bedsData.length, " beds in ").concat(roomA.name));
                    // 6. Create a Maintenance Request (Linked to the Unit)
                    // Even though it's a bed issue, we link it to the Unit (Flat 1)
                    return [4 /*yield*/, prisma_1.prisma.maintenanceRequest.create({
                            data: {
                                title: "Broken Fan in Room A",
                                description: "The ceiling fan in Room A is wobbling dangerous.",
                                unitId: flat1.id,
                                requesterId: "student-user-999",
                                assigneeId: "admin-user-001",
                                priority: 5,
                                status: "OPEN",
                            },
                        })];
                case 9:
                    // 6. Create a Maintenance Request (Linked to the Unit)
                    // Even though it's a bed issue, we link it to the Unit (Flat 1)
                    _a.sent();
                    console.log("Created sample maintenance request.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma_1.prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
