/**
 * Pagination and Sorting Utilities
 * UF3/UF4 Curriculum Project
 * Provides comprehensive pagination and sorting functionality for API endpoints
 */

/**
 * Parse pagination parameters from request query
 * @param {Object} query - Request query object
 * @returns {Object} Pagination parameters
 */
const parsePaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  // Ensure reasonable limits
  const maxLimit = 100;
  const finalLimit = Math.min(limit, maxLimit);

  return {
    page: Math.max(page, 1),
    limit: finalLimit,
    offset: Math.max(offset, 0)
  };
};

/**
 * Parse sorting parameters from request query
 * @param {Object} query - Request query object
 * @param {Array} allowedFields - Array of allowed sort fields
 * @param {string} defaultField - Default sort field
 * @returns {Object} Sorting parameters
 */
const parseSortParams = (query, allowedFields = [], defaultField = 'created_at') => {
  let sortBy = query.sortBy || defaultField;
  let sortOrder = (query.sortOrder || 'DESC').toUpperCase();

  // Validate sort field
  if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
    sortBy = defaultField;
  }

  // Validate sort order
  if (!['ASC', 'DESC'].includes(sortOrder)) {
    sortOrder = 'DESC';
  }

  return {
    sortBy,
    sortOrder
  };
};

/**
 * Parse filtering parameters from request query
 * @param {Object} query - Request query object
 * @param {Array} allowedFilters - Array of allowed filter fields
 * @returns {Object} Filter parameters
 */
const parseFilterParams = (query, allowedFilters = []) => {
  const filters = {};

  allowedFilters.forEach(field => {
    if (query[field] !== undefined) {
      filters[field] = query[field];
    }
  });

  return filters;
};

/**
 * Build SQL WHERE clause from filters
 * @param {Object} filters - Filter parameters
 * @param {string} tableAlias - Table alias for SQL query
 * @returns {Object} SQL WHERE clause and parameters
 */
const buildWhereClause = (filters, tableAlias = '') => {
  const conditions = [];
  const params = [];
  const prefix = tableAlias ? `${tableAlias}.` : '';

  Object.entries(filters).forEach(([field, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        // Handle array values (IN clause)
        const placeholders = value.map(() => '?').join(',');
        conditions.push(`${prefix}${field} IN (${placeholders})`);
        params.push(...value);
      } else if (typeof value === 'string' && value.includes('%')) {
        // Handle LIKE queries
        conditions.push(`${prefix}${field} LIKE ?`);
        params.push(value);
      } else {
        // Handle exact matches
        conditions.push(`${prefix}${field} = ?`);
        params.push(value);
      }
    }
  });

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  return { whereClause, params };
};

/**
 * Build SQL ORDER BY clause
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (ASC/DESC)
 * @param {string} tableAlias - Table alias for SQL query
 * @returns {string} SQL ORDER BY clause
 */
const buildOrderByClause = (sortBy, sortOrder, tableAlias = '') => {
  const prefix = tableAlias ? `${tableAlias}.` : '';
  return `ORDER BY ${prefix}${sortBy} ${sortOrder}`;
};

/**
 * Build SQL LIMIT clause
 * @param {number} limit - Number of records to return
 * @param {number} offset - Number of records to skip
 * @returns {string} SQL LIMIT clause
 */
const buildLimitClause = (limit, offset) => {
  return `LIMIT ${limit} OFFSET ${offset}`;
};

/**
 * Calculate pagination metadata
 * @param {number} totalCount - Total number of records
 * @param {number} page - Current page number
 * @param {number} limit - Records per page
 * @returns {Object} Pagination metadata
 */
const calculatePaginationMeta = (totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalCount,
    limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

/**
 * Create paginated response
 * @param {Array} data - Array of records
 * @param {Object} meta - Pagination metadata
 * @param {string} message - Success message
 * @returns {Object} Formatted response
 */
const createPaginatedResponse = (data, meta, message = 'Data retrieved successfully') => {
  return {
    status: 'success',
    message,
    data,
    pagination: meta,
    timestamp: new Date().toISOString()
  };
};

/**
 * Middleware for handling pagination, sorting, and filtering
 * @param {Object} options - Configuration options
 * @returns {Function} Express middleware
 */
const paginationMiddleware = (options = {}) => {
  const {
    allowedSortFields = ['created_at', 'updated_at'],
    allowedFilters = [],
    defaultSortField = 'created_at',
    maxLimit = 100
  } = options;

  return (req, res, next) => {
    // Parse pagination parameters
    const pagination = parsePaginationParams(req.query);
    pagination.limit = Math.min(pagination.limit, maxLimit);

    // Parse sorting parameters
    const sorting = parseSortParams(req.query, allowedSortFields, defaultSortField);

    // Parse filtering parameters
    const filters = parseFilterParams(req.query, allowedFilters);

    // Attach to request object
    req.pagination = pagination;
    req.sorting = sorting;
    req.filters = filters;

    next();
  };
};

/**
 * Search functionality for text fields
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @param {string} tableAlias - Table alias
 * @returns {Object} Search clause and parameters
 */
const buildSearchClause = (searchTerm, searchFields = [], tableAlias = '') => {
  if (!searchTerm || searchFields.length === 0) {
    return { searchClause: '', params: [] };
  }

  const prefix = tableAlias ? `${tableAlias}.` : '';
  const conditions = searchFields.map(field => `${prefix}${field} LIKE ?`);
  const searchClause = `(${conditions.join(' OR ')})`;
  const params = searchFields.map(() => `%${searchTerm}%`);

  return { searchClause, params };
};

export {
  parsePaginationParams,
  parseSortParams,
  parseFilterParams,
  buildWhereClause,
  buildOrderByClause,
  buildLimitClause,
  calculatePaginationMeta,
  createPaginatedResponse,
  paginationMiddleware,
  buildSearchClause
};
