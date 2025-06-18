import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { StorageBrowser } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID,
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID
    }
  },
  Storage: {
    S3: {
      bucket: process.env.REACT_APP_BUCKET_NAME,
      region: process.env.REACT_APP_AWS_REGION
    }
  }
};

Amplify.configure(amplifyConfig);

function App() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h1>S3 Storage Browser Demo</h1>
            <button onClick={signOut}>Sign out</button>
          </div>
          <StorageBrowser />
        </div>
      )}
    </Authenticator>
  );
}

export default App;