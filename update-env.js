const { CloudFormationClient, DescribeStacksCommand } = require('@aws-sdk/client-cloudformation');
const fs = require('fs');

async function updateEnv() {
  const client = new CloudFormationClient({ region: 'us-west-2' });
  
  try {
    const response = await client.send(new DescribeStacksCommand({
      StackName: 'storage-browser-demo'
    }));
    
    const outputs = response.Stacks[0].Outputs.reduce((acc, output) => {
      acc[output.OutputKey] = output.OutputValue;
      return acc;
    }, {});
    
    const envContent = `REACT_APP_USER_POOL_ID=${outputs.UserPoolId}
REACT_APP_USER_POOL_CLIENT_ID=${outputs.UserPoolClientId}
REACT_APP_IDENTITY_POOL_ID=${outputs.IdentityPoolId}
REACT_APP_BUCKET_NAME=${outputs.BucketName}
REACT_APP_AWS_REGION=${outputs.Region}
`;
    
    fs.writeFileSync('.env', envContent);
    console.log('✅ Environment variables updated');
  } catch (error) {
    console.error('❌ Error updating environment:', error);
  }
}

updateEnv();