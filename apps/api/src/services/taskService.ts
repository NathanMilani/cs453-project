import { pool } from "../db/pool";

const taskSelect = `
	t.id,
	t.title,
	t.description,
	t.status,
	t.project_id AS "projectId",
	t.assigned_to AS "assignedTo",
	t.created_at AS "createdAt",
	t.updated_at AS "updatedAt"
`;

export async function getTasksForUser(
	userId: number,
	role: "user" | "admin",
) {
	if (role === "admin") {
		const result = await pool.query(
			`SELECT ${taskSelect}
			 FROM tasks t
			 ORDER BY t.id`,
		);

		return result.rows;
	}

	const result = await pool.query(
		`SELECT ${taskSelect}
		 FROM tasks t
		 JOIN projects p ON p.id = t.project_id
		 WHERE p.owner_id = $1
		    OR t.assigned_to = $1
		 ORDER BY t.id`,
		[userId],
	);

	return result.rows;
}

export async function getTaskById(id: number) {
	const result = await pool.query(
		`SELECT ${taskSelect},
		        p.owner_id AS "projectOwnerId"
		 FROM tasks t
		 JOIN projects p ON p.id = t.project_id
		 WHERE t.id = $1`,
		[id],
	);

	return result.rows[0];
}

export async function createTask(
	title: string,
	description: string | undefined,
	status: string | undefined,
	projectId: number,
	assignedTo: number | undefined,
) {
	const result = await pool.query(
		`INSERT INTO tasks (
			title,
			description,
			status,
			project_id,
			assigned_to
		 )
		 VALUES ($1, $2, COALESCE($3, 'todo'), $4, $5)
		 RETURNING
			id,
			title,
			description,
			status,
			project_id AS "projectId",
			assigned_to AS "assignedTo",
			created_at AS "createdAt",
			updated_at AS "updatedAt"`,
		[
			title,
			description || null,
			status,
			projectId,
			assignedTo || null,
		],
	);

	return result.rows[0];
}

export async function updateTask(
	id: number,
	title?: string,
	description?: string,
	status?: string,
	assignedTo?: number | null,
) {
	const result = await pool.query(
		`UPDATE tasks
		 SET title = COALESCE($1, title),
			 description = COALESCE($2, description),
			 status = COALESCE($3, status),
			 assigned_to = COALESCE($4, assigned_to),
			 updated_at = NOW()
		 WHERE id = $5
		 RETURNING
			id,
			title,
			description,
			status,
			project_id AS "projectId",
			assigned_to AS "assignedTo",
			created_at AS "createdAt",
			updated_at AS "updatedAt"`,
		[title, description, status, assignedTo, id],
	);

	return result.rows[0];
}

export async function deleteTask(id: number) {
	const result = await pool.query(
		`DELETE FROM tasks
		 WHERE id = $1
		 RETURNING id`,
		[id],
	);

	return result.rows[0];
}

export async function getProjectForTaskCreation(projectId: number) {
	const result = await pool.query(
		`SELECT id,
		        owner_id AS "ownerId"
		 FROM projects
		 WHERE id = $1`,
		[projectId],
	);

	return result.rows[0];
}