const generateQuery = (table, rows, filters) => {
    let query = `SELECT * FROM ${table} WHERE `
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


module.exports.generateQuery = generateQuery