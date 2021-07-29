# koacrab开发计划

## 功能列表
* 基础
  * 丰富路由功能
  * 添加redis/session
  * 支持MySql、PostgreSQL、mongo等ORM
  * 解析markdown
  * 日志
  * 支持TS
  * restful
  * GraphGL
  * jwt
  * 官网、教程
  * mock数据
* 高级
  * 脚手架
  * RPC
  * 分布式
  * 微服务
  * 集群
  * 插件
  * 支持websocket
  * 支持钩子
  * 监控
  * 多语言（国际化）
  * 安全
  * 性能
  * https
  * http2.0
  * 支持caddy
  * Docker部署
  * 单元测试
  * 计划任务
  * 命令行调用
  * 自动更新
  * 图片上传到图床

## 工具
* 前端集成开发工具

## 插件
* 类
* 分页
* excel
* pdf
* 二维码
* 验证码
* 短信
* 邮箱
* 上传文件
* 导出

## 系统
* demo
* 博客
* 自动生成后台
* 微信
* 小程序
* CMS
* 商城
* 区块链
* 直播

## 教程

=============
proxy https 参数 get post 多请求合并
mysql
static
router,restful
.html后缀
设计koacrab的字符
markdown

=============
原理：
读取所有中间件 -> 把中间件注入到koa系统里（顺序）-> 运行系统
=============
功能：
支持es6/es7
支持async/await
hook钩子
中间件
多路由模式
日志（请求、错误、性能）
pm2
多项目,国际化,多主题,自定义错误页面
单元测试,覆盖率
rest api
部署
docker
安全
插件
扩展
子域名
模板
代理proxy
认证
关闭控制器（暂时）

=============
辅助工具
命令行
生成控制器
生成模板
初始化项目

=============

模板渲染
model加载
配置文件
测试用例
unit , 把工具库放到common里面，在任何地方都可以使用
cookie和session
路由的各种形式restful，参数
前置，后置，空操作 完成
调试,异常处理
日志
模板开发
静态模块
yarn
proxy
安全过滤
RPC

官网，图标

pm2
部署
安全
性能
国际化,语言包
多站点
多域名，多模块

API/教程/插件/指南

=============
1. 写API接口，供前端调用，可以调用多个第三方的接口
2. 连接数据库，写模型，然后写API接口自己调用，供前端使用

