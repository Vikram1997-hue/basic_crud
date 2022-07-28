// const express = require('express');
// const app = express();

// const {Pool} = require('pg');
// const credentials = {
//     host: 'localhost',
//     port: 5432,
//     user: 'user_1',
//     database: 'avtraining',
//     password: 'test123'
// };
// let pool = new Pool(credentials)


// //Table creation before anything else
// async function main(req, res, next) {
//     let tableName = "student";
//     let cols = [
//         {name: "id", dtype: "serial", constraints:["Primary Key",  "Not Null"]},
//         {name: "name", dtype: "varchar(20)", constraints: ["Not Null"]},
//         {name: "dob", dtype: "date"}
//     ];
//     await ddlCreate(tableName, cols)
//     next()
// } 

// app.get(main, "/", (req, res) => {
//     res.send("CRUD App with PostMan")
// })

// async function ddlCreate(tableName, cols) {
//     let myQuery = "create table " + tableName + "(";
//     for(let col of cols) {
//         myQuery = myQuery + col.name + " " + col.dtype;
//         if(col.hasOwnProperty('constraints')) {
//             for(let constraint of col.constraints)
//                 myQuery = myQuery + " " + constraint
//         }
//         if(col != cols[cols.length-1])
//             myQuery = myQuery + ","
//     }
//     myQuery = myQuery + ")";
//     console.log(myQuery)

//     await pool.query(myQuery, (err) => {
//         if(err) {
//             console.error("error in ddlCreate",err)
//             return
//         }
//     })
// } //DDL - C

// // app.post("/info/post", (req,res) => {
// //     pool.query = 
// // })//DML - C

// app.get("/info/get", (req, res) => {
//     pool.query("select * from student")
// })


// app.listen(3001, (err) => {
//     if(err)
//         console.error("Something went wrong while trying to listen:", err)
// })

// pool.end()




const express = require('express');
const { result } = require('lodash');
const app = express()
const {Pool} = require('pg');
const credentials = {
    host: 'localhost',
    port: 5432,
    user: 'user_1',
    database: 'avtraining',
    password: 'test123'
};
let pool = new Pool(credentials)


app.get("/", (req, res, next) => {
    res.send("Sup")
})

app.get("/info/get", (req, res, next) => {
    pool.query("select * from student", (err, result) => {
        if(err) {
            console.error("Error in GET request:", err);
            return
        }
        res.send(result.rows)
    })
})

app.post("/info/post", (req, res, next) => {
    pool.query(`insert into student(name, dob) values('${req.query.name}', now()::date)`, (err, result) => {
        if(err) {
            console.error("Error in POST request:", err)
            return
        }
        res.redirect('/info/get')
    })
})

app.delete("/info/delete", (req, res, next) => {
    let q = "delete from student where "
    console.log(req.query)
    if(req.query.hasOwnProperty('id')) {
        q = q + 'id = ' + req.query.id;
    }
    else if(req.query.hasOwnProperty('name')) {
        q = q + `name = '${req.query.name}'`;
    }
    console.log(q)
    pool.query(q, (err, result) => {
        if(err) {
            console.error("Error in DELETE request:",err)
            return
        }
        res.redirect('/info/get')
    })
})

//update a student partially or fully
app.patch("/info/patch", (req, res) => {
    let myQuery = 'update student set ';
    let addComma = false
    if(req.query.hasOwnProperty('name')) {
        myQuery = myQuery + `name = '` + req.query.name + `' `
        addComma = true
    }
    if(req.query.hasOwnProperty('dob')) {
        if(addComma == true)
            myQuery = myQuery + ', '
        myQuery = myQuery + `dob = DATE('` + req.query.dob + `') `
    }

    myQuery = myQuery + "where id = " + req.query.searchId
    // console.log(myQuery)
    
    pool.query(myQuery, (err, result) => {
        if(err) {
            console.error("Error in PATCH request:", err);
            return
        }
        res.redirect('/info/get')
    })
})

app.listen(3001, (err) => {
    if(err)
        console.log("Error in listening", err)
});
