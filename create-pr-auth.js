#!/usr/bin/env node

const https = require('https');

const REPO_OWNER = 'erluxman';
const REPO_NAME = 'tt';
const BRANCH = 'feature/authentication-and-mongodb';
const BASE_BRANCH = 'main';

const TITLE = 'feat: Add authentication and MongoDB persistence';
const BODY = `## Summary
This PR implements authentication and MongoDB persistence for the todo application.

## Changes

### Authentication System
- ✅ JWT-based authentication with secure token management
- ✅ Login/Signup API endpoints (\`/api/auth/login\`, \`/api/auth/signup\`)
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
- ✅ Login/Signup pages (\`/auth\`)
- ✅ Protected routes with auto-redirect
- ✅ User info display and logout functionality
- ✅ Authentication state management with React Context

### Default Test User
- Email: \`test@test.com\`
- Password: \`test\`
- Auto-creation endpoint: \`/api/init\`

## Testing
- ✅ All 67 tests passing
- ✅ Type checking: ✅ Pass
- ✅ Linting: ✅ Pass
- ✅ Updated all tests to work with authentication

## Setup Required
1. Set up MongoDB (local or Atlas)
2. Create \`.env.local\` with \`MONGODB_URI\`
3. Visit \`/api/init\` to create default user
4. See \`AUTH_SETUP.md\` for detailed instructions

## Architecture
- Clean separation of concerns (auth, data, business logic)
- Repository pattern for data access
- Service layer for business logic
- JWT-based stateless authentication
- User-specific data isolation`;

const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error('❌ GITHUB_TOKEN environment variable is not set.');
  console.error('');
  console.error('Please set it with: export GITHUB_TOKEN=your_token_here');
  console.error('');
  console.error('To create a GitHub token:');
  console.error('1. Go to https://github.com/settings/tokens');
  console.error('2. Click "Generate new token (classic)"');
  console.error('3. Select "repo" scope');
  console.error('4. Copy the token and run: export GITHUB_TOKEN=your_token');
  console.error('');
  console.error('Or create the PR manually at:');
  console.error(\`https://github.com/\${REPO_OWNER}/\${REPO_NAME}/pull/new/\${BRANCH}\`);
  process.exit(1);
}

const data = JSON.stringify({
  title: TITLE,
  body: BODY,
  head: BRANCH,
  base: BASE_BRANCH,
});

const options = {
  hostname: 'api.github.com',
  path: \`/repos/\${REPO_OWNER}/\${REPO_NAME}/pulls\`,
  method: 'POST',
  headers: {
    'Authorization': \`token \${token}\`,
    'User-Agent': 'Node.js',
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

console.log('Creating pull request...');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 201) {
      const pr = JSON.parse(responseData);
      console.log('✅ Pull request created successfully!');
      console.log(\`PR URL: \${pr.html_url}\`);
      console.log(\`PR Number: #\${pr.number}\`);
    } else {
      console.error('❌ Failed to create pull request.');
      console.error(\`Status: \${res.statusCode}\`);
      console.error('Response:', responseData);
      console.error('');
      console.error('You can create it manually at:');
      console.error(\`https://github.com/\${REPO_OWNER}/\${REPO_NAME}/pull/new/\${BRANCH}\`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error creating pull request:', error.message);
  console.error('');
  console.error('You can create it manually at:');
  console.error(\`https://github.com/\${REPO_OWNER}/\${REPO_NAME}/pull/new/\${BRANCH}\`);
  process.exit(1);
});

req.write(data);
req.end();
