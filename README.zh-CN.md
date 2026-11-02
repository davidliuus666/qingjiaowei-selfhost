# 青椒味 · 自部署轻量版

> 给带领人：先看 [START-HERE.zh-CN.md](START-HERE.zh-CN.md)，不用懂技术。
> 给维护者：看 [DEPLOY_BUTTON.zh-CN.md](DEPLOY_BUTTON.zh-CN.md)（发布检查清单）。
> 想绑自己的域名：看 [DOMAIN.zh-CN.md](DOMAIN.zh-CN.md)。

**QJW** 是「青椒味」的英文名。这是给「想自己管数据」的小组用的后端。它只依赖 Cloudflare 的免费额度：

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/davidliuus666/qingjiaowei-selfhost)

> **不要走 Workers & Pages → Create → Import a repository。** 连接 GitHub 后，让按钮自己新建仓库；手动导入源仓库不会自动创建 D1，最后会在部署阶段失败。

- Worker：跑后端
- D1：存文字内容、聚会、公告、测验、作业
- **不需要 R2**：图片、音频、PDF 都填外部直链
- **不绑域名也能用**：先用免费的 `*.workers.dev` 地址
- **想绑自己的域名也可以**：绑定后 HTTPS 自动配好，二维码自动用新地址，见 [DOMAIN.zh-CN.md](DOMAIN.zh-CN.md)
- **不需要信用卡**：不开 R2 就不用绑卡

## 你需要准备

1. 一个 Cloudflare 账号（邮箱注册，免费）
2. 一串你自己编的、只有你知道的「设置码」，至少 8 位（第一次打开后台时用）
3. 一键部署需要一个 GitHub 账号（按钮会把代码复制到你自己的仓库）

## 一键部署（小白版）

1. 点上面的 **Deploy to Cloudflare**。
2. 登录 GitHub 和 Cloudflare。连接 GitHub 后，**让 Cloudflare 自己新建仓库**；不要走 **Workers & Pages → Create → Import a repository**，那条路不会建 D1，最后会部署失败。如果名字被占用，Cloudflare 会在后面加个数字，比如 `qingjiaowei-selfhost2`，这是正常的。
3. 起个名字，自己编一个**部署设置码**（至少 8 位），点部署。把码写下来；它不是 GitHub 或 Cloudflare 密码。
4. 等 2-3 分钟。打开 Worker 的 **Settings → Domains & Routes**；如果 `workers.dev` 显示 **Disabled**，点 **Enable**。如果页面写 **No URLs enabled**，也是在这个页面开。地址长这样：`https://<worker名>.<你的子域>.workers.dev`。
5. 在这个地址后面加 `/admin`。输入同一个设置码、小组名称、管理员密码（至少 8 位），然后生成二维码。

如果 `/admin` 提示 **“部署设置码还是示例值”**，去 **Settings → Variables and Secrets**，把 `SETUP_CODE` 换成你自己的码，保存，再回 `/admin` 用新码。示例值是服务端故意拒绝的。

## 部署（给技术同工的手动版）

优先点上面的「Deploy to Cloudflare」。按钮已经实际部署验证过；如果走不通，再用下面的手动步骤。

```bash
npm install
npx wrangler login

# 建一个 D1 数据库，把输出里的 database_id 填进 wrangler.jsonc
npx wrangler d1 create qingjiaowei-selfhost

# 部署
npm run deploy

# 设置一次性设置码（按提示输入，至少 8 位，不要用示例值）
npx wrangler secret put SETUP_CODE
```

部署完成后，打开：

```text
https://<你的-worker名>.<你的-workers子域>.workers.dev/admin
```

如果 Worker 页面写 **No URLs enabled**，或者 `workers.dev` 显示 **Disabled**，先打开 **Settings → Domains & Routes → workers.dev → Enable**。准确地址也会显示在那里。

第一次打开会要求输入：

- 部署设置码
- 小组名称
- 管理员密码（至少 8 位）

设置好后，去「安全」页生成二维码，发到群里，大家用 App 扫码加入。

> 自部署版必须设置 `SETUP_CODE`，而且至少 8 位、不能是示例值；没设置的话第一次设置会被拒绝。这样公开地址不会被陌生人抢先设管理员密码。
>
> 如果 `/admin` 提示设置码还是示例值，去 **Settings → Variables and Secrets** 把 `SETUP_CODE` 换掉，保存后再用新码。

## 绑定自己的域名（可选）

支持。域名先托管到同一个 Cloudflare 账号，然后在 Worker 的 **Settings → Domains & Routes → Add → Custom Domain** 里填 `qjw.example.com` 即可；Cloudflare 会自动建 DNS 记录和证书，代码不用改。

一键部署按钮不能代办这一步：域名注册和 NS 修改在 Cloudflare 之外，按钮没有权限。完整步骤（含 DNSHE 免费域名）见 [DOMAIN.zh-CN.md](DOMAIN.zh-CN.md)。

## 本地预览

```bash
cp .dev.vars.example .dev.vars
# 把 .dev.vars 里的 SETUP_CODE 改成你自己的，别用示例值
npm run dev
```

打开 `http://localhost:8789/admin`。本地也走第一次设置流程。

## 没有 R2 怎么用

后台的「图片库」和上传按钮会隐藏，图片字段只留一个输入框。把公开直链贴进去就行：

| 内容 | 填什么 |
| --- | --- |
| 系列封面、单集封面 | `https://...jpg/png/webp` 图片直链 |
| 单集音频 | 类型选「音频直链」，填 MP3 / M4A 直链 |
| 单集视频 | 类型选「视频直链」，填 MP4 直链 |
| 讲义 / PPT | PDF 直链，或腾讯文档 / WPS / Google Slides 的分享链接 |
| 公告、聚会、轮播图 | 图片直链 |

注意：

- 必须是直链，不是网盘的「分享页面」；Google Drive / OneDrive 的分享链接经常不是文件本身。
- 必须 HTTPS，必须公开可访问。
- 外链是公开的，别把祷告内容、成绩、成员资料放在外链里。
- PPT 最稳的是导出 PDF，再用 App 内的 PDF 阅读器打开。

## 这个版本没有的东西

- 文件上传 / 图片库（等 R2 完整版）
- 一键按钮自动绑定域名（域名归属和 NS 必须你本人操作；部署后可手动绑，见 [DOMAIN.zh-CN.md](DOMAIN.zh-CN.md)）
- 自动升级（更新要重新部署）
- 多租户 / 收费系统

## 安全提醒

- 不要把 `.dev.vars`、管理员密码、Cloudflare API Token 提交到仓库。
- 设置码只用一次；设置完管理员密码后就失效。
- 管理员密码忘了目前需要重新部署或改数据库，正式版会补重置流程。

## 界面语言

- 首次设置、登录、后台和课堂都支持中文 / English 切换。
- 默认跟随浏览器语言，右上角可以切换，选择会记在这个浏览器里。
- 后台里自己填的小组名、标题、通知等内容不会被自动翻译。
- App 界面目前只有中文。

## 许可证

MIT，详见 [LICENSE](LICENSE)。

MIT 只覆盖本仓库的代码；“青椒味”“QJW”名称和 LOGO 是项目标识，代码许可证不授予品牌使用权，也不能用来暗示官方认可。

## 更新记录

- 第一版：D1 only、无 R2、首次设置向导、设置码、默认关闭生命河自动同步。
- 文档更新：补充自定义域名和 DNSHE 免费域名步骤；绑定后二维码自动使用新地址。
- 一键按钮已实际部署验证；不要走手动导入仓库的旧路径。
- 许可证：MIT。
