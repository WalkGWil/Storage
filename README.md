# S3 Storage Browser App

A minimal Amplify web app with S3 Storage Browser functionality.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure Amplify:
   - Update `src/App.js` with your AWS configuration:
     - User Pool ID
     - User Pool Client ID  
     - Identity Pool ID
     - S3 bucket name
     - AWS region

3. Deploy with Amplify:
   ```
   amplify init
   amplify add auth
   amplify add storage
   amplify push
   ```

4. Start development server:
   ```
   npm start
   ```

## Features

- User authentication with Cognito
- S3 file browser interface
- Upload, download, and delete files
- Folder navigation