import { pool } from '../server/config/database.js'

try {
  console.log('\n=== LOCAL BLOOM DATABASE CONNECTION TEST ===')

  const result = await pool.query(`
        SELECT
            current_database() AS database_name,
            current_user AS database_user,
            NOW() AS server_time,
            version() AS postgres_version
    `)

  const row = result.rows[0]

  console.log('\n=== CONNECTION SUCCESSFUL ===')
  console.log('Database:', row.database_name)
  console.log('User:', row.database_user)
  console.log('Server time:', row.server_time)
  console.log(
    'PostgreSQL:',
    row.postgres_version.split(' ').slice(0, 2).join(' '),
  )

  const tables = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name IN (
            'users',
            'venues',
            'activity_types',
            'events',
            'tags',
            'event_tags',
            'event_images'
          )
        ORDER BY table_name
    `)

  console.log('\n=== LOCAL BLOOM TABLES ===')

  for (const table of tables.rows) {
    console.log(table.table_name)
  }

  console.log(`\nFound ${tables.rows.length} of 7 expected tables.`)

  if (tables.rows.length !== 7) {
    console.warn('WARNING: Some expected tables are missing or not visible.')
    process.exitCode = 1
  }
} catch (error) {
  console.error('\n=== CONNECTION FAILED ===')
  console.error('Error code:', error.code || 'N/A')
  console.error('Error type:', error.name)
  console.error(
    'Check credentials, database access, network, and SSL configuration.',
  )

  process.exitCode = 1
} finally {
  await pool.end()
}
