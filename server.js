var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");


// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;



var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeetracker_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
  runPrompt();
});

function runPrompt() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View Departments",
        "View Roles",
        "View Employees",
        "Add Departments",
        "Add Roles",
        "Add Employees",
        "Update Employee Roles"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Departments":
        viewDepartments();
        break;

      case "View Roles":
        viewRoles();
        break;

      case "View Employees":
        viewEmployees();
        break;

      case "Add Departments":
        addDepartments();
        break;

      case "Add Roles":
        addRoles();
        break;

      case "Add Employees":
        addEmployees();
        break;

      case "Update Employee Roles":
        updateEmployeeRoles();
        break;
      }
    });
}


function viewDepartments() {
  console.log(' ')
  connection.query('SELECT id, name AS department FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    runPrompt();
  });
};

function viewRoles() {
  console.log(' ')
  connection.query('SELECT r.id, title, salary, name AS department FROM role r LEFT JOIN department d ON department_id = d.id', (err, res) => {
    if (err) throw err;
    console.table(res);
    runPrompt();
  });
};

function viewEmployees() {
  console.log(' ')
  connection.query('SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, title AS Title, salary AS Salary, name AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id', (err, res) => {
    if (err) throw err;
    console.table(res);
    runPrompt();
  });
};

function addDepartments() {
  inquirer.prompt([
    {
        name: "depName",
        type: "input",
        message: "Enter new department:",
        // validate: confirmStringInput
    }
]).then(answers => {
    connection.query("INSERT INTO department (name) VALUES (?)", [answers.depName]);
    console.log("\x1b[32m", `${answers.depName} was added to departments.`);
    runPrompt();
})
};

function addRoles() {
  connection.query('SELECT * FROM department', function(err, res) {
    if (err) throw (err);
  inquirer
    .prompt([{
        name: "title",
        type: "input",
        message: "What is the title of the new role?",
      }, 
      {
        name: "salary",
        type: "input",
        message: "What is the salary of the new role?",
      },
      {
        name: "departmentName",
        type: "list",
// is there a simpler way to make the options here the results of a query that selects all departments?`
        message: "Which department does this role fall under?",
        choices: function() {
            var choicesArray = [];
            res.forEach(res => {
                choicesArray.push(
                    res.name
                );
            })
            return choicesArray;
          }
      }
      ]) 
  .then(function(answer) {
  const department = answer.departmentName;
  connection.query('SELECT * FROM DEPARTMENT', function(err, res) {
      if (err) throw (err);

    let filteredDept = res.filter(function(res) {
      return res.name == department;
  }
  )
  let id = filteredDept[0].id;
  let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
  let values = [answer.title, parseInt(answer.salary), id]
  console.log(values);
  connection.query(query, values,
      function(err, res, fields) {
      console.log(`You have added this role: ${(values[0])}.`)
  });
      runPrompt()
      });
  });
  });
};

async function addEmployees() {
connection.query('SELECT * FROM role', function(err, result) {
  if (err) throw (err);
inquirer
  .prompt([{
    name: "firstName",
    type: "input",
    message: "What is the employee's first name?",
    }, 
    {
    name: "lastName",
    type: "input",
    message: "What is the employee's last name?",
    },
    {
    name: "roleName",
    type: "list",
// is there a simpler way to make the options here the results of a query that selects all departments?`
    message: "What role does the employee have?",
    choices: function() {
      rolesArray = [];
        result.forEach(result => {
            rolesArray.push(
                result.title
            );
        })
        return rolesArray;
      }
    }
    ]) 
// in order to get the id here, i need a way to grab it from the departments table 
  .then(function(answer) {
  console.log(answer);
  const role = answer.roleName;
  connection.query('SELECT * FROM role', function(err, res) {
      if (err) throw (err);
      let filteredRole = res.filter(function(res) {
          return res.title == role;
      })
  let roleId = filteredRole[0].id;
  connection.query("SELECT * FROM employee", function(err, res) {
    inquirer
    .prompt ([
      {
      name: "manager",
      type: "list",
      message: "Who is their manager?",
      choices: function() {
        managersArray = []
        res.forEach(res => {
            managersArray.push(
                res.last_name)
            
        })
        return managersArray;
      }
      }
    ]).then(function(managerAnswer) {
      const manager = managerAnswer.manager;
    connection.query('SELECT * FROM employee', function(err, res) {
    if (err) throw (err);
    let filteredManager = res.filter(function(res) {
      return res.last_name == manager;
    })
    let managerId = filteredManager[0].id;
    console.log(managerAnswer);
    let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
    let values = [answer.firstName, answer.lastName, roleId, managerId]
    console.log(values);
    connection.query(query, values,
        function(err, res, fields) {
        console.log(`You have added this employee: ${(values[0]).toUpperCase()}.`)
      })
      viewEmployees();
      })
    });
    });
    });
  })
})
};

function updateEmployeeRoles() {
  connection.query('SELECT * FROM employee', function(err, result) {
    if (err) throw (err);
  inquirer
    .prompt([
      {
      name: "employeeName",
      type: "list",
      message: "Which employee's role is changing?",
      choices: function() {
        employeeArray = [];
          result.forEach(result => {
              employeeArray.push(
                  result.last_name
              );
          })
          return employeeArray;
        }
        }
        ]) 
  .then(function(answer) {
  console.log(answer);
  const name = answer.employeeName;
  connection.query("SELECT * FROM role", function(err, res) {
    inquirer
    .prompt ([
      {
        name: "role",
        type: "list",
        message: "What is their new role?",
        choices: function() {
          rolesArray = [];
          res.forEach(res => {
            rolesArray.push(
              res.title)
          })
          return rolesArray;
        }
      }
    ]).then(function(rolesAnswer) {
      const role = rolesAnswer.role;
      console.log(rolesAnswer.role);
    connection.query('SELECT * FROM role WHERE title = ?', [role], function(err, res) {
    if (err) throw (err);
      let roleId = res[0].id;
      let query = "UPDATE employee SET role_id ? WHERE last_name ?";
      let values = [roleId, name]
      console.log(values);
        connection.query(query, values,
          function(err, res, fields) {
          console.log(`You have updated ${name}'s role to ${role}.`)
          })
      viewEmployees();
    });
    });
    });
  });
});
}

// runPrompt();