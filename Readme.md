## Ego项目自评

网易前端mini项目——Ego动漫网站。
    
本仓库有两个分支：
- master分支，提供nei构建工具以及后端接口，可在本地搭建本地服务器运行项目。
- online分支，没有nei构建工具和后端接口，只用来线上展示，用mock数据来模拟ajax请求。

### Get Start
1. git clone 本仓库
2. 在项目根目录下，用命令行工具安装nei工具（默认你已经安装node～）
```
npm install nei -g
```
3. 在项目根目录下，用命令行工具执行下面命令
```
npm run server
```

后端接口的响应速度不稳定，所以当某些点击操作没反应时多等几秒钟或多点击几下··囧。

### 项目功能实现
- 首页：视觉和功能完成度较高，注册框的部分功能还没实现（级联选择器）。
- 作品列表页：视觉和功能完成度高。
- 作品创建页面：没有完成····

### 功能展示

### 持续改进
1. 将项目中涉及到的组件（级联选择器、分页器等）剥离出来，并结合测试课程与持续改进课程中的知识，封装成可复用的组件；
2. 结合NEC代码规范改善CSS的代码质量。
