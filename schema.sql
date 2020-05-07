
-- Drops the task_saver_db if it already exists --
DROP DATABASE IF EXISTS employeetracker_db;

-- Create the database task_saver_db and specified it for use.
CREATE DATABASE employeetracker_db;

USE employeetracker_db;

-- Create the table tasks.
CREATE TABLE department (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  PRIMARY KEY (id)
);

-- Insert a set of records.
INSERT INTO tasks (task) VALUES ('Pick up milk.');
INSERT INTO tasks (task) VALUES ('Mow the lawn.');
INSERT INTO tasks (task) VALUES ('Call Shannon back.');
