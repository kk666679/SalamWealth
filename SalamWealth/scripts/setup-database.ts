import fs from "fs"
import path from "path"
import { getPool } from "../lib/db"

async function setupDatabase() {
  const pool = getPool()

  try {
    console.log("Setting up database...")

    // Read and execute database-setup.sql
    const setupSql = fs.readFileSync(path.join(__dirname, "database-setup.sql"), "utf8")
    await pool.query(setupSql)
    console.log("Database schema created successfully")

    // Read and execute sample-data.sql
    const sampleDataSql = fs.readFileSync(path.join(__dirname, "sample-data.sql"), "utf8")
    await pool.query(sampleDataSql)
    console.log("Sample data inserted successfully")

    console.log("Database setup completed successfully")
  } catch (error) {
    console.error("Error setting up database:", error)
  } finally {
    await pool.end()
  }
}

setupDatabase()
