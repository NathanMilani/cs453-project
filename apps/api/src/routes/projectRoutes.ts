import { Router } from "express";
import { AuthenticatedRequest } from "../middleware/authenticate";
import {
	createProject,
	getProjectById,
	getProjectsForUser,
} from "../services/projectService";

const router = Router();

router.get("/", async (req: AuthenticatedRequest, res) => {
	try {
		const user = req.user!;

		const projects = await getProjectsForUser(
			user.userId,
			user.role,
		);

		res.json(projects);
	} catch (error) {
		console.error("Failed to fetch projects:", error);

		res.status(500).json({
			error: "Failed to fetch projects",
		});
	}
});

router.post("/", async (req: AuthenticatedRequest, res) => {
	try {
		const { name, description } = req.body;

		if (!name) {
			return res.status(400).json({
				error: "Project name is required",
			});
		}

		const project = await createProject(
			name,
			description,
			req.user!.userId,
		);

		res.status(201).json(project);
	} catch (error) {
		console.error("Failed to create project:", error);

		res.status(500).json({
			error: "Failed to create project",
		});
	}
});

router.get("/:id", async (req: AuthenticatedRequest, res) => {
	try {
		const id = Number(req.params.id);

		if (Number.isNaN(id)) {
			return res.status(400).json({
				error: "Invalid project id",
			});
		}

		const project = await getProjectById(id);

		if (!project) {
			return res.status(404).json({
				error: "Project not found",
			});
		}

		const isOwner = project.ownerId === req.user!.userId;
		const isAdmin = req.user!.role === "admin";

		if (!isOwner && !isAdmin) {
			return res.status(403).json({
				error: "You do not have permission to view this project",
			});
		}

		res.json(project);
	} catch (error) {
		console.error("Failed to fetch project:", error);

		res.status(500).json({
			error: "Failed to fetch project",
		});
	}
});

export default router;