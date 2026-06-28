import { Router } from "express";
import {
	createTask,
	deleteTask,
	getAllTasks,
	getTaskById,
	updateTask,
} from "../services/taskService";

const router = Router();

router.get("/", async (_req, res) => {
	try {
		const tasks = await getAllTasks();
		res.json(tasks);
	} catch (error) {
		console.error("Failed to fetch tasks:", error);
		res.status(500).json({ error: "Failed to fetch tasks" });
	}
});

router.post("/", async (req, res) => {
	try {
		const { title, description, status } = req.body;

		if (!title) {
			return res.status(400).json({
				error: "Title is required",
			});
		}

		const task = await createTask(title, description, status);
		res.status(201).json(task);
	} catch (error) {
		console.error("Failed to create task:", error);
		res.status(500).json({ error: "Failed to create task" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const id = Number(req.params.id);

		if (Number.isNaN(id)) {
			return res.status(400).json({ error: "Invalid task id" });
		}

		const task = await getTaskById(id);

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		res.json(task);
	} catch (error) {
		console.error("Failed to fetch task:", error);
		res.status(500).json({ error: "Failed to fetch task" });
	}
});

router.patch("/:id", async (req, res) => {
	try {
		const id = Number(req.params.id);
		const { title, description, status } = req.body;

		if (Number.isNaN(id)) {
			return res.status(400).json({ error: "Invalid task id" });
		}

		const task = await updateTask(id, title, description, status);

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		res.json(task);
	} catch (error) {
		console.error("Failed to update task:", error);
		res.status(500).json({ error: "Failed to update task" });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const id = Number(req.params.id);

		if (Number.isNaN(id)) {
			return res.status(400).json({ error: "Invalid task id" });
		}

		const task = await deleteTask(id);

		if (!task) {
			return res.status(404).json({ error: "Task not found" });
		}

		res.status(204).send();
	} catch (error) {
		console.error("Failed to delete task:", error);
		res.status(500).json({ error: "Failed to delete task" });
	}
});

export default router;