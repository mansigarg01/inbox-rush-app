// debug-flow.js
import { spawn } from 'child_process';
import http from 'http';

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9333;

const browserProc = spawn(edgePath, [
  `--remote-debugging-port=${port}`,
  '--headless',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--user-data-dir=C:\\Users\\LENOVO\\.gemini\\antigravity\\scratch\\inbox-rush\\.debug_profile',
  'about:blank'
], { stdio: 'ignore' });

// Wait 2s for browser to start
await new Promise(r => setTimeout(r, 2000));

async function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

try {
  const version = await getJson('/json/version');
  console.log('Connected to Edge:', version.Browser);

  // Create new target tab for http://localhost:3001
  const newTab = await new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: port,
      path: '/json/new?http://localhost:3001',
      method: 'PUT'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });

  console.log('Opened tab:', newTab.id);

  // Connect via native WebSocket
  const WebSocket = globalThis.WebSocket;
  const ws = new WebSocket(newTab.webSocketDebuggerUrl);

  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let msgId = 1;
  function send(method, params = {}) {
    const id = msgId++;
    return new Promise(resolve => {
      const listener = (event) => {
        const res = JSON.parse(event.data);
        if (res.id === id) {
          ws.removeEventListener('message', listener);
          resolve(res.result);
        }
      };
      ws.addEventListener('message', listener);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Enable Console and Runtime
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log(`[BROWSER CONSOLE ${msg.params.type.toUpperCase()}]:`, ...msg.params.args.map(a => a.value || a.description));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]:', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
    }
  });

  await send('Console.enable');
  await send('Runtime.enable');
  await send('Page.enable');

  console.log('Navigating to http://localhost:3001 ...');
  await send('Page.navigate', { url: 'http://localhost:3001' });

  // Wait 2s for Landing Page
  await new Promise(r => setTimeout(r, 2000));

  // Check DOM text
  let evalRes = await send('Runtime.evaluate', {
    expression: 'document.body.innerText'
  });
  console.log('Home screen loaded, text preview:', evalRes.result.value.substring(0, 150));

  // Find and click "PLAY DEMO QUEST" button
  console.log('Clicking PLAY DEMO QUEST button...');
  evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const demoBtn = btns.find(b => b.innerText.includes('PLAY DEMO'));
      if (!demoBtn) return 'PLAY DEMO button not found!';
      demoBtn.click();
      return 'Clicked PLAY DEMO';
    })()`
  });
  console.log('Click result:', evalRes.result.value);

  // Wait 1.5s for Mission Selection screen
  await new Promise(r => setTimeout(r, 1500));

  evalRes = await send('Runtime.evaluate', {
    expression: 'document.body.innerText'
  });
  console.log('Mission selection text preview:', evalRes.result.value.substring(0, 200));

  // Find and click "START MISSION" button
  console.log('Clicking START MISSION button...');
  evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.innerText.includes('START MISSION'));
      if (!startBtn) return 'START MISSION button not found!';
      startBtn.click();
      return 'Clicked START MISSION';
    })()`
  });
  console.log('Start Mission Click result:', evalRes.result.value);

  // Wait 2s for Gameplay screen to load
  await new Promise(r => setTimeout(r, 2500));

  evalRes = await send('Runtime.evaluate', {
    expression: 'document.body.innerText'
  });
  console.log('After Start Mission, page text:', evalRes.result.value.substring(0, 300));

  ws.close();
} catch (err) {
  console.error('Debug script error:', err);
} finally {
  browserProc.kill();
  process.exit(0);
}
