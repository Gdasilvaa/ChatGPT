# Shift Planner Web Application

This repository contains a simple shift planning application with a Node.js backend and a React-based frontend. The backend uses SQLite for storage.

## Setup

### Backend

1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3001`.

### Frontend

1. Navigate to the `frontend` folder.
2. Install the static server dependency:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```
   Open your browser at `http://localhost:3000` (or the port printed by `serve`).

## Features

- Manage employees (name, role, hourly rate).
- Create shifts (date, start/end time, role, location) and assign employees.
- Automatic calculation of hours per shift and total hours per employee.
- Overhours are highlighted when exceeding 40 hours per week.

This setup is minimal and intended for demonstration purposes. You can extend it by adding authentication, CSV export, or email notifications as needed.
