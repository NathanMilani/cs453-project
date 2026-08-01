import { pool } from "../db/pool";

export async function getAllUsers() {
	const result = await pool.query(
		`SELECT
			id,
			name,
			email,
			role,
			created_at AS "createdAt"
		 FROM users
		 ORDER BY id`,
	);

	return result.rows;
}