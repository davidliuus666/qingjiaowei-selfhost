# QJW · Self-hosted edition

> For group leaders: start with [START-HERE.md](START-HERE.md). No technical background required.
> **Church tech volunteer?** Read [FOR-CHURCH-TECH.md](FOR-CHURCH-TECH.md) — what you are taking on, what it costs, and what it does not do.
> For maintainers: read [DEPLOY_BUTTON.md](DEPLOY_BUTTON.md) for the release checklist.
> To bind your own domain: read [DOMAIN.md](DOMAIN.md).
> 中文说明见 [README.zh-CN.md](README.zh-CN.md)。

**QJW** is the English name of 青椒味, a small-group app for church meetings, sermons, and classes. This is the self-hosted backend for groups that want to own their data: meetings, sermon series, announcements, quizzes, homework, attendance, and prayer requests, all in a SQLite database in your own Cloudflare account. It runs entirely on Cloudflare's free tier:

> **Where members get the app:** the client is published on the [official download page](https://qingjiaowei.gracelink.cc/download), not by this backend. Members can also use the [web app](https://qingjiaowei.gracelink.cc/app) without installing anything. This backend only serves your group's data and QR codes.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/davidliuus666/qingjiaowei-selfhost)

> **Do not use Workers & Pages → Create → Import a repository.** After connecting GitHub, let the button create a new repository. That is what provisions D1. Manually importing the source repo skips D1 and fails at the deploy step.

- **Workers** for the backend
- **D1** for text content, meetings, announcements, quizzes, and homework
- **No R2 required** — images, audio, and PDFs are external public URLs
- **No domain required to start** — use the free `*.workers.dev` address
- **Custom domains are supported** — HTTPS is provisioned automatically and the QR code uses the new address; see [DOMAIN.md](DOMAIN.md)
- **No credit card required** — R2 stays off

## What you need

1. A Cloudflare account (free, email signup)
2. A one-time **setup code** that you make up, at least 8 characters (used only when you first open the admin)
3. For one-click deploy: a GitHub account (the button copies the code into your own repository)

## One-click deployment (beginner path)

1. Click **Deploy to Cloudflare** above.
2. Sign in to GitHub and Cloudflare. After GitHub connects, **let Cloudflare create a new repository**. Do not use **Workers & Pages → Create → Import a repository**; that path does not create D1 and fails at deploy. If the name is taken, Cloudflare adds a number such as `qingjiaowei-selfhost2`; that is normal.
3. Pick a name, enter a **setup code you make up** (at least 8 characters), and click deploy. Write the code down; it is not your GitHub or Cloudflare password.
4. Wait 2–3 minutes. On the Worker page, open **Settings → Domains & Routes**. If `workers.dev` says **Disabled**, click **Enable**. If the page says **No URLs enabled**, this is the same page. The address looks like `https://<worker-name>.<your-subdomain>.workers.dev`.
5. Open that address with `/admin` at the end. Enter the same setup code, a group name, and an admin password (at least 8 characters). Then generate a QR code.
6. Send members the [official download page](https://qingjiaowei.gracelink.cc/download) and the [web app](https://qingjiaowei.gracelink.cc/app); they install the app (or open the web app) before scanning.

If `/admin` says **“SETUP_CODE is still the example value”**, go to **Settings → Variables and Secrets**, replace `SETUP_CODE` with your own code, save, and enter that new code on `/admin`. The example value is refused on purpose.

## Manual deployment (for technical volunteers)

Prefer the button above. It has been verified with a real Cloudflare deployment. If it does not work, these manual steps remain the fallback.

```bash
npm install
npx wrangler login

# Create a D1 database, then put the printed database_id into wrangler.jsonc
npx wrangler d1 create qingjiaowei-selfhost

# Deploy
npm run deploy

# Set the one-time setup code (at least 8 characters; do not keep the example value)
npx wrangler secret put SETUP_CODE
```

When deployment finishes, open:

```text
https://<your-worker-name>.<your-workers-subdomain>.workers.dev/admin
```

If the Worker page says **No URLs enabled** or `workers.dev` is **Disabled**, open **Settings → Domains & Routes → workers.dev → Enable** first. The exact address is shown there.

The first visit asks for:

- the deployment setup code
- a group name
- an admin password (at least 8 characters)

After that, open **Access**, generate a QR code, and share it with the group. People join by scanning it in the app.

> `SETUP_CODE` is required in the self-hosted edition, must be at least 8 characters, and must not be the example value. Otherwise the first-time setup is refused, so a public URL cannot be claimed by a stranger.
>
> If `/admin` says the setup code is still the example value, replace `SETUP_CODE` under **Settings → Variables and Secrets**, save, then enter the new code.

## Custom domain (optional)

Supported. Put the domain in the same Cloudflare account, then open **Settings → Domains & Routes → Add → Custom Domain** on the Worker and enter `qjw.example.com`. Cloudflare creates the DNS record and certificate automatically; no code changes are needed.

The Deploy to Cloudflare button cannot do this step: domain registration and nameserver changes happen outside Cloudflare. See [DOMAIN.md](DOMAIN.md) for the full walkthrough, including the DNSHE free-domain option.

## Local preview

```bash
cp .dev.vars.example .dev.vars
# Replace the example SETUP_CODE in .dev.vars with your own
npm run dev
```

Open `http://localhost:8789/admin`. Local development goes through the same first-time setup flow.

## Using it without R2

The media library and upload buttons are hidden, and image fields accept a URL only. Paste a public direct link:

| Content | What to paste |
| --- | --- |
| Series cover, episode cover | A direct image URL (`https://...jpg/png/webp`) |
| Episode audio | Choose **Audio URL** and paste an MP3 / M4A direct link |
| Episode video | Choose **Video URL** and paste an MP4 direct link |
| Handout / slides | A PDF direct link, or a Tencent Docs / WPS / Google Slides share link |
| Announcements, meetings, carousel | A direct image URL |

Notes:

- It must be a direct file link, not a cloud-drive landing page. Google Drive and OneDrive share links are often not the file itself.
- HTTPS only, and publicly reachable.
- External links are public. Do not put prayer details, grades, or member information behind one.
- Slides are most reliable when exported to PDF and opened in the app's PDF viewer.

## Not included in this edition

- File uploads / media library (requires the full R2 edition)
- Automatic custom-domain binding from the one-click button (the domain and nameservers belong to you; bind it manually after deployment with [DOMAIN.md](DOMAIN.md))
- Automatic upgrades (redeploy to update)
- Multi-tenancy or billing

## Security notes

- Never commit `.dev.vars`, admin passwords, or Cloudflare API tokens.
- The setup code works once and stops working after the admin password is set.
- A forgotten admin password currently requires a redeploy or a database change. A reset flow is planned.

## Interface language

- The setup page, sign-in page, admin, and classroom all support Chinese and English.
- The language follows the browser by default. Use the switch in the top right to change it; the choice is remembered in this browser.
- Text you enter yourself (group names, titles, notices, and so on) is not translated automatically.
- The phone app supports Chinese and English. It follows your phone language by default; you can change it in **Settings → Interface language**.

## License

MIT. See [LICENSE](LICENSE).

The MIT license covers the code in this repository. The names “青椒味” and “QJW”, and the logo, are project identifiers; the license does not grant rights to use them as branding or to imply endorsement.

## Changelog

- First release: D1 only, no R2, first-time setup wizard, setup code, Life River auto-sync off by default.
- Docs update: added custom-domain and DNSHE free-domain steps; QR codes use the new address after binding.
- One-click deploy button verified with a real Cloudflare deployment; manual import is not supported.
- License: MIT.
