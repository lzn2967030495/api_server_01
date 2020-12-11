// 用来存放所有的路由模块

// 导包
const express = require('express')
// 创建路由模块
const router = express.Router()

// 导入自定义路由处理函数
const userHandler = require('../router_handler/user')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则的对象
const { reg_login_schema } = require('../schema/user')

// 注册新用户
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser)

// 登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)


// 将路由对象共享出去
module.exports = router