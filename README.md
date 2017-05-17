# book-manager-ui
an app for reading
框架支持：Ionic ，基于angularjs，是目前移动混合开发框架中入门最快、效率较高的开发框架，支持不同平台如android、ios的打包和发布；


目录：
www/src/**/*，源代码目录；
www/index.html 引入依赖，包括第三方插件、自定义的指令、服务、控制器等；



页面：
www/src/views/bookshelf/*.html 书架页面；
www/src/views/bookstore/*.html 书城页面；
www/src/views/self/*.html 个人页面；

www/src/views/tabs.html 侧边栏和切换标签页定义；
www/src/views/login_*.html 登录注册页面；


控制器：
www/src/js/bookshelf/*.js 书架页面控制器；
www/src/js/bookstore/*.js 书城页面控制器；
www/src/js/self/*.js 个人页面控制器；


配置
www/scr/js/config/config.js 配置服务器IP

app.js 配置页面路由、Http拦截器、返回按钮功能；
