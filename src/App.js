import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { StorageBrowser } from '@aws-amplify/ui-react-storage';
import { getCurrentUser } from 'aws-amplify/auth';
import { list } from 'aws-amplify/storage';
import '@aws-amplify/ui-react/styles.css';

// Debug environment variables
console.log('🔍 Environment Variables:', {
  userPoolId: process.env.REACT_APP_USER_POOL_ID,
  userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
  identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  bucketName: process.env.REACT_APP_BUCKET_NAME,
  region: process.env.REACT_APP_AWS_REGION
});

const amplifyConfig = {
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
      region: process.env.REACT_APP_AWS_REGION || 'us-west-2'
    }
  }
};

console.log('🔧 Amplify Configuration:', amplifyConfig);
Amplify.configure(amplifyConfig);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ StorageBrowser Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '2px solid red', borderRadius: '5px', background: '#ffe6e6' }}>
          <h3>❌ StorageBrowser Error</h3>
          <p><strong>Error:</strong> {this.state.error?.message}</p>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function DebugPanel({ user }) {
  const [s3Objects, setS3Objects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [networkInfo, setNetworkInfo] = useState({});

  const testS3Access = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🧪 Testing S3 access...');
      
      // Test different path variations
      const tests = [
        { path: '', description: 'Root path' },
        { path: '/', description: 'Root with slash' },
        { path: 'public/', description: 'Public folder' }
      ];

      let allObjects = [];
      for (const test of tests) {
        try {
          console.log(`🔍 Testing path: "${test.path}" (${test.description})`);
          const result = await list({ path: test.path });
          console.log(`✅ ${test.description} result:`, result);
          if (result.items) {
            allObjects = [...allObjects, ...result.items];
          }
        } catch (pathError) {
          console.warn(`⚠️ ${test.description} failed:`, pathError.message);
        }
      }

      setS3Objects(allObjects);
      
      // Test network connectivity
      const bucketUrl = `https://${process.env.REACT_APP_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com`;
      setNetworkInfo({
        bucketUrl,
        timestamp: new Date().toISOString()
      });

    } catch (err) {
      console.error('❌ S3 access error:', err);
      console.error('❌ Error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        statusCode: err.$metadata?.httpStatusCode,
        stack: err.stack
      });
      setError(`${err.name}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testBucketCORS = async () => {
    try {
      const bucketUrl = `https://${process.env.REACT_APP_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com`;
      console.log('🌐 Testing CORS with bucket URL:', bucketUrl);
      
      const response = await fetch(bucketUrl, { method: 'HEAD' });
      console.log('✅ CORS test response:', response.status, response.headers);
    } catch (corsError) {
      console.error('❌ CORS test failed:', corsError);
    }
  };

  useEffect(() => {
    if (user) {
      testS3Access();
      testBucketCORS();
    }
  }, [user]);

  return (
    <div style={{ background: '#f5f5f5', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
      <h3>🔍 Debug Information</h3>
      <p><strong>User:</strong> {user?.username || 'Not authenticated'}</p>
      <p><strong>User ID:</strong> {user?.userId || 'N/A'}</p>
      <p><strong>Bucket:</strong> {process.env.REACT_APP_BUCKET_NAME}</p>
      <p><strong>Region:</strong> {process.env.REACT_APP_AWS_REGION}</p>
      <p><strong>Bucket URL:</strong> {networkInfo.bucketUrl}</p>
      
      <div style={{ margin: '10px 0' }}>
        <button onClick={testS3Access} disabled={loading} style={{ marginRight: '10px' }}>
          {loading ? 'Testing...' : 'Test S3 Access'}
        </button>
        <button onClick={testBucketCORS}>Test CORS</button>
      </div>
      
      {error && (
        <div style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '3px' }}>
          ❌ <strong>Error:</strong> {error}
        </div>
      )}
      
      <p><strong>S3 Objects Found:</strong> {s3Objects.length}</p>
      {s3Objects.length === 0 && !loading && (
        <div style={{ color: 'orange', background: '#fff3cd', padding: '10px', borderRadius: '3px' }}>
          ⚠️ <strong>No objects found.</strong> The bucket might be empty or there could be permission issues.
        </div>
      )}
      
      {s3Objects.length > 0 && (
        <details>
          <summary>View Objects ({s3Objects.length})</summary>
          <pre style={{ background: 'white', padding: '10px', borderRadius: '3px', overflow: 'auto' }}>
            {JSON.stringify(s3Objects, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔐 Checking authentication...');
        const currentUser = await getCurrentUser();
        console.log('✅ Current user:', currentUser);
        setUser(currentUser);
      } catch (err) {
        console.log('ℹ️ User not authenticated:', err.message);
        setAuthError(err.message);
      }
    };
    checkAuth();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user: authUser }) => {
        console.log('🔐 Authenticator user:', authUser);
        
        return (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h1>S3 Storage Browser</h1>
              <button onClick={signOut}>Sign out</button>
            </div>
            
            <DebugPanel user={authUser} />
            
            <ErrorBoundary>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
                <StorageBrowser 
                  path=""
                  displayText={{
                    getListObjectsResultMessage: (items) => {
                      console.log('📊 StorageBrowser items:', items);
                      return `${items.length} objects found`;
                    }
                  }}
                  onError={(error) => {
                    console.error('❌ StorageBrowser error:', error);
                  }}
                  onUploadStart={(file) => {
                    console.log('⬆️ Upload started:', file);
                  }}
                  onUploadSuccess={(result) => {
                    console.log('✅ Upload success:', result);
                  }}
                  onUploadError={(error) => {
                    console.error('❌ Upload error:', error);
                  }}
                />
              </div>
            </ErrorBoundary>
          </div>
        );
      }}
    </Authenticator>
  );
}

export default App;