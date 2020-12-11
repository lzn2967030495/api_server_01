// 导入express
const express = require("express")
// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
// 创建路由对象
const router = express.Router()

// 导入用户抽离模块
const userinfo_handler = require('../router_handler/userinfo')

// 获取用户基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)

// 导入验证规则
const { update_userinfo_schema, update_password_schema } = require('../schema/user')
// 更新用户基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

// 重置密码路由
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)

// 导入验证规则
const { update_avatar_schema } = require('../schema/user')
// 更新用户头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

// 向外导出
module.exports = router