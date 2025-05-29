/**
 * User Controller Unit Tests
 * UF3/UF4 Curriculum Project
 * Tests for user controller functions
 */

import { jest } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';
import {
  getProfile,
  updateProfile,
  addWeightEntry,
  getWeightHistory,
  getAllUsers,
  getUserById,
  updateUserStatus
} from '../user.controller.js';

// Mock dependencies
jest.mock('uuid');
jest.mock('../../db/database.js', () => ({
  query: jest.fn()
}));
jest.mock('../../utils/encryption.utils.js', () => ({
  encryptObjectFields: jest.fn((obj) => obj),
  decryptObjectFields: jest.fn((obj) => obj)
}));
jest.mock('../../utils/pagination.utils.js', () => ({
  calculatePaginationMeta: jest.fn(),
  createPaginatedResponse: jest.fn(),
  buildOrderByClause: jest.fn(() => 'ORDER BY created_at ASC'),
  buildLimitClause: jest.fn(() => 'LIMIT 10 OFFSET 0')
}));

import { query } from '../../db/database.js';
import { encryptObjectFields, decryptObjectFields } from '../../utils/encryption.utils.js';
import {
  calculatePaginationMeta,
  createPaginatedResponse,
  buildOrderByClause,
  buildLimitClause
} from '../../utils/pagination.utils.js';

describe('User Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      user: { id: 'user-123', role: 'user' },
      pagination: { page: 1, limit: 10, offset: 0 },
      sorting: { sortBy: 'created_at', sortOrder: 'ASC' }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    test('should get existing user profile successfully', async () => {
      mockReq.params.userId = 'user-123';
      
      const mockProfile = {
        id: 'profile-123',
        user_id: 'user-123',
        weight_kg: 70.5,
        height_cm: 175,
        date_of_birth: '1990-01-01',
        gender: 'male',
        activity_level: 'moderately_active',
        fitness_goal: 'maintain_weight',
        created_at: new Date(),
        updated_at: new Date(),
        email: 'test@example.com',
        first_name: 'encryptedFirstName',
        last_name: 'encryptedLastName',
        role: 'user'
      };
      
      query.mockResolvedValueOnce([mockProfile]);
      decryptObjectFields.mockReturnValue({
        ...mockProfile,
        first_name: 'John',
        last_name: 'Doe'
      });
      
      await getProfile(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['user-123']
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          profile: expect.objectContaining({
            id: 'profile-123',
            userId: 'user-123',
            firstName: 'John',
            lastName: 'Doe',
            weightKg: 70.5,
            heightCm: 175
          })
        }
      });
    });

    test('should create profile if it does not exist', async () => {
      mockReq.params.userId = 'user-123';
      
      query.mockResolvedValueOnce([]); // No existing profile
      uuidv4.mockReturnValue('new-profile-123');
      query.mockResolvedValueOnce(); // Insert new profile
      
      const newProfile = {
        id: 'new-profile-123',
        user_id: 'user-123',
        weight_kg: null,
        height_cm: null,
        created_at: new Date(),
        updated_at: new Date(),
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user'
      };
      
      query.mockResolvedValueOnce([newProfile]); // Get newly created profile
      decryptObjectFields.mockReturnValue(newProfile);
      
      await getProfile(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        'INSERT INTO user_profiles (id, user_id) VALUES (?, ?)',
        ['new-profile-123', 'user-123']
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('should handle database errors', async () => {
      mockReq.params.userId = 'user-123';
      
      query.mockRejectedValue(new Error('Database error'));
      
      await getProfile(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateProfile', () => {
    test('should update existing profile successfully', async () => {
      mockReq.params.userId = 'user-123';
      mockReq.body = {
        weight_kg: 72.0,
        height_cm: 180,
        date_of_birth: '1990-01-01',
        gender: 'male',
        activity_level: 'very_active',
        fitness_goal: 'build_muscle'
      };
      
      query.mockResolvedValueOnce([{ id: 'profile-123' }]); // Existing profile
      query.mockResolvedValueOnce(); // Update profile
      
      const updatedProfile = {
        id: 'profile-123',
        user_id: 'user-123',
        weight_kg: 72.0,
        height_cm: 180,
        date_of_birth: '1990-01-01',
        gender: 'male',
        activity_level: 'very_active',
        fitness_goal: 'build_muscle',
        updated_at: new Date(),
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user'
      };
      
      query.mockResolvedValueOnce([updatedProfile]); // Get updated profile
      decryptObjectFields.mockReturnValue(updatedProfile);
      
      await updateProfile(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE user_profiles SET'),
        expect.arrayContaining([72.0, 180, '1990-01-01', 'male', 'very_active', 'build_muscle', 'user-123'])
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Profile updated successfully',
        data: {
          profile: expect.objectContaining({
            weightKg: 72.0,
            heightCm: 180,
            activityLevel: 'very_active'
          })
        }
      });
    });

    test('should create profile if it does not exist', async () => {
      mockReq.params.userId = 'user-123';
      mockReq.body = {
        weight_kg: 70.0,
        height_cm: 175
      };
      
      query.mockResolvedValueOnce([]); // No existing profile
      uuidv4.mockReturnValue('new-profile-123');
      query.mockResolvedValueOnce(); // Insert new profile
      
      const newProfile = {
        id: 'new-profile-123',
        user_id: 'user-123',
        weight_kg: 70.0,
        height_cm: 175,
        created_at: new Date(),
        updated_at: new Date(),
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user'
      };
      
      query.mockResolvedValueOnce([newProfile]); // Get newly created profile
      decryptObjectFields.mockReturnValue(newProfile);
      
      await updateProfile(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_profiles'),
        expect.arrayContaining(['new-profile-123', 'user-123', 70.0, 175])
      );
    });
  });

  describe('addWeightEntry', () => {
    test('should add weight entry successfully', async () => {
      mockReq.params.userId = 'user-123';
      mockReq.body = {
        weight_kg: 71.5,
        recorded_date: '2024-01-15',
        notes: 'Morning weight'
      };
      
      query.mockResolvedValueOnce([]); // No existing entry for this date
      uuidv4.mockReturnValue('weight-entry-123');
      query.mockResolvedValueOnce(); // Insert weight entry
      
      const newEntry = {
        id: 'weight-entry-123',
        user_id: 'user-123',
        weight_kg: 71.5,
        recorded_date: '2024-01-15',
        notes: 'Morning weight',
        created_at: new Date()
      };
      
      query.mockResolvedValueOnce([newEntry]); // Get created entry
      
      await addWeightEntry(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        'SELECT id FROM weight_history WHERE user_id = ? AND recorded_date = ?',
        ['user-123', '2024-01-15']
      );
      expect(query).toHaveBeenCalledWith(
        'INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, notes) VALUES (?, ?, ?, ?, ?)',
        ['weight-entry-123', 'user-123', 71.5, '2024-01-15', 'Morning weight']
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    test('should return error when entry already exists for date', async () => {
      mockReq.params.userId = 'user-123';
      mockReq.body = {
        weight_kg: 71.5,
        recorded_date: '2024-01-15'
      };
      
      query.mockResolvedValueOnce([{ id: 'existing-entry' }]); // Existing entry
      
      await addWeightEntry(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Weight entry already exists for this date',
          statusCode: 409
        })
      );
    });
  });

  describe('getWeightHistory', () => {
    test('should get weight history with pagination', async () => {
      mockReq.params.userId = 'user-123';
      
      const mockWeightHistory = [
        {
          id: 'entry-1',
          user_id: 'user-123',
          weight_kg: 70.0,
          recorded_date: '2024-01-10',
          notes: 'Test entry 1',
          created_at: new Date()
        },
        {
          id: 'entry-2',
          user_id: 'user-123',
          weight_kg: 71.0,
          recorded_date: '2024-01-11',
          notes: 'Test entry 2',
          created_at: new Date()
        }
      ];
      
      query.mockResolvedValueOnce([{ total: 25 }]); // Total count
      query.mockResolvedValueOnce(mockWeightHistory); // Weight history
      
      const mockPaginationMeta = {
        currentPage: 1,
        totalPages: 3,
        totalCount: 25,
        limit: 10,
        hasNextPage: true,
        hasPrevPage: false
      };
      
      calculatePaginationMeta.mockReturnValue(mockPaginationMeta);
      createPaginatedResponse.mockReturnValue({
        status: 'success',
        data: mockWeightHistory,
        pagination: mockPaginationMeta
      });
      
      await getWeightHistory(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        'SELECT COUNT(*) as total FROM weight_history WHERE user_id = ?',
        ['user-123']
      );
      expect(calculatePaginationMeta).toHaveBeenCalledWith(25, 1, 10);
      expect(createPaginatedResponse).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getAllUsers (Admin)', () => {
    test('should get all users with pagination', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          email: 'user1@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'user',
          is_active: true,
          created_at: new Date()
        }
      ];
      
      query.mockResolvedValueOnce([{ total: 50 }]); // Total count
      query.mockResolvedValueOnce(mockUsers); // Users
      
      const mockPaginationMeta = {
        currentPage: 1,
        totalPages: 5,
        totalCount: 50,
        limit: 10,
        hasNextPage: true,
        hasPrevPage: false
      };
      
      calculatePaginationMeta.mockReturnValue(mockPaginationMeta);
      createPaginatedResponse.mockReturnValue({
        status: 'success',
        data: mockUsers,
        pagination: mockPaginationMeta
      });
      decryptObjectFields.mockReturnValue(mockUsers[0]);
      
      await getAllUsers(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith('SELECT COUNT(*) as total FROM users');
      expect(createPaginatedResponse).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getUserById (Admin)', () => {
    test('should get user by ID successfully', async () => {
      mockReq.params.userId = 'user-123';
      
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'encryptedFirstName',
        last_name: 'encryptedLastName',
        role: 'user',
        is_active: true,
        created_at: new Date()
      };
      
      query.mockResolvedValueOnce([mockUser]);
      decryptObjectFields.mockReturnValue({
        ...mockUser,
        first_name: 'John',
        last_name: 'Doe'
      });
      
      await getUserById(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['user-123']
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          user: expect.objectContaining({
            id: 'user-123',
            firstName: 'John',
            lastName: 'Doe'
          })
        }
      });
    });

    test('should return error when user not found', async () => {
      mockReq.params.userId = 'nonexistent-user';
      
      query.mockResolvedValueOnce([]); // No user found
      
      await getUserById(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not found',
          statusCode: 404
        })
      );
    });
  });

  describe('updateUserStatus (Admin)', () => {
    test('should update user status successfully', async () => {
      mockReq.params.userId = 'user-123';
      mockReq.body = { isActive: false };
      
      query.mockResolvedValueOnce(); // Update user status
      
      const updatedUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
        is_active: false,
        created_at: new Date()
      };
      
      query.mockResolvedValueOnce([updatedUser]); // Get updated user
      decryptObjectFields.mockReturnValue(updatedUser);
      
      await updateUserStatus(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        'UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?',
        [false, 'user-123']
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'User status updated successfully',
        data: {
          user: expect.objectContaining({
            isActive: false
          })
        }
      });
    });

    test('should return error when user not found', async () => {
      mockReq.params.userId = 'nonexistent-user';
      mockReq.body = { isActive: false };
      
      query.mockResolvedValueOnce(); // Update query
      query.mockResolvedValueOnce([]); // No user found
      
      await updateUserStatus(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not found',
          statusCode: 404
        })
      );
    });
  });
});
