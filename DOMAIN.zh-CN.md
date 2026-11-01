# 绑定自己的域名（可选）

> 给带领人和技术同工。操作 5–15 分钟，NS 生效可能要等几分钟到 24 小时，不需要改代码。
> English: [DOMAIN.md](DOMAIN.md)

## 先说结论

- **支持。** 自部署版跑在 Cloudflare Worker 上，可以绑自己的域名或子域名。
- Cloudflare 会自动创建 DNS 记录和 HTTPS 证书，不额外收费。
- 自部署版代码没有写死域名。绑定后打开新地址，二维码就会用新地址；也可以显式设置 `PUBLIC_ORIGINS` 固定下来。
- **一键部署按钮不能代办域名。** 按钮只能操作 Cloudflare 账号里的 Worker 和 D1；域名注册、改 NS 都在 Cloudflare 之外，按钮没有权限。所以域名是部署后的**可选第 6 步**，不是按钮里的一个勾选项。

## 先选一个地址

推荐用子域名，例如：

```text
qjw.example.com
```

不要用 `www` 和根域名同时绑同一个 Worker：Cloudflare 的 Custom Domain 是精确匹配，`example.com` 和 `www.example.com` 是两个地址。需要两个都能用，就选一个做主地址，另一个做重定向。

绑之前需要满足：

1. 你有一个自己能管理的域名（或免费二级域名）。
2. 这个域名能修改 NS（名称服务器）。
3. 域名已经加到**同一个 Cloudflare 账号**，并且状态是 **Active**。

> 不要用 CNAME 直接指向 `xxx.workers.dev` 来代替。Cloudflare 的 Custom Domain 要求域名先成为账号里的 Active zone，CNAME 到 workers.dev 通常不会得到正确的证书和路由。

## 路线 A：用自己的域名（推荐）

适合已经有域名，或者打算买一个长期用的域名。

1. 在域名注册商买好域名。
2. 打开 Cloudflare 控制台，选择 **Add a site**，输入域名，选 **Free** 计划。
3. Cloudflare 会给你两条 NS（名称服务器），例如 `xxx.ns.cloudflare.com`。回到域名注册商，把 NS 改成这两条。
4. 等 Cloudflare 里的域名状态变成 **Active**。通常几分钟，慢的话最多 24 小时。
5. 打开 **Workers & Pages → qingjiaowei-selfhost → Settings → Domains & Routes → Add → Custom Domain**，输入 `qjw.example.com`（或你的域名），点 **Add Custom Domain**。
6. Cloudflare 会自动建 DNS 记录并签发证书。打开 `https://qjw.example.com/admin`，重新登录后台。
7. 到「安全 / 邀请新手机」重新生成小组二维码。旧二维码仍然指向旧地址，换域名后要发新的。

### 也可以写在 wrangler.jsonc 里

域名已经在同一个 Cloudflare 账号里 Active 后，把 `wrangler.jsonc` 里的注释取消，改成你的域名：

```jsonc
"routes": [
  { "pattern": "qjw.example.com", "custom_domain": true }
]
```

然后重新部署：

```bash
npm run deploy
```

Cloudflare 会自动创建 DNS 记录和证书。和面板方式二选一，不要重复添加。

## 路线 B：DNSHE 免费域名

如果只是测试、过渡，或者暂时不想买域名，可以用 [DNSHE](https://www.dnshe.com/) 的免费域名。

**优先选 `.de5.net` 后缀。** DNSHE 支持修改 NS，但目前并不是每个后缀都能被 Cloudflare 当成独立域名接受；`.de5.net` 是社区里最常用来托管 Cloudflare 的，其他后缀以 Cloudflare 添加时的提示为准。

步骤：

1. 打开 <https://www.dnshe.com/>，注册或登录，按页面要求完成人机验证。
2. 进入「域名服务 → 免费域名」，选择 `.de5.net`，填一个前缀，例如 `qjw`，得到 `qjw.de5.net`。
3. 在 Cloudflare 控制台 **Add a site**，输入 `qjw.de5.net`，选 **Free**，复制 Cloudflare 给的两条 NS。
4. 回到 DNSHE 的域名管理，找到 **DNS / NS 服务器** 设置，把原来的 NS 换成 Cloudflare 的两条，保存。
5. 等 Cloudflare 里的 `qjw.de5.net` 变成 **Active**。
6. 按路线 A 的第 5–7 步，在 Worker 里添加 **Custom Domain**，然后重新登录、重新生成二维码。

注意事项：

- 免费域名默认只有 1 年，到期前要在 DNSHE 续期；也可能因为政策或违规被回收。
- 免费域名适合测试和过渡，不建议作为唯一长期地址。正式用还是建议自己买一个域名。
- 如果 Cloudflare 提示不能添加这个域名，说明该后缀当前不被接受；换 `.de5.net` 或买一个正式域名。
- 不要把管理员密码、设置码、成员资料发到 DNSHE 的工单或公开地方。

## 绑定后必须知道的几件事

### 二维码会变

小组二维码里编码了服务器地址（`server=`）。换域名后：

- 新生成的二维码会指向新域名。
- 已经加入的手机本地保存的还是旧地址，**不会自动切换**。
- 旧地址先不要关。等大家重新扫新二维码，或者继续保留旧地址让老设备用。
- 如果你把 `workers.dev` 地址关掉，老设备会连不上，需要重新扫码。

### 登录状态会变

后台登录 Cookie 是按域名隔离的。换到新域名后要重新登录一次，这是正常的。

### 可选：固定对外地址

绑定并确认新域名能打开后，可以把对外地址固定成它。在 Cloudflare 控制台：

**Worker → Settings → Variables and Secrets → Add**，添加：

```text
PUBLIC_ORIGINS = https://qjw.example.com
```

或者在 `wrangler.jsonc` 里取消注释：

```jsonc
"vars": { "PUBLIC_ORIGINS": "https://qjw.example.com" }
```

作用：

- 二维码和接口里的图片 / 音频绝对链接会统一用这个地址。
- 即使你从 `workers.dev` 打开后台，生成的二维码也会指向新域名。
- 不设置也可以：默认用当前访问地址。

> 一定等新域名能正常打开后再设置，否则二维码会指向一个还没生效的地址。

## 为什么不能塞进一键按钮

一键部署按钮能做的：

- 把代码复制到你的 GitHub 仓库
- 自动创建 D1 数据库
- 部署 Worker

它不能做的：

- 替你注册域名
- 登录 DNSHE 或域名注册商
- 修改 NS
- 把域名加到你的 Cloudflare 账号
- 替你选择用哪个域名

这些动作需要域名所有权和注册商权限，Cloudflare 的部署按钮没有这个权限。所以域名只能作为部署后的可选步骤。技术同工用面板或 `wrangler` 的 `routes` 都可以，一次配置好，以后不用再动。

## 国内访问提醒

- 这个自部署版是 Cloudflare **Worker**，默认免费地址是 `*.workers.dev`，不是 `*.pages.dev`。
- `workers.dev` 在中国大陆经常打不开；绑自定义域名通常更容易打开。
- 但 Cloudflare 免费版不保证中国大陆的访问质量，也不保证域名不被阻断。如果大陆稳定访问是硬要求，不要只靠 Cloudflare 免费版，需要国内服务器、备案或加速方案。

## 常见问题

**Cloudflare 一直显示 Pending / 未激活**

NS 还没改对或还没生效。在电脑上执行：

```bash
nslookup -type=NS qjw.example.com
```

看到的是 Cloudflare 的两条 NS 才算对。生效可能需要几分钟到 24 小时。

**Add Custom Domain 提示 CNAME 已存在**

先到 Cloudflare 的 DNS 记录里删掉同名的 CNAME，再添加 Custom Domain。

**打开是 522 / 523 / 1016**

先确认 Worker 本身能通过 `workers.dev` 打开，再检查 Custom Domain 是否加在正确的 Worker 上。

**证书一直没出来**

Custom Domain 会自动申请证书，通常几分钟。确认域名是 Active 状态，且没有和同名的其他记录冲突。

**换域名后 App 连不上**

二维码里的旧地址失效了。重新生成二维码，或者先保留旧域名，等大家重新扫码。

## 相关文档

- [README.zh-CN.md](README.zh-CN.md)
- [START-HERE.zh-CN.md](START-HERE.zh-CN.md)
- [DEPLOY_BUTTON.zh-CN.md](DEPLOY_BUTTON.zh-CN.md)
- Cloudflare 官方文档：[Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
