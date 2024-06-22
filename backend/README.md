# Project Setup Guide

## Setting Up PostgreSQL Database

### Using Docker

If you have Docker installed, you can quickly set up PostgreSQL using the following command:

```bash

docker  run  -d  \

--name students-db \

-e  POSTGRES_USER=myuser  \

-e POSTGRES_PASSWORD=mypassword \

-e  POSTGRES_DB=mydatabase  \

-p 5432:5432 \

postgres:13
```

### Setting Up Locally

If you prefer to set up PostgreSQL locally, follow these steps:

1.  **Install PostgreSQL**:

- Install PostgreSQL from the [official website](https://www.postgresql.org/download/) or using your package manager.

2.  **Start PostgreSQL**:

- Start PostgreSQL server.

3.  **Connect to PostgreSQL**:

- Use `psql` command to connect to your PostgreSQL instance:

```bash

psql  -h localhost -U myuser -d mydatabase

```

4.  **Create Database**:

- Create the database if it doesn't exist:

```sql

CREATE DATABASE yourdatabase;

```

5.  **Create Tables**:

- Create the necessary tables for your application:

```sql

CREATE TABLE IF NOT EXISTS students (

student_id SERIAL PRIMARY KEY,

first_name VARCHAR(50) NOT NULL,

last_name VARCHAR(50) NOT NULL,

date_of_birth DATE NOT NULL,

email VARCHAR(100) UNIQUE NOT NULL

);



CREATE TABLE IF NOT EXISTS marks (

mark_id SERIAL PRIMARY KEY,

student_id INT REFERENCES students(student_id) ON DELETE CASCADE,

subject VARCHAR(50) NOT NULL,

mark INT CHECK (mark >= 0 AND mark <= 100),

exam_date DATE NOT NULL

);

```

6.  **Update Application Configuration**:

- Update your Node.js application configuration (`db.js` or similar) with the appropriate connection details (username, password, host, database name).

7.  **Start Your Node.js Application**:

- Start your Node.js application as usual.
