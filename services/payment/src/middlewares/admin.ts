import { Request, Response, NextFunction } from "express";

export const verifyAdmin = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const adminKey = req.headers["x-admin-key"] as string;
    const validAdminKey = process.env.ADMIN_SECRET_KEY;

    if (!adminKey || adminKey !== validAdminKey) {
        return res.status(403).json({ message: "Unauthorized - Invalid admin key" });
    }

    next();
};
