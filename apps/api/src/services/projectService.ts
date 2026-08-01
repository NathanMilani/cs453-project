import { pool } from "../db/pool";

const projectSelect = `
	id,
	name,
	description,
	owner_id AS "ownerId",
	created_at AS "createdAt"
`;

export async function getProjectsForUser(
	userId: number,
	role: "user" | "admin",
) {
	if (role === "admin") {
		const result = await pool.query(
			`SELECT ${projectSelect}
			 FROM projects
			 ORDER BY id`,
		);

		return result.rows;
	}

	const result = await pool.query(
		`SELECT ${projectSelect}
		 FROM projects
		 WHERE owner_id = $1
		 ORDER BY id`,
		[userId],
	);

	return result.rows;
}

export async function getProjectById(id: number) {
	const result = await pool.query(
		`SELECT ${projectSelect}
		 FROM projects
		 WHERE id = $1`,
		[id],
	);

	return result.rows[0];
}

export async function createProject(
	name: string,
	description: string | undefined,
	ownerId: number,
) {
	const result = await pool.query(
		`INSERT INTO projects (name, description, owner_id)
		 VALUES ($1, $2, $3)
		 RETURNING ${projectSelect}`,
		[name, description || null, ownerId],
	);

	return result.rows[0];
}