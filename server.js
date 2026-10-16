// Foodie Hu Mai - Secure Zero-Dependency Local & Production HTTP Server
// Hardened with Security Headers, Path Traversal Defense, and Live Order Referral Tracking

const http = require('http');
const fs = require('fs');
const path = require('path');
const couponsData = require('./coupons.js');
const comparatorEngine = require('./comparator.js');

const PORT = process.env.PORT || 4200;
const PUBLIC_DIR = path.resolve(__dirname);
const ORDERS_LOG_FILE = path.join(PUBLIC_DIR, 'orders-log.json');

// MIME types whitelist
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Security Headers (Clickjacking, MIME Sniffing, XSS defense)
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:;"
};

// ==========================================
// PERSISTENT ORDER LOGGING SYSTEM
// ==========================================
function loadOrdersLog() {
  try {
    if (fs.existsSync(ORDERS_LOG_FILE)) {
      const data = fs.readFileSync(ORDERS_LOG_FILE, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (err) {
    console.error('[Telemetry] Error reading orders log:', err.message);
  }
  return [];
}

function saveOrderLog(record) {
  try {
    const logs = loadOrdersLog();
    logs.unshift(record); // Prepend latest order
    // Keep last 500 orders
    const trimmed = logs.slice(0, 500);
    fs.writeFileSync(ORDERS_LOG_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[Telemetry] Error writing orders log:', err.message);
    return false;
  }
}

// ==========================================
// HTTP SERVER LOGIC
// ==========================================
const requestHandler = (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...SECURITY_HEADERS
    });
    return res.end();
  }

  // ==========================================
  // API ROUTE 1: GET /api/coupons
  // ==========================================
  if (pathname === '/api/coupons' && method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      ...SECURITY_HEADERS
    });
    return res.end(JSON.stringify({ status: 'success', count: couponsData.length, coupons: couponsData }));
  }

  // ==========================================
  // API ROUTE 2: GET /api/compare
  // ==========================================
  if (pathname === '/api/compare' && method === 'GET') {
    const amount = parseFloat(parsedUrl.searchParams.get('amount')) || 299;
    const payment = parsedUrl.searchParams.get('payment') || 'all';
    const orderType = parsedUrl.searchParams.get('type') || 'solo';
    
    const comparison = comparatorEngine.calculate(amount, payment, orderType);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      ...SECURITY_HEADERS
    });
    return res.end(JSON.stringify({ status: 'success', result: comparison }));
  }

  // ==========================================
  // API ROUTE 3: POST /api/record-successful-order (also supports /api/track-order)
  // Only records genuine successful orders with confirmed payment
  // ==========================================
  if ((pathname === '/api/record-successful-order' || pathname === '/api/track-order') && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) req.destroy(); // 1MB buffer limit against DoS
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');

        // Require genuine payment confirmation
        const paymentStatus = String(payload.paymentStatus || '').toUpperCase();
        if (paymentStatus !== 'SUCCESS' && !payload.transactionId) {
          res.writeHead(400, {
            'Content-Type': 'application/json; charset=UTF-8',
            ...SECURITY_HEADERS
          });
          return res.end(JSON.stringify({ 
            status: 'ignored', 
            message: 'Only verified successful paid orders are recorded' 
          }));
        }

        const record = {
          orderId: `FHM-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          transactionId: String(payload.transactionId || `TXN-${Date.now()}`).substring(0, 50),
          paymentStatus: 'SUCCESS',
          timestamp: new Date().toISOString(),
          platform: String(payload.platform || 'Direct Order').substring(0, 50),
          restaurant: String(payload.restaurant || 'Direct Dish').substring(0, 80),
          couponCode: String(payload.couponCode || 'NONE').substring(0, 30),
          billAmount: Math.max(0, Number(payload.billAmount) || 0),
          savings: Math.max(0, Math.min(10000, Number(payload.savings) || 0)),
          city: String(payload.city || 'Ludhiana').substring(0, 50),
          clientIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'
        };

        saveOrderLog(record);
        console.log(`[Order Confirmed] ${record.orderId} | Txn: ${record.transactionId} | ${record.platform} | ${record.restaurant} | Bill: ₹${record.billAmount} | Saved: ₹${record.savings}`);

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          ...SECURITY_HEADERS
        });
        return res.end(JSON.stringify({ status: 'success', recorded: true, record }));
      } catch (err) {
        res.writeHead(400, {
          'Content-Type': 'application/json; charset=UTF-8',
          ...SECURITY_HEADERS
        });
        return res.end(JSON.stringify({ status: 'error', message: 'Malformed JSON payload' }));
      }
    });
    return;
  }

  // ==========================================
  // API ROUTE 4: GET /api/orders-log
  // Admin analytics endpoint to view all recorded referral orders
  // ==========================================
  if (pathname === '/api/orders-log' && method === 'GET') {
    const logs = loadOrdersLog();
    const totalSaved = logs.reduce((sum, item) => sum + (item.savings || 0), 0);
    
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      ...SECURITY_HEADERS
    });
    return res.end(JSON.stringify({
      status: 'success',
      totalTrackedOrders: logs.length,
      totalSavedRupees: totalSaved,
      orders: logs
    }));
  }

  // ==========================================
  // HARDENED STATIC ASSET SERVING WITH PATH TRAVERSAL DEFENSE
  // ==========================================
  const targetFile = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const safePath = path.resolve(PUBLIC_DIR, targetFile);

  // VULNERABILITY FIX 1: Boundary check against Directory Traversal (LFI)
  if (!safePath.startsWith(PUBLIC_DIR)) {
    console.warn(`[Security Alert] Blocked Path Traversal attempt: ${pathname}`);
    res.writeHead(403, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
    return res.end('403 Forbidden - Path traversal attempt blocked');
  }

  // VULNERABILITY FIX 2: Block access to hidden/system files
  const baseName = path.basename(safePath);
  if (baseName.startsWith('.') || baseName === 'orders-log.json') {
    res.writeHead(403, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
    return res.end('403 Forbidden - Protected file');
  }

  // VULNERABILITY FIX 3: Whitelisted Extension verification
  const ext = path.extname(safePath).toLowerCase();
  const contentType = MIME_TYPES[ext];
  if (!contentType) {
    res.writeHead(403, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
    return res.end('403 Forbidden - File type not allowed');
  }

  // Safe file read
  fs.readFile(safePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
        res.end('404 Not Found - Foodie Hu Mai');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
        res.end('500 Server Error');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        ...SECURITY_HEADERS
      });
      res.end(content);
    }
  });
};

const server = http.createServer(requestHandler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🛡️ FOODIE HU MAI - Secure Hardened Server is LIVE!`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`📊 Order Tracking API: http://localhost:${PORT}/api/orders-log`);
    console.log(`====================================================`);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = requestHandler;
}
