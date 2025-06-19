# Contact API Documentation

## Overview

This API provides endpoints for managing contact messages within the application. Users can submit contact forms, and administrators can manage and update the status of these contacts.

## Authentication

All endpoints require user authentication. Include the authentication token in your request headers.

## Base URL

/api/user/

---

## Endpoints

### 1. Submit Contact Message

_POST_ /contact

Submit a new contact message from an authenticated user.

#### Headers

Authorization: Bearer {token}
Content-Type: application/json

#### Request Body

json
{
"subject": "string (required, max: 255)",
"message": "string (required)"
}

#### Example Request

json
{
"subject": "Issue with my order",
"message": "I'm having trouble with my recent order. The delivery was delayed and I need assistance."
}

#### Response

_Success (200 OK)_
json
{
"message": "Your message has been sent successfully",
"contact_id": 123
}

_Validation Error (422 Unprocessable Entity)_
json
{
"message": "The given data was invalid.",
"errors": {
"subject": ["The subject field is required."],
"message": ["The message field is required."]
}
}

#### Notes

- User information (name, email) is automatically extracted from the authenticated user
- An email notification is sent to the user's email address
- A contact record is created in the database with status "unattended" (default)

---

### 2. Update Contact Status

_POST_ /{contactId}/update-contact-status

Update the status of a specific contact message. _Admin access required._

#### Headers

Authorization: Bearer {admin_token}
Content-Type: application/json

#### URL Parameters

- contactId (integer, required): The ID of the contact to update

#### Request Body

json
{
"status": "string (required, enum: 'unattended' | 'sorted')"
}

#### Example Request

json
{
"status": "sorted"
}

#### Response

_Success (200 OK)_
json
{
"message": "Contact status updated successfully",
"status": "sorted"
}

_Unauthorized (403 Forbidden)_
json
{
"message": "You are not authorized to perform this action"
}

_Not Found (404 Not Found)_
json
{
"message": "Contact not found"
}

_Validation Error (422 Unprocessable Entity)_
json
{
"message": "The given data was invalid.",
"errors": {
"status": ["The selected status is invalid."]
}
}

#### Notes

- Only users with account_type = 'admin' can access this endpoint
- Valid status values are: unattended, sorted

---

### 3. Get Contact List

_GET_ /contacts

Retrieve a paginated list of contact messages. _Admin access required._

#### Headers

Authorization: Bearer {admin_token}

#### Query Parameters

- status (string, optional): Filter contacts by status
  - Allowed values: unattended, sorted
- page (integer, optional): Page number for pagination (default: 1)

#### Example Request

GET /contacts?status=unattended&page=1

#### Response

_Success (200 OK)_
json
{
"contacts": {
"current_page": 1,
"data": [
{
"id": 123,
"user_id": 456,
"name": "John Doe",
"email": "john@example.com",
"subject": "Issue with my order",
"message": "I'm having trouble with my recent order...",
"status": "unattended",
"created_at": "2025-06-07T10:30:00.000000Z",
"updated_at": "2025-06-07T10:30:00.000000Z"
}
],
"first_page_url": "http://example.com/api/user/contacts?page=1",
"from": 1,
"last_page": 5,
"last_page_url": "http://example.com/api/user/contacts?page=5",
"links": [...],
"next_page_url": "http://example.com/api/user/contacts?page=2",
"path": "http://example.com/api/user/contacts",
"per_page": 10,
"prev_page_url": null,
"to": 10,
"total": 50
},
"message": "Contact list retrieved successfully"
}

_Unauthorized (403 Forbidden)_
json
{
"message": "You are not authorized to perform this action"
}

_Validation Error (422 Unprocessable Entity)_
json
{
"message": "The given data was invalid.",
"errors": {
"status": ["The selected status is invalid."]
}
}

#### Notes

- Only users with account_type = 'admin' can access this endpoint
- Results are paginated with 10 items per page
- Contacts are ordered by creation date (newest first)
- If no status filter is provided, all contacts are returned

---

## Error Codes

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| 200         | Success                                 |
| 403         | Forbidden - Admin access required       |
| 404         | Not Found - Contact not found           |
| 422         | Unprocessable Entity - Validation error |
| 401         | Unauthorized - Authentication required  |

## Data Models

### Contact Model

json
{
"id": "integer",
"user_id": "integer",
"name": "string",
"email": "string",
"subject": "string",
"message": "text",
"status": "enum('unattended', 'sorted')",
"created_at": "timestamp",
"updated_at": "timestamp"
}

## Email Notifications

When a contact is submitted, an email notification is automatically sent to the user using the Brevo mailer service. The email includes:

- User's name and email
- Subject of the contact
- Message content
- Sent from: support@bhuorder.com.ng (Order Support)
