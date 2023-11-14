import { pool } from "./database.js";
import "./dotenv.js";
import usersData from "../data/usersData.js";
import boardsData from "../data/boardsData.js";
import boardMembersData from "../data/boardMembersData.js";
import tasksData from "../data/tasksData.js";

const createUsersTable = async () => {
  const createUsersTableQuery = `
      DROP TABLE IF EXISTS users CASCADE;
  
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(320) NOT NULL,
        email VARCHAR(320) NOT NULL,
        password VARCHAR(100) NOT NULL,
        phone_number VARCHAR(15) NOT NULL
      )
    `;

  try {
    await pool.query(createUsersTableQuery);
    console.log("🎉 users table created successfully");
  } catch (err) {
    console.error("⚠️ error creating users table", err);
  }
};

const seedUsersTable = async () => {
  await createUsersTable();

  usersData.forEach((item) => {
    const insertQuery = {
      text: "INSERT INTO users (name, email, password, phone_number) VALUES ($1, $2, $3, $4)",
    };

    const values = [item.name, item.email, item.password, item.phone_number];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error("⚠️ error inserting item", err);
        return;
      }
      console.log(`✅ User ${item.name} added successfully`);
    });
  });

  // only after users table has been created should this be created to avoid table deadlock
  seedBoardsTable();
};

const createBoardsTable = async () => {
  const createBoardsTableQuery = `
      DROP TABLE IF EXISTS boards CASCADE;
  
      CREATE TABLE IF NOT EXISTS boards (
        board_id SERIAL PRIMARY KEY,
        board_owner_id SERIAL REFERENCES users(user_id),
        board_name VARCHAR(320) NOT NULL
      )
    `;
  try {
    await pool.query(createBoardsTableQuery);
    console.log("🎉 boards table created successfully");
  } catch (err) {
    console.error("⚠️ error creating boards table", err);
  }
};

const seedBoardsTable = async () => {
  await createBoardsTable();

  boardsData.forEach((item) => {
    const insertQuery = {
      text: "INSERT INTO boards (board_id, board_owner_id, board_name) VALUES ($1, $2, $3)",
    };

    const values = [item.board_id, item.board_owner_id, item.board_name];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error("⚠️ error inserting item", err);
        return;
      }
      console.log(`✅ Board ${item.board_name} added successfully`);
    });
  });

  // only after boards table has been created should this be created to avoid table deadlock
  seedBoardMembersTable();
};

const createBoardMembersTable = async () => {
  const createBoardMembersTableQuery = `
      DROP TABLE IF EXISTS board_members CASCADE;
  
      CREATE TABLE IF NOT EXISTS board_members (
        board_member_id SERIAL REFERENCES users(user_id),
        board_id SERIAL REFERENCES boards(board_id)
      )
    `;
  try {
    await pool.query(createBoardMembersTableQuery);
    console.log("🎉 board_members table created successfully");
  } catch (err) {
    console.error("⚠️ error creating board_members table", err);
  }
};

const seedBoardMembersTable = async () => {
  await createBoardMembersTable();

  boardMembersData.forEach((item) => {
    const insertQuery = {
      text: "INSERT INTO board_members(board_member_id, board_id) VALUES ($1, $2)",
    };

    const values = [item.board_member_id, item.board_id];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error("⚠️ error inserting item", err);
        return;
      }
      console.log(
        `✅ Board member id ${item.board_member_id} added successfully`
      );
    });
  });

  // only after all other tables have been created should tasks table be created to avoid table deadlock
  seedTasksTable();
};

const createTasksTable = async () => {
  const createTasksTableQuery = `
      DROP TABLE IF EXISTS tasks;
  
      CREATE TABLE IF NOT EXISTS tasks (
        task_id SERIAL PRIMARY KEY,
        board_id SERIAL REFERENCES boards(board_id),
        task_creator_id SERIAL REFERENCES users(user_id),
        task_assignee_id SERIAL REFERENCES users(user_id),
        task_description VARCHAR(320) NOT NULL,
        task_priority VARCHAR(320) NOT NULL,
        task_status VARCHAR(320) NOT NULL,
        task_start_time VARCHAR(320) NOT NULL,
        task_end_time VARCHAR(320) NOT NULL,
        task_date DATE NOT NULL
      )
    `;
  try {
    await pool.query(createTasksTableQuery);
    console.log("🎉 tasks table created successfully");
  } catch (err) {
    console.error("⚠️ error creating tasks table", err);
  }
};

const seedTasksTable = async () => {
  await createTasksTable();

  tasksData.forEach((item) => {
    const insertQuery = {
      text: "INSERT INTO tasks (task_id, board_id, task_creator_id, task_assignee_id, task_description, task_priority, task_status, task_start_time, task_end_time, task_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    };

    const values = [
      item.task_id,
      item.board_id,
      item.task_creator_id,
      item.task_assignee_id,
      item.task_description,
      item.task_priority,
      item.task_status,
      item.task_start_time,
      item.task_end_time,
      item.task_date,
    ];

    pool.query(insertQuery, values, (err, res) => {
      if (err) {
        console.error("⚠️ error inserting item", err);
        return;
      }
      console.log(`✅ Task id ${item.task_id} added successfully`);
    });
  });
};

seedUsersTable();
