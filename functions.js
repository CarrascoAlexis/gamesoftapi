
const bcrypt = require('bcrypt');
const { db } = require('./config');
const saltRounds = 10

exports.generateQuery = function(table, rows, filters, columns = "*") {
    let query = `SELECT ${columns} FROM ${table} WHERE `
    rows.forEach((element, idx, array) => {
        if(filters[element.COLUMN_NAME] != undefined && filters[element.COLUMN_NAME] != null)
        {
            query += ` ${element.COLUMN_NAME} = "${filters[element.COLUMN_NAME]}"`
            if (idx != array.length - 1){
                query += ' AND'
            }
        }
    })
    query = query.substring(0, query.lastIndexOf(" "))
    return query
} 


exports.cryptPassword = function(password) {
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err) return err;
        return hash;
    });
};
 
exports.comparePassword = async function(password, hash, res) {
    await bcrypt.compare(password, hash, function(err, result) {
        if(err) return err;
        if (result) res.send(true)
        else res.send(false)
        return;
      });
};