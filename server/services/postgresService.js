import { pool } from '../config/database.js'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

/*  Class to interact with the Postgres database easier */
/*  Quick Reference: */
//  Methods:
/**
 * @constructor (table) - Constructor to set the table name
 * @method get_all() - Get all records from the table
 * @method get_paginated_data_basic(limit, page) - Get paginated data from the table
 * @method get_paginated_data_where(limit, page, where) - Get paginated data with a WHERE clause
 * @method get_paginated_data_where_order(limit, page, where, order) - Get paginated data with a WHERE clause and ORDER BY clause
 * @method get_by_id(id) - Get a record by ID
 * @method save(data) - Save a new record to the table
 * @method update(id, data) - Update a record by ID
 * @method delete(id) - Delete a record by ID
 * @method get_by_field(field, value) - Get records by a specific field and value
 * @method get_by_fields(fields) - Get records by multiple fields
 */
// Example usage:
/**
 * @example
 * import PostgresService from './services/postgresService.js'
 * 
 * const postService = new PostgresService('posts')
 * 
 * const posts = await postService.get_all()
 * const paginatedPosts = await postService.get_paginated_data_basic(10, 0)
 * const paginatedPostsWhere1 = await postService.get_paginated_data_where(10, 0, { tag: 1 })
 * const paginatedPostsWhere2 = await postService.get_paginated_data_where(10, 0, { tag: 1, user_id: 1 })
 * const paginatedPostsWhereOrder1 = await postService.get_paginated_data_where_order(10, 0, { tag: 1 }, 'created_at DESC') 
 * const paginatedPostsWhereOrder2 = await postService.get_paginated_data_where_order(10, 0, { tag: 1, user_id: 1 }, 'created_at DESC')
 * const post = await postService.get_by_id(1)
 * const newPost = await postService.save({ title: 'New Post', content: 'New content' })
 * const updatedPost = await postService.update(1, { title: 'Updated Post', content: 'Updated content' })
 * const deletedPost = await postService.delete(1)
 * const postsByTag = await postService.get_by_field('tag', 1)
 * const postsByFields = await postService.get_by_fields({ tag: 1, user_id: 1 })
 */

class PostgresService {

    /**
     * Constructor to set the table name
     * @param {string} table - The name of the table in the Postgres database
     * @example
     * const postService = new PostgresService('posts')
     */
    constructor(table) {
        this.table = table
    }

    /**
     * Get all records from the table
     * @returns {Promise<Array>} - Returns all records from the table
     * @example
     * const posts = await postService.get_all()
     */
    async get_all() {
        try {
        const result = await pool.query(`SELECT * FROM ${this.table}`)
        return result.rows
        } catch (error) {
        console.error('Error fetching all data:', error)
        throw error
        }
    }

    /**
     * Get paginated data from the table
     * @param {number} limit - The number of records to return
     * @param {number} page - The page number, starting from 0
     * @returns {Promise<Array>} - Returns paginated data from the table
     * @example
     * const paginatedPosts = await postService.get_paginated_data_basic(10, 0)
     */
    async get_paginated_data_basic(limit, page) {
        try {
        const result = await pool.query(
            `SELECT * FROM ${this.table} LIMIT $1 OFFSET $2`,
            [limit, page * limit]
        )
        return result.rows
        } catch (error) {
        console.error('Error fetching paginated data:', error)
        throw error
        }
    }

    /**
     * Get paginated data with a WHERE clause
     * Useful for getting paginated data from a conditional query
     * @param {number} limit - The number of records to return
     * @param {number} page - The page number, starting from 0
     * @param {Object} where - An object representing the WHERE conditions
     * @returns {Promise<Array>} - Returns paginated data with a WHERE clause
     * @example
     * const paginatedPostsWhere1 = await postService.get_paginated_data_where(10, 0, { tag: 1 })
     */
    async get_paginated_data_where(limit, page, where) {
        const keys = Object.keys(where)
        const values = Object.values(where)
        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ')
    
        try {
            const result = await pool.query(
            `SELECT * FROM ${this.table} WHERE ${conditions} LIMIT $${keys.length + 1} OFFSET $${keys.length + 2}`,
            [...values, limit, page * limit]
            )
            return result.rows
        } catch (error) {
            console.error('Error fetching paginated data with WHERE clause:', error)
            throw error
        }
    }

    /**
     * Get paginated data with a WHERE clause and ORDER BY clause
     * Useful for getting paginated data from a conditional query with an order
     * @param {number} limit - The number of records to return
     * @param {number} page - The page number, starting from 0
     * @param {Object} where - An object representing the WHERE conditions
     * @param {string} order - The ORDER BY clause, e.g., "created_at DESC"
     * @returns {Promise<Array>} - Returns paginated data with a WHERE clause and ORDER BY clause
     * @example
     * const paginatedPostsWhereOrder1 = await postService.get_paginated_data_where_order(10, 0, { tag: 1 }, 'created_at DESC')
     */
    async get_paginated_data_where_order(limit, page, where, order) {
        const keys = Object.keys(where)
        const values = Object.values(where)
        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ')

        try {
            const result = await pool.query(
            `SELECT * FROM ${this.table} WHERE ${conditions} ORDER BY ${order} LIMIT $${keys.length + 1} OFFSET $${keys.length + 2}`,
            [...values, limit, page * limit]
            )
            return result.rows
        } catch (error) {
            console.error('Error fetching paginated data with WHERE clause:', error)
            throw error
        }
    }

    /**
     * Get a record by ID
     * @param {string|number} id 
     * @returns {Promise<Object>} - Returns a record by ID
     * @example
     * const post = await postService.get_by_id(1)
     */
    async get_by_id(id) {
        try {
        const result = await pool.query(
            `SELECT * FROM ${this.table} WHERE id = $1`,
            [id]
        )
        return result.rows[0]
        } catch (error) {
        console.error('Error fetching data by ID:', error)
        throw error
        }
    }

    /**
     * Save a new record to the table
     * @param {Object} data 
     * @returns {Promise<Object>} - Returns the saved data
     * @example
     * const newPost = await postService.save({ title: 'New Post', content: 'New content' })
     */
    async save(data) {
        const keys = Object.keys(data)
        const values = Object.values(data)
        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')

        try {
        const result = await pool.query(
            `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
            values
        )
        return result.rows[0]
        } catch (error) {
        console.error('Error saving data:', error)
        throw error
        }
    }

    /**
     * Update a record by ID
     * @param {string|number} id 
     * @param {Object} data 
     * @returns {Promise<Object>} - Returns the updated data
     * @example
     * const updatedPost = await postService.update(1, { title: 'Updated Post', content: 'Updated content' })
     */
    async update(id, data) {
        const keys = Object.keys(data)
        const values = Object.values(data)
        const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ')

        try {
        const result = await pool.query(
            `UPDATE ${this.table} SET ${setClause} WHERE id = $1 RETURNING *`,
            [id, ...values]
        )
        return result.rows[0]
        } catch (error) {
        console.error('Error updating data:', error)
        throw error
        }
    }

    /**
     * Delete a record by ID
     * @param {string} id 
     * @returns {Promise<Object>} - Returns the deleted data
     * @example
     * const deletedPost = await postService.delete(1)
     */
    async delete(id) {
        try {
        const result = await pool.query(
            `DELETE FROM ${this.table} WHERE id = $1 RETURNING *`,
            [id]
        )
        return result.rows[0]
        } catch (error) {
        console.error('Error deleting data:', error)
        throw error
        }
    }

    /**
     * Returns and array of records by a specific field and value
     * @param {string} field 
     * @param {any} value 
     * @returns {Promise<Array>} - Returns records by field
     * @example
     * const postsByTag = await postService.get_by_field('tag', 1)
     */
    async get_by_field(field, value) {
        try {
        const result = await pool.query(
            `SELECT * FROM ${this.table} WHERE ${field} = $1`,
            [value]
        )
        return result.rows
        } catch (error) {
        console.error('Error fetching data by field:', error)
        throw error
        }
    }

    /**
     * Returns an array of records by multiple fields
     * @param {Object} fields 
     * @returns {Promise<Array>} - Returns records by fields
     * @example
     * const postsByFields = await postService.get_by_fields({ tag: 1, user_id: 1 })
     */
    async get_by_fields(fields) {
        const keys = Object.keys(fields)
        const values = Object.values(fields)
        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ')

        try {
        const result = await pool.query(
            `SELECT * FROM ${this.table} WHERE ${conditions}`,
            values
        )
        return result.rows
        } catch (error) {
        console.error('Error fetching data by fields:', error)
        throw error
        }
    }
}

export default PostgresService