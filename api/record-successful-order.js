module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    try {
      const payload = req.body || {};
      const paymentStatus = String(payload.paymentStatus || '').toUpperCase();
      
      if (paymentStatus !== 'SUCCESS' && !payload.transactionId) {
        return res.status(400).json({
          status: 'ignored',
          message: 'Only verified successful paid orders are recorded'
        });
      }

      return res.status(200).json({
        status: 'recorded',
        orderId: payload.orderId || ('ORD-' + Date.now()),
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  return res.status(405).json({ status: 'method_not_allowed' });
};
