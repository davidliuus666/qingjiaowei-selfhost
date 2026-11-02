# For church tech volunteers

You are the person your church asks when something needs a server. Someone wants the small-group app, but the church will not put member data on a vendor's account, and there is no budget line for software.

This repository is for that situation. You deploy it once, hand out one QR code, and the group runs on your own Cloudflare account.

If you have to talk someone into it, or talk yourself out of it, [this article](https://qingjiaowei.gracelink.cc/en/blog/self-hosted-small-group-data) covers the trade-offs without the sales pitch: what a group actually stores, what self-hosting really costs, and when it is the wrong choice.

## What it actually is

- A **Cloudflare Worker** that serves the group's backend: meetings, sermons, announcements, quizzes, homework, attendance, prayer requests.
- **D1** (SQLite) for storage. Nothing else.
- **No R2, no credit card.** Images, audio, and PDFs are public URLs you paste in.
- **No server to patch.** No Node process, no Docker, no database to back up by hand.

The phone app and web app are published by the project at [qingjiaowei.gracelink.cc](https://qingjiaowei.gracelink.cc). Your deployment holds the data and mints the join QR code — members still get the client from the official download page or open the web app in a browser.

## Why a church would pick this over a SaaS

| | SaaS small-group app | This |
| --- | --- | --- |
| Who holds member data | The vendor | Your church's Cloudflare account |
| Cost | Per-seat subscription | Cloudflare free tier |
| Who can read the database | Vendor staff | Only people with your Cloudflare login |
| Shutting it down | Export request, maybe | Delete the Worker and the D1 database |
| Vendor disappears | Your group does too | The code is MIT; the data is a SQLite file you can export |

That last row is the real argument. Churches get burned by discontinued tools, and a group's prayer requests and attendance history are not something you want to re-enter.

## The 10-minute path

1. Click **Deploy to Cloudflare** in [README.md](README.md). Let Cloudflare create a **new** repository — do not use "Import a repository", that path skips D1 creation and fails at the deploy step.
2. Enter a setup code you make up (8+ characters). Write it down.
3. Wait 2–3 minutes. Enable `workers.dev` under **Settings → Domains & Routes** if it is off.
4. Open `https://<your-worker>.workers.dev/admin`, enter the setup code, the group name, and an admin password.
5. Generate the join QR code. Send members the download page or the web app link.
6. Done. The setup code stops working once the admin password is set, so a stranger who finds the URL cannot claim it.

If you would rather do it from a terminal, the manual path is in [README.md](README.md#manual-deployment-for-technical-volunteers).

## The honest limitations

- **Mainland China access is not guaranteed.** `*.workers.dev` is often unreachable there; a custom domain usually helps but Cloudflare's free plan makes no promises. See [DOMAIN.md](DOMAIN.md).
- **No file uploads in this edition.** Media is external URLs only. If the group needs uploads, that needs the R2 edition, which is not published yet.
- **No auto-updates.** You redeploy to upgrade.
- **No password reset flow yet.** A forgotten admin password means redeploying or editing the database.
- **One group per deployment.** No multi-tenancy, no billing.
- **The clients are official builds.** You are self-hosting the data, not forking the app.

## What to tell your pastor

> The group's information lives in our own Cloudflare account, not on someone else's service. There is no monthly fee. If we stop using it, we delete it and it is gone.

That is accurate, and it is usually enough.

## Before you promise it to anyone

Deploy it yourself first, create a test group, and put three people through the QR flow on real phones. Then delete the test data. The one-click button has been verified with a real deployment, but your network and your church's phones are not mine.

If it breaks, open an issue with the error text from the Cloudflare build log. Never paste your setup code, admin password, or API token.
