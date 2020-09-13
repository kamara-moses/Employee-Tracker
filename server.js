const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const promisemysql = require('promise-mysql');


// Connection Properties
const connectionProperties = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'KyMyAr091217$',
    database: 'employees_DB'
}

// Creating Connection
const connection = mysql.createConnection(connectionProperties);


// Establishing Connection to database
connection.connect((err) => {
    if (err) throw err;

    // Start main menu function

    console.log('\n WELCOME TO EMPLOYEE TRACKER \n');
    start();
});

function start() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'Main Menu',
            choices: [                
                'View All Departments',
                'View ALl Roles',
                'View All Employees',
                'View All Employees by Department',
                'View All Employees by Role',
                'View All Employees by Manager',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Delete Department',
                'Delete Role',
                'Delete Employee',
                'View Department Budgets',
                'Exit'
            ]
        })
        .then((answer) => {
            //Switch case from user input
            switch (answer.action) {
                case 'View All Departments':
                    viewAllDept();
                    break;

                case 'View ALl Roles':
                    viewAllRole();
                    break;

                case 'View All Employees':
                    viewAllEmp();
                    break;

                case 'View All Employees by Department':
                    viewAllEmpByDept();
                    break;

                case 'View All Employees by Role':
                    viewAllEmpByRole();
                    break;

                case 'View All Employees by Manager':
                    viewAllEmpByMgr();
                    break;

                case 'Add Department':
                    addDept();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Add Employee':
                    addEmp();
                    break;

                case 'Update Employee Role':
                    updateEmpRole();
                    break;

                case 'Update Employee Managers':
                    updateEmpMngr();
                    break;

                case 'Delete Department':
                    deleteDept();
                    break;

                case 'Delete Role':
                    deleteRole();
                    break;

                case 'Delete Employee':
                    deleteEmp();
                    break;

                case 'View Department Budgets':
                    viewDeptBudgets();
                    break;

                case 'Exit':{
                    exitLoop = true;
                    process.exit(0); // successful exit
                    return;
                }
            }
        });
}

//View ALl Departments
function viewAllDept() {
    //Query to view all departments
    const query = `SELECT * FROM department`;

    // Query from connection
    connection.query(query, function (err, res) {
        if (err) return err;
        console.log('\n');

        // Display query results using console.table
        console.table(res);

        //Back to main menu
        start();
    });
}

//View ALl Employees
function viewAllRole() {
    //Query to view all roles
    const query = `SELECT * FROM role`;

    // Query from connection
    connection.query(query, function (err, res) {
        if (err) return err;
        console.log('\n');

        // Display query results using console.table
        console.table(res);

        //Back to main menu
        start();
    });
}

//View ALl Employees
function viewAllEmp() {
    //Query to view all employees
    const query = `SELECT * FROM employee`;
    // Query from connection
    connection.query(query, function (err, res) {
        if (err) return err;
        console.log('\n');

        // Display query results using console.table
        console.table(res);

        //Back to main menu
        start();
    });
}
//View ALl Employees by Department
function viewAllEmpByDept() {
    // Set global array to store department names
    let deptArr = [];

    // Create new connection using promise-sql
    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // Query just names of departments
        return conn.query('SELECT name FROM department');
    }).then(function (value) {

        // Place all names within deptArr
        deptQuery = value;
        for (i = 0; i < value.length; i++) {
            deptArr.push(value[i].name);

        }
    }).then(() => {

        // Prompt user to select department from array of departments
        inquirer.prompt({
            name: 'department',
            type: 'list',
            message: 'Which department would you like to search?',
            choices: deptArr
        })
            .then((answer) => {
                // Query all employees depending on selected department
                const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC`;
                connection.query(query, (err, res) => {
                    if (err) return err;

                    // Show results in console.table
                    console.log('\n');
                    console.table(res);

                    // Back to main menu
                    start();
                });
            });
    });
}

// View All Employees by Role
function viewAllEmpByRole() {
    // set global array to store all roles
    let roleArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties)
        .then((conn) => {

            // Query all roles
            return conn.query('SELECT title FROM role');
        }).then(function (roles) {

            // Place all roles within the roleArray
            for (i = 0; i < roles.length; i++) {
                roleArr.push(roles[i].title);
            }
        }).then(() => {

            // Prompt user to select a role
            inquirer.prompt({
                name: 'role',
                type: 'list',
                message: 'Which role would you like to search?',
                choices: roleArr
            })
                .then((answer) => {

                    // Query all employees by role selected by user
                    const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC`;
                    connection.query(query, (err, res) => {
                        if (err) return err;

                        // show results using console.table
                        console.log('\n');
                        console.table(res);
                        start();
                    });
                });
        });
}

// View all employees by manager
function viewAllEmpByMgr() {

    // set manager array
    let managerArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties)
        .then((conn) => {

            // Query all employees
            return conn.query('SELECT DISTINCT m.id, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e Inner JOIN employee m ON e.manager_id = m.id');

        }).then(function (managers) {

            // place all employees in array
            for (i = 0; i < managers.length; i++) {
                managerArr.push(managers[i].manager);
            }

            return managers;
        }).then((managers) => {

            inquirer.prompt({

                // Prompt user of manager
                name: 'manager',
                type: 'list',
                message: 'Which manager would you like to search?',
                choices: managerArr
            })
                .then((answer) => {

                    let managerID;

                    // get ID of manager selected
                    for (i = 0; i < managers.length; i++) {
                        if (answer.manager == managers[i].manager) {
                            managerID = managers[i].id;
                        }
                    }

                    // query all employees by selected manager
                    const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            INNER JOIN role ON e.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            WHERE e.manager_id = ${managerID};`;

                    connection.query(query, (err, res) => {
                        if (err) return err;

                        // display results with console.table
                        console.log("\n");
                        console.table(res);

                        // back to main menu
                        start();
                    });
                });
        });
}


// Add Department
function addDept() {

    inquirer.prompt({

        // Prompt user for name of department
        name: 'deptName',
        type: 'input',
        message: 'Department Name: '
    }).then((answer) => {

        // add department to the table
        connection.query(`INSERT INTO department (name)VALUES ('${answer.deptName}');`, (err, res) => {
            if (err) return err;
            console.log('\n DEPARTMENT ADDED...\n ');
            start();
        });

    });
}

// Add Role
function addRole() {

    // Create array of departments
    let departmentArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties)
        .then((conn) => {

            // Query all departments
            return conn.query('SELECT id, name FROM department ORDER BY name ASC');

        }).then((departments) => {

            // Place all departments in array
            for (i = 0; i < departments.length; i++) {
                departmentArr.push(departments[i].name);
            }

            return departments;
        }).then((departments) => {

            inquirer.prompt([
                {
                    // Prompt user role title
                    name: 'roleTitle',
                    type: 'input',
                    message: 'Role title: '
                },
                {
                    // Prompt user for salary
                    name: 'salary',
                    type: 'number',
                    message: 'Salary: '
                },
                {
                    // Prompt user to select department role is under
                    name: 'dept',
                    type: 'list',
                    message: 'Department: ',
                    choices: departmentArr
                }]).then((answer) => {

                    // Set department ID variable
                    let deptID;

                    // get id of department selected
                    for (i = 0; i < departments.length; i++) {
                        if (answer.dept == departments[i].name) {
                            deptID = departments[i].id;
                        }
                    }

                    // Added role to role table
                    connection.query(`INSERT INTO role (title, salary, department_id)
                VALUES ('${answer.roleTitle}', ${answer.salary}, ${deptID})`, (err, res) => {
                        if (err) return err;
                        console.log(`\n ROLE ${answer.roleTitle} ADDED...\n`);
                        start();
                    });

                });

        });

}

// Add employee
function addEmp() {

    // Create two global array to hold 
    let roleArr = [];
    let managerArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // Query  all roles and all manager. Pass as a promise
        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'),
            conn.query(`SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC`)
        ]);
    }).then(([roles, managers]) => {

        // Place all roles in array
        for (i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }

        // place all managers in array
        for (i = 0; i < managers.length; i++) {
            managerArr.push(managers[i].Employee);
        }

        return Promise.all([roles, managers]);
    }).then(([roles, managers]) => {

        // add option for no manager
        managerArr.unshift('--');

        inquirer.prompt([
            {
                // Prompt user of their first name
                name: 'firstName',
                type: 'input',
                message: 'First name: ',
                // Validate field is not blank
                validate: function (input) {
                    if (input === '') {
                        console.log('**FIELD REQUIRED**');
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                // Prompt user of their last name
                name: 'lastName',
                type: 'input',
                message: 'Lastname name: ',
                // Validate field is not blank
                validate: function (input) {
                    if (input === '') {
                        console.log('**FIELD REQUIRED**');
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                // Prompt user of their role
                name: 'role',
                type: 'list',
                message: 'What is their role?',
                choices: roleArr
            }, {
                // Prompt user for manager
                name: 'manager',
                type: 'list',
                message: 'Who is their manager?',
                choices: managerArr
            }]).then((answer) => {

                // Set variable for IDs
                let roleID;
                // Default Manager value as null
                let managerID = null;

                // Get ID of role selected
                for (i = 0; i < roles.length; i++) {
                    if (answer.role == roles[i].title) {
                        roleID = roles[i].id;
                    }
                }

                // get ID of manager selected
                for (i = 0; i < managers.length; i++) {
                    if (answer.manager == managers[i].Employee) {
                        managerID = managers[i].id;
                    }
                }

                // Add employee
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ('${answer.firstName}', '${answer.lastName}', ${roleID}, ${managerID})`, (err, res) => {
                    if (err) return err;

                    // Confirm employee has been added
                    console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                    start();
                });
            });
    });
}


// Update Employee Role
function updateEmpRole() {

    // create employee and role array
    let employeeArr = [];
    let roleArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties
    ).then((conn) => {
        return Promise.all([

            // query all roles and employee
            conn.query(`SELECT id, title FROM role ORDER BY title ASC`),
            conn.query(`SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC`)
        ]);
    }).then(([roles, employees]) => {

        // place all roles in array
        for (i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }

        // place all employees in array
        for (i = 0; i < employees.length; i++) {
            employeeArr.push(employees[i].Employee);
            //console.log(value[i].name);
        }

        return Promise.all([roles, employees]);
    }).then(([roles, employees]) => {

        inquirer.prompt([
            {
                // prompt user to select employee
                name: 'employee',
                type: 'list',
                message: 'Who would you like to edit?',
                choices: employeeArr
            }, {
                // Select role to update employee
                name: 'role',
                type: 'list',
                message: 'What is their new role?',
                choices: roleArr
            },]).then((answer) => {

                let roleID;
                let employeeID;

                /// get ID of role selected
                for (i = 0; i < roles.length; i++) {
                    if (answer.role == roles[i].title) {
                        roleID = roles[i].id;
                    }
                }

                // get ID of employee selected
                for (i = 0; i < employees.length; i++) {
                    if (answer.employee == employees[i].Employee) {
                        employeeID = employees[i].id;
                    }
                }

                // update employee with new role
                connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                    if (err) return err;

                    // confirm update employee
                    console.log(`\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `);

                    // back to main menu
                    start();
                });
            });
    });

}

// Update employee manager
function updateEmpMgr() {

    // set global array for employees
    let employeeArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // query all employees
        return conn.query('SELECT employee.id, concat(employee.first_name, " " ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC');
    }).then((employees) => {

        // place employees in array
        for (i = 0; i < employees.length; i++) {
            employeeArr.push(employees[i].Employee);
        }

        return employees;
    }).then((employees) => {

        inquirer.prompt([
            {
                // prompt user to selected employee
                name: 'employee',
                type: 'list',
                message: 'Who would you like to edit?',
                choices: employeeArr
            }, {
                // prompt user to select new manager
                name: 'manager',
                type: 'list',
                message: 'Who is their new Manager?',
                choices: employeeArr
            },]).then((answer) => {

                let employeeID;
                let managerID;

                // get ID of selected manager
                for (i = 0; i < employees.length; i++) {
                    if (answer.manager == employees[i].Employee) {
                        managerID = employees[i].id;
                    }
                }

                // get ID of selected employee
                for (i = 0; i < employees.length; i++) {
                    if (answer.employee == employees[i].Employee) {
                        employeeID = employees[i].id;
                    }
                }

                // update employee with manager ID
                connection.query(`UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`, (err, res) => {
                    if (err) return err;

                    // confirm update employee
                    console.log(`\n ${answer.employee} MANAGER UPDATED TO ${answer.manager}...\n`);

                    // go back to main menu
                    start();
                });
            });
    });
}

// Delete Department
function deleteDept() {

    // department array
    let deptArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // query all departments
        return conn.query('SELECT id, name FROM department');
    }).then((depts) => {

        // add all departments to array
        for (i = 0; i < depts.length; i++) {
            deptArr.push(depts[i].name);
        }

        inquirer.prompt([{

            // confirm to continue to select department to delete
            name: 'continueDelete',
            type: 'list',
            message: '*** WARNING *** Deleting a department will delete all roles and employees associated with the department. Do you want to continue?',
            choices: ['NO', 'YES']
        }]).then((answer) => {

            // if not, go back to main menu
            if (answer.continueDelete === 'NO') {
                start();
            }

        }).then(() => {

            inquirer.prompt([{

                // prompt user to select department
                name: 'dept',
                type: 'list',
                message: 'Which department would you like to delete?',
                choices: deptArr
            }, {

                // confirm with user to delete
                name: 'confirmDelete',
                type: 'Input',
                message: 'Type the department name EXACTLY to confirm deletion of the department: '

            }]).then((answer) => {

                if (answer.confirmDelete === answer.dept) {

                    // if confirmed, get department id
                    let deptID;
                    for (i = 0; i < depts.length; i++) {
                        if (answer.dept == depts[i].name) {
                            deptID = depts[i].id;
                        }
                    }

                    // delete department
                    connection.query(`DELETE FROM department WHERE id=${deptID};`, (err, res) => {
                        if (err) return err;

                        // confirm department has been deleted
                        console.log(`\n DEPARTMENT '${answer.dept}' DELETED...\n `);

                        // back to main menu
                        start();
                    });
                }
                else {

                    // do not delete department if not confirmed and go back to main menu
                    console.log(`\n DEPARTMENT '${answer.dept}' NOT DELETED...\n `);

                    //back to main menu
                    start();
                }

            });
        })
    });
}

// Delete Role
function deleteRole() {

    // Create role array
    let roleArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // query all roles
        return conn.query('SELECT id, title FROM role');
    }).then((roles) => {

        // add all roles to array
        for (i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }

        inquirer.prompt([{
            // confirm to continue to select role to delete
            name: 'continueDelete',
            type: 'list',
            message: '*** WARNING *** Deleting role will delete all employees associated with the role. Do you want to continue?',
            choices: ['NO', 'YES']
        }]).then((answer) => {

            // if not, go to main menu
            if (answer.continueDelete === "NO") {
                start();
            }

        }).then(() => {

            inquirer.prompt([{
                // prompt user of of roles
                name: 'role',
                type: 'list',
                message: 'Which role would you like to delete?',
                choices: roleArr
            }, {
                // confirm to delete role by typing role exactly
                name: 'confirmDelete',
                type: 'Input',
                message: 'Type the role title EXACTLY to confirm deletion of the role'

            }]).then((answer) => {

                if (answer.confirmDelete === answer.role) {

                    // get role id of of selected role
                    let roleID;
                    for (i = 0; i < roles.length; i++) {
                        if (answer.role == roles[i].title) {
                            roleID = roles[i].id;
                        }
                    }

                    // delete role
                    connection.query(`DELETE FROM role WHERE id=${roleID};`, (err, res) => {
                        if (err) return err;

                        // confirm role has been added 
                        console.log(`\n ROLE '${answer.role}' DELETED...\n `);

                        //back to main menu
                        start();
                    });
                }
                else {

                    // if not confirmed, do not delete
                    console.log(`\n ROLE '${answer.role}' NOT DELETED...\n `);

                    //back to main menu
                    start();
                }

            });
        })
    });
}

// Delete employee
function deleteEmp() {

    // Create global employee array
    let employeeArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // Query all employees
        return conn.query('SELECT employee.id, concat(employee.first_name, " " ,  employee.last_name) AS employee FROM employee ORDER BY Employee ASC');
    }).then((employees) => {

        // Place all employees in array
        for (i = 0; i < employees.length; i++) {
            employeeArr.push(employees[i].employee);
        }

        inquirer.prompt([
            {
                // prompt user of all employees
                name: 'employee',
                type: 'list',
                message: 'Who would you like to delete?',
                choices: employeeArr
            }, {
                // confirm delete of employee
                name: 'confirmDelete',
                type: 'list',
                message: 'Confirm Deletion',
                choices: ['NO', 'YES']
            }]).then((answer) => {

                if (answer.confirmDelete == 'YES') {
                    let employeeID;

                    // if confirmed, get ID of employee selected
                    for (i = 0; i < employees.length; i++) {
                        if (answer.employee == employees[i].employee) {
                            employeeID = employees[i].id;
                        }
                    }

                    // deleted selected employee
                    connection.query(`DELETE FROM employee WHERE id=${employeeID};`, (err, res) => {
                        if (err) return err;

                        // confirm deleted employee
                        console.log(`\n EMPLOYEE '${answer.employee}' DELETED...\n `);

                        // back to main menu
                        start();
                    });
                }
                else {

                    // if not confirmed, go back to main menu
                    console.log(`\n EMPLOYEE '${answer.employee}' NOT DELETED...\n `);

                    // back to main menu
                    start();
                }

            });
    });
}

// View Department Budget
function viewDeptBudgets() {

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties)
        .then((conn) => {
            return Promise.all([

                // query all departments and salaries
                conn.query('SELECT department.name AS department, role.salary FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department ASC'),
                conn.query('SELECT name FROM department ORDER BY name ASC')
            ]);
        }).then(([deptSalaies, departments]) => {

            let deptBudgetArr = [];
            let department;

            for (d = 0; d < departments.length; d++) {
                let departmentBudget = 0;

                // add all salaries together
                for (i = 0; i < deptSalaies.length; i++) {
                    if (departments[d].name == deptSalaies[i].department) {
                        departmentBudget += deptSalaies[i].salary;
                    }
                }

                // create new property with budgets
                department = {
                    Department: departments[d].name,
                    Budget: departmentBudget
                }

                // add to array
                deptBudgetArr.push(department);
            }
            console.log('\n');

            // display departments budgets using console.table
            console.table(deptBudgetArr);

            // back to main menu
            start();
        });
}
function exit() {
    // Close your database connection when Node exits
    process.on('exit', function (code) {
        db.close();
        return console.log(`About to exit with code ${code}`);
    });
}
