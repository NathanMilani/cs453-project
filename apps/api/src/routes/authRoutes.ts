import { Router } from "express";
import {
	loginUser,
	registerUser,
} from "../services/authService";

const router = Router();

router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				error: "Name, email, and password are required",
			});
		}

		const user = await registerUser(name, email, password);

		res.status(201).json(user);
	} catch (error: any) {
		console.error("Failed to register user:", error);

		if (error?.code === "23505") {
			return res.status(409).json({
				error: "An account with this email already exists",
			});
		}

		res.status(500).json({
			error: "Failed to register user",
		});
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				error: "Email and password are required",
			});
		}

		const loginResult = await loginUser(email, password);

		if (!loginResult) {
			return res.status(401).json({
				error: "Invalid email or password",
			});
		}

		res.json(loginResult);
	} catch (error: any) {
		console.error("Failed to register user:", error);

		if (error?.code === "23505") {
			return res.status(409).json({
				error: "An account with this email already exists",
			});
		}

		res.status(500).json({
			error: "Failed to register user",
		});
	}
});

export default router;