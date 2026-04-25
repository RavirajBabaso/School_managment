# API Documentation
**School Staff Task Management — Adhira International School**
*WebTree IT Solution | Version 1.0 | April 2026*

---

## Base URL
```
http://<server>:5000/api
```
All endpoints are prefixed with `/api`. The production URL is served over HTTPS via Nginx.

---

## Authentication

All protected routes require a JWT Bearer token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

Access tokens expire in **15 minutes**. Use the refresh-token endpoint to obtain a new one.

---

## 1. Auth Endpoints

### POST `/auth/login`
Authenticate a user and receive JWT tokens.

**Request body:**
```json
{ "email": "chairman@school.com", "password": "SecurePass@123" }
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "name": "Chairman", "role": "CHAIRMAN" },
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>"
  }
}
```

### POST `/auth/logout`
Invalidate the refresh token.

### POST `/auth/refresh-token`
Obtain a new access token using a valid refresh token.

**Request body:**
```json
{ "refreshToken": "<jwt>" }
```

### POST `/auth/change-password`
Change password for the authenticated user.

**Request body:**
```json
{ "currentPassword": "old", "newPassword": "new", "confirmPassword": "new" }
```

---

## 2. User Management (Chairman only)

### GET `/users`
List all department head users.

### POST `/users`
Create a new user.

**Request body:**
```json
{
  "name": "HR Head",
  "email": "hr@school.com",
  "password": "TempPass@123",
  "role": "HR",
  "department_id": 5
}
```

### PUT `/users/:id`
Update user details. Same body shape as POST; all fields optional.

### DELETE `/users/:id`
Soft-delete (deactivate) a user. The account is disabled but data is preserved.

---

## 3. Tasks

### POST `/tasks`
Create and assign a new task (Chairman only).
Accepts `multipart/form-data` for file attachments.

**Fields:**
| Field | Type | Required |
|---|---|---|
| title | string | ✓ |
| description | string | |
| assigned_to | number (user id) | ✓ |
| department_id | number | |
| priority | HIGH / MEDIUM / LOW | ✓ |
| start_date | YYYY-MM-DD | ✓ |
| due_date | YYYY-MM-DD | ✓ |
| attachment | File (multipart) | |

### GET `/tasks`
Get all tasks with optional filters.

**Query params:** `status`, `priority`, `department_id`, `assigned_to`, `from`, `to`, `search`

### GET `/tasks/:id`
Get a single task with full history log.

### PUT `/tasks/:id`
Update task status, add comment, or replace attachment.

### GET `/tasks/my-tasks`
Tasks assigned to the currently authenticated user.

### GET `/tasks/dept/:deptId`
All tasks for a specific department.

---

## 4. Reports

### GET `/reports/daily`
Generate or fetch the daily task summary.

**Query params:** `dateFrom` (YYYY-MM-DD), `dateTo` (YYYY-MM-DD)

### GET `/reports/weekly`
Weekly department performance report.

### GET `/reports/monthly`
Monthly MIS report with performance analytics.

### GET `/reports/:id/download`
Download a generated report.

**Query params:** `format` — `pdf` or `excel`

---

## 5. Notifications

### GET `/notifications`
All notifications for the authenticated user.

### PUT `/notifications/:id/read`
Mark a single notification as read.

### PUT `/notifications/read-all`
Mark all notifications as read.

---

## 6. Announcements

### POST `/announcements`
Create a broadcast or department-level announcement (Chairman only).

**Request body:**
```json
{
  "message": "Staff meeting on Friday at 3 PM.",
  "target": "ALL",
  "department_id": null
}
```
`target`: `ALL` or `DEPT`. If `DEPT`, provide `department_id`.

### GET `/announcements`
List announcements visible to the authenticated user.

---

## 7. Approvals

### GET `/approvals`
List all approval requests.

### POST `/approvals`
Submit a new approval request (Budget, Purchase, Policy, Event).

### PUT `/approvals/:id/process`
Approve or reject a request (Chairman only).

**Request body:**
```json
{ "status": "APPROVED", "remarks": "Approved for Q2." }
```

---

## 8. Dashboard

### GET `/dashboard/chairman`
Full school-wide dashboard data for the Chairman.

### GET `/dashboard/dept/:deptId`
Department-specific dashboard for department heads.

### GET `/dashboard/performance`
Performance analytics — delay percentage, efficiency scores.

---

## Error Responses

All errors follow this shape:
```json
{ "success": false, "message": "Descriptive error message", "errors": [] }
```

| HTTP Code | Meaning |
|---|---|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized — invalid or missing token |
| 403 | Forbidden — insufficient role |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Rate Limiting
100 requests per 15 minutes per IP address.

---

*WebTree IT Solution — hr@webtreeitsolution.com*
