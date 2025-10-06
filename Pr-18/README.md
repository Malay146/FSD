# Notes Taking API - Practical 18

A RESTful API built with Express.js and MongoDB for a mobile notes-taking application.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Delete notes
- **MongoDB Atlas Integration**: Cloud database storage
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Proper error responses for all scenarios
- **CORS Enabled**: Ready for mobile app integration
- **RESTful Design**: Standard HTTP methods and status codes
- **Timestamps**: Automatic creation and update timestamps

## 📱 API Endpoints

### Base URL: `http://localhost:3007`

| Method | Endpoint         | Description       | Request Body                                 |
| ------ | ---------------- | ----------------- | -------------------------------------------- |
| GET    | `/`              | API documentation | -                                            |
| GET    | `/api/notes`     | Get all notes     | -                                            |
| GET    | `/api/notes/:id` | Get note by ID    | -                                            |
| POST   | `/api/notes`     | Create new note   | `{ "title": "string", "content": "string" }` |
| PUT    | `/api/notes/:id` | Update note       | `{ "title": "string", "content": "string" }` |
| DELETE | `/api/notes/:id` | Delete note       | -                                            |

## 🏗️ Data Structure

```json
{
	"_id": "ObjectId",
	"title": "String (required, max 100 chars)",
	"content": "String (required, max 5000 chars)",
	"timestamp": "Date (auto-generated)",
	"updatedAt": "Date (auto-updated)",
	"createdAt": "Date (auto-generated)",
	"__v": "Number"
}
```

## 📋 Sample API Calls

### 1. Create a Note

```bash
POST /api/notes
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content of my first note"
}
```

### 2. Get All Notes

```bash
GET /api/notes
```

### 3. Get Single Note

```bash
GET /api/notes/{note_id}
```

### 4. Update Note

```bash
PUT /api/notes/{note_id}
Content-Type: application/json

{
  "title": "Updated Note Title",
  "content": "Updated note content"
}
```

### 5. Delete Note

```bash
DELETE /api/notes/{note_id}
```

## 🧪 Testing with Postman

1. **Import Collection**: Use the provided Postman collection
2. **Set Base URL**: `http://localhost:3007`
3. **Test Sequence**:
   - GET `/` (Check API status)
   - POST `/api/notes` (Create test note)
   - GET `/api/notes` (Verify creation)
   - PUT `/api/notes/:id` (Update note)
   - DELETE `/api/notes/:id` (Delete note)

## ⚡ Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. API will be available at: `http://localhost:3007`

## 🔧 Environment Variables

Create a `.env` file for custom configuration:

```
PORT=3007
MONGODB_URI=your_mongodb_atlas_connection_string
```

## 📊 Database Schema

- **Collection**: `notes`
- **Database**: `notes_app`
- **Connection**: MongoDB Atlas
- **Validation**: Built-in Mongoose validation

## 🛡️ Error Handling

- **400**: Bad Request (validation errors, invalid ID)
- **404**: Not Found (note doesn't exist, invalid route)
- **500**: Internal Server Error (database errors)

All errors return structured JSON responses with success flags and error messages.

## 🌐 Mobile App Integration

This API is designed for mobile app backends:

- CORS enabled for cross-origin requests
- JSON responses for easy parsing
- RESTful conventions for predictable behavior
- Proper HTTP status codes
- Structured error responses
