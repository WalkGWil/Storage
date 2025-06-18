import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { StorageBrowser } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

// Debug environment variables
console.log('Environment Variables:', {
  userPoolId: process.env.REACT_APP_USER_POOL_ID,
  userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
  identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  bucketName: process.env.REACT_APP_BUCKET_NAME,
  region: process.env.REACT_APP_AWS_REGION
});

// Replace these with CloudFormation outputs
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID || 'YOUR_USER_POOL_ID',
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || 'YOUR_USER_POOL_CLIENT_ID',
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID || 'YOUR_IDENTITY_POOL_ID',
      loginWith: {
        username: true
      }
    }
  },
  Storage: {
    S3: {
      bucket: process.env.REACT_APP_BUCKET_NAME || 'YOUR_BUCKET_NAME',
      region: 'us-west-2'
    }
  }
});

function App() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h1>S3 Storage Browser</h1>
            <button onClick={signOut}>Sign out</button>
          </div>
          <StorageBrowser 
            displayText={{
              getListObjectsResultMessage: (items) => `${items.length} objects`
            }}
          />
        </div>
      )}
    </Authenticator>
  );
}

export default App;