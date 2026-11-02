# 给带领人：自己搭一个小组后端

先看这页，不用懂技术。

## 你需要准备

- 一个邮箱
- 一个 Cloudflare 账号（免费注册）
- 一个 GitHub 账号（一键按钮要用；没有就找技术同工代部署）

**你不需要：** 服务器、域名、信用卡、命令行、数据库知识。先用免费地址就能跑；想绑自己的域名也可以，部署后多一步。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/davidliuus666/qingjiaowei-selfhost)

按钮会把代码复制到你自己的 GitHub 账号，并自动创建 D1 数据库。

> **不要走 Cloudflare 的「Import a repository」。** 让按钮自己新建仓库，才会自动创建 D1。

## 用一键按钮部署

1. 点「Deploy to Cloudflare」。
2. 登录 GitHub 和 Cloudflare。连接 GitHub 后，**让 Cloudflare 自己新建仓库**；不要选「Import a repository」，那条路不会建 D1。如果名字后面多了个数字（比如 `...2`），正常。
3. 起个名字，自己编一个**部署设置码**（至少 8 位），点部署。把码写下来；它不是 GitHub 或 Cloudflare 密码。
4. 等 2-3 分钟。打开 Worker 的 **Settings → Domains & Routes**；如果 `workers.dev` 显示 **Disabled**，点 **Enable**。如果写 **No URLs enabled**，也是在这个页面。地址是 `https://<worker名>.<你的子域>.workers.dev`。
5. 在地址后面加 `/admin`。输入同一个设置码、小组名称、管理员密码（至少 8 位），生成二维码，发到群里。
6. （可选）想用自己的域名：部署完后按 [DOMAIN.zh-CN.md](DOMAIN.zh-CN.md) 绑定。一键按钮不能代办域名，因为域名注册和 NS 要在 Cloudflare 外面操作。

就这些。不绑域名也能用；没有服务器要买，没有数据库要装。

默认地址是 `*.workers.dev`（这个版本是 Worker，不是 Pages）。中国大陆可能打不开；想更稳就绑自己的域名，但 Cloudflare 免费版也不保证大陆访问质量。

## 现在是什么状态

**一键按钮已经跑通。** 让按钮自己新建仓库，不要手动导入源仓库；如果走不通，技术同工可以按 [README.zh-CN.md](README.zh-CN.md) 手动部署。

## 常见问题

- **没有网址 / `workers.dev` 显示 Disabled：** 打开 **Settings → Domains & Routes → workers.dev → Enable**。
- **提示“部署设置码还是示例值”：** 打开 **Settings → Variables and Secrets**，把 `SETUP_CODE` 换成自己的码，保存，再回 `/admin` 用新码。
- **部署失败，而且你是手动导入仓库的：** 回到 GitHub 重新点按钮；手动导入不会自动建 D1。

## 没有 R2，图片/音频/PDF 放哪

不用上传到 Cloudflare，填外部直链就行：

- 封面图：`https://...jpg/png/webp`
- 音频：MP3 / M4A 直链
- 讲义：PDF 直链最稳；PPT 建议先导出 PDF
- 视频：MP4 直链

后台的图片上传按钮会隐藏，只留一个填链接的框。这是故意的：不用绑信用卡，也能用。

## 界面语言

后台和课堂都支持中文 / English，默认跟随浏览器语言，右上角可以切换。手机 App 目前只有中文。

## 卡住了怎么办

把报错的截图发给我们，不要发管理员密码和设置码。

## 一句话

你的小组数据在你自己的 Cloudflare 账号里；你不需要买服务器，也不需要懂 Cloudflare 的名词。按上面的步骤走就行，域名是可选的。
