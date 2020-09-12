const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');


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

    console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
    start();
});

function start() {
    inquirer
    .prompt({
        name: 'action',
        type: 'list',
        message: 'Main Menu',
        choices: [
            'View All Employees',
            'View All Employees by Department',
            'View All Employees by Role',
            'View All Employees by Manager',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Update Employee Department',
            'Update Employee Role',
            'Update Employee',
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

            case 'Update Employee Department':
                updateEmpDept();
                break;

            case 'Update Employee Role':
                updateEmpRole();
                break;

            case 'Update Employee':
                updateEmp();
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

            case 'Exit':
                exit();
                break;
        }
    });
}

//View ALl Employees
function viewAllEmp() {
    //query to view all employees
    const query = 'SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name , " " , m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC';

     // Query from connection
     connection.query(query, function(err, res) {
        if(err) return err;
        console.log("\n");

        // Display query results using console.table
        console.table(res);

        //Back to main menu
        start();
    });
}