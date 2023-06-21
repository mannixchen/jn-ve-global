# 升级指南

框架 V2 版本底层重构，更多的工作在基础建设层面完成。

框架整体使用 [无界](https://wujie-micro.github.io/doc/) 重构。

底层通过方案替换、代码优化、机制优化，使系统的运行速度得到了指数级的提升。

对比视频已发到前端群里

## 基座升级

基座升级方式不变，由架构组发出升级包，部署即可

## 微应用升级

:::tip

此次升级并不复杂，就是覆盖范围较广

:::

### 旧项目升级

:::tip

对于没有经历过上次升级(monorepo)的项目，直接使用 [micro-cli](../micro-cli/index.md) 升级即可

micro-cli 需要更新，执行

 `npm i jn-micro-cli@1.2.0 -g --registry=http://172.31.71.159/repository/npm-public/`

:::

### monorepo 项目升级

本次升级总共涉及到 6 个文件

![v12v2](/images/micro/v1tov2-files.png)

#### 文件替换

* 根目录下

  + `/global.d.ts`
  + `global.wujie.d.ts`
  + `package.json`
  + `pnpm-lock.yaml`

* 子目录下

    - `/子项目目录/public/index.html`
    - `/子项目目录/src/main.ts`

:::tip 

如果各自的项目有自己项目独有的依赖，请在覆盖 package.json 后，自行安装特有依赖

:::

### Home 升级

home 升级方式不变，参考 [首页开发](./homeDev.md)
