// 项目的入口文件

// 导入express模块
const express = require('express')
// 导入cors中间件 解决跨域问题
const cors = require('cors')


// 创建服务器
const app = express()

// 将cors注册为全局中间件
app.use(cors())

// 配置解析表单数据的中间件 解析post请求的数据
app.use(express.urlencoded({ extended: false }))

// 优化 res.send() 代码
app.use(function (req, res, next) {
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = function (err, status = 1) {
        res.send({
            // 状态
            status,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err
        })
    }
    // 将中间件流到下一个
    next()
})

// 解析 token 的中间件 
const expressJWT = require('express-jwt')
// 导入配置文件 
const config = require('./config')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证 
app.use(expressJWT({ secret: config.jwtSecretKey}).unless({ path: [/^\/api\//] }))

// 写在跨域与配置表单之后
// 导入自定义用户路由模块
const userRouter = require('./router/user')
// 注册全局中间件
app.use('/api', userRouter)

// 错误捕获
const joi = require('@hapi/joi')
// 注册全局错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误 
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
})

// 监听,启动服务器
app.listen(3007, function () {
    console.log('http://127.0.0.1');
})