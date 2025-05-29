/**
 * Logging Middleware
 * UF3/UF4 Curriculum Project
 * Provides comprehensive request/response logging for monitoring and debugging
 */

import morgan from 'morgan';

/**
 * Custom token for user ID
 */
morgan.token('user-id', (req) => {
  return req.user?.id || 'anonymous';
});

/**
 * Custom token for user email
 */
morgan.token('user-email', (req) => {
  return req.user?.email || 'anonymous';
});

/**
 * Custom token for request body (sanitized)
 */
morgan.token('body', (req) => {
  if (req.method === 'GET' || !req.body) return '';
  
  // Create a copy to avoid modifying original
  const sanitizedBody = { ...req.body };
  
  // Remove sensitive fields
  delete sanitizedBody.password;
  delete sanitizedBody.passwordConfirm;
  delete sanitizedBody.currentPassword;
  delete sanitizedBody.newPassword;
  
  return JSON.stringify(sanitizedBody);
});

/**
 * Custom token for response time in milliseconds
 */
morgan.token('response-time-ms', (req, res) => {
  if (!req._startAt || !res._startAt) {
    return '';
  }
  
  const ms = (res._startAt[0] - req._startAt[0]) * 1000 +
             (res._startAt[1] - req._startAt[1]) * 1e-6;
  
  return ms.toFixed(3);
});

/**
 * Development logging format
 * Detailed logging for development environment
 */
const developmentFormat = ':method :url :status :response-time-ms ms - :res[content-length] bytes - User: :user-email (:user-id) - Body: :body';

/**
 * Production logging format
 * Concise logging for production environment
 */
const productionFormat = ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time-ms ms';

/**
 * Combined logging format
 * Standard Apache combined log format with additional fields
 */
const combinedFormat = ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

/**
 * Create logging middleware based on environment
 */
const createLogger = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'development':
      return morgan(developmentFormat, {
        skip: (req, res) => {
          // Skip logging for health checks and static files
          return req.url === '/health' || 
                 req.url === '/favicon.ico' ||
                 req.url.startsWith('/static/');
        }
      });
      
    case 'production':
      return morgan(productionFormat, {
        skip: (req, res) => {
          // Skip successful requests in production to reduce log volume
          return res.statusCode < 400;
        }
      });
      
    case 'test':
      // Minimal logging for tests
      return morgan('tiny', {
        skip: () => true // Skip all logging in test environment
      });
      
    default:
      return morgan(combinedFormat);
  }
};

/**
 * Error logging middleware
 * Logs detailed error information
 */
const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const userId = req.user?.id || 'anonymous';
  const userEmail = req.user?.email || 'anonymous';
  
  console.error(`[${timestamp}] ERROR - ${err.status || 'UNKNOWN'}`);
  console.error(`User: ${userEmail} (${userId})`);
  console.error(`Method: ${req.method} ${req.originalUrl}`);
  console.error(`IP: ${req.ip || req.connection.remoteAddress}`);
  console.error(`User-Agent: ${req.get('User-Agent') || 'Unknown'}`);
  console.error(`Error: ${err.message}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`Stack: ${err.stack}`);
  }
  
  next(err);
};

/**
 * Request logging middleware
 * Logs incoming requests with detailed information
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const userId = req.user?.id || 'anonymous';
  const userEmail = req.user?.email || 'anonymous';
  
  // Log request details
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  console.log(`User: ${userEmail} (${userId})`);
  console.log(`IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`User-Agent: ${req.get('User-Agent') || 'Unknown'}`);
  
  // Log request body for non-GET requests (sanitized)
  if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    delete sanitizedBody.password;
    delete sanitizedBody.passwordConfirm;
    delete sanitizedBody.currentPassword;
    delete sanitizedBody.newPassword;
    
    console.log(`Body: ${JSON.stringify(sanitizedBody)}`);
  }
  
  next();
};

/**
 * Response logging middleware
 * Logs outgoing responses
 */
const responseLogger = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    const timestamp = new Date().toISOString();
    const userId = req.user?.id || 'anonymous';
    
    console.log(`[${timestamp}] Response ${res.statusCode} - User: ${userId}`);
    
    if (process.env.NODE_ENV === 'development' && res.statusCode >= 400) {
      console.log(`Response Body: ${data}`);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

/**
 * API access logger
 * Logs API endpoint access for analytics
 */
const apiAccessLogger = (req, res, next) => {
  // Only log API endpoints
  if (!req.originalUrl.startsWith('/api/')) {
    return next();
  }
  
  const timestamp = new Date().toISOString();
  const userId = req.user?.id || 'anonymous';
  const endpoint = req.originalUrl;
  const method = req.method;
  
  // Log API access
  console.log(`[${timestamp}] API_ACCESS - ${method} ${endpoint} - User: ${userId}`);
  
  next();
};

export {
  createLogger,
  errorLogger,
  requestLogger,
  responseLogger,
  apiAccessLogger,
  developmentFormat,
  productionFormat,
  combinedFormat
};
