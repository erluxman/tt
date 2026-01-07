#!/usr/bin/env node

const https = require('https');

const REPO_OWNER = 'erluxman';
const REPO_NAME = 'tt';
const BRANCH = 'feature/ci-cd-and-architecture-refactor';
const BASE_BRANCH = 'main';

const TITLE = 'feat: Add CI/CD pipeline and refactor to SOLID architecture';
const BODY = `## Summary
This PR implements a complete CI/CD setup and refactors the codebase to follow SOLID principles with proper separation of concerns.

## Changes

### Architecture Refactoring
- ✅ Extracted types to \`lib/types/todo.ts\`
- ✅ Created repository layer (\`lib/repositories/todoRepository.ts\`) for data access
- ✅ Created service layer (\`lib/services/todoService.ts\`) for business logic
- ✅ Created custom hook (\`hooks/useTodos.ts\`) for state management
- ✅ Split UI into smaller components (TodoForm, TodoItem, TodoList)
- ✅ Refactored API route to use service layer
- ✅ Refactored main page to use new components and hooks

### Testing Infrastructure
- ✅ Set up Jest and React Testing Library
- ✅ Added comprehensive test coverage (66 tests, all passing)
  - Repository layer tests
  - Service layer tests
  - Component tests
  - API route integration tests

### CI/CD Pipeline
- ✅ Created GitHub Actions workflow (\`.github/workflows/ci.yml\`)
  - Runs on all pushes and pull requests
  - Executes: linting, type checking, tests, and build verification
- ✅ Added branch protection documentation (\`.github/BRANCH_PROTECTION.md\`)

## Testing
- ✅ All 66 tests passing
- ✅ Type checking: ✅ Pass
- ✅ Linting: ✅ Pass
- ✅ Build: ✅ Successful

## Next Steps
After merging, follow the instructions in \`.github/BRANCH_PROTECTION.md\` to set up branch protection rules in GitHub.`;

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
  console.error(`https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/new/${BRANCH}`);
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
  path: `/repos/${REPO_OWNER}/${REPO_NAME}/pulls`,
  method: 'POST',
  headers: {
    'Authorization': `token ${token}`,
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
      console.log(`PR URL: ${pr.html_url}`);
      console.log(`PR Number: #${pr.number}`);
    } else {
      console.error('❌ Failed to create pull request.');
      console.error(`Status: ${res.statusCode}`);
      console.error('Response:', responseData);
      console.error('');
      console.error('You can create it manually at:');
      console.error(`https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/new/${BRANCH}`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error creating pull request:', error.message);
  console.error('');
  console.error('You can create it manually at:');
  console.error(`https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/new/${BRANCH}`);
  process.exit(1);
});

req.write(data);
req.end();

