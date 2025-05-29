/**
 * Encryption Utilities
 * UF3/UF4 Curriculum Project
 * Provides encryption and decryption for sensitive user data
 */

import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

/**
 * Get encryption key from environment or generate one
 * @returns {Buffer} Encryption key
 */
const getEncryptionKey = () => {
  const envKey = process.env.ENCRYPTION_KEY;
  
  if (envKey) {
    // Ensure key is exactly 32 bytes
    if (envKey.length >= KEY_LENGTH) {
      return Buffer.from(envKey.slice(0, KEY_LENGTH), 'utf8');
    } else {
      // Pad key if too short
      const paddedKey = envKey.padEnd(KEY_LENGTH, '0');
      return Buffer.from(paddedKey, 'utf8');
    }
  }
  
  // Generate a random key if none provided (not recommended for production)
  console.warn('⚠️  No ENCRYPTION_KEY found in environment. Using random key (data will not persist across restarts)');
  return crypto.randomBytes(KEY_LENGTH);
};

// Get the encryption key
const ENCRYPTION_KEY = getEncryptionKey();

/**
 * Encrypt sensitive data
 * @param {string} text - Text to encrypt
 * @returns {string} Encrypted data with IV and tag
 */
const encrypt = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  try {
    // Generate random IV for each encryption
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    cipher.setAAD(Buffer.from('fitness-tracker-aad', 'utf8'));
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get authentication tag
    const tag = cipher.getAuthTag();
    
    // Combine IV, tag, and encrypted data
    const result = iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
    
    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt sensitive data
 * @param {string} encryptedData - Encrypted data with IV and tag
 * @returns {string} Decrypted text
 */
const decrypt = (encryptedData) => {
  if (!encryptedData || typeof encryptedData !== 'string') {
    return encryptedData;
  }

  try {
    // Split the encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    // Create decipher
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    decipher.setAAD(Buffer.from('fitness-tracker-aad', 'utf8'));
    decipher.setAuthTag(tag);
    
    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash sensitive data (one-way)
 * @param {string} data - Data to hash
 * @param {string} salt - Optional salt
 * @returns {string} Hashed data
 */
const hashData = (data, salt = '') => {
  if (!data) return data;
  
  try {
    const hash = crypto.createHash('sha256');
    hash.update(data + salt);
    return hash.digest('hex');
  } catch (error) {
    console.error('Hashing error:', error);
    throw new Error('Failed to hash data');
  }
};

/**
 * Generate a secure random token
 * @param {number} length - Token length in bytes
 * @returns {string} Random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a secure random password
 * @param {number} length - Password length
 * @returns {string} Random password
 */
const generatePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

/**
 * Encrypt object fields
 * @param {Object} obj - Object to encrypt
 * @param {Array} fields - Fields to encrypt
 * @returns {Object} Object with encrypted fields
 */
const encryptObjectFields = (obj, fields = []) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const encrypted = { ...obj };
  
  fields.forEach(field => {
    if (encrypted[field] !== undefined && encrypted[field] !== null) {
      encrypted[field] = encrypt(String(encrypted[field]));
    }
  });
  
  return encrypted;
};

/**
 * Decrypt object fields
 * @param {Object} obj - Object to decrypt
 * @param {Array} fields - Fields to decrypt
 * @returns {Object} Object with decrypted fields
 */
const decryptObjectFields = (obj, fields = []) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const decrypted = { ...obj };
  
  fields.forEach(field => {
    if (decrypted[field] !== undefined && decrypted[field] !== null) {
      try {
        decrypted[field] = decrypt(String(decrypted[field]));
      } catch (error) {
        console.warn(`Failed to decrypt field ${field}:`, error.message);
        // Keep original value if decryption fails
      }
    }
  });
  
  return decrypted;
};

/**
 * Validate encryption key strength
 * @param {string} key - Encryption key to validate
 * @returns {Object} Validation result
 */
const validateEncryptionKey = (key) => {
  if (!key) {
    return { valid: false, message: 'Encryption key is required' };
  }
  
  if (key.length < 32) {
    return { valid: false, message: 'Encryption key must be at least 32 characters long' };
  }
  
  // Check for common weak patterns
  const weakPatterns = [
    /^(.)\1+$/, // All same character
    /^(012|123|234|345|456|567|678|789|890)+/, // Sequential numbers
    /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+/i // Sequential letters
  ];
  
  for (const pattern of weakPatterns) {
    if (pattern.test(key)) {
      return { valid: false, message: 'Encryption key appears to use a weak pattern' };
    }
  }
  
  return { valid: true, message: 'Encryption key is valid' };
};

export {
  encrypt,
  decrypt,
  hashData,
  generateToken,
  generatePassword,
  encryptObjectFields,
  decryptObjectFields,
  validateEncryptionKey
};
