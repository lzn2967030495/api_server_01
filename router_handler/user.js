// 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用

const db = require('../db/index');
// 导入加密模块
const bcrypt = require('bcryptjs')
// 导入加密token
const jwt = require('jsonwebtoken')
// 导入配置文件 
const config = require('../config')


// 注册用户的处理函数 向外导出
exports.regUser = (req, res) => {
    // req 请求数据
    // res 响应数据

    // 接收表单数据
    const userinfo = req.body
    // console.log(userinfo); { username: 'l', password: '2967030495' }

    // 判断用户名和密码是否为空
    if (!userinfo.username || !userinfo.password) {
        // 响应数据
        // return red.send({ status: 1, message: '用户名或密码不能为空！' });
        return res.cc('用户名或密码不能为空！');
    }

    // 检测用户名是否被占用
    // 导入数据库操作模块
    const db = require('../db/index')
    // 定义 SQL 语句
    const sql = 'select * from ev_user where username=?'
    // 执行 SQL 语句并根据结果判断用户名是否被占用：
    db.query(sql, [userinfo.username], function (err, results) {
        // console.log(results);
        // [ RowDataPacket {
        //     id: 1,
        //     username: 'An',
        //     password: '1314520',
        //     nickname: null,
        //     email: null,
        //     user_pic: null } ]
        // 执行sql语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err.message);
        }
        // 用户名被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: "用户名被占用，请更换其他用户名！" })
            return res.cc('用户名被占用，请更换其他用户名！');
        }

        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // 插入新用户
        // 定义插入的用户的sql语句
        const sql = 'insert into ev_user set?'
        // 调用 db.query() 执行 SQL 语句，插入新用户
        db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
            // 执行sql语句失败
            if (err) // return res.send({ status: 1, message: err.message })
                return res.css(err.message)
            // sql执行成功，但影响函数不为一
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册用户失败,请稍后重试！' })
                return res.cc('注册用户失败,请稍后重试！')
            }
            // 注册成功
            // res.send({ status: 0, message: '注册成功' })
            return res.cc('注册成功', 0)
        })
    })

}

// 登录的处理函数 向外导出
exports.login = (req, res) => {
    // req 请求数据
    // res 响应数据

    // 根据用户名查询用户的数据
    // 接收表单的数据
    const userinfo = req.body
    // 定义sql语句
    const sql = `select * from ev_user where username=?`
    // 执行sql语句，查询用户数据
    db.query(sql, userinfo.username, function (err, results) {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 执行sql语句成功 但是查询数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败')
        // 判断用户输入的登录密码是否和数据库中的密码一致
        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // console.log(results[0]);
        // 返回值是布尔值（true 一致、false 不一致）
        if (!compareResult) {
            return res.cc('密码错误，请重新输入！')
        }
        // 生成 JWT 的 Token 字符串
        // 通过 ES6 的高级语法，快速剔除 密码 和 头像 的值：
        const user = { ...results[0], password: '', user_pic: '' }
        // 生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h'
        })
        // 将生成的 Token 字符串响应给客户端
        res.send({
            status: 0, 
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀 
            token: 'Bearer ' + tokenStr,
        })
    })
}