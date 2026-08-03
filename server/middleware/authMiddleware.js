const jwt = require('jsonwebtoken');

// A fallback secret just for local development (in production, use a .env file!)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_textile_key_123';

const verifyToken = (req, res, next) => {
  // 1. Grab the token from the request headers
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // 2. Remove the "Bearer " prefix standard in HTTP requests
    const token = authHeader.replace('Bearer ', '');
    
    // 3. Verify the token using our secret key
    const verified = jwt.verify(token, JWT_SECRET);
    
    // 4. Attach the decoded user data to the request so the next function can use it
    req.user = verified;
    
    // 5. Let the request proceed to the actual route!
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = { verifyToken, JWT_SECRET };