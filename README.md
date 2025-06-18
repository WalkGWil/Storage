# Storage Browser Demo

A minimal demo of AWS Amplify Storage Browser component.

## Quick Start

1. **Deploy infrastructure:**
   ```bash
   npm run deploy
   ```

2. **Start the app:**
   ```bash
   npm start
   ```

3. **Create a user account** and start uploading/browsing files!

## What's included

- Cognito authentication
- S3 bucket with proper CORS
- Storage Browser with public and private file access
- Automatic environment configuration

## File Structure

- `public/` - Files accessible to all users
- `private/{user-id}/` - Files private to each user