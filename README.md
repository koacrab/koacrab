# KoaCrab
> 前身是hzl.php（未开源）, 后基于express重构后，随着koa2的出现，使用到了async/await，不再需要经过Babel,就能很好的解决了回调的问题，所以使用Koa2进行改版升级，并于老婆的生日那天开源。

> 含义：因为是基于koa的，所以也蹭下koa的热度，再者主要是Crab，对，没错，就是螃蟹！

> 简单易上手！

## 核心功能
* 支持koa、koa2、express的中间件
* 支持es6/es7/es8/es9/es10等特性开发
* 单元测试
* 支持websocket
* 覆盖率
* 日志
* 多域名、多项目、多模块
* 模板渲染
* 安全
* 国际化
* 异常处理
* cookie和session
* 数据库orm
* 命令行
* 支持pm2
* Docker部署
* 插件
* 钩子Hook
* 代理Proxy
* 集群

## 系统原理

## API

## 工具
* KoaCrab-Cli脚手架工具
* KoaCrab-Mock 模拟数据
* KoaCrab-Api API接口管理
* KoaCrab-Cron 计划任务
* 性能测试

## 案例（等待开源）
* KoaCrab-Demo 学习案例
* KoaCrab-Hzl 海之林官网
* KoaCrab-Auth 多系统登录
* KoaCrab-CMS cms管理系统
* KoaCrab-Blog Blog管理系统
* KoaCrab-Shop 商城
* KoaCrab-Weixin 微信公众号管理
* KoaCrab-wx 微信小程序
* KoaCrab-Admin 后台管理生成
* KoaCrab-Pm2 pm2管理系统
* KoaCrab-Doc 文档管理系统
* KoaCrab-Tools 工具
* KoaCrab-Monitor 前端监控管理系统
* KoaCrab-Teamwork 协同云
* KoaCrab-Monitor 埋点监控

## bug
* 根目录的文件夹，models,services,controllers不存在时会报错
* 中间件的顺序不同，执行的也不同，例如mysql放到view后面，Mysql里面的方法就获取不到了，异步中间件
* 配置文件，同时支持多个数据库
* 端口被占用时就使用另一个端口
* 不同的环境要取不同的配置


## 参考
* [egg](https://github.com/eggjs/egg)
* [thinkjs]()
https://github.com/Wizzercn/NodeWk
