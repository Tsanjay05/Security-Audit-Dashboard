# Security Audit Log Dashboard

A professional, simple, and highly functional full-stack dashboard for security engineers to bulk upload, search, filter, sort, and paginate system audit logs. Built using **React (Vite)**, **Node.js**, **Express**, and **MongoDB**.

---

## Technical Architecture & Design Rationale

### 1. 3-Tier Layered Architecture
The backend is structured around a strict separation of concerns to ensure maintainability, scalability, and ease of testing:
- **Routes Layer:** Handles request mapping and associates paths with controller handlers.
- **Middleware Layer:** Manages request logging, CORS headers, standard JSON parsing settings, and centralized global error handling.
- **Validators Layer (Zod):** Validates incoming payload schemas before they touch controllers or the database.
- **Controllers Layer:** Thin handlers responsible for extracting request parameters and compiling response payloads.
- **Services Layer:** Houses the core business logic and MongoDB queries (e.g. query configuration for filters/searches and DB batch calls).
- **Models Layer (Mongoose):** Defines database schema definitions and indexing configurations.

### 2. High-Throughput Bulk Insertions
To efficiently store up to 10,000 log records in a single request, the service layer leverages MongoDB's native `insertMany()` method. This minimizes database round-trips and executes batch writes in a highly performant manner.

### 3. Server-side Query Operations
As datasets grow, client-side searching, filtering, sorting, and pagination become bottleneck operations. All query computations are performed strictly on the database/server-side:
- Pagination is computed using Mongoose `.skip()` and `.limit()`.
- Text searching utilizes case-insensitive regular expressions across string fields (`actor`, `action`, `resource`, `ipAddress`).
- Exact matching is performed for discrete fields (`role`, `resourceType`, `severity`, `status`, `region`).
- Compound and single-field database indexes are declared on Mongoose schema definitions to optimize query execution plans.

### 4. Data Validation and Handling Rules
- **Non-Enum Validation:** Both `severity` and `status` fields are validated as non-empty strings. Hardcoded enums are avoided to ensure the logging schema remains adaptable to evolving system logs.
- **Timestamp Integrity:** The schema stores the payload's `timestamp` exactly as provided. No automatic date generators are defined, ensuring audit trail accuracy.

---

## Setup & Running Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or on a URI connection)

### 1. Configure Environment Variables
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/security-audit-logs
NODE_ENV=development
```

### 2. Start the Backend Server
Navigate to the `backend/` directory:
```bash
cd backend
npm install
npm start
```
The backend server runs on `http://localhost:5000`.

### 3. Start the Frontend Server
Navigate to the `frontend/` directory:
```bash
cd ../frontend
npm install
npm run dev
```
The frontend dev server runs on `http://localhost:3000` and contains a pre-configured proxy routing all `/api` requests to `http://localhost:5000`.

---

## API Documentation

### 1. Bulk Upload API
- **Route:** `POST /api/logs/bulk`
- **Body:** `Array` of audit log objects (up to 10,000 records)
- **JSON Payload Format:**
```json
[
  {
    "actor": "priya.nair@company.com",
    "role": "admin",
    "action": "DELETE_USER",
    "resource": "/api/users/334",
    "resourceType": "USER",
    "ipAddress": "192.168.1.45",
    "region": "ap-south-1",
    "severity": "HIGH",
    "status": "Unresolved",
    "timestamp": "2025-06-14T08:32:11Z"
  }
]
```
- **Responses:**
  - `201 Created` - Success payload detailing record count inserted.
  - `400 Bad Request` - Validation failures (Zod schema mismatches).

### 2. Fetch Logs API
- **Route:** `GET /api/logs`
- **Query Parameters:**
  - `search` (String): Case-insensitive match on `actor`, `action`, `resource`, or `ipAddress`.
  - `actor`, `role`, `action`, `resourceType`, `severity`, `status`, `region` (String): Exact match query parameters.
  - `startDate`, `endDate` (ISO Date Strings): Timestamp filter boundaries.
  - `sortBy` (String): Field sorting criteria (defaults to `timestamp`).
  - `sortOrder` (String): Sorting direction (`asc` or `desc`, defaults to `desc`).
  - `page` (Number): Desired records page index (defaults to `1`).
  - `limit` (Number): Records retrieved per page chunk (defaults to `10`).
- **Response Format:**
```json
{
  "success": true,
  "metadata": {
    "totalRecords": 24,
    "currentPage": 1,
    "totalPages": 3,
    "limit": 10
  },
  "data": [ ... ]
}
```
