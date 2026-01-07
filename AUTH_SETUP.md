# Authentication & Database Setup Guide

This application now includes authentication and MongoDB persistence.

## Features

- ✅ User authentication (email/password)
- ✅ MongoDB database persistence
- ✅ JWT-based session management
- ✅ User-specific todos (each user sees only their own todos)
- ✅ Default test user (test@test.com / test)
- ✅ Sign up and login pages

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

You have two options:

#### Option A: Local MongoDB

1. Install MongoDB locally or use Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. Set your `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=todoapp
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Set your `.env.local` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   MONGODB_DB_NAME=todoapp
   ```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=todoapp

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

### 4. Initialize Default User

After starting your application, call the init endpoint to create the default test user:

```bash
curl -X POST http://localhost:3000/api/init
```

Or visit: http://localhost:3000/api/init in your browser

This creates a default user:
- **Email:** test@test.com
- **Password:** test

### 5. Start the Application

```bash
npm run dev
```

## Usage

### Default Credentials

- **Email:** test@test.com
- **Password:** test

### Creating New Users

1. Visit `/auth` page
2. Click "Sign Up" tab
3. Enter email, password (min 4 characters), and optional name
4. Click "Sign Up"

### Logging In

1. Visit `/auth` page
2. Enter email and password
3. Click "Login"

After login, you'll be redirected to the main todo page where you can:
- Create todos (stored in MongoDB)
- Edit todos
- Delete todos
- See only your own todos

## Architecture

### Authentication Flow

1. User logs in → JWT token generated
2. Token stored in localStorage
3. Token sent with every API request
4. Server validates token and extracts user ID
5. Todos are filtered by user ID

### Database Structure

**Users Collection:**
```javascript
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  name: string,
  provider: 'credentials' | 'google',
  createdAt: string,
  updatedAt: string
}
```

**Todos Collection:**
```javascript
{
  _id: ObjectId,
  userId: string,
  text: string,
  completed: boolean,
  createdAt: string,
  updatedAt: string
}
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Todos (All require authentication)

- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create todo
- `PUT /api/todos` - Update todo
- `DELETE /api/todos?id=...` - Delete todo

### Initialization

- `POST /api/init` - Create default test user

## Security Notes

1. **JWT Secret:** Change `JWT_SECRET` in production!
2. **Password Hashing:** Passwords are hashed using bcrypt
3. **Token Expiration:** Tokens expire after 7 days (configurable)
4. **User Isolation:** Each user can only access their own todos

## Future Enhancements

- [ ] Google OAuth integration
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Remember me option
- [ ] Social login (Facebook, GitHub, etc.)

## Troubleshooting

### "MongoDB connection failed"
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env.local`
- Check network connectivity

### "Authentication required" errors
- Make sure you're logged in
- Check if token is stored in localStorage
- Try logging out and logging back in

### "User not found" on login
- Make sure you've initialized the default user (`/api/init`)
- Or create a new account via signup

### Todos not persisting
- Check MongoDB connection
- Verify user is authenticated
- Check browser console for errors

