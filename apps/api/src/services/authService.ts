import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { pool } from "../db/pool";

export async function registerUser(
	name: string,
	email: string,
	password: string,
) {
	const passwordHash = await bcrypt.hash(password, 10);

	const result = await pool.query(
		`INSERT INTO users (name, email, password_hash)
		 VALUES ($1, $2, $3)
		 RETURNING
			id,
			name,
			email,
			role,
			created_at AS "createdAt"`,
		[name, email, passwordHash],
	);

	return result.rows[0];
}

export async function loginUser(email: string, password: string) {
	const result = await pool.query(
		`SELECT
			id,
			name,
			email,
			password_hash AS "passwordHash",
			role
		 FROM users
		 WHERE email = $1`,
		[email],
	);

	const user = result.rows[0];

	if (!user) {
		return null;
	}

	const passwordMatches = await bcrypt.compare(
		password,
		user.passwordHash,
	);

	if (!passwordMatches) {
		return null;
	}

	const token = jwt.sign(
		{
			userId: user.id,
			email: user.email,
			role: user.role,
		},
		env.jwtSecret,
		{
			expiresIn: "1h",
		},
	);

	return {
		token,
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		},
	};
}