// 创建数据库的连接对象

// 导入mysql模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'an'
})

// 向外共享db数据库
module.exports = db