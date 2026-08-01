# CS453/553 Client-Server Architecture Project

This repository contains the **starter template** for the semester project in
**CS453 / CS553 – Client/Server Architectures**.

Students will build and extend a distributed web application over the course
of the semester. The system will evolve through several architectural stages,
mirroring the historical evolution of modern web systems.

The goal of the project is to help students understand **how real client/server
systems are designed and built**, including:

- REST API design
- Database integration
- Authentication and authorization
- Multi-service architectures
- Modern API technologies

---

# Project Overview

The semester project is a **Task / Project Management System**.

The application allows users to:

- Create projects
- Create tasks within projects
- Assign tasks to users
- Track task status
- Manage user accounts

---

# Architecture Overview

```text
Browser Client
        |
        v
 REST API (Express)
        |
        v
 PostgreSQL
```

---

# Technology Stack

### Server

- Node.js
- TypeScript
- Express

### Database

- PostgreSQL

### Development Tools

- Docker
- npm
- Git
- Thunder Client

---

# Repository Structure

```text
cs453-project-template
│
├── apps
│   ├── api
│   └── client
│
├── database
│
├── docs
│
├── scripts
│
├── docker-compose.yml
│
└── README.md
```

---

# Development Setup

## 1. Clone the repository

```shell
git clone <your-repository-url>
cd cs453-project-template
```

---

## 2. Start PostgreSQL

```shell
docker compose up -d
```

---

## 3. Create the database tables

Windows PowerShell:

```powershell
Get-Content database/schema.sql | docker exec -i cs453-postgres psql -U postgres -d cs453
```

---

## 4. Configure environment variables

Create a `.env` file in the project root.

Example:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cs453
JWT_SECRET=replace-with-your-secret-key
PORT=3000
```

---

## 5. Install dependencies

```shell
cd apps/api
npm install
```

---

## 6. Run the API

```shell
npm run dev
```

The server should start on:

```text
http://localhost:3000
```

---

# API Endpoints

## Health

```
GET /health
GET /db-health
```

---

## Authentication

```
POST /auth/register
POST /auth/login
```

---

## Projects

```
GET /projects
POST /projects
GET /projects/:id
```

---

## Tasks

```
GET /tasks
POST /tasks
GET /tasks/:id
PATCH /tasks/:id
DELETE /tasks/:id
```

---

## Users (Administrator Only)

```
GET /users
```

---

# Authentication

The API uses JWT authentication.

Passwords are hashed using **bcrypt** before being stored in PostgreSQL.

After logging in, the API returns a JWT token.

Protected routes require:

```
Authorization: Bearer <jwt-token>
```

---

# Authorization

The application protects the following routes:

- /tasks
- /projects
- /users

Authenticated users may only access resources they own.

Administrators may access administrator-only routes and bypass ownership restrictions where appropriate.

---

# Checkpoint 1 Features

Implemented:

- Express REST API
- PostgreSQL integration
- Docker database
- CRUD operations for tasks
- Request validation
- JSON error responses
- Refactored architecture
  - routes
  - services
  - database modules

---

# Checkpoint 2 Features

Added:

- User registration
- User login
- Password hashing with bcrypt
- JWT authentication
- Authentication middleware
- Administrator authorization
- Project management
- Project ownership validation
- Task ownership validation
- Protected API routes
- Environment variable support

---

# Testing

This project was manually tested using the Thunder Client extension in VS Code and PowerShell.

## Health Endpoints

✔ GET /health

- Verified the server is running.
- Expected Status: 200 OK

✔ GET /db-health

- Verified PostgreSQL connection.
- Expected Status: 200 OK

---

## Authentication

✔ POST /auth/register

- Successfully created a new user.
- Password stored as a bcrypt hash.
- Expected Status: 201 Created

✔ POST /auth/login

- Successfully returned a JWT token.
- Expected Status: 200 OK

✔ Duplicate Registration

- Attempted to register the same email twice.
- Returned:
  - Status: 409 Conflict

✔ Invalid Login

- Attempted login using an incorrect password.
- Returned:
  - Status: 401 Unauthorized

---

## Projects

✔ POST /projects

- Successfully created a project for the authenticated user.
- Expected Status: 201 Created

✔ GET /projects

- Successfully returned projects owned by the authenticated user.
- Expected Status: 200 OK

✔ GET /projects/:id

- Verified owner can access the project.
- Verified another user receives:
  - Status: 403 Forbidden

- Verified requesting a non-existent project returns:
  - Status: 404 Not Found

---

## Tasks

✔ POST /tasks

- Successfully created a task inside a project.

✔ GET /tasks

- Returned tasks belonging to the authenticated user.

✔ PATCH /tasks/:id

- Verified project owner can update a task.
- Verified another user receives:
  - Status: 403 Forbidden

✔ DELETE /tasks/:id

- Successfully deleted an existing task.

---

## Administrator Authorization

✔ GET /users

Normal authenticated user:

- Returned:
  - 403 Forbidden

Administrator account:

- Returned:
  - 200 OK
  - List of registered users

---

## Manual Testing Summary

The following scenarios were verified successfully:

- User registration
- User login
- Password hashing
- JWT authentication
- Duplicate email handling
- Invalid login
- Protected routes
- Administrator-only routes
- Project ownership
- Task ownership
- CRUD operations for projects and tasks
- PostgreSQL database persistence

---

# Reflection Questions for Checkpoint 1

## 1. What is the difference between an in-memory API and a database-backed API?

The difference between these two is how the API stores and accesses data. An in-memory API stores all of its data directly in memory while the program is running, so if the server is shut down all of the data is lost. A database-backed API stores the data in a database like PostgreSQL and retrieves it by making database queries, so the data is still there even after the server restarts.

---

## 2. Why is it useful to separate routes, services, and database logic?

Because it makes the architecture of the project much more organized and easier to read. It also makes the code easier to maintain since the routes handle the HTTP requests, the services handle the application logic, and the database layer handles communicating with PostgreSQL.

---

## 3. What HTTP status codes did you use, and why?

I used status codes 200, 201, 204, 400, 404, and 500 for this checkpoint. These codes let the client know what happened after making a request. A 200 means the request was successful, 201 means a new task was created successfully, 204 means a task was deleted successfully, 400 means the client sent invalid input, 404 means the requested task does not exist, and 500 means an unexpected server or database error occurred.

---

## 4. What happens when a client requests a task ID that does not exist?

It returns a 404 Not Found status code along with a JSON error message saying that the task was not found.

---

## 5. What was the hardest part of connecting the API to PostgreSQL?

The hardest part was learning the Docker and PowerShell commands needed to connect PostgreSQL and create the database tables. After everything was running, I used Thunder Client to verify all of the task endpoints.

---

# Reflection Questions for Checkpoint 2

## 1. What is the difference between authentication and authorization?

Authentication is the what is used in verifying if the user is who they say they are. Authorization is the what users right to be given permission to a given task or information.

---

## 2. Why should passwords be hashed instead of stored directly?

Passwords should be hashed because storing plain text passwords is a security risk. Hashing with bcrypt protects user passwords even if the database is compromised.

---

## 3. What information did you include in your JWT, and why?

My JWT contains the user's ID, email, and role. The user ID identifies the user, the email identifies the account, and the role is used to determine whether the user is an administrator or a normal user.

---

## 4. What is the difference between a 401 response and a 403 response?

A 401 Unauthorized response means the user is not authenticated, such as having no token or an invalid token. A 403 Forbidden response means the user is authenticated but does not have permission to access the requested resource.

---

## 5. Where does your application perform role or ownership checks?

The application performs role and ownership checks inside the protected routes after the authentication middleware verifies the JWT. The routes determine whether the user owns the requested project or task or whether they are an administrator.

---

## 6. How are users, projects, and tasks related in your database?

The users table stores user accounts. Each project belongs to one user through the owner_id field. Each task belongs to a project through the project_id field and can also be assigned to a user through the assigned_to field. PostgreSQL foreign keys enforce these relationships.

---

## 7. What was the hardest part of adding authentication or authorization?

The hard part was when trying to get the bcrypt, JWT authorization, middleware, and the authorization to work without problems. Since all of these are interconnected with one another, testing was a bit hard. However, after doing a lot of testing, there are no bugs and the authorization works as intended.
