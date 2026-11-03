# Start here: run your group's backend

Read this page first. You do not need to be technical.

## What you need

- An email address
- A Cloudflare account (free signup)
- A GitHub account (used by the one-click button; if you do not have one, ask a technical volunteer to deploy for you)

**You do not need:** a server, a domain, a credit card, the command line, or database knowledge. The free address works without a domain; if you want your own domain, that is one optional step after deployment.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/gracelink-david/qingjiaowei-selfhost)

The button copies the code into your GitHub account and creates the D1 database for you.

> **Do not use Cloudflare's "Import a repository" option.** Let the button create the new repository; that is what creates D1.

## Deploy with the one-click button

1. Click **Deploy to Cloudflare**.
2. Sign in to GitHub and Cloudflare. After GitHub connects, **let Cloudflare create a new repository**. Do not choose **Import a repository**; that path does not create D1. If Cloudflare adds a number such as `...2`, that is normal.
3. Pick a name, enter a **setup code you make up** (at least 8 characters), and click deploy. Write it down; it is not your GitHub or Cloudflare password.
4. Wait 2–3 minutes. On the Worker page, open **Settings → Domains & Routes**. If `workers.dev` is **Disabled**, click **Enable**. If it says **No URLs enabled**, this is the same page. Your address is `https://<worker-name>.<your-subdomain>.workers.dev`.
5. Open that address with `/admin` at the end. Enter the same setup code, your group name, and an admin password (at least 8 characters). Generate a QR code and share it with the group.
6. (Optional) To use your own domain, follow [DOMAIN.md](DOMAIN.md) after deployment. The one-click button cannot bind the domain, because registration and nameserver changes happen outside Cloudflare.

That is all. It works without a domain; there is no server to rent and no database to install.

## How members join

Members do not deploy anything, and they do not need to know your Cloudflare address. Ask them to install the app from the official site first, or let them use the web app:

- Android download: <https://qingjiaowei.gracelink.cc/download>
- Web app: <https://qingjiaowei.gracelink.cc/app>

After installing or opening the web app, they scan the QR code you generated in the admin. The QR code contains your group's server address; the client comes from the official site, while your group's data stays in your own account.

The default address is `*.workers.dev` (this is a Worker, not Pages). It may be unreachable in mainland China. A custom domain usually helps, but Cloudflare's free plan does not guarantee mainland access quality.

## Where things stand today

**The one-click button works.** Let it create a new repository; do not manually import the source repo. If it fails, a technical volunteer can deploy manually using [README.md](README.md).

## Common fixes

- **No URL / `workers.dev` is Disabled:** open **Settings → Domains & Routes → workers.dev → Enable**.
- **“SETUP_CODE is still the example value”:** open **Settings → Variables and Secrets**, replace `SETUP_CODE` with your own code, save, and enter that code on `/admin`.
- **Deploy failed after you manually imported the repository:** start over with the button; manual import does not create D1.

## Without R2, where do images, audio, and PDFs go?

You do not upload them to Cloudflare. Paste public direct links instead:

- Covers: `https://...jpg/png/webp`
- Audio: MP3 / M4A direct link
- Handouts: a PDF direct link is most reliable; export slides to PDF first
- Video: MP4 direct link

The upload button in the admin is hidden and only a URL field remains. That is intentional: no credit card needed.

## Language

The admin and classroom work in Chinese and English. They follow your browser language by default; the switch in the top right changes it. The phone app also supports Chinese and English, follows your phone language by default, and can be changed in **Settings → Interface language**.

## Stuck?

Send us a screenshot of the error. Never send your admin password or setup code.

## The short version

Your group's data lives in your own Cloudflare account. You do not need to buy a server or learn Cloudflare terminology. Follow the steps above; the domain step is optional.
