/**
 * Pagination Utils Unit Tests
 * UF3/UF4 Curriculum Project
 * Tests for pagination utility functions
 */

import { jest } from '@jest/globals';
import {
  parsePaginationParams,
  parseSortParams,
  calculatePaginationMeta,
  createPaginatedResponse,
  buildWhereClause,
  buildOrderByClause,
  buildLimitClause,
  buildSearchClause,
  paginationMiddleware
} from '../pagination.utils.js';

describe('Pagination Utils', () => {
  describe('parsePaginationParams', () => {
    test('should parse valid pagination parameters', () => {
      const query = { page: '2', limit: '20' };
      const result = parsePaginationParams(query);
      
      expect(result).toEqual({
        page: 2,
        limit: 20,
        offset: 20
      });
    });

    test('should use default values for invalid parameters', () => {
      const query = { page: 'invalid', limit: 'invalid' };
      const result = parsePaginationParams(query);
      
      expect(result).toEqual({
        page: 1,
        limit: 10,
        offset: 0
      });
    });

    test('should handle missing parameters', () => {
      const query = {};
      const result = parsePaginationParams(query);
      
      expect(result).toEqual({
        page: 1,
        limit: 10,
        offset: 0
      });
    });

    test('should enforce maximum limit', () => {
      const query = { page: '1', limit: '200' };
      const result = parsePaginationParams(query, 100);
      
      expect(result.limit).toBe(100);
    });

    test('should enforce minimum values', () => {
      const query = { page: '0', limit: '0' };
      const result = parsePaginationParams(query);
      
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
    });
  });

  describe('parseSortParams', () => {
    test('should parse valid sort parameters', () => {
      const query = { sortBy: 'name', sortOrder: 'DESC' };
      const allowedFields = ['name', 'created_at'];
      const result = parseSortParams(query, allowedFields);
      
      expect(result).toEqual({
        sortBy: 'name',
        sortOrder: 'DESC'
      });
    });

    test('should use default values for invalid sort field', () => {
      const query = { sortBy: 'invalid_field', sortOrder: 'ASC' };
      const allowedFields = ['name', 'created_at'];
      const result = parseSortParams(query, allowedFields, 'created_at');
      
      expect(result).toEqual({
        sortBy: 'created_at',
        sortOrder: 'ASC'
      });
    });

    test('should normalize sort order', () => {
      const query = { sortBy: 'name', sortOrder: 'desc' };
      const allowedFields = ['name'];
      const result = parseSortParams(query, allowedFields);
      
      expect(result.sortOrder).toBe('DESC');
    });

    test('should handle missing parameters', () => {
      const query = {};
      const allowedFields = ['name'];
      const result = parseSortParams(query, allowedFields, 'name');
      
      expect(result).toEqual({
        sortBy: 'name',
        sortOrder: 'ASC'
      });
    });
  });

  describe('calculatePaginationMeta', () => {
    test('should calculate pagination metadata correctly', () => {
      const totalCount = 95;
      const page = 2;
      const limit = 10;
      
      const result = calculatePaginationMeta(totalCount, page, limit);
      
      expect(result).toEqual({
        currentPage: 2,
        totalPages: 10,
        totalCount: 95,
        limit: 10,
        hasNextPage: true,
        hasPrevPage: true
      });
    });

    test('should handle first page correctly', () => {
      const totalCount = 25;
      const page = 1;
      const limit = 10;
      
      const result = calculatePaginationMeta(totalCount, page, limit);
      
      expect(result.hasPrevPage).toBe(false);
      expect(result.hasNextPage).toBe(true);
    });

    test('should handle last page correctly', () => {
      const totalCount = 25;
      const page = 3;
      const limit = 10;
      
      const result = calculatePaginationMeta(totalCount, page, limit);
      
      expect(result.hasPrevPage).toBe(true);
      expect(result.hasNextPage).toBe(false);
    });

    test('should handle single page correctly', () => {
      const totalCount = 5;
      const page = 1;
      const limit = 10;
      
      const result = calculatePaginationMeta(totalCount, page, limit);
      
      expect(result.hasPrevPage).toBe(false);
      expect(result.hasNextPage).toBe(false);
      expect(result.totalPages).toBe(1);
    });

    test('should handle zero count correctly', () => {
      const totalCount = 0;
      const page = 1;
      const limit = 10;
      
      const result = calculatePaginationMeta(totalCount, page, limit);
      
      expect(result.totalPages).toBe(0);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(false);
    });
  });

  describe('createPaginatedResponse', () => {
    test('should create paginated response correctly', () => {
      const data = [{ id: 1, name: 'Test' }];
      const paginationMeta = {
        currentPage: 1,
        totalPages: 1,
        totalCount: 1,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
      };
      const message = 'Data retrieved successfully';
      
      const result = createPaginatedResponse(data, paginationMeta, message);
      
      expect(result).toEqual({
        status: 'success',
        message: 'Data retrieved successfully',
        data: [{ id: 1, name: 'Test' }],
        pagination: paginationMeta
      });
    });

    test('should use default message when not provided', () => {
      const data = [];
      const paginationMeta = {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
      };
      
      const result = createPaginatedResponse(data, paginationMeta);
      
      expect(result.message).toBe('Data retrieved successfully');
    });
  });

  describe('buildOrderByClause', () => {
    test('should build ORDER BY clause correctly', () => {
      const result = buildOrderByClause('name', 'DESC', 'u');
      expect(result).toBe('ORDER BY u.name DESC');
    });

    test('should handle missing table alias', () => {
      const result = buildOrderByClause('created_at', 'ASC');
      expect(result).toBe('ORDER BY created_at ASC');
    });

    test('should handle missing parameters', () => {
      const result = buildOrderByClause();
      expect(result).toBe('');
    });
  });

  describe('buildLimitClause', () => {
    test('should build LIMIT clause correctly', () => {
      const result = buildLimitClause(10, 20);
      expect(result).toBe('LIMIT 10 OFFSET 20');
    });

    test('should handle zero offset', () => {
      const result = buildLimitClause(10, 0);
      expect(result).toBe('LIMIT 10 OFFSET 0');
    });

    test('should handle missing parameters', () => {
      const result = buildLimitClause();
      expect(result).toBe('');
    });
  });

  describe('buildSearchClause', () => {
    test('should build search clause for multiple fields', () => {
      const searchTerm = 'test';
      const fields = ['name', 'description'];
      const tableAlias = 'e';
      
      const result = buildSearchClause(searchTerm, fields, tableAlias);
      
      expect(result.searchClause).toBe('(e.name LIKE ? OR e.description LIKE ?)');
      expect(result.params).toEqual(['%test%', '%test%']);
    });

    test('should handle single field', () => {
      const searchTerm = 'test';
      const fields = ['name'];
      
      const result = buildSearchClause(searchTerm, fields);
      
      expect(result.searchClause).toBe('(name LIKE ?)');
      expect(result.params).toEqual(['%test%']);
    });

    test('should handle empty search term', () => {
      const searchTerm = '';
      const fields = ['name'];
      
      const result = buildSearchClause(searchTerm, fields);
      
      expect(result.searchClause).toBe('');
      expect(result.params).toEqual([]);
    });

    test('should handle empty fields array', () => {
      const searchTerm = 'test';
      const fields = [];
      
      const result = buildSearchClause(searchTerm, fields);
      
      expect(result.searchClause).toBe('');
      expect(result.params).toEqual([]);
    });
  });
});
