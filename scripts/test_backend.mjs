async function runTests() {
  console.log('=== Test 1: Is Lumi alive? ===');
  try {
    const res = await fetch('http://127.0.0.1:5001/health');
    const data = await res.json();
    console.log('Lumi Health (127.0.0.1:5001):', data);
  } catch (err) {
    try {
      const res = await fetch('http://localhost:5001/health');
      const data = await res.json();
      console.log('Lumi Health (localhost:5001):', data);
    } catch (e2) {
      console.log('Lumi health error:', err.message);
    }
  }

  console.log('\n=== Test 2: Full chat flow with Lumi ===');
  try {
    const res = await fetch('http://127.0.0.1:5001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "I'm tired",
        todayFocusMs: 3600000,
        status: 'working',
        breakDue: true,
        breaks: [],
      }),
    });
    const data = await res.json();
    console.log('Lumi Response:');
    console.log('- Reply:', data.reply);
    console.log('- Suggested Action:', data.suggestedAction);
    console.log('- Full data:', data);
  } catch (err) {
    try {
      const res = await fetch('http://localhost:5001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "I'm tired",
          todayFocusMs: 3600000,
          status: 'working',
          breakDue: true,
          breaks: [],
        }),
      });
      const data = await res.json();
      console.log('Lumi Response:');
      console.log('- Reply:', data.reply);
      console.log('- Suggested Action:', data.suggestedAction);
      console.log('- Full data:', data);
    } catch (e2) {
      console.log('Chat error:', err.message);
    }
  }
}

runTests();
