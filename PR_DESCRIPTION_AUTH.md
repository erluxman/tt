## Summary
This PR implements authentication and MongoDB persistence for the todo application.

## Changes

### Authentication System
- ✅ JWT-based authentication with secure token management
- ✅ Login/Signup API endpoints (`/api/auth/login`, `/api/auth/signup`)
- ✅ Password hashing using bcrypt
- ✅ Session management with localStorage
- ✅ Protected API routes (all todo endpoints require authentication)
- ✅ Authentication middleware for route protection

### MongoDB Integration
- ✅ MongoDB connection setup with connection pooling
- ✅ User model with password hashing
- ✅ MongoDB repository for todos (user-specific storage)
- ✅ Automatic fallback to in-memory storage if MongoDB not configured
- ✅ User-specific todo isolation (each user sees only their todos)

### User Interface
- ✅ Login/Signup pages (`/auth`)
- ✅ Protected routes with auto-redirect
- ✅ User info display and logout functionality
- ✅ Authentication state management with React Context

### Default Test User
- Email: `test@test.com`
- Password: `test`
- Auto-creation endpoint: `/api/init`

## Testing
- ✅ All 67 tests passing
- ✅ Type checking: ✅ Pass
- ✅ Linting: ✅ Pass
- ✅ Updated all tests to work with authentication

## Setup Required
1. Set up MongoDB (local or Atlas)
2. Create `.env.local` with `MONGODB_URI`
3. Visit `/api/init` to create default user
4. See `AUTH_SETUP.md` for detailed instructions

## Architecture
- Clean separation of concerns (auth, data, business logic)
- Repository pattern for data access
- Service layer for business logic
- JWT-based stateless authentication
- User-specific data isolation

