import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./authenticate";

export function requireAdmin(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	if (req.user?.role !== "admin") {
		return res.status(403).json({
			error: "Administrator access required",
		});
	}

	next();
}