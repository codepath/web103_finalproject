import { pool } from '../server/config/database.js'

try {
  console.log('\n=== DATABASE SCHEMA INSPECTION ===')

  const context = await pool.query(`
        SELECT
            current_database() AS database_name,
            current_schema() AS current_schema,
            current_setting('search_path') AS search_path
    `)

  console.log('\nDatabase context:')
  console.table(context.rows)

  const schemas = await pool.query(`
        SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name NOT IN (
            'information_schema',
            'pg_catalog'
        )
        AND schema_name NOT LIKE 'pg_toast%'
        AND schema_name NOT LIKE 'pg_temp%'
        ORDER BY schema_name
    `)

  console.log('\nAvailable schemas:')
  console.table(schemas.rows)

  const tables = await pool.query(`
        SELECT
            table_schema,
            table_name,
            table_type
        FROM information_schema.tables
        WHERE table_schema NOT IN (
            'information_schema',
            'pg_catalog'
        )
        ORDER BY table_schema, table_name
    `)

  console.log('\nVisible database tables:')

  if (tables.rows.length === 0) {
    console.log('No tables visible to the current database user.')
  } else {
    console.table(tables.rows)
  }

  const expected = [
    'users',
    'venues',
    'activity_types',
    'events',
    'tags',
    'event_tags',
    'event_images',
  ]

  const found = expected.filter((name) =>
    tables.rows.some((table) => table.table_name === name),
  )

  console.log(`\nExpected Local Bloom tables found: ${found.length}/7`)

  const missing = expected.filter((name) => !found.includes(name))

  if (missing.length > 0) {
    console.log('Missing or inaccessible:', missing.join(', '))
  }
} catch (error) {
  console.error('\n=== INSPECTION FAILED ===')
  console.error('Error code:', error.code || 'N/A')
  console.error('Error type:', error.name)
  process.exitCode = 1
} finally {
  await pool.end()
}
