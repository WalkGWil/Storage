#!/bin/bash

# Deploy CloudFormation stack
aws cloudformation deploy \
  --template-file cloudformation-template.yaml \
  --stack-name s3-storage-browser-stack \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides AppName=s3-storage-browser

# Get outputs
aws cloudformation describe-stacks \
  --stack-name s3-storage-browser-stack \
  --query 'Stacks[0].Outputs'