var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project-3"
});


module.exports.getAllUsers=()=>
{
    return new Promise(function(resolve,reject){
            let UsersSelect=`SELECT * FROM users`;
            con.query(UsersSelect,function(err,result,fields){
            if (err) throw err;
            let JsonUsers=JSON.stringify(result)
            let UserssArr=JSON.parse(JsonUsers)
            resolve(UserssArr);  
    })
})
}
module.exports.GetAllVacations=()=>
{
    return new Promise(function(resolve,reject){
            let DBVacations=`SELECT * FROM vacation`;
            con.query(DBVacations,function(err,result,fields){
            if (err) throw err;
            let JsonVacations=JSON.stringify(result)
            let VacationsArr=JSON.parse(JsonVacations)
            resolve(VacationsArr);  
    })
})
}

module.exports.getAllVactions=()=>
{
    return new Promise(function(resolve,reject){
            let VactionsSelect=`SELECT * FROM vacation`;
            con.query(VactionsSelect,function(err,result,fields){
            if (err) throw err;
            let JsonVacations=JSON.stringify(result)
            let VacationssArr=JSON.parse(JsonVacations)
            resolve(VacationssArr);  
    })
})
}

module.exports.UserSortedVacations=(Uid)=>
{
    return new Promise(function(resolve,reject){
            let UserVactionsSelect=`SELECT * FROM users_vacation WHERE uid='${Uid}'`;
            con.query(UserVactionsSelect,function(err,result,fields){
            if (err) throw err;
            let JsonUserVacations=JSON.stringify(result)
            let VacationsUsersArr=JSON.parse(JsonUserVacations)
            resolve(VacationsUsersArr);  
    })
})
}

module.exports.getAllUsersVacations=(Uid)=>
{
    return new Promise(function(resolve,reject){
            let UserVactionsSelect=`SELECT * FROM users_vacation`;
            con.query(UserVactionsSelect,function(err,result,fields){
            if (err) throw err;
            let JsonUserVacations=JSON.stringify(result)
            let VacationsUsersArr=JSON.parse(JsonUserVacations)
            resolve(VacationsUsersArr);  
    })
})
}
