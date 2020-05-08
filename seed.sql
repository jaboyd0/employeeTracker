USE employeeDB;

INSERT INTO department (name)
VALUES ('Sales'), ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100, 1), ('Salesperson', 80, 1), ('Lead Engineer', 150, 2), ('Software Engineer', 120, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Joe', 'Mama', 1, null), ('Dick', 'Andballs', 3, null), ('Bob', 'A', 4, 2), ('Jim', 'C', 2, 1), ('Sam', 'D', 2, 1);
