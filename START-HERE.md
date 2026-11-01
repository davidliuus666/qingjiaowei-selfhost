# Start here: run your group's backend

Read this page first. You do not need to be technical.

## What you need

- An email address
- A Cloudflare account (free signup)
- A GitHub account (used by the one-click button; if you do not have one, ask a technical volunteer to deploy for you)

**You do not need:** a server, a domain, a credit card, the command line, or database knowledge. The free address works without a domain; if you want your own domain, that is one optional step after deployment.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/davidliuus666/qingjiaowei-selfhost)

The button copies the code into your GitHub account and creates the D1 database for you.

> **Do not use Cloudflare's "Import a repository" option.** Let the button create the new repository; that is what creates D1.

## Deploy with the one-click button: five steps, plus an optional domain step

1. Click **Deploy to Cloudflare**.
2. Sign in to Cloudflare and GitHub, then allow access.
3. Pick a name and click deploy.
4. Wait 2–3 minutes, then open the URL Cloudflare gives you and add `/admin` at the end.
5. Enter the setup code, your group name, and an admin password. Generate a QR code and share it with the group.
6. (Optional) To use your own domain, follow [DOMAIN.md](DOMAIN.md) after deployment. The one-click button cannot bind the domain, because registration and nameserver changes happen outside Cloudflare.

That is all. It works without a domain; there is no server to rent and no database to install.

The default address is `*.workers.dev` (this is a Worker, not Pages). It may be unreachable in mainland China. A custom domain usually helps, but Cloudflare's free plan does not guarantee mainland access quality.

## Where things stand today

**The one-click button works.** Let it create a new repository; do not manually import the source repo. If it fails, a technical volunteer can deploy manually using [README.md](README.md).

## Without R2, where do images, audio, and PDFs go?

You do not upload them to Cloudflare. Paste public direct links instead:

- Covers: `https://...jpg/png/webp`
- Audio: MP3 / M4A direct link
- Handouts: a PDF direct link is most reliable; export slides to PDF first
- Video: MP4 direct link

The upload button in the admin is hidden and only a URL field remains. That is intentional: no credit card needed.

## Language

The admin and classroom work in Chinese and English. They follow your browser language by default; the switch in the top right changes it. The phone app is currently Chinese only.

## Stuck?

Send us a screenshot of the error. Never send your admin password or setup code.

## The short version

Your group's data lives in your own Cloudflare account. You do not need to buy a server or learn Cloudflare terminology. Follow the steps above; the domain step is optional.
