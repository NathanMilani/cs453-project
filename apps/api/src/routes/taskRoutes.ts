import { Router } from "express";
import { AuthenticatedRequest } from "../middleware/authenticate";
import {
	createTask,
	deleteTask,
	getProjectForTaskCreation,
	getTaskById,
	getTasksForUser,
	updateTask,
} from "../services/taskService";

const router = Router();

router.get("/", async (req: AuthenticatedRequest, res) => {
	try {
		const tasks = await getTasksForUser(
			req.user!.userId,
			req.user!.role,
		);

		res.json(tasks);
	} catch (error) {
		console.error("Failed to fetch tasks:", error);
		res.status(500).json({ error: "Failed to fetch tasks" });
	}
});

router.post("/", async (req: AuthenticatedRequest, res) => {
	try {
		const {
			title,
			description,
			status,
			projectId,
			assignedTo,
		} = req.body;

		if (!title) {
			return res.status(400).json({
				error: "Title is required",
			});
		}

		if (!Number.isInteger(projectId)) {
			return res.status(400).json({
				error: "A valid projectId is required",
			});
		}

		const project = await getProjectForTaskCreation(projectId);

		if (!project) {
			return res.status(404).json({
				error: "Project not found",
			});
		}

		const isOwner = project.ownerId === req.user!.userId;
		const isAdmin = req.user!.role === "admin";

		if (!isOwner && !isAdmin) {
			return res.status(403).json({
				error: "You do not have permission to create tasks for this project",
			});
		}

		const task = await createTask(
			title,
			description,
			status,
			projectId,
			assignedTo,
		);

		res.status(201).json(task);
	} catch (error) {
		console.error("Failed to create task:", error);
		res.status(500).json({ error: "Failed to create task" });
	}
});

router.get("/:id", async (req: AuthenticatedRequest, res) => {
	try {
		const id = Number(req.params.id);

		if (!Number.isInteger(id)) {
			return res.status(400).json({
				error: "Invalid task id",
			});
		}

		const task = await getTaskById(id);

		if (!task) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		const canAccess =
			req.user!.role === "admin" ||
			task.projectOwnerId === req.user!.userId ||
			task.assignedTo === req.user!.userId;

		if (!canAccess) {
			return res.status(403).json({
				error: "You do not have permission to access this task",
			});
		}

		delete task.projectOwnerId;
		res.json(task);
	} catch (error) {
		console.error("Failed to fetch task:", error);
		res.status(500).json({ error: "Failed to fetch task" });
	}
});

router.patch("/:id", async (req: AuthenticatedRequest, res) => {
	try {
		const id = Number(req.params.id);
		const { title, description, status, assignedTo } = req.body;

		if (!Number.isInteger(id)) {
			return res.status(400).json({
				error: "Invalid task id",
			});
		}

		const existingTask = await getTaskById(id);

		if (!existingTask) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		const canModify =
			req.user!.role === "admin" ||
			existingTask.projectOwnerId === req.user!.userId;

		if (!canModify) {
			return res.status(403).json({
				error: "You do not have permission to modify this task",
			});
		}

		const task = await updateTask(
			id,
			title,
			description,
			status,
			assignedTo,
		);

		res.json(task);
	} catch (error) {
		console.error("Failed to update task:", error);
		res.status(500).json({ error: "Failed to update task" });
	}
});

router.delete("/:id", async (req: AuthenticatedRequest, res) => {
	try {
		const id = Number(req.params.id);

		if (!Number.isInteger(id)) {
			return res.status(400).json({
				error: "Invalid task id",
			});
		}

		const existingTask = await getTaskById(id);

		if (!existingTask) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		const canDelete =
			req.user!.role === "admin" ||
			existingTask.projectOwnerId === req.user!.userId;

		if (!canDelete) {
			return res.status(403).json({
				error: "You do not have permission to delete this task",
			});
		}

		await deleteTask(id);
		res.status(204).send();
	} catch (error) {
		console.error("Failed to delete task:", error);
		res.status(500).json({ error: "Failed to delete task" });
	}
});

export default router;