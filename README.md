# Tamboot Cloud Admin Frontend
Tamboot Cloud Admin Frontend是一个基于[Ant Disign Pro](https://pro.ant.design/index-cn)的前端脚手架工程，实现了企业级应用常见的用户管理、角色管理、权限管理、菜单管理等基本功能，封装了分页、新建模态框、修改模态框等常用组件，开发者可基于此快速搭建系统。

[Demo演示地址](http://cloud.tamboot.com)


## 快速上手教程

* [运行项目](#运行项目)
* [项目结构](#项目结构)
* [新增页面](#新增页面)
* [页面路由](#页面路由)
* [构建项目](#构建项目)
* [部署项目](#部署项目)

### 运行项目 <div id="运行项目"></div>

以mock模式运行项目，该种模式使用了mock数据，不依赖后端接口服务。
```bash
$ cd tamboot-cloud-admin-frontend
$ npm install --save core-js --registry=https://registry.npm.taobao.org
$ npm install --save puppeteer --ignore-scripts --registry=https://registry.npm.taobao.org
$ npm install --registry=https://registry.npm.taobao.org
$ npm run start
```

以no-mock模式运行项目，该种模式依赖后端接口服务，需要运行后端项目。
```bash
$ cd tamboot-cloud-admin-frontend
$ npm install --save core-js --registry=https://registry.npm.taobao.org
$ npm install --save puppeteer --ignore-scripts --registry=https://registry.npm.taobao.org
$ npm install --registry=https://registry.npm.taobao.org
```

### 项目结构 <div id="项目结构"></div>

目录|说明
-----|-----
config | [umi](https://umijs.org/) 配置
dist | 构建后生成的文件
mock | 本地模拟数据
src | 源码目录
src/assets | 本地静态资源
src/components | 业务通用组件
src/e2e | 集成测试用例
src/layouts | 通用布局
src/models | 全局 [dva](https://dvajs.com/) model
src/pages | 业务页面入口和常用模板
src/services | 后台接口服务
src/utils | 工具库
src/locales | 国际化资源
src/global.less | 全局样式
src/global.js | 全局 JS
tests | 测试工具
-|-

### 新增页面 <div id="新增页面"></div>

新增页面一般需要创建3个文件view、service、model，分别对应目录`src/pages`、`src/services`、`src/models`。可参考`src/pages/System/User.js`、`src/services/systemUser.js`、`src/models/systemUser.js`。

### 页面路由 <div id="页面路由"></div>

页面路由采用了约定优于配置的方式，路由信息与页面目录相对应，比如页面`src/pages/System/User.js`的路由为`/system/user`。

### 构建项目 <div id="构建项目"></div>

执行以下命令，构建完成后将在`dist`目录生成相关的文件。
```bash
$ cd tamboot-cloud-admin-frontend
$ npm run build
```

### 部署项目 <div id="部署项目"></div>

构建完成后，可将构建生成的`dist`目录部署到生产服务器中，以下是一个nginx配置的例子：
```
server {
    listen 80;

    #font end config
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    } 

    #back end api config
    location /tamboot-cloud-admin-api/ {
        proxy_pass http://www.tamboot.com/tamboot-cloud-admin-api/;
    }
}
```