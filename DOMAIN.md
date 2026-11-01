# Bind your own domain (optional)

> For group leaders and technical volunteers. The setup takes 5–15 minutes; nameserver propagation can take minutes to 24 hours. No code changes.
> 中文说明见 [DOMAIN.zh-CN.md](DOMAIN.zh-CN.md).

## The short answer

- **Yes, custom domains are supported.** The self-hosted edition runs on a Cloudflare Worker, and you can attach your own domain or subdomain.
- Cloudflare creates the DNS record and HTTPS certificate automatically, at no extra cost.
- The self-hosted code does not hard-code a domain. Open the new address after binding and the QR code will use it; you can also pin it with `PUBLIC_ORIGINS`.
- **The Deploy to Cloudflare button cannot do this for you.** The button can manage the Worker and D1 in your Cloudflare account, but domain registration and nameserver changes happen outside Cloudflare. The domain is therefore an **optional step 6 after deployment**, not a checkbox in the button.

## Pick one address

Use a subdomain, for example:

```text
qjw.example.com
```

Do not attach both `www` and the apex to the same Worker: a Custom Domain matches one exact hostname. If you need both, pick one as the main address and redirect the other.

Before you start, you need:

1. A domain you control (or a free subdomain).
2. Permission to change its nameservers (NS).
3. The domain added to the **same Cloudflare account** and showing **Active**.

> Do not use a CNAME to `xxx.workers.dev` instead. A Cloudflare Custom Domain requires the hostname to be an active zone in your account; a plain CNAME to workers.dev usually will not get the right certificate or routing.

## Option A: your own domain (recommended)

This is the best choice if you already own a domain or want a stable long-term address.

1. Register the domain with any registrar.
2. In the Cloudflare dashboard, choose **Add a site**, enter the domain, and select the **Free** plan.
3. Cloudflare gives you two nameservers, such as `xxx.ns.cloudflare.com`. Go back to your registrar and replace the NS with those two.
4. Wait until the domain shows **Active** in Cloudflare. This usually takes minutes, and at most 24 hours.
5. Open **Workers & Pages → qingjiaowei-selfhost → Settings → Domains & Routes → Add → Custom Domain**, enter `qjw.example.com` (or your domain), and select **Add Custom Domain**.
6. Cloudflare creates the DNS record and certificate automatically. Open `https://qjw.example.com/admin` and sign in again.
7. Open **Access / Invite a new phone** and generate a new group QR code. The old QR code still points to the old address, so issue a new one after switching.

### Or configure it in wrangler.jsonc

Once the domain is active in the same Cloudflare account, uncomment the example in `wrangler.jsonc` and replace it with your domain:

```jsonc
"routes": [
  { "pattern": "qjw.example.com", "custom_domain": true }
]
```

Then redeploy:

```bash
npm run deploy
```

Cloudflare creates the DNS record and certificate. Use either the dashboard or Wrangler, not both.

## Option B: a free DNSHE domain

For testing or a temporary address, you can use a free domain from [DNSHE](https://www.dnshe.com/).

**Prefer the `.de5.net` suffix.** DNSHE supports nameserver changes, but not every suffix is currently accepted by Cloudflare as a standalone zone. `.de5.net` is the one most commonly used with Cloudflare; for other suffixes, follow whatever Cloudflare says when you add the site.

Steps:

1. Open <https://www.dnshe.com/>, register or sign in, and complete the human verification.
2. Go to **Domain services → Free domains**, choose `.de5.net`, and enter a prefix such as `qjw` to get `qjw.de5.net`.
3. In Cloudflare, choose **Add a site**, enter `qjw.de5.net`, select **Free**, and copy the two nameservers Cloudflare gives you.
4. In DNSHE, open the domain's **DNS / NS servers** settings, replace the existing nameservers with Cloudflare's two, and save.
5. Wait until `qjw.de5.net` shows **Active** in Cloudflare.
6. Follow steps 5–7 of Option A: add the **Custom Domain** to the Worker, sign in again, and generate a new QR code.

Keep in mind:

- Free domains are normally valid for one year and must be renewed at DNSHE; they can also be reclaimed for policy violations.
- A free domain is fine for testing and transition, but not ideal as the only long-term address. A paid domain is more reliable.
- If Cloudflare refuses to add the domain, that suffix is not currently accepted. Switch to `.de5.net` or use a paid domain.
- Never send your admin password, setup code, or member data to DNSHE support or any public place.

## What changes after binding

### The QR code changes

The group QR code contains the server address (`server=`). After switching domains:

- New QR codes point to the new domain.
- Phones that already joined still store the old address and **do not switch automatically**.
- Keep the old address running until everyone has scanned the new code, or keep it permanently for existing devices.
- If you turn off the `workers.dev` address, existing devices will lose access and must rejoin with a new QR code.

### Sign-in state changes

Admin session cookies are scoped to the hostname. After moving to the new domain, sign in again. That is expected.

### Optional: pin the public origin

Once the new domain works, you can pin the public address. In the Cloudflare dashboard:

**Worker → Settings → Variables and Secrets → Add**:

```text
PUBLIC_ORIGINS = https://qjw.example.com
```

Or uncomment this in `wrangler.jsonc`:

```jsonc
"vars": { "PUBLIC_ORIGINS": "https://qjw.example.com" }
```

What it does:

- QR codes and absolute media links use this address consistently.
- Even if you open the admin through `workers.dev`, the generated QR code points to the new domain.
- It is optional: without it, the current request origin is used.

> Set this only after the new domain actually works. Otherwise the QR code will point to an address that is not live yet.

## Why this cannot be part of the deploy button

The Deploy to Cloudflare button can:

- copy the repository into your GitHub account
- create the D1 database
- deploy the Worker

It cannot:

- register a domain for you
- sign in to DNSHE or your registrar
- change nameservers
- add the domain to your Cloudflare account
- choose which domain you want

Those actions require domain ownership and registrar permissions, which the deploy button does not have. The domain therefore stays an optional step after deployment. A technical volunteer can use the dashboard or Wrangler `routes`; it is a one-time setup.

## Mainland China note

- This self-hosted edition is a Cloudflare **Worker**. Its default free address is `*.workers.dev`, not `*.pages.dev`.
- `workers.dev` is often unreachable in mainland China. A custom domain usually works better.
- A custom domain does not guarantee mainland China availability: Cloudflare's free plan does not promise access quality there, and a domain can still be blocked. If reliable mainland access is a hard requirement, use a domestic server, ICP filing, or a paid acceleration setup.

## Troubleshooting

**Cloudflare stays Pending**

The nameservers are wrong or have not propagated. Check with:

```bash
nslookup -type=NS qjw.example.com
```

You should see Cloudflare's two nameservers. Propagation can take minutes to 24 hours.

**Add Custom Domain says a CNAME already exists**

Delete the existing CNAME record for that hostname in Cloudflare DNS, then add the Custom Domain again.

**522 / 523 / 1016**

First confirm the Worker itself opens on `workers.dev`, then check that the Custom Domain is attached to the correct Worker.

**The certificate does not appear**

Custom Domains request certificates automatically and usually finish in minutes. Confirm the zone is Active and there is no conflicting record.

**The app cannot connect after switching**

The old address inside the QR code no longer works. Generate a new QR code, or keep the old domain running until everyone has rejoined.

## Related

- [README.md](README.md)
- [START-HERE.md](START-HERE.md)
- [DEPLOY_BUTTON.md](DEPLOY_BUTTON.md)
- Cloudflare docs: [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
