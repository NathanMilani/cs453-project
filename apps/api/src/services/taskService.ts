import { pool } from "../db/pool";

const taskSelect = `
	id,
	title,
	description,
	status,
	created_at AS "createdAt",
	updated_at AS "updatedAt"
`;

export async function getAllTasks() {
	const result = await pool.query(
		`SELECT ${taskSelect}
		 FROM tasks
		 ORDER BY id`,
	);

	return result.rows;
}

export async function getTaskById(id: number) {
	const result = await pool.query(
		`SELECT ${taskSelect}
		 FROM tasks
		 WHERE id = $1`,
		[id],
	);

	return result.rows[0];
}

export async function createTask(
	title: string,
	description?: string,
	status?: string,
) {
	const result = await pool.query(
		`INSERT INTO tasks (title, description, status)
		 VALUES ($1, $2, COALESCE($3, 'todo'))
		 RETURNING ${taskSelect}`,
		[title, description || null, status],
	);

	return result.rows[0];
}

export async function updateTask(
	id: number,
	title?: string,
	description?: string,
	status?: string,
) {
	const result = await pool.query(
		`UPDATE tasks
		 SET title = COALESCE($1, title),
			 description = COALESCE($2, description),
			 status = COALESCE($3, status),
			 updated_at = NOW()
		 WHERE id = $4
		 RETURNING ${taskSelect}`,
		[title, description, status, id],
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