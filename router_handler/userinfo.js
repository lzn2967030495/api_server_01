// 导入数据库
const db = require('../db/index')
// 导入验证方法
const bcrypt = require('bcryptjs')

//  获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 定义查询用户信息的sql语句
    const sql = 'select id,username,nickname,email,user_pic from ev_user where id=?'
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 执行sql语句成功 行数不等于一
        if (results.length !== 1) return res.cc('获取用户信息失败！')
        // 成功
        res.send({
            status: 0,
            message: "获取用户基本信息成功!",
            data: results[0]
        })
    })
}

// 更新用户基本信息
exports.updateUserInfo = (req, res) => {
    // 定义sql语句
    const sql = 'update ev_user set ? where id =?'
    // 执行sql语句
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但影响行数不为 1
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
        // 修改用户信息成功
        return res.cc('修改用户信息成功', 0)
    })
    // res.send('ok')
}

// 重置密码处理函数
exports.updatePassword = (req, res) => {
    // 根据id查询用户数据sql语句
    const sql = 'select * from ev_user where id=?'
    // 执行sql语句查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 检查指定id的用户是否存在
        if (results.length !== 1) return res.cc('用户不存在')

        // 判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')

        // 更新数据库的密码
        // 定义更新用户密码的sql的语句
        const sql = 'update ev_user set password=? where id=?'
        // 对新密码进行 bcrypt 加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 执行sql语句 根据id更新用户的密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // 失败
            if (err) return res.cc(err)
            // sql成功 不为一
            if (results.affectedRows !== 1) return res.cc("更新密码失败！")
            // 更新密码成功
            res.cc("更新密码成功！", 0)
        })
    })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // 定义更新用户头像的 SQL 语句：
    const sql = 'update ev_user set user_pic=? where id=?'
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err)
        // 执行sql语句成功 行数不等于1
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')
        // 更换头像成功
        return res.cc("更新用户成功！", 0)
    })
}