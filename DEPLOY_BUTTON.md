# One-click deploy button: release checklist

This page is for maintainers, not group leaders. Leaders should read [START-HERE.md](START-HERE.md).

## Current status

The public repository is live at <https://github.com/davidliuus666/qingjiaowei-selfhost>, and the button has been used successfully in a real Cloudflare account. It created a new repository and a real D1 database.

The clean-account checklist below remains for regression testing. Keep the manual steps as the fallback.

## Common mistake: manual import

Do not use **Workers & Pages → Create → Import a repository**. That path deploys the source repo directly, does not provision D1, and fails at the deploy step. After connecting GitHub, let the button create a new repository; if the name is taken, Cloudflare adds a suffix such as `qingjiaowei-selfhost2` and writes the real D1 ID into that copy's `wrangler.jsonc`.

## Repository requirements

The repository root must be the current `selfhost/` directory, with no extra nesting, and must not be mixed with the app or website (Cloudflare handles monorepos poorly).

It must contain:

- `package.json`
  - `scripts.deploy` = `wrangler deploy`
  - no `build` script (Wrangler bundles TypeScript; a dry-run deploy must not be the build command)
  - `cloudflare.bindings.SETUP_CODE.description` (the button uses it to prompt for the setup code)
- `wrangler.jsonc`
  - D1 binding only
  - `database_id` set to a placeholder that the button replaces
  - no R2; no active `routes` (a commented example is fine; the button cannot bind the user's domain); no hard-coded `PUBLIC_ORIGINS`
- `.dev.vars.example`
  - only a sample `SETUP_CODE`, with a clear instruction to change it
- `src/`
- `README.md` (English default) and `README.zh-CN.md`
- `START-HERE.md` (English default) and `START-HERE.zh-CN.md`
- `DOMAIN.md` (English default) and `DOMAIN.zh-CN.md`
- `LICENSE` (MIT; required before publishing)
- `.gitignore`
  - ignore `node_modules/`, `dist/`, `.wrangler/`, `.dev.vars`

It must never contain:

- production domains
- the production database ID
- `.dev.vars`, admin passwords, or Cloudflare tokens
- `node_modules/`, `dist/`, logs, or temporary files

## Button markup

```markdown
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/davidliuus666/qingjiaowei-selfhost)
```

Official docs: <https://developers.cloudflare.com/workers/platform/deploy-buttons/>

## Why the button cannot bind a custom domain

The button can only manage the Worker and D1 in the user's Cloudflare account. A custom domain requires the hostname to be an active zone in that account, which means the user must change nameservers at their registrar. The button has no registrar permissions and cannot choose a domain for the user. The domain is therefore an optional step after deployment; see [DOMAIN.md](DOMAIN.md). A commented `routes` example may stay in `wrangler.jsonc`, but it must not be active, or the button deployment will bind the wrong hostname or fail.

## Clean-account test checklist

Use an account that has never used Cloudflare Workers, and follow the beginner path:

- [ ] The button signs the user in to Cloudflare / GitHub
- [ ] D1 is created automatically and deployment succeeds without asking for a database ID
- [ ] The Worker has a working URL (enable `workers.dev` if it starts Disabled)
- [ ] `/admin` shows four fields: setup code, group name, password, confirm password
- [ ] A wrong setup code is rejected with a clear message
- [ ] The example setup code is refused with a clear message
- [ ] The correct setup code creates the group and enters the admin
- [ ] The language switch changes the admin and classroom to English, with no leftover Chinese UI text
- [ ] The admin has no media library or upload buttons
- [ ] Series covers show a URL field only
- [ ] A QR code is generated and the app can join by scanning it
- [ ] (Optional) After binding a custom domain, `/admin` opens and the QR code's `server=` uses the new domain
- [ ] Without R2: uploads return 503, `/media` returns 404, and the installer download returns 404
- [ ] Refreshing the page allows signing in again
- [ ] The whole flow needs no terminal, domain, or credit card
- [ ] Timing: under 10 minutes from clicking the button to getting the QR code

## Known limitations (must be in user-facing docs)

- Requires a GitHub account; otherwise use assisted deployment.
- `workers.dev` may be unreachable in mainland China. A custom domain usually helps and is supported after deployment, but the button cannot bind it, and Cloudflare's free plan does not guarantee mainland access quality.
- Free domains from DNSHE (prefer `.de5.net`) are an option for testing or transition, but a paid domain is better for long-term use.
- The button copies the code into the user's repository, so upstream updates do not sync automatically.
- The first edition has no R2 and no automatic upgrades. Custom domains are supported but must be bound after deployment.
- Do not manually import the repository; use the button so D1 is provisioned.
