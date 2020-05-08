
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
  title varchar(30) NOT NULL,
  salary DECIMAL(9,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id int NOT NULL AUTO_INCREMENT,
  first_name varchar(30),
  last_name varchar(30),
  role_id INT,
  manager_id INT NULL,
  PRIMARY KEY (id)
);
