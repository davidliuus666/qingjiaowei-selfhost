# 一键部署按钮：发布检查清单

这份是给维护者看的，不是给小组带领人看的。给带领人看 [START-HERE.zh-CN.md](START-HERE.zh-CN.md)。

## 当前状态

公开仓库已经建好：<https://github.com/davidliuus666/qingjiaowei-selfhost>，按钮也已经在真实 Cloudflare 账号上跑通：它会新建一个仓库副本，并自动创建真实的 D1 数据库。

下面的干净账号清单继续用于回归测试。手动步骤保留作为兜底。

## 常见错误：手动导入仓库

不要走 **Workers & Pages → Create → Import a repository**。那条路会直接部署源仓库，不会自动创建 D1，最后会在部署阶段失败。连接 GitHub 后，让按钮自己新建仓库；如果名字被占用，Cloudflare 会加后缀（例如 `qingjiaowei-selfhost2`），并把真实的 D1 ID 写进副本的 `wrangler.jsonc`。

## 公开仓库要求

仓库根目录就是 `selfhost/` 这一层，不要再套一层，也不要和 App / 官网混在一个仓库里（Cloudflare 对 monorepo 支持不好）。

必须包含：

- `package.json`
  - `scripts.deploy` = `wrangler deploy`
  - 不要放 `build` 脚本（Wrangler 会自己打包 TypeScript；不要把 dry-run 部署当成构建命令）
  - `cloudflare.bindings.SETUP_CODE.description`（按钮会用它提示用户填设置码）
- `wrangler.jsonc`
  - 只有 D1 绑定
  - `database_id` 用占位符，按钮会自动换成用户自己的
  - 不要 R2；不要启用 `routes`（可以保留注释示例，按钮不能替用户绑域名）；不要写死 `PUBLIC_ORIGINS`
- `.dev.vars.example`
  - 只放 `SETUP_CODE` 示例，并明确要求用户改成自己的
- `src/`
- `README.md`（默认英文）、`README.zh-CN.md`
- `START-HERE.md`（默认英文）、`START-HERE.zh-CN.md`
- `DOMAIN.md`（默认英文）、`DOMAIN.zh-CN.md`
- `LICENSE`（MIT，公开前必须带上）
- `.gitignore`
  - 排除 `node_modules/`、`dist/`、`.wrangler/`、`.dev.vars`

绝对不能带：

- 生产域名
- 生产数据库 ID
- `.dev.vars` / 管理员密码 / Cloudflare Token
- `node_modules/`、`dist/`、日志、临时文件

## 按钮代码

```markdown
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/davidliuus666/qingjiaowei-selfhost)
```

官方说明：<https://developers.cloudflare.com/workers/platform/deploy-buttons/>

## 为什么域名不能塞进一键按钮

按钮只能操作 Cloudflare 账号里的 Worker 和 D1。自定义域名要求域名先成为该账号下的 Active zone，这需要用户到注册商改 NS；按钮没有域名注册商权限，也不能替用户选域名。所以域名只能做成部署后的可选步骤，完整说明见 [DOMAIN.zh-CN.md](DOMAIN.zh-CN.md)。`wrangler.jsonc` 里可以保留注释示例，但不要启用 `routes`，否则按钮部署会绑错或失败。

## 干净账号测试清单

用一个从没用过 Cloudflare Workers 的账号，按小白视角走：

- [ ] 点按钮后能登录 Cloudflare / GitHub
- [ ] 自动创建 D1，部署成功，没有让用户填数据库编号
- [ ] Worker 有可用的网址（如果 `workers.dev` 默认关闭，能打开它）
- [ ] 打开 `/admin` 能看到设置码、小组名称、密码、确认密码四个框
- [ ] 设置码错误时明确拒绝
- [ ] 设置码还是示例值时明确拒绝
- [ ] 设置码正确时能建组，进入后台
- [ ] 切换语言后，后台和课堂都变成英文，界面没有残留中文
- [ ] 后台没有“图片库”和上传按钮
- [ ] 系列封面字段只显示外链输入，不显示上传
- [ ] 生成二维码成功；手机 App 扫码能连上
- [ ] （可选）绑定自定义域名后，`/admin` 能打开，二维码里的 `server=` 是新域名
- [ ] 不带 R2 时，上传接口 503、`/media` 404、安装包下载 404
- [ ] 刷新后能重新登录
- [ ] 整个流程不用终端、不用域名、不用信用卡
- [ ] 计时：从点按钮到出二维码不超过 10 分钟

## 已知限制（要写进用户说明）

- 需要 GitHub 账号；没有就代部署。
- `workers.dev` 在中国大陆可能打不开。自定义域名通常更好，部署后可以绑，但一键按钮不能代办；Cloudflare 免费版也不保证大陆访问质量。
- 免费域名可以用 DNSHE（优先 `.de5.net`），但只建议测试/过渡，长期用还是自己买域名。
- 一键按钮复制的是用户自己的仓库，上游更新不会自动同步。
- 第一版没有 R2、没有自动升级；自定义域名支持，但要在部署后手动绑定。
- 不要手动导入仓库；用按钮才会自动创建 D1。
