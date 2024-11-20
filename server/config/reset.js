import { pool } from "./database.js";
import {categoriesData} from '../data/categories.js';
// import "./dotenv.js";

const createUserTable = async () => {
  const query = `
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                githubid integer NOT NULL,
                username varchar(100) NOT NULL,
                avatarurl varchar(500) NOT NULL,
                accesstoken varchar(500) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

  try {
    await pool.query(query);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
};

const createIncomeTable = async () => {
  const query = `
            CREATE TABLE IF NOT EXISTS income (
                id SERIAL PRIMARY KEY,
                user_id integer NOT NULL,
                amount decimal NOT NULL,
                source varchar(255) NOT NULL,
                date date NOT NULL
            );
        `;

  try {
    await pool.query(query);
    console.log("Income table created successfully");
  } catch (error) {
    console.error("Error creating income table:", error);
  }
};

const createExpensesTable = async () => {
  const query = `
            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                user_id integer NOT NULL,
                category_id integer NOT NULL,
                amount decimal NOT NULL,
                description varchar(255) NOT NULL,
                date date NOT NULL
            );
        `;

  try {
    await pool.query(query);
    console.log("Expenses table created successfully");
  } catch (error) {
    console.error("Error creating expenses table:", error);
  }
};

const createCategoriesTable = async () => {
  const query = `
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name varchar(255) NOT NULL
            );
        `;

  try {
    await pool.query(query);
    console.log("Categories table created successfully");
  } catch (error) {
    console.error("Error creating categories table:", error);
  }
};

const createSavingsGoalsTable = async () => {
  const query = `
            CREATE TABLE IF NOT EXISTS savings_goals (
                id SERIAL PRIMARY KEY,
                user_id integer NOT NULL,
                goal_name varchar(255) NOT NULL,
                target_amount decimal NOT NULL,
                current_amount decimal NOT NULL,
                deadline date NOT NULL
            );
        `;

  try {
    await pool.query(query);
    console.log("Savings goals table created successfully");
  } catch (error) {
    console.error("Error creating savings goals table:", error);
  }
};

const createBudgetAlertsTable = async () => {
  const query = `
            CREATE TABLE IF NOT EXISTS budget_alerts (
                id SERIAL PRIMARY KEY,
                user_id integer NOT NULL,
                limit_amount decimal NOT NULL,
                alert_message varchar(255) NOT NULL
            );
        `;

  try {
    await pool.query(query);
    console.log("Budget alerts table created successfully");
  } catch (error) {
    console.error("Error creating budget alerts table:", error);
  }
};

const createReportsTable = async () => {
  const query = `
            CREATE TABLE IF NOT EXISTS reports (
                id SERIAL PRIMARY KEY,
                user_id integer NOT NULL,
                report_type varchar(255) NOT NULL,
                date_range varchar(255) NOT NULL,
                report_data text NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

  try {
    await pool.query(query);
    console.log("Reports table created successfully");
  } catch (error) {
    console.error("Error creating reports table:", error);
  }
};

const createAllTables = async () => {
  await createUserTable();
  await createIncomeTable();
  await createExpensesTable();
  await createCategoriesTable();
  await createSavingsGoalsTable();
  await createBudgetAlertsTable();
  await createReportsTable();
};

createAllTables();

const seedCategoriesTable = async () => {
  const query = `
            INSERT INTO categories (name)
            VALUES ($1)
            ;
        `;

  try {
    for (const category of categoriesData) {
      await pool.query(query, [category.name]);
    }
    console.log("Categories table seeded successfully");
  } catch (error) {
    console.error("Error seeding categories table:", error);
  }
};

await seedCategoriesTable();