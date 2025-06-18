// Test script to add sample data to S3 bucket for debugging
const AWS = require('aws-sdk');

// Configure AWS SDK
const s3 = new AWS.S3({
  region: 'us-west-2'
});

const bucketName = 's3-storage-browser-storage-686255958159';

async function addTestData() {
  try {
    console.log('🧪 Adding test data to S3 bucket...');
    
    // Create a few test files
    const testFiles = [
      { key: 'test-file-1.txt', content: 'This is test file 1' },
      { key: 'test-file-2.txt', content: 'This is test file 2' },
      { key: 'folder/nested-file.txt', content: 'This is a nested file' }
    ];

    for (const file of testFiles) {
      await s3.putObject({
        Bucket: bucketName,
        Key: file.key,
        Body: file.content,
        ContentType: 'text/plain'
      }).promise();
      console.log(`✅ Created: ${file.key}`);
    }

    // List objects to verify
    const objects = await s3.listObjectsV2({
      Bucket: bucketName
    }).promise();

    console.log('📋 Objects in bucket:');
    objects.Contents.forEach(obj => {
      console.log(`  - ${obj.Key} (${obj.Size} bytes)`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run if called directly
if (require.main === module) {
  addTestData();
}

module.exports = { addTestData };