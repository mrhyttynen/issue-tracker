// TODO: move this to src folder
import { Database } from "sqlite3";

const bodyParser = require('body-parser')

const express = require('express');
import { Request, Response } from "express";
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
const jsonParser = bodyParser.json();
const backendPort = 8080;
const frontEndPort = 3000;

enum IssueStatus {OPEN, IN_PROGRESS, RESOLVED, CLOSED}
export type Issue = {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  assigneeEmail: string;
  startDate: Date;
}

const execute = async (db: Database, sql: string) => {
  return new Promise<void>((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

// default OPEN_CREATE
const db: Database = new Database("issues.db");

const createTablesAndAddUsersIfNotExist = async () => {
  try {
    await execute(
      db,
      `
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS issues (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        status TEXT NOT NULL,
        description TEXT,
        assigneeEmail TEXT NOT NULL,
        startDate DATE NOT NULL,
        FOREIGN KEY (assigneeEmail) REFERENCES users(email)
      );

      INSERT OR IGNORE INTO users (email, name) VALUES 
        ('a@user.com', 'userA'),
        ('b@user.com', 'userB'),
        ('c@user.com', 'userC');
      `
    );
  } catch (error) {
    console.log(error);
  }
};

const fetchAll = async (db: Database, sql: string ) => {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

createTablesAndAddUsersIfNotExist().then(() => {
  console.log("Database setup complete");
});

// DEFINE ROUTES:
// POST /issues     Create new issue
app.post('/issues', jsonParser, cors({origin: `http://localhost:${frontEndPort}`}), async (req: Request, res: Response) => {
  console.log("calling POST /issues");
  try {
    const newIssue: Issue = {
      id: crypto.randomUUID(),
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      assigneeEmail: req.body.assigneeEmail,
      startDate: new Date()
    };

    await execute(
      db,
      `INSERT INTO issues (id, title, status, assigneeEmail, startDate, description) VALUES (
        '${newIssue.id}', '${newIssue.title}', '${newIssue.status}', '${newIssue.assigneeEmail}', '${newIssue.startDate}', '${newIssue.description}'
      );`
    );
    res.status(201).json(newIssue);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
  
});

// GET /issues      Retrieve all issues
app.get('/issues', cors({origin: `http://localhost:${frontEndPort}`}), async (req: Request, res: Response) => {
  console.log('calling GET /issues');
  let allIssues;
  try {
    allIssues = await fetchAll(
      db,
      `SELECT * FROM issues;`
    );
    res.status(200).json(allIssues);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }

});

// GET /issues/:assigneeEmail       Retrieve my issues
app.get('/issues/:assigneeEmail', cors({origin: `http://localhost:${frontEndPort}`}), async (req: Request, res: Response) => {
  console.log('calling GET /issues with');
  console.log(req.params.assigneeEmail);
  let assigneeIssues;
  try {
    assigneeIssues = await fetchAll(
      db,
      `SELECT * FROM issues WHERE assigneeEmail='${req.params.assigneeEmail}';`
    );
    res.status(200).json(assigneeIssues);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }

});

// DELETE /issues/:id       Delete issue
app.delete('/issues/:id', cors({origin: `http://localhost:${frontEndPort}`}), async (req: Request, res: Response) => {
  console.log("calling DELETE with");
  console.log(req.params.id);
  try {
    await execute(
      db,
      `DELETE FROM issues WHERE id='${req.params.id}';`
    );
    res.status(204);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }

});

// Start the server
app.listen(backendPort, () => {
  console.log(`Backend running on Port ${backendPort}`);
}); 
