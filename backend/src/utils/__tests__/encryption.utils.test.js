/**
 * Encryption Utils Unit Tests
 * UF3/UF4 Curriculum Project
 * Tests for encryption utility functions
 */

import { jest } from '@jest/globals';
import {
  encrypt,
  decrypt,
  encryptObjectFields,
  decryptObjectFields,
  hashPassword,
  comparePassword
} from '../encryption.utils.js';

// Mock environment variables
process.env.ENCRYPTION_KEY = 'test_encryption_key_32_characters';
process.env.ENCRYPTION_ALGORITHM = 'aes-256-cbc';

describe('Encryption Utils', () => {
  describe('encrypt and decrypt', () => {
    test('should encrypt and decrypt text correctly', () => {
      const originalText = 'Hello, World!';
      const encrypted = encrypt(originalText);
      const decrypted = decrypt(encrypted);
      
      expect(encrypted).not.toBe(originalText);
      expect(decrypted).toBe(originalText);
    });

    test('should handle empty string', () => {
      const originalText = '';
      const encrypted = encrypt(originalText);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(originalText);
    });

    test('should handle null values', () => {
      const encrypted = encrypt(null);
      const decrypted = decrypt(encrypted);
      
      expect(encrypted).toBeNull();
      expect(decrypted).toBeNull();
    });

    test('should handle undefined values', () => {
      const encrypted = encrypt(undefined);
      const decrypted = decrypt(encrypted);
      
      expect(encrypted).toBeUndefined();
      expect(decrypted).toBeUndefined();
    });

    test('should produce different encrypted values for same input', () => {
      const originalText = 'Test message';
      const encrypted1 = encrypt(originalText);
      const encrypted2 = encrypt(originalText);
      
      expect(encrypted1).not.toBe(encrypted2);
      expect(decrypt(encrypted1)).toBe(originalText);
      expect(decrypt(encrypted2)).toBe(originalText);
    });

    test('should handle special characters', () => {
      const originalText = 'Special chars: !@#$%^&*()_+{}|:"<>?[]\\;\',./ àáâãäåæçèéêë';
      const encrypted = encrypt(originalText);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(originalText);
    });

    test('should handle long text', () => {
      const originalText = 'A'.repeat(1000);
      const encrypted = encrypt(originalText);
      const decrypted = decrypt(encrypted);
      
      expect(decrypted).toBe(originalText);
    });
  });

  describe('encryptObjectFields', () => {
    test('should encrypt specified fields in object', () => {
      const originalObject = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };
      const fieldsToEncrypt = ['firstName', 'lastName'];
      
      const encryptedObject = encryptObjectFields(originalObject, fieldsToEncrypt);
      
      expect(encryptedObject.id).toBe(originalObject.id);
      expect(encryptedObject.email).toBe(originalObject.email);
      expect(encryptedObject.firstName).not.toBe(originalObject.firstName);
      expect(encryptedObject.lastName).not.toBe(originalObject.lastName);
    });

    test('should handle non-existent fields gracefully', () => {
      const originalObject = {
        id: '123',
        name: 'John'
      };
      const fieldsToEncrypt = ['firstName', 'lastName'];
      
      const encryptedObject = encryptObjectFields(originalObject, fieldsToEncrypt);
      
      expect(encryptedObject.id).toBe(originalObject.id);
      expect(encryptedObject.name).toBe(originalObject.name);
      expect(encryptedObject.firstName).toBeUndefined();
      expect(encryptedObject.lastName).toBeUndefined();
    });

    test('should handle empty fields array', () => {
      const originalObject = {
        id: '123',
        name: 'John'
      };
      const fieldsToEncrypt = [];
      
      const encryptedObject = encryptObjectFields(originalObject, fieldsToEncrypt);
      
      expect(encryptedObject).toEqual(originalObject);
    });

    test('should handle null object', () => {
      const fieldsToEncrypt = ['firstName'];
      
      const encryptedObject = encryptObjectFields(null, fieldsToEncrypt);
      
      expect(encryptedObject).toBeNull();
    });

    test('should handle undefined object', () => {
      const fieldsToEncrypt = ['firstName'];
      
      const encryptedObject = encryptObjectFields(undefined, fieldsToEncrypt);
      
      expect(encryptedObject).toBeUndefined();
    });
  });

  describe('decryptObjectFields', () => {
    test('should decrypt specified fields in object', () => {
      const originalObject = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };
      const fieldsToEncrypt = ['firstName', 'lastName'];
      
      const encryptedObject = encryptObjectFields(originalObject, fieldsToEncrypt);
      const decryptedObject = decryptObjectFields(encryptedObject, fieldsToEncrypt);
      
      expect(decryptedObject).toEqual(originalObject);
    });

    test('should handle non-existent fields gracefully', () => {
      const originalObject = {
        id: '123',
        name: 'John'
      };
      const fieldsToDecrypt = ['firstName', 'lastName'];
      
      const decryptedObject = decryptObjectFields(originalObject, fieldsToDecrypt);
      
      expect(decryptedObject.id).toBe(originalObject.id);
      expect(decryptedObject.name).toBe(originalObject.name);
    });

    test('should handle empty fields array', () => {
      const originalObject = {
        id: '123',
        name: 'John'
      };
      const fieldsToDecrypt = [];
      
      const decryptedObject = decryptObjectFields(originalObject, fieldsToDecrypt);
      
      expect(decryptedObject).toEqual(originalObject);
    });

    test('should handle null object', () => {
      const fieldsToDecrypt = ['firstName'];
      
      const decryptedObject = decryptObjectFields(null, fieldsToDecrypt);
      
      expect(decryptedObject).toBeNull();
    });
  });

  describe('hashPassword', () => {
    test('should hash password correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    test('should produce different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    test('should handle empty password', async () => {
      const password = '';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);
    });

    test('should handle special characters in password', async () => {
      const password = 'P@ssw0rd!@#$%^&*()';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);
    });
  });

  describe('comparePassword', () => {
    test('should compare password correctly', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);
      
      const isMatch = await comparePassword(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    test('should return false for incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hashedPassword = await hashPassword(password);
      
      const isMatch = await comparePassword(wrongPassword, hashedPassword);
      expect(isMatch).toBe(false);
    });

    test('should handle empty password', async () => {
      const password = '';
      const hashedPassword = await hashPassword(password);
      
      const isMatch = await comparePassword(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    test('should handle case sensitivity', async () => {
      const password = 'TestPassword123!';
      const wrongCasePassword = 'testpassword123!';
      const hashedPassword = await hashPassword(password);
      
      const isMatch = await comparePassword(wrongCasePassword, hashedPassword);
      expect(isMatch).toBe(false);
    });
  });
});
