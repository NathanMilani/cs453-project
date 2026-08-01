import { Router } from "express";
import { getAllUsers } from "../services/userService";

const router = Router();

router.get("/", async (_req, res) => {
	try {
		const users = await getAllUsers();
		res.json(users);
	} catch (error) {
		console.error("Failed to fetch users:", error);

		res.status(500).json({
			error: "Failed to fetch users",
		});
	}
});

export default router;