# S3 Storage Browser App

A minimal React web app with S3 Storage Browser functionality deployed via CloudFormation.

## Quick Deploy

1. **Deploy AWS infrastructure:**
   ```bash
   ./deploy.sh
   ```
   This creates Cognito User Pool, Identity Pool, S3 bucket, and generates `.env` file.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

## Manual Deploy

1. **Deploy CloudFormation stack:**
   ```bash
   aws cloudformation deploy \
     --template-file cloudformation-template.yaml \
     --stack-name s3-storage-browser-stack \
     --capabilities CAPABILITY_IAM
   ```

2. **Get configuration values:**
   ```bash
   aws cloudformation describe-stacks \
     --stack-name s3-storage-browser-stack \
     --query 'Stacks[0].Outputs'
   ```

## Infrastructure

- **Cognito User Pool** - User authentication
- **Cognito Identity Pool** - AWS credentials for authenticated users  
- **S3 Bucket** - File storage with CORS configuration
- **IAM Role** - S3 permissions for authenticated users

## Features

- User authentication with Cognito
- S3 file browser interface
- Upload, download, and delete files
- Folder navigation
- Environment variable configuration