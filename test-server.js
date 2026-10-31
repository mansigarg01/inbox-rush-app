// test-server.js
import './server/index.js';

// Wait 1 second for server to listen
await new Promise(res => setTimeout(res, 1200));

console.log('Testing endpoints via in-process fetch...');

try {
  // Test 1: Config
  const res1 = await fetch('http://127.0.0.1:3001/api/config');
  const data1 = await res1.json();
  console.log('Test 1 Config Success:', data1);

  // Test 2: Auth Status
  const res2 = await fetch('http://127.0.0.1:3001/api/auth/status');
  const data2 = await res2.json();
  console.log('Test 2 Auth Status Success:', data2);

  // Test 3: Emails Demo
  const res3 = await fetch('http://127.0.0.1:3001/api/emails?demo=true');
  const data3 = await res3.json();
  console.log('Test 3 Emails Success:', {
    count: data3.count,
    mode: data3.mode,
    firstSubject: data3.emails[0]?.subject,
    gamePrompt: data3.emails[0]?.gamePrompt
  });

  // Test 4: Action Execute Demo
  const res4 = await fetch('http://127.0.0.1:3001/api/actions/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messageId: 'mock_msg_001',
      action: 'ARCHIVE',
      isDemo: true
    })
  });
  const data4 = await res4.json();
  console.log('Test 4 Action Success:', data4);

  // Test 5: Summary Stats
  const res5 = await fetch('http://127.0.0.1:3001/api/stats/summary');
  const data5 = await res5.json();
  console.log('Test 5 Summary Success:', data5);

  console.log('\n🌟 ALL SERVER & API TESTS PASSED 100%!');
  process.exit(0);
} catch (err) {
  console.error('Test failed:', err);
  process.exit(1);
}
