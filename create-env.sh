#!/bin/bash

# Create .env file from existing CloudFormation stack
echo "Creating .env file from CloudFormation stack..."

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

echo "REACT_APP_AWS_REGION=us-west-2" >> .env

echo ".env file created successfully!"
cat .env