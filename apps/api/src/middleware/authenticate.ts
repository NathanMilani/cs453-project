import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedRequest extends Request {
	user?: {
		userId: number;
		email: string;
		role: "user" | "admin";
	};
}

export function authenticate(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	const authorizationHeader = req.headers.authorization;

	if (!authorizationHeader?.startsWith("Bearer ")) {
		return res.status(401).json({
			error: "Authentication required",
		});
	}

	const token = authorizationHeader.substring("Bearer ".length);

	try {
		const payload = jwt.verify(token, env.jwtSecret);

		if (
			typeof payload === "string" ||
			typeof payload.userId !== "number" ||
			typeof payload.email !== "string" ||
			(payload.role !== "user" && payload.role !== "admin")
		) {
			return res.status(401).json({
				error: "Authentication required",
			});
		}

		req.user = {
			userId: payload.userId,
			email: payload.email,
			role: payload.role,
		};

		next();
	} catch {
		return res.status(401).json({
			error: "Authentication required",
		});
	}
}