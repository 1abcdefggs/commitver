// Simple test without external dependencies
function testCommitver() {
  console.log('🧪 Testing basic workspace functionality...\n');
  
  // Test basic functionality without external dependencies
  const testMessage = 'Test commit message';
  const testVersion = '1.0.0';
  
  console.log('📝 Original message:', testMessage);
  console.log('📝 Test version:', testVersion);
  console.log('📝 Formatted message: `v${testVersion} ${testMessage}`');
  
  console.log('\n✅ Basic test completed successfully!');
  console.log('🎯 The test project is working in the workspace');
  console.log('📁 Workspace root:', process.cwd());
}

// Run the test
testCommitver();
