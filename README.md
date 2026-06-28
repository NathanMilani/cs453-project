
# CS453/553 Client-Server Architecture Project

This repository contains the **starter template** for the semester project in  
**CS453 / CS553 – Client/Server Architectures**.

Students will build and extend a distributed web application over the course
of the semester. The system will evolve through several architectural stages,
mirroring the historical evolution of modern web systems.

The goal of the project is to help students understand **how real client/server
systems are designed and built**, including:

- REST API design
- database integration
- authentication and authorization
- multi-service architectures
- real-time communication
- modern API technologies

---

# Project Overview

The semester project is a **Task / Project Management System**.

The application allows users to:

- create projects
- create tasks within projects
- assign tasks to users
- track task status
- comment on tasks
- view project activity

This domain is intentionally simple so that the focus remains on **system
architecture and communication between components**, rather than complex
business logic.

---

# Architecture Overview

The system follows a typical web architecture.

```shell
Browser Client
|
v
REST API
|
v
PostgreSQL
```


Over the semester, the architecture will evolve to include additional
components such as authentication services, real-time communication,
and potentially additional APIs.

Example extended architecture:

```shell
Browser Client
|
v
API Layer
/
Auth API Task API
|
v
PostgreSQL
```

---

# Technology Stack

The default project stack is:

Server
- Node.js
- TypeScript
- Express

Database
- PostgreSQL

Development Tools
- Docker (for database)
- npm
- Git

Students who prefer Python may implement the server using **FastAPI**, but
all examples and starter code will use **TypeScript**.

---

# Repository Structure

```shell
cs453-project-template
│
├── apps
│ ├── api
│ │ Server-side application
│ │
│ └── client
│ Simple browser client
│
├── database
│ Database schema, migrations, and seed data
│
├── docs
│ Architecture documentation
│
├── scripts
│ Utility scripts for development
│
├── docker-compose.yml
│ Starts PostgreSQL database
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

## 2. Start the database

This project uses Docker to run PostgreSQL locally.

```shell
docker compose up -d
```

This will start a PostgreSQL database container.

---

## 3. Creating the Database Tables

```shell
Get-Content database/schema.sql | docker exec -i cs453-postgres psql -U postgres -d cs453
```


## 4. Install dependencies

```shell
cd apps/api
npm install
```

---

## 5. Run the server
```shell
npm run dev
```


The API server should start locally.

---

# Project Milestones

The project will evolve over several milestones during the semester.

### Milestone 1 – REST API

Students will implement:

- REST endpoints
- database integration
- CRUD operations
- request validation

---

### Milestone 2 – Authentication

Students will add:

- user accounts
- password hashing
- login endpoints
- JWT authentication
- protected routes

---

### Milestone 3 – Architectural Extensions

Students will extend the system with at least one of the following:

- WebSockets for real-time updates
- GraphQL API
- multi-service architecture
- asynchronous messaging
- advanced API documentation

Graduate students will complete an additional architecture extension and
design analysis.

---

# Learning Goals

By completing this project students should understand:

- how client/server systems communicate
- how APIs are designed and implemented
- how databases integrate with web services
- how authentication works in distributed systems
- how modern web architectures evolve over time

---

# Academic Integrity

All work submitted for this project must be your own.

Students may use documentation and external references, but copying code
from other students or online repositories is considered academic misconduct.

---

# License

This repository is provided for educational use in CS453/553.

# Checkpoint 1 Features

After going through the first Checkpoint assignment, I have gone into the repository and made the changes to add the core required features:
 - Express REST API
 - PostgreSQL database integration
 - Docker support for PostgreSQL
 - Task CRUD operations
    - GET /tasks
    - POST /tasks
    - GET /tasks/:id
    - PATCH /tasks/:id
    - DELETE /tasks/:id
 - Request validation
 - JSON error responses
 - Refactored architecture using routes, services, and database modules

Here is how I set up the database tables on a windows environment:
 1. cloned the repository to my local computer
 2. used the command: docker compose up -d
    - Then I typed this to create the table for the data id to be stored:
        -Get-Content database/schema.sql | docker exec -i cs453-postgres psql -U postgres -d cs453
 3. typed npm install
 4. npm run dev
Thats how I was able to get my docker set up for my database tables.

I also used the Thunder Client extension inside of VSCode to test the following endpoints:
    1. GET /health
    2. GET /db-health
    3. GET /tasks
    4. POST /tasks
    5. GET /tasks/:id
    6. PATCH /tasks/:id
    7. DELETE /tasks/:id
All of these work and can be ran functionally.

# Reflection Questions
Answer the following questions in your README or in a separate file such as answers.md.

1. What is the difference between an in-memory API and a database-backed API?
My answer:
The difference between these two is how the API stores and accesses data. An in-memory API stores all of its data directly in memory while the program is running, so if the server is shut down all of the data is lost. A database-backed API stores the data in a database like PostgreSQL and retrieves it by making database queries, so the data is still there even after the server restarts.

2. Why is it useful to separate routes, services, and database logic?
My answer:
Because it makes the architecture of the project much more organized and easier to read. It also makes the code easier to maintain since the routes handle the HTTP requests, the services handle the application logic, and the database layer handles communicating with PostgreSQL.

3. What HTTP status codes did you use, and why?
My answer:
I used status codes 200, 201, 204, 400, 404, and 500 for this checkpoint. These codes let the client know what happened after making a request. A 200 means the request was successful, 201 means a new task was created successfully, 204 means a task was deleted successfully, 400 means the client sent invalid input, 404 means the requested task does not exist, and 500 means an unexpected server or database error occurred. Without these status codes it would be much harder to know whether a GET, POST, PATCH, or DELETE request worked correctly.

4. What happens when a client requests a task ID that does not exist?
My answer:
It will return a 404 Not Found status code along with a JSON error message saying that the task was not found.

5. What was the hardest part of connecting the API to PostgreSQL?
My answer:
The hardest part was learning what commands to run in the VS Code terminal and getting PostgreSQL connected correctly through Docker. These are the commands I used:
 1. docker compose up -d
 2. Get-Content database/schema.sql | docker exec -i cs453-postgres psql -U postgres -d cs453
 3. npm run dev
After everything was running, I used the Thunder Client extension in VS Code to test all of my GET, POST, PATCH, and DELETE endpoints to make sure they were working correctly.
