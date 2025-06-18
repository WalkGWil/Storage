#!/bin/bash

# Deploy CloudFormation stack
aws cloudformation deploy \
  --template-file cloudformation-template.yaml \
  --stack-name s3-storage-browser-stack \
  --capabilities CAPABILITY_IAM

# Get outputs and save to .env file
aws cloudformation describe-stacks \
  --stack-name s3-storage-browser-stack \
  --query 'Stacks[0].Outputs' \
  --output table

echo "Creating .env file..."
aws cloudformation describe-stacks \
  --stack-name s3-storage-browser-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
  --output text | sed 's/^/REACT_APP_USER_POOL_ID=/' > .env

aws cloudformation describe-stacks \
  --stack-name s3-storage-browser-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
  --output text | sed 's/^/REACT_APP_USER_POOL_CLIENT_ID=/' >> .env

aws cloudformation describe-stacks \
  --stack-name s3-storage-browser-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`IdentityPoolId`].OutputValue' \
  --output text | sed 's/^/REACT_APP_IDENTITY_POOL_ID=/' >> .env

aws cloudformation describe-stacks \
  --stack-name s3-storage-browser-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
  --output text | sed 's/^/REACT_APP_BUCKET_NAME=/' >> .env

aws cloudformation describe-stacks \
  --stack-name s3-storage-browser-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`Region`].OutputValue' \
  --output text | sed 's/^/REACT_APP_AWS_REGION=/' >> .env

echo ".env file created successfully!"