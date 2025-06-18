# S3 Storage Browser Debug Guide

## Common Issues and Solutions

### 1. Empty Storage Browser (No Data Showing)

**Possible Causes:**
- Empty S3 bucket
- Permission issues
- CORS configuration problems
- Authentication issues
- Incorrect bucket/region configuration

**Debug Steps:**

1. **Check Browser Console** - Look for error messages in the developer console
2. **Verify Environment Variables** - Ensure all REACT_APP_* variables are set correctly
3. **Test S3 Access** - Use the debug panel's "Test S3 Access" button
4. **Check Authentication** - Verify user is properly authenticated with Cognito

### 2. Permission Errors

**Symptoms:**
- "Access Denied" errors
- 403 status codes
- "User is not authorized to perform" messages

**Solutions:**
- Verify IAM role has correct S3 permissions
- Check Identity Pool role attachment
- Ensure bucket policy allows access

### 3. CORS Issues

**Symptoms:**
- Network errors in browser console
- "CORS policy" error messages
- Failed preflight requests

**Solutions:**
- Verify S3 bucket CORS configuration
- Check allowed origins, methods, and headers

### 4. Empty Bucket

**Symptoms:**
- "0 objects found" in debug panel
- Empty StorageBrowser interface

**Solutions:**
- Add test files to the bucket
- Run the test-s3-data.js script to populate sample data

## Debug Console Output

The enhanced App.js now provides detailed console logging:

- 🔍 Environment variable validation
- 🔧 Amplify configuration details
- 🔐 Authentication status
- 🧪 S3 access test results
- 📊 StorageBrowser item counts
- ❌ Detailed error information
- 🌐 CORS test results

## Manual Testing Commands

### Test S3 Access via AWS CLI
```bash
aws s3 ls s3://s3-storage-browser-storage-686255958159 --region us-west-2
```

### Add Test Files
```bash
echo "Test content" | aws s3 cp - s3://s3-storage-browser-storage-686255958159/test-file.txt --region us-west-2
```

### Check Bucket CORS
```bash
aws s3api get-bucket-cors --bucket s3-storage-browser-storage-686255958159 --region us-west-2
```

## Troubleshooting Checklist

- [ ] Environment variables are correctly set
- [ ] CloudFormation stack deployed successfully
- [ ] User can authenticate with Cognito
- [ ] S3 bucket exists and is accessible
- [ ] IAM roles have correct permissions
- [ ] CORS is properly configured
- [ ] Bucket contains some test data
- [ ] Network connectivity is working
- [ ] No browser console errors

## Next Steps

1. Run the application and check the debug panel
2. Look for specific error messages in the console
3. Use the "Test S3 Access" and "Test CORS" buttons
4. If bucket is empty, run the test-s3-data.js script
5. Verify all AWS resources are properly configured