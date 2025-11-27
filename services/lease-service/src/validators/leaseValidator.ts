import z from "zod";

export const leaseValidator = z.object({
    unitId: z.uuid("Invalid unit ID"),
    tenantId:z.uuid("Invalid tenant ID"),
    moveInDate: z.date("Invalid move in date").optional(),
    moveOutDate: z.date("Invalid move out date").optional(),
    rentAmount: z.number().positive("Rent amount must be a positive number"),
    securityDeposit: z.number().positive("Security deposit must be a positive number").default(0),
    serviceCharge: z.number().positive("Service charge must be a positive number").default(0),
    totalAmount: z.number().positive("Total amount must be a positive number").default(0),
    paymentFrequency: z.enum(["MONTHLY", "QUARTERLY", "YEARLY", "BI_ANNUALLY"]).default("YEARLY"),
    status: z.enum(["PENDING", "ACTIVE", "TERMINATED", "EXPIRED", "CANCELLED"]).default("PENDING"),
    agreementUrl: z.string().url("Invalid agreement URL").optional(),
    terminationDate: z.date("Invalid termination date").optional(),
});

export const updateLeaseValidator = z.object({
    moveInDate: z.date("Invalid move in date").optional(),
    moveOutDate: z.date("Invalid move out date").optional(),
    terminationDate: z.date("Invalid termination date").optional(),
    terminationReason: z.string("Invalid termination reason").optional(),
    paymentFrequency: z.enum(["MONTHLY", "QUARTERLY", "YEARLY", "BI_ANNUALLY"]).optional(),
    status: z.enum(["PENDING", "ACTIVE", "TERMINATED", "EXPIRED", "CANCELLED"]).optional(),
    agreementUrl: z.string().url("Invalid agreement URL").optional(),
    totalAmount: z.number().positive("Total amount must be a positive number").optional(),
    serviceCharge: z.number().positive("Service charge must be a positive number").optional(),
    securityDeposit: z.number().positive("Security deposit must be a positive number").optional(),
});