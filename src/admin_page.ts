export const ADMIN_PAGE_HTML = `<!doctype html>
<html lang="__QJW_LANG_ATTR__">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#0a0a0c" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#f4f6f1" media="(prefers-color-scheme: light)" />
<meta name="robots" content="noindex, nofollow" />
<link rel="icon" type="image/webp" href="/logo.webp?v=20261029" />
<title>__QJW_TITLE__</title>
<script>
(function () {
  try {
    var t = localStorage.getItem('qjw.admin.theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
</script>
<style>
  :root {
    color-scheme: dark;
    --bg: #0a0a0c;
    --panel: #121216;
    --panel-2: #17171c;
    --line: #26262d;
    --line-strong: #393943;
    --text: #f2f2f5;
    --muted: #8d8d98;
    --accent: #8bd450;
    --accent-ink: #0b1606;
    --accent-hover: #9ade62;
    --danger: #ff9b9b;
    --danger-bg: #3a1f22;
    --danger-line: #5a2a30;
    --danger-hover-bg: #48252a;
    --radius: 14px;
    /* 深色下这些是原来的写死颜色；浅色媒体查询里整套换掉 */
    --glow: rgba(139, 212, 80, .10);
    --header-bg: rgba(10, 10, 12, .88);
    --modal-backdrop: rgba(0, 0, 0, .68);
    --modal-bg: #0d0d11;
    --modal-foot-bg: rgba(15, 15, 19, .97);
    --field-bg: #0f0f13;
    --hover-bg: #202027;
    --ghost-hover-bg: #1b1b21;
    --chip-bg: #23232a;
    --surface-raised: #1c1c22;
    --line-soft: #2e2e37;
    --line-hover: #4a4a56;
    --thumb-a: #1e3320;
    --thumb-b: #263c1b;
    --thumb-text: #c8f0a7;
    --badge-on-text: #b6ef8e;
    --badge-off-bg: #241e20;
    --badge-off-line: #3a3033;
    --badge-off-text: #b58e8e;
    --badge-info-text: #a9c4ff;
    --bulk-bg: rgba(21, 27, 18, .96);
    --bulk-hint: #7f8a76;
    --focus-line: #56613f;
    --focus-line-strong: #5a6842;
    --spinner-track: #33333c;
    --empty-icon: #585863;
    --media-shot-bg: #0f0f13;
    --media-tick-bg: rgba(10, 10, 12, .82);
    --invite-code-text: #b8b8c2;
    --warning-bg: #241f13;
    --warning-line: #4a3f22;
    --warning-text: #d8b25a;
    --toast-bg: #1c1c22;
    --toast-err-bg: #2b1b1e;
    --toast-err-line: #5a2a30;
    --toast-err-text: #ffc2c2;
    --placeholder: #6f6f7a;
    --row-meta: #71717d;
    --row-hint: #62626e;
    --footnote: #61616c;
  }
  * { box-sizing: border-box; }
  html, body { min-height: 100%; }
  body {
    margin: 0;
    background:
      radial-gradient(900px 420px at 50% -180px, var(--glow), transparent 70%),
      var(--bg);
    color: var(--text);
    font: 15px/1.55 system-ui, -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif;
  }
  body.modal-open { overflow: hidden; }
  button, input, textarea, select { font: inherit; }
  button { color: inherit; }
  .hidden { display: none !important; }
  .grow { flex: 1; }

  header {
    position: sticky;
    top: 0;
    z-index: 30;
    background: var(--header-bg);
    border-bottom: 1px solid var(--line);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }
  .header-inner {
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 1040px;
    margin: 0 auto;
    padding: 12px 20px;
  }
  .brand-logo {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    object-fit: cover;
  }
  .brand {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: .01em;
    white-space: nowrap;
  }
  .brand span {
    color: var(--muted);
    font-size: 13px;
    font-weight: 500;
    margin-left: 6px;
  }
  .tabs-wrap {
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs-wrap::-webkit-scrollbar { display: none; }
  .tabs {
    display: flex;
    gap: 2px;
    max-width: 1040px;
    margin: 0 auto;
    padding: 0 12px;
  }
  .tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 11px 10px 12px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--muted);
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
  }
  .tab:hover { color: var(--text); }
  .tab.on {
    color: var(--text);
    border-bottom-color: var(--accent);
    font-weight: 650;
  }
  .tab-count {
    min-width: 19px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--chip-bg);
    color: var(--muted);
    font-size: 11px;
    line-height: 19px;
    text-align: center;
  }
  .tab.on .tab-count { background: rgba(139, 212, 80, .16); color: var(--accent); }

  main {
    max-width: 1040px;
    margin: 0 auto;
    padding: 22px 20px 72px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 38px;
    padding: 8px 13px;
    border: 1px solid var(--line-strong);
    border-radius: 11px;
    background: var(--panel-2);
    color: var(--text);
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    transition: background .15s, border-color .15s, opacity .15s;
  }
  .btn:hover { background: var(--hover-bg); border-color: var(--line-hover); }
  .btn:disabled { opacity: .5; cursor: default; }
  .btn.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--accent-ink);
    font-weight: 700;
  }
  .btn.primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
  .btn.ghost { background: transparent; border-color: transparent; color: var(--muted); }
  .btn.ghost:hover { background: var(--ghost-hover-bg); color: var(--text); border-color: transparent; }
  .btn.danger { background: var(--danger-bg); border-color: var(--danger-line); color: var(--danger); }
  .btn.danger:hover { background: var(--danger-hover-bg); }
  .btn.on {
    border-color: rgba(139, 212, 80, .38);
    background: rgba(139, 212, 80, .10);
    color: var(--accent);
  }
  .btn.on:hover { border-color: rgba(139, 212, 80, .58); background: rgba(139, 212, 80, .16); }
  .btn.wide { width: 100%; min-height: 44px; }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .search {
    position: relative;
    flex: 1 1 260px;
    min-width: 180px;
  }
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    display: flex;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
  }
  .search input {
    width: 100%;
    min-height: 40px;
    padding: 9px 12px 9px 37px;
    border: 1px solid var(--line);
    border-radius: 11px;
    background: var(--panel);
    color: var(--text);
    outline: none;
  }
  .search input:focus { border-color: var(--focus-line); box-shadow: 0 0 0 3px rgba(139, 212, 80, .08); }
  .search input::placeholder { color: var(--placeholder); }
  select.filter {
    min-height: 40px;
    padding: 8px 30px 8px 11px;
    border: 1px solid var(--line);
    border-radius: 11px;
    background: var(--panel);
    color: var(--text);
    outline: none;
    cursor: pointer;
  }
  select.filter:focus { border-color: var(--focus-line); }

  .list-meta {
    min-height: 20px;
    margin: 0 2px 8px;
    color: var(--muted);
    font-size: 12.5px;
  }
  .list { display: flex; flex-direction: column; gap: 7px; }
  .home-intro {
    margin: 0 0 14px;
    padding: 13px 15px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--panel);
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
  }
  .home-intro strong { color: var(--text); font-weight: 600; }
  .home-card-row { cursor: default; }
  .home-card-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
  .row {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr) auto;
    align-items: center;
    gap: 13px;
    width: 100%;
    padding: 11px 13px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--panel);
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition: background .15s, border-color .15s, transform .15s;
  }
  .row:hover {
    background: var(--panel-2);
    border-color: var(--line-strong);
  }
  .row:active { transform: scale(.997); }
  .thumb {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    overflow: hidden;
    border-radius: 11px;
    background: linear-gradient(145deg, #1e3320, #263c1b);
    color: var(--thumb-text);
    font-size: 15px;
    font-weight: 700;
  }
  .thumb img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .thumb-mark { position: relative; z-index: 0; }
  .row-main { min-width: 0; }
  .row-title {
    overflow: hidden;
    color: var(--text);
    font-size: 14.5px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .row-sub {
    overflow: hidden;
    margin-top: 2px;
    color: var(--muted);
    font-size: 12.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .row-meta {
    margin-top: 4px;
    color: var(--row-meta);
    font-size: 11.5px;
  }
  .row-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    white-space: nowrap;
  }
  .row-hint { color: var(--row-hint); font-size: 11.5px; }
  .row:hover .row-hint { color: var(--accent); }
  .badge {
    display: inline-flex;
    align-items: center;
    min-height: 21px;
    padding: 1px 8px;
    border: 1px solid var(--line-soft);
    border-radius: 999px;
    background: var(--surface-raised);
    color: var(--muted);
    font-size: 11px;
    line-height: 18px;
  }
  .badge.on { border-color: rgba(139, 212, 80, .28); background: rgba(139, 212, 80, .11); color: var(--badge-on-text); }
  .badge.off { border-color: var(--badge-off-line); background: var(--badge-off-bg); color: var(--badge-off-text); }
  .badge.info { border-color: rgba(122, 166, 255, .25); background: rgba(122, 166, 255, .10); color: var(--badge-info-text); }

  /* ---------------- 批量选择 ---------------- */
  .row.selectable { grid-template-columns: 22px 52px minmax(0, 1fr) auto; }
  .row.selectable.selected {
    border-color: rgba(139, 212, 80, .42);
    background: rgba(139, 212, 80, .06);
  }
  .tick {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 1px solid var(--line-hover);
    border-radius: 6px;
    background: var(--field-bg);
    color: transparent;
    font-size: 12px;
    font-weight: 800;
    line-height: 1;
    transition: background .12s, border-color .12s;
  }
  .tick.on {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--accent-ink);
  }
  .bulkbar {
    position: sticky;
    top: 96px;
    z-index: 20;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 12px;
    padding: 10px 12px;
    border: 1px solid rgba(139, 212, 80, .32);
    border-radius: 13px;
    background: var(--bulk-bg);
    box-shadow: 0 10px 28px rgba(0, 0, 0, .38);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .bulkbar .bulk-count { color: var(--text); font-size: 13px; font-weight: 700; }
  .bulkbar .bulk-hint { color: var(--bulk-hint); font-size: 12px; }
  .bulkbar .btn { min-height: 32px; padding: 5px 10px; font-size: 12.5px; }

  .empty {
    padding: 54px 20px;
    border: 1px dashed var(--line-strong);
    border-radius: 16px;
    color: var(--muted);
    text-align: center;
  }
  .empty-icon {
    margin-bottom: 8px;
    color: var(--empty-icon);
    font-size: 28px;
    line-height: 1;
  }
  .empty p { margin: 0 0 14px; }

  .pager {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 14px;
    color: var(--muted);
    font-size: 12.5px;
  }
  .pager-buttons { display: flex; gap: 6px; }
  .pager .btn { min-height: 32px; padding: 5px 10px; font-size: 12.5px; }

  .group-card {
    padding: 22px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background:
      radial-gradient(500px 220px at 100% 0, rgba(139, 212, 80, .10), transparent 70%),
      var(--panel);
  }
  .group-card h2 { margin: 0 0 5px; font-size: 22px; }
  .group-card .intro { margin: 0; color: var(--muted); font-size: 13.5px; }
  .detail-row {
    display: flex;
    gap: 14px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--line);
    font-size: 13.5px;
  }
  .detail-key { min-width: 60px; color: var(--muted); }
  .group-card .actions { margin-top: 18px; }

  .auth-wrap {
    display: grid;
    place-items: center;
    min-height: 72vh;
    padding: 20px 0;
  }
  .auth-card {
    width: 100%;
    max-width: 400px;
    padding: 26px;
    border: 1px solid var(--line);
    border-radius: 20px;
    background: var(--panel);
    box-shadow: 0 22px 60px rgba(0, 0, 0, .26);
  }
  .auth-logo {
    display: block;
    width: 46px;
    height: 46px;
    margin-bottom: 15px;
    border-radius: 14px;
    object-fit: cover;
  }
  .auth-card h1 { margin: 0 0 6px; font-size: 21px; }
  .auth-card .hint { margin: 0 0 18px; color: var(--muted); font-size: 13px; line-height: 1.6; }
  .field { display: block; margin-top: 12px; }
  .field-label { display: block; margin-bottom: 5px; color: var(--muted); font-size: 12.5px; }
  .auth-form input,
  .modal input[type=text],
  .modal input[type=number],
  .modal input[type=datetime-local],
  .modal input[type=time],
  .modal input[type=password],
  .modal textarea,
  .modal select,
  .editor-page input[type=text],
  .editor-page input[type=number],
  .editor-page input[type=datetime-local],
  .editor-page input[type=time],
  .editor-page textarea,
  .editor-page select {
    width: 100%;
    padding: 9px 11px;
    border: 1px solid var(--line-strong);
    border-radius: 10px;
    background: var(--field-bg);
    color: var(--text);
    outline: none;
  }
  .auth-form input { min-height: 42px; }
  .auth-form input:focus,
  .modal input:focus,
  .modal textarea:focus,
  .modal select:focus,
  .editor-page input:focus,
  .editor-page textarea:focus,
  .editor-page select:focus {
    border-color: var(--focus-line-strong);
    box-shadow: 0 0 0 3px rgba(139, 212, 80, .08);
  }
  .auth-form .btn { margin-top: 18px; }
  .form-error { min-height: 18px; margin: 10px 0 0; color: var(--danger); font-size: 12.5px; }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 40vh;
    color: var(--muted);
    font-size: 13.5px;
  }
  .spinner {
    width: 17px;
    height: 17px;
    border: 2px solid var(--spinner-track);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 24px 16px;
    overflow-y: auto;
    background: var(--modal-backdrop);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
  .confirm-backdrop { z-index: 80; align-items: center; }
  .confirm-card {
    width: min(380px, 100%);
    margin: auto;
    padding: 22px;
    border: 1px solid var(--line-strong);
    border-radius: 18px;
    background: var(--modal-bg);
    box-shadow: 0 30px 90px rgba(0, 0, 0, .48);
  }
  .confirm-card h2 { margin: 0 0 8px; font-size: 17px; }
  .confirm-text { margin: 0; color: var(--muted); font-size: 13.5px; line-height: 1.65; }
  .confirm-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
  .modal {
    width: min(660px, 100%);
    margin: auto 0;
    overflow: hidden;
    border: 1px solid var(--line-strong);
    border-radius: 19px;
    background: var(--modal-bg);
    box-shadow: 0 30px 90px rgba(0, 0, 0, .48);
  }
  .modal-head {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 17px 20px 13px;
    border-bottom: 1px solid var(--line);
    background: var(--modal-bg);
  }
  .modal-head h2 { margin: 0; font-size: 17px; }
  .modal-sub { margin-top: 3px; color: var(--muted); font-size: 12px; }
  .icon-btn {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    margin-left: auto;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: var(--muted);
    font-size: 21px;
    line-height: 1;
    cursor: pointer;
  }
  .icon-btn:hover { background: var(--hover-bg); color: var(--text); }
  .modal-body { padding: 5px 20px 18px; }
  .modal-body .field { margin-top: 13px; }
  .modal label.check-row,
  .editor-page label.check-row {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-top: 16px;
    padding: 11px 12px;
    border: 1px solid var(--line);
    border-radius: 11px;
    background: var(--panel);
    color: var(--text);
    font-size: 13.5px;
    cursor: pointer;
  }
  .check-row input { width: 17px; height: 17px; accent-color: var(--accent); }
  .modal-foot {
    position: sticky;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 13px 20px;
    border-top: 1px solid var(--line);
    background: var(--field-bg);
  }
  .modal-foot .spacer { flex: 1; }

  /* ---------------- 整页编辑（不是弹窗，不会点到外面就关掉） ---------------- */
  .editor-page {
    border: 1px solid var(--line);
    border-radius: 18px;
    background: var(--panel);
    /* 不能 overflow:hidden，否则底部保存栏的 sticky 会失效 */
  }
  .editor-head {
    border-radius: 18px 18px 0 0;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 18px 14px;
    border-bottom: 1px solid var(--line);
    background: var(--panel);
  }
  .editor-head h2 { margin: 0; font-size: 19px; }
  .editor-sub { margin-top: 3px; color: var(--muted); font-size: 12.5px; }
  .editor-back {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 34px;
    padding: 5px 11px;
    border: 1px solid var(--line-strong);
    border-radius: 9px;
    background: var(--panel-2);
    color: var(--text);
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
  }
  .editor-back:hover { background: var(--hover-bg); }
  .editor-body { padding: 4px 18px 20px; }
  .editor-body .field { margin-top: 14px; }
  .editor-dirty {
    margin-left: auto;
    padding-top: 8px;
    color: var(--warning-text);
    font-size: 12px;
    white-space: nowrap;
  }
  .editor-foot {
    position: sticky;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 18px;
    border-top: 1px solid var(--line);
    border-radius: 0 0 18px 18px;
    background: var(--modal-foot-bg);
  }
  .editor-foot .spacer { flex: 1; }
  .series-episodes {
    margin: 0 18px;
    padding: 18px 0 22px;
    border-top: 1px solid var(--line);
  }
  .series-ep-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .series-ep-head h3 { margin: 0; font-size: 15px; }
  .series-ep-head .count { color: var(--muted); font-size: 12.5px; }
  .series-ep-head .grow { flex: 1; }
  .series-ep-empty {
    margin: 0 0 14px;
    color: var(--muted);
    font-size: 13px;
  }
  .upload-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 10px;
    margin-top: 8px;
    color: var(--muted);
    font-size: 12px;
  }
  .upload-row input[type=file] {
    max-width: 220px;
    color: var(--muted);
    font-size: 12px;
  }
  .upload-preview { margin-top: 8px; }
  .upload-preview img {
    display: block;
    max-width: 100%;
    max-height: 180px;
    border-radius: 10px;
    object-fit: cover;
  }

  /* ---------------- 图片库 ---------------- */
  .btn.mini {
    min-height: 30px;
    padding: 4px 9px;
    border-radius: 8px;
    font-size: 12px;
  }
  .media-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 14px;
  }
  .media-toolbar .list-meta { margin: 0; }
  .media-toolbar .search { flex: 1 1 240px; }
  .media-hint { color: var(--muted); font-size: 12px; }
  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 11px;
  }
  .media-card {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 13px;
    background: var(--panel-2);
    transition: border-color .15s, box-shadow .15s, transform .15s;
  }
  .media-card.selectable { cursor: pointer; }
  .media-card.selectable:hover { border-color: var(--line-strong); }
  .media-card.selected {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(139, 212, 80, .14);
  }
  .media-tick {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 3;
    background: var(--media-tick-bg);
    backdrop-filter: blur(4px);
  }
  .media-card .shot {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    background: var(--field-bg);
  }
  .media-card .meta { padding: 8px 10px 10px; min-width: 0; }
  .media-card .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12.5px;
  }
  .media-card .sub {
    margin-top: 2px;
    color: var(--muted);
    font-size: 11px;
  }
  .media-actions { display: flex; gap: 6px; margin-top: 8px; }
  .media-pick .media-card {
    cursor: pointer;
    transition: border-color .15s, transform .15s;
  }
  .media-pick .media-card:hover {
    border-color: var(--accent);
    transform: translateY(-1px);
  }
  .media-empty {
    margin-top: 8px;
    padding: 38px 16px;
    border: 1px dashed var(--line-strong);
    border-radius: 14px;
    color: var(--muted);
    font-size: 13px;
    text-align: center;
  }
  .picker-backdrop { z-index: 80; }
  .picker-card { width: min(900px, 100%); }
  .picker-search { padding: 12px 20px 0; }
  .picker-search .search { flex: none; }
  .picker-search .search input { background: var(--modal-bg); }
  .picker-card .modal-body {
    max-height: min(64vh, 620px);
    overflow: auto;
  }
  /* ---------------- 安全 / 设备 ---------------- */
  .access-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 780px;
  }
  .access-card {
    padding: 20px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: var(--panel);
  }
  .access-card h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  }
  .access-lead {
    margin: 6px 0 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.6;
  }
  .access-form {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 15px;
  }
  .access-form input {
    flex: 1 1 220px;
    min-height: 40px;
    padding: 9px 12px;
    border: 1px solid var(--line);
    border-radius: 11px;
    background: var(--modal-bg);
    color: var(--text);
    outline: none;
  }
  .access-form input:focus { border-color: var(--focus-line); box-shadow: 0 0 0 3px rgba(139, 212, 80, .08); }
  .invite-result {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid var(--line);
  }
  .invite-qr {
    flex: 0 0 190px;
    width: 190px;
    padding: 10px;
    border-radius: 14px;
    background: #fff;
  }
  .invite-qr svg { display: block; width: 100%; height: auto; }
  .invite-detail { flex: 1 1 250px; min-width: 0; }
  .invite-detail strong { display: block; font-size: 14px; }
  .invite-detail .access-lead { margin-top: 4px; }
  .invite-link {
    margin: 10px 0;
    padding: 10px 12px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--modal-bg);
    color: var(--invite-code-text);
    font: 12px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace;
    word-break: break-all;
  }
  .invite-actions { display: flex; flex-wrap: wrap; gap: 8px; }
  .invite-share { margin-top: 12px; }
  .invite-share strong { display: block; font-size: 13px; }
  .invite-share-text {
    box-sizing: border-box;
    width: 100%;
    min-height: 112px;
    margin: 8px 0;
    padding: 10px 12px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--modal-bg);
    color: var(--text);
    font: 12px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace;
    resize: vertical;
  }
  .access-warning {
    margin-top: 12px;
    padding: 9px 11px;
    border: 1px solid var(--warning-line);
    border-radius: 10px;
    background: var(--warning-bg);
    color: var(--warning-text);
    font-size: 12px;
    line-height: 1.55;
  }
  /* ---------------- 自动同步 ---------------- */
  .sync-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 14px 0 4px;
    padding: 13px 14px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--panel-2);
  }
  .sync-line { display: flex; gap: 12px; align-items: baseline; }
  .sync-label { flex: 0 0 84px; color: var(--muted); font-size: 12.5px; }
  .sync-value {
    flex: 1;
    min-width: 0;
    color: var(--text);
    font-size: 13px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
  .device-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 14px;
  }
  .device-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 13px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--panel-2);
  }
  .device-dot {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    border-radius: 10px;
    background: rgba(139, 212, 80, .10);
    color: var(--accent);
  }
  .device-dot svg { width: 20px; height: 20px; }
  .device-main { flex: 1; min-width: 0; }
  .device-name {
    overflow: hidden;
    font-size: 13.5px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .device-sub { margin-top: 2px; color: var(--muted); font-size: 11.5px; }
  .access-empty {
    margin-top: 14px;
    padding: 28px 16px;
    border: 1px dashed var(--line-strong);
    border-radius: 12px;
    color: var(--muted);
    font-size: 13px;
    text-align: center;
  }
  .muted { color: var(--muted); }
  .footnote {
    margin: 28px 2px 0;
    color: var(--footnote);
    font-size: 12px;
  }
  .toast {
    position: fixed;
    left: 50%;
    bottom: 26px;
    z-index: 100;
    max-width: min(520px, calc(100vw - 32px));
    padding: 10px 15px;
    border: 1px solid var(--line-strong);
    border-radius: 12px;
    background: var(--surface-raised);
    color: var(--text);
    font-size: 13.5px;
    box-shadow: 0 12px 34px rgba(0, 0, 0, .38);
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, 10px);
    transition: opacity .18s, transform .18s;
  }
  .toast.show { opacity: 1; transform: translate(-50%, 0); }
  .toast.err { border-color: var(--danger-line); background: var(--toast-err-bg); color: var(--toast-err-text); }

  @media (max-width: 620px) {
    .header-inner { padding: 10px 10px; gap: 5px; }
    .header-inner .btn.ghost { padding: 8px 10px; }
    .brand span { display: none; }
    .brand { font-size: 15px; }
    .tabs { padding: 0 8px; }
    main { padding: 16px 14px 64px; }
    .row { grid-template-columns: 44px minmax(0, 1fr) auto; gap: 11px; padding: 10px; }
    .row.selectable { grid-template-columns: 20px 44px minmax(0, 1fr) auto; gap: 9px; }
    .bulkbar { top: 90px; }
    .thumb { width: 44px; height: 44px; border-radius: 10px; }
    .row-meta { display: none; }
    .row-hint { display: none; }
    .toolbar { gap: 7px; }
    .search { flex-basis: 100%; }
    .toolbar > .btn.primary { margin-left: auto; }
    .modal-backdrop { padding: 0; }
    .modal {
      width: 100%;
      min-height: 100%;
      margin: 0;
      border: 0;
      border-radius: 0;
    }
    .modal-body { padding-bottom: 26px; }
    .editor-head { padding: 13px 13px 12px; }
    .editor-head h2 { font-size: 17px; }
    .editor-body { padding: 4px 13px 18px; }
    .editor-foot { padding: 10px 13px; }
  }

  /* 英文按钮比中文长，窄屏先收起刷新；再窄就把品牌字收起来，只留 logo */
  @media (max-width: 470px) {
    #refresh { display: none !important; }
  }
  @media (max-width: 340px) {
    .brand { display: none !important; }
  }

  /* 跟随系统：白天用浅色，晚上回深色；手动选深色时这段不生效 */
  @media (prefers-color-scheme: light) {
    :root:not([data-theme="dark"]) {
      color-scheme: light;
      --bg: #f4f6f1;
      --panel: #ffffff;
      --panel-2: #eef2ea;
      --line: #dde2d7;
      --line-strong: #c8d0c1;
      --text: #171a15;
      --muted: #646b60;
      --accent: #3f7a22;
      --accent-ink: #ffffff;
      --accent-hover: #35691b;
      --danger: #b3261e;
      --danger-bg: #fdeceb;
      --danger-line: #e3b4b0;
      --danger-hover-bg: #f8dedb;
      --glow: rgba(76, 143, 43, .06);
      --header-bg: rgba(255, 255, 255, .88);
      --modal-backdrop: rgba(20, 26, 18, .35);
      --modal-bg: #ffffff;
      --modal-foot-bg: #f7f8f5;
      --field-bg: #f7f8f5;
      --hover-bg: #eef2ea;
      --ghost-hover-bg: #eef2ea;
      --chip-bg: #e7ebe2;
      --surface-raised: #ffffff;
      --line-soft: #e0e5db;
      --line-hover: #b9c4b2;
      --thumb-a: #dfeadd;
      --thumb-b: #cfe3c8;
      --thumb-text: #2f5d1c;
      --badge-on-text: #2f5d1c;
      --badge-off-bg: #f2eeee;
      --badge-off-line: #e0d3d3;
      --badge-off-text: #8a5a5a;
      --badge-info-text: #2e5f9e;
      --bulk-bg: rgba(236, 244, 232, .97);
      --bulk-hint: #5f6a59;
      --focus-line: #6f9a55;
      --focus-line-strong: #5f8a47;
      --spinner-track: #d8dfd2;
      --empty-icon: #a7b0a0;
      --media-shot-bg: #eef2ea;
      --media-tick-bg: rgba(255, 255, 255, .86);
      --invite-code-text: #3d4439;
      --warning-bg: #fff5dd;
      --warning-line: #e8cf9a;
      --warning-text: #8a5a00;
      --toast-bg: #ffffff;
      --toast-err-bg: #fdeceb;
      --toast-err-line: #e3b4b0;
      --toast-err-text: #b3261e;
      --placeholder: #7a8175;
      --row-meta: #6f776b;
      --row-hint: #6f776b;
      --footnote: #6f776b;
    }
    .auth-card,
    .confirm-card,
    .modal,
    .toast {
      box-shadow: 0 18px 50px rgba(27, 38, 24, .10);
    }
    .invite-qr { border: 1px solid var(--line); }
  }

  /* 手动选浅色：系统是深色时也要覆盖 */
  :root[data-theme="light"] {
    color-scheme: light;
    --bg: #f4f6f1;
    --panel: #ffffff;
    --panel-2: #eef2ea;
    --line: #dde2d7;
    --line-strong: #c8d0c1;
    --text: #171a15;
    --muted: #646b60;
    --accent: #3f7a22;
    --accent-ink: #ffffff;
    --accent-hover: #35691b;
    --danger: #b3261e;
    --danger-bg: #fdeceb;
    --danger-line: #e3b4b0;
    --danger-hover-bg: #f8dedb;
    --glow: rgba(76, 143, 43, .06);
    --header-bg: rgba(255, 255, 255, .88);
    --modal-backdrop: rgba(20, 26, 18, .35);
    --modal-bg: #ffffff;
    --modal-foot-bg: #f7f8f5;
    --field-bg: #f7f8f5;
    --hover-bg: #eef2ea;
    --ghost-hover-bg: #eef2ea;
    --chip-bg: #e7ebe2;
    --surface-raised: #ffffff;
    --line-soft: #e0e5db;
    --line-hover: #b9c4b2;
    --thumb-a: #dfeadd;
    --thumb-b: #cfe3c8;
    --thumb-text: #2f5d1c;
    --badge-on-text: #2f5d1c;
    --badge-off-bg: #f2eeee;
    --badge-off-line: #e0d3d3;
    --badge-off-text: #8a5a5a;
    --badge-info-text: #2e5f9e;
    --bulk-bg: rgba(236, 244, 232, .97);
    --bulk-hint: #5f6a59;
    --focus-line: #6f9a55;
    --focus-line-strong: #5f8a47;
    --spinner-track: #d8dfd2;
    --empty-icon: #a7b0a0;
    --media-shot-bg: #eef2ea;
    --media-tick-bg: rgba(255, 255, 255, .86);
    --invite-code-text: #3d4439;
    --warning-bg: #fff5dd;
    --warning-line: #e8cf9a;
    --warning-text: #8a5a00;
    --toast-bg: #ffffff;
    --toast-err-bg: #fdeceb;
    --toast-err-line: #e3b4b0;
    --toast-err-text: #b3261e;
    --placeholder: #7a8175;
    --row-meta: #6f776b;
    --row-hint: #6f776b;
    --footnote: #6f776b;
  }
  :root[data-theme="light"] .auth-card,
  :root[data-theme="light"] .confirm-card,
  :root[data-theme="light"] .modal,
  :root[data-theme="light"] .toast {
    box-shadow: 0 18px 50px rgba(27, 38, 24, .10);
  }
  :root[data-theme="light"] .invite-qr { border: 1px solid var(--line); }
</style>
</head>
<body>
<header>
  <div class="header-inner">
    <img class="brand-logo" src="/logo.webp?v=20261029" alt="青椒味" width="26" height="26" />
    <div class="brand">青椒味<span>管理后台</span></div>
    <span class="grow"></span>
    <button id="lang" class="btn ghost hidden" type="button">English</button>
    <button id="theme" class="btn ghost" type="button" title="切换管理后台外观">跟随系统</button>
    <button id="refresh" class="btn ghost hidden" type="button">刷新</button>
    <button id="account" class="btn ghost hidden" type="button">账号</button>
    <button id="logout" class="btn ghost hidden" type="button">退出</button>
  </div>
  <div id="tabs" class="tabs-wrap"></div>
</header>
<main id="app"><p class="loading"><span class="spinner"></span>__QJW_LOADING__</p></main>
<script>
(function () {
  'use strict';

  // 服务端把 __QJW_LANG__ 换成 en / zh；默认保持中文。
  var LANG = '__QJW_LANG__' === 'en' ? 'en' : 'zh';
  var IS_EN = LANG === 'en';
  if (IS_EN) {
    document.documentElement.lang = 'en';
    document.title = 'QJW · Admin';
  }

  // 首次设置 / 登录页的文案；其余栏目由下面的 EN 字典统一翻译。
  var A = IS_EN ? {
    langSwitch: '中文',
    alt: 'QJW',
    setupTitle: 'First time here: set up your group',
    setupHint: 'Enter your group name and an admin password. The setup code is the one you entered when deploying; it works only once.',
    setupCode: 'Setup code',
    setupCodePlaceholder: 'The code from deployment',
    groupName: 'Group name',
    groupNamePlaceholder: 'e.g. QJW Group',
    password: 'Admin password (at least 8 characters)',
    passwordPlaceholder: 'Choose a password',
    passwordAgain: 'Type it again',
    passwordAgainPlaceholder: 'Type it again',
    setupButton: 'Set up and start',
    loginTitle: 'Back to admin',
    loginHint: 'For leaders only. Enter your password to manage announcements, meetings, prayer requests, and classes.',
    loginPassword: 'Admin password',
    loginPasswordPlaceholder: 'Enter password',
    loginButton: 'Log in',
    codeRequired: 'Enter the setup code',
    groupRequired: 'Enter the group name',
    passwordShort: 'Password must be at least 8 characters',
    passwordMismatch: 'The two passwords do not match',
    setupDone: 'All set. You can start now.',
    welcomeBack: 'Welcome back'
  } : {
    langSwitch: 'English',
    alt: '青椒味',
    setupTitle: '第一次使用：把小组开起来',
    setupHint: '先填小组名称和管理员密码。部署设置码是部署时填的那串字，只用这一次；设完管理员密码后就失效。',
    setupCode: '部署设置码',
    setupCodePlaceholder: '部署时填的那串字',
    groupName: '小组名称',
    groupNamePlaceholder: '例如：青椒味小组',
    password: '管理员密码（至少 8 位）',
    passwordPlaceholder: '想一个密码',
    passwordAgain: '再输一次',
    passwordAgainPlaceholder: '再输一次',
    setupButton: '设置并开始使用',
    loginTitle: '回到后台',
    loginHint: '只给自己人用：输密码进后台，发公告、改聚会信息、发祷告事项、管理课堂。',
    loginPassword: '管理员密码',
    loginPasswordPlaceholder: '输入密码',
    loginButton: '登录',
    codeRequired: '请填部署设置码',
    groupRequired: '请填小组名称',
    passwordShort: '密码至少 8 位',
    passwordMismatch: '两次输入的密码不一样',
    setupDone: '设置好了，可以开始用了',
    welcomeBack: '欢迎回来'
  };

  // 后台其余栏目的英文文案。动态的条数、分页等由下面的 tr() 统一处理。
  var EN = {
    '首页': 'Home',
    '卡片': 'Card',
    '首页卡片': 'Home cards',
    '公告': 'Announcements',
    '聚会': 'Meetings',
    '轮播图': 'Carousel',
    '系列': 'Series',
    '单集': 'Episodes',
    '祷告事项': 'Prayer requests',
    '小组信息': 'Group info',
    '图片库': 'Media library',
    '安全': 'Access',
    '自动同步': 'Auto sync',
    '课堂': 'Classroom',

    '卡片类型': 'Card type',
    '参加聚会': 'Join meeting',
    '本周公告': 'This week’s announcement',
    '选择哪场聚会': 'Choose a meeting',
    '选择哪条公告': 'Choose an announcement',
    '（已隐藏）': ' (hidden)',
    '卡片标题（留空自动）': 'Card title (auto if empty)',
    '留空：聚会卡显示「参加聚会」，公告卡显示公告标题': 'Leave empty to show “Join meeting” on meeting cards, or the announcement title on announcement cards.',
    '卡片背景图（留空用内容自己的图）': 'Card background (empty = the content image)',
    '公告卡片': 'Announcement card',
    '聚会卡片': 'Meeting card',
    '首': 'H',
    '告': 'A',
    '会': 'M',

    '标题': 'Title',
    '例如：本周公告': 'e.g. This week’s announcement',
    '摘要（首页卡片副标题）': 'Summary (home card subtitle)',
    '一句话说清楚': 'One line is enough',
    '正文（空行分段）': 'Body (blank line starts a paragraph)',
    '背景图（首页「本周公告」卡片，可留空）': 'Background image (home announcement card; optional)',
    '发布时间（留空表示现在）': 'Publish time (empty = now)',
    '前台显示': 'Show in app',
    '（未命名公告）': '(Untitled announcement)',
    '已发布': 'Published',
    '隐藏': 'Hidden',
    '显示中': 'Visible',
    '显示': 'Show',

    '聚会主题': 'Meeting topic',
    '例如：腓立比书 第二章': 'e.g. Philippians 2',
    '经文': 'Scripture',
    '带领人': 'Leader',
    '背景图（首页「参加聚会」卡片，可留空）': 'Background image (home meeting card; optional)',
    '聚会方式': 'Meeting mode',
    '线下': 'In person',
    '线上': 'Online',
    '线上线下同步进行': 'Hybrid',
    '每周重复（固定周几、几点，设一次一直用）': 'Repeat weekly (set the day and time once)',
    '每周几': 'Day of week',
    '周一': 'Mon',
    '周二': 'Tue',
    '周三': 'Wed',
    '周四': 'Thu',
    '周五': 'Fri',
    '周六': 'Sat',
    '周日': 'Sun',
    '开始时间（北京时间）': 'Start time (Beijing time)',
    '结束时间（北京时间）': 'End time (Beijing time)',
    '开始时间（北京时间，只办这一次）': 'Start time (Beijing time, one-off)',
    '结束时间（北京时间，留空默认 2 小时）': 'End time (Beijing time, empty = 2 hours)',
    '线下地点': 'Location',
    'Zoom 会议链接（整段粘贴，带密码也可以）': 'Zoom link (paste the whole invitation, password included)',
    '手动开放线上入口（临时改时间时用）': 'Manually open the online room (for schedule changes)',
    '（未命名聚会）': '(Untitled meeting)',

    '图片': 'Image',
    '点击后跳转的链接（可留空）': 'Link when tapped (optional)',
    '排序（数字小的在前）': 'Sort order (smallest first)',
    '排序（数字小的在前；留 0 表示不指定，按添加时间最新的在前）': 'Sort order (smallest first; 0 = newest first)',
    '排序': 'Sort order',
    '还没有上传图片': 'No image uploaded yet',
    '轮播图': 'Carousel',
    '图': 'C',

    '系列名': 'Series name',
    '副标题': 'Subtitle',
    '封面图': 'Cover image',
    '封面占位字（没图时显示，一个汉字最好）': 'Cover placeholder (shown without an image; one character works best)',
    '分类': 'Category',
    '普通': 'Regular',
    '特别': 'Special',
    '生命河': 'Life River',
    '（未命名系列）': '(Untitled series)',
    '系': 'S',

    '第几讲': 'Lesson number',
    '讲员': 'Speaker',
    '时长（直接填数字，自动补「分钟」）': 'Duration (enter minutes only)',
    '例如：38': 'e.g. 38',
    '简介': 'Description',
    '资料链接': 'Handout link',
    'PPT / 讲义等网页链接，填了 App 本讲简介下面就能直接看': 'PPT or handout URL. It opens below the description in the app.',
    '封面图（列表里的缩略图，留空就用系列封面）': 'Cover (list thumbnail; empty = series cover)',
    '音视频类型': 'Media type',
    '没有': 'None',
    'YouTube 链接': 'YouTube link',
    '视频直链': 'Video URL',
    '音频直链': 'Audio URL',
    '音视频地址': 'Media URL',
    '（未命名单集）': '(Untitled episode)',
    '含资料': 'Handout',
    '无音视频': 'No media',
    '集': 'E',

    '代祷人': 'Requested by',
    '祷告内容': 'Prayer request',
    '时间（留空表示现在）': 'Time (empty = now)',
    '（空内容）': '(Empty)',
    '代祷人：': 'Requested by: ',
    '祷': 'P',

    '一句话简介': 'Short description',
    '小组名称': 'Group name',
    '组织': 'Organization',
    'App 默认外观（手机没单独选过时用）': 'Default app appearance (until changed on the phone)',
    '跟随手机系统': 'Follow system',
    '浅色': 'Light',
    '深色': 'Dark',
    '跟随系统': 'Follow system',

    '首页卡片在「轮播图」栏目里管理。这里决定轮播下面显示哪些卡片：可以加卡片、选具体哪场聚会或哪条公告，也能上移 / 下移调整顺序。': 'The carousel is managed under Carousel. Here you choose which cards appear below it: add cards, pick a specific meeting or announcement, and reorder them.',
    ' 轮播图在「轮播图」栏目里管理。这里决定轮播下面显示哪些卡片：可以加卡片、选具体哪场聚会或哪条公告，也能上移 / 下移调整顺序。': ' The carousel is managed under Carousel. Here you choose which cards appear below it: add cards, pick a specific meeting or announcement, and reorder them.',
    '+ 新增卡片': '+ Add card',
    '还没有配置首页卡片。App 现在按默认显示最近一场聚会和最新公告；加一张卡片后，首页就只显示你配的这些。': 'No home cards configured. The app currently shows the next meeting and latest announcement by default. Once you add a card, only the cards you configure appear.',
    '+ 新增第一张卡片': '+ Add first card',
    '提示：公告设成「隐藏」后，这张卡片在 App 里会自动不显示；改回发布就会恢复。删除卡片不会删掉对应的聚会或公告。': 'Tip: hiding an announcement also hides its card in the app. Publishing it again restores the card. Deleting a card does not delete the meeting or announcement.',
    '↑ 上移': '↑ Move up',
    '↓ 下移': '↓ Move down',
    '排序失败': 'Could not reorder',
    '编辑': 'Edit',
    '删除这张首页卡片？': 'Delete this home card?',
    '只是从首页移除，不会删掉对应的聚会或公告。': 'This only removes the card from the home page. The meeting or announcement stays.',
    '删除中…': 'Deleting…',
    '已删除': 'Deleted',
    '内容已删除': 'Content deleted',
    '公告已隐藏': 'Announcement hidden',
    '参加聚会（内容已删除）': 'Join meeting (content deleted)',
    '公告（内容已删除）': 'Announcement (content deleted)',
    '这条公告已经删掉了': 'This announcement was deleted',
    '已隐藏，App 不显示': 'Hidden in the app',
    '这场聚会已经删掉了': 'This meeting was deleted',

    '搜索': 'Search',
    '按显示状态筛选': 'Filter by visibility',
    '全部状态': 'All statuses',
    '批量管理': 'Bulk actions',
    '✓ 完成选择': '✓ Done',
    '勾选后一起处理': 'Select items to act on them together',
    '系列下面的单集也会一起删掉，不能恢复。': 'Episodes in this series will also be deleted. This cannot be undone.',
    '删除后不能恢复。': 'This cannot be undone.',
    '全选': 'Select all',
    '设为发布': 'Publish',
    '设为隐藏': 'Hide',
    '加载中…': 'Loading…',
    '正在加载…': 'Loading…',
    '读取失败，请稍后再试': 'Could not load. Try again.',
    '再试一次': 'Try again',
    '（未命名）': '(Untitled)',
    '勾选': 'Select',
    '编辑 ›': 'Edit ›',
    '清除搜索和筛选': 'Clear search and filters',
    '上一页': 'Previous',
    '下一页': 'Next',
    '还没有写小组名称': 'No group name yet',
    '还没有写简介。': 'No description yet.',
    '未填写': 'Not set',
    '编辑小组信息': 'Edit group info',
    '（不属于任何系列）': '(No series)',
    '还没有可选内容': 'Nothing to choose yet',
    '/media/... 或者外部图片链接': '/media/... or an external image URL',
    '自动转 WebP': 'Converts to WebP',
    '上传好了，记得保存': 'Uploaded. Remember to save.',
    '上传失败': 'Upload failed',
    '这个版本不开文件上传，请填外部图片直链（https://…）': 'File uploads are off in this edition. Paste a direct image URL (https://…).',
    '取消': 'Cancel',
    '关闭': 'Close',
    '放弃未保存的修改？': 'Discard unsaved changes?',
    '这一页还有没保存的内容，离开后这些修改就没了。': 'This page has unsaved changes. They will be lost if you leave.',
    '放弃修改': 'Discard changes',
    '这个系列的单集': 'Episodes in this series',
    '+ 新增单集': '+ Add episode',
    '还没有单集，点右上角「新增单集」添加。': 'No episodes yet. Use “Add episode” in the top right.',
    '单集读取失败': 'Could not load episodes',
    '← 返回系列': '← Back to series',
    '← 返回列表': '← Back to list',
    '新增': 'Add',
    '填好后点下面的「保存」。这是整页编辑，点到旁边不会关掉。': 'Fill in the fields, then select Save below. This is a full-page editor and will not close if you click away.',
    '有未保存的修改': 'Unsaved changes',
    '删除后不能恢复，这个系列下面的单集也会一起删除。': 'This cannot be undone. Episodes in this series will also be deleted.',
    '返回系列': 'Back to series',
    '返回列表': 'Back to list',
    '保存': 'Save',
    '保存中…': 'Saving…',
    '已新增': 'Added',
    '已保存': 'Saved',

    '账号': 'Account',
    '修改管理员密码，其他设备会退出登录。': 'Change the admin password. Other devices will be signed out.',
    '现在的密码': 'Current password',
    '至少 8 位': 'At least 8 characters',
    '新密码（至少 8 位）': 'New password (at least 8 characters)',
    '再输一次新密码': 'Type the new password again',
    '修改密码': 'Change password',
    '新密码至少 8 位': 'New password must be at least 8 characters',
    '两次输入的新密码不一样': 'The new passwords do not match',
    '修改中…': 'Changing…',
    '密码改好了，其他设备需要重新登录': 'Password changed. Other devices must sign in again.',
    '现在的密码不对': 'The current password is incorrect',
    '会话密钥没配置好': 'Session secret is not configured',
    '正在读取内容…': 'Loading content…',
    '图片库也能按文件名搜索。': 'You can also search the media library by file name.',
    '这个版本用外链图片和音视频。': 'This edition uses external image, audio, and video URLs.',
    '改完的内容保存后立即生效。': 'Saved changes take effect immediately.',
    '已刷新': 'Refreshed',
    '已退出': 'Signed out',
    '读取图片库失败': 'Could not load the media library',
    '登录已过期，请重新登录': 'Your session expired. Sign in again.',
    '链接已复制': 'Link copied',
    '复制这个链接': 'Copy this link',
    '浏览器读不了这个图片格式，换 JPG / PNG 再试': 'This browser cannot read that image format. Try JPG or PNG.',
    '转 WebP 失败，换一张图试试': 'Could not convert to WebP. Try another image.',
    '这个浏览器不支持转 WebP，请用 Chrome / Edge 打开后台': 'This browser cannot convert to WebP. Use Chrome or Edge.',
    '搜索图片文件名…': 'Search image file names…',
    '搜索图片文件名': 'Search image file names',
    '+ 上传图片': '+ Upload image',
    '正在转 WebP 并上传…': 'Converting to WebP and uploading…',
    '图片已上传': 'Image uploaded',
    '勾选图片后可以一起删除': 'Select images to delete them together',
    '会从 R2 真正删掉，不能恢复。': 'This permanently deletes from R2 and cannot be undone.',
    '删除所选': 'Delete selected',
    '清空': 'Clear',
    '正在读取图片库…': 'Loading media library…',
    '图片库还是空的。点右上角「上传图片」，传一次以后就能在公告、聚会、系列、轮播图里反复选用。': 'The media library is empty. Use “Upload image” in the top right once, then reuse the image in announcements, meetings, series, and the carousel.',
    '清除搜索': 'Clear search',
    '以后改公告、聚会、系列或轮播图时，图片那一栏点「从图片库选择」就能直接用这里的图。图片多的时候可以用上面的搜索找文件名，或者点「批量管理」一次删除多张。': 'When editing an announcement, meeting, series, or carousel slide, choose “Choose from library” to reuse an image. With many images, search by file name or use “Bulk actions” to delete several at once.',
    '点击选用': 'Use this image',
    '复制链接': 'Copy link',
    '删除': 'Delete',
    '真删除': 'Delete permanently',
    '图片已删除': 'Image deleted',
    '从图片库选择': 'Choose from library',
    '上传过一次的图都在这里，点一下就填进当前表单。': 'Images you have uploaded appear here. Select one to fill the current form.',
    '图片库还没有图。关掉这里，用图片栏下面的「上传」传一张，之后就能反复选用。': 'The media library is empty. Close this and use Upload below the image field, then reuse the image later.',
    '已选好图片，记得保存': 'Image selected. Remember to save.',

    '生命河主日讲道 · 自动同步': 'Life River Sunday sermon · Auto sync',
    '每周一北京时间 21:00 自动去 ROLCC 的主日讲道页面检查一次。有新的一期就自动加进「生命河」分类；只加新的，不会覆盖你改过的内容。': 'Every Monday at 21:00 Beijing time, check the ROLCC Sunday sermon page. New episodes are added to the “Life River” category. Only new content is added; your edits are never overwritten.',
    '正在读取同步状态…': 'Loading sync status…',
    '读取同步状态失败': 'Could not load sync status',
    '重新读取': 'Reload',
    '还没同步过': 'Not synced yet',
    '成功': 'Succeeded',
    '失败': 'Failed',
    '上次同步': 'Last sync',
    '最新一期': 'Latest episode',
    '同步到系列': 'Synced to series',
    '第一次同步时自动创建「主日讲道」': '“Sunday Sermon” is created automatically on the first sync',
    '已导入到': 'Imported through',
    '还没导入过内容': 'Nothing imported yet',
    '自动检查': 'Schedule',
    '每周一 21:00（北京时间）': 'Mondays at 21:00 (Beijing time)',
    '自动同步：已开启': 'Auto sync: on',
    '自动同步：已关闭': 'Auto sync: off',
    '已开启自动同步': 'Auto sync enabled',
    '已关闭自动同步': 'Auto sync disabled',
    '正在同步…': 'Syncing…',
    '立即同步': 'Sync now',
    '没有新内容': 'No new content',
    '同步失败': 'Sync failed',
    '打开来源页面': 'Open source page',
    '只导入音频、主题和讲义 PDF，不会把音频复制到我们的服务器，App 里直接从生命河网站播放。来源页面只给主题，没有简介和时长，这两项先空着。讲义 PDF 的链接会按音频文件名自动推出来，一起填进单集。': 'Audio, titles, and handout PDFs are imported. Audio is not copied to our server; the app plays it from the Life River site. The source provides titles only, so descriptions and durations stay empty for now. Handout PDF links are derived from the audio filename and filled into each episode.',
    '这一期已经在内容里了': 'This episode is already in your content',
    '来源页面的表头变了，暂时抓不到日期 / 讲员 / 主题': 'The source page layout changed, so the date, speaker, and topic could not be read',
    '来源页面的讲道表格是空的': 'The sermon table on the source page is empty',
    '来源页面返回的内容不完整': 'The source page returned incomplete content',
    '来源页面里没找到讲道表格': 'No sermon table was found on the source page',
    '来源页面里没有可用的讲道音频': 'No usable sermon audio was found on the source page',
    '自动创建系列失败': 'Could not create the series automatically',

    '邀请新手机': 'Invite a new phone',
    '生成一个 24 小时内有效的小组二维码。对方面对面在 App 或网页版里扫，或者把二维码图片发给他，让他在 App / 网页版里从相册导入。一个码可以加好几台手机，不用每台都生成。': 'Generate a group QR code valid for 24 hours. The other person can scan it in the app or web app, or import the image from their photo library. One code can add several phones, so you do not need a new code for each one.',
    '这个二维码可以加入几台手机': 'How many phones can use this QR code',
    '只给 1 台手机': '1 phone',
    '最多 5 台手机': 'Up to 5 phones',
    '最多 10 台手机': 'Up to 10 phones',
    '最多 20 台手机': 'Up to 20 phones',
    '生成小组二维码': 'Generate group QR code',
    '过期时间：': 'Expires: ',
    '立即作废': 'Revoke now',
    '立即作废这个二维码？': 'Revoke this QR code now?',
    '作废后这个二维码不能再加新手机，已经加入的手机不受影响。': 'No new phones can join with this code. Phones that already joined are unaffected.',
    '作废中…': 'Revoking…',
    '这个二维码已经失效了': 'This QR code has already expired',
    '二维码已作废，已经加入的手机不受影响': 'QR code revoked. Phones that already joined are unaffected.',
    '收起来': 'Hide',
    '这个二维码不是网址，只能在青椒味 App 或网页版里扫。只在这里显示一次，到期或用完自动失效。': 'This is not a URL. It can only be scanned in the QJW app or web app. It is shown only once and expires automatically.',
    '生成中…': 'Generating…',
    '小组二维码生成了，24 小时内有效': 'Group QR code generated. It is valid for 24 hours.',
    '发给成员的话': 'Message for members',
    '复制后，把上面的二维码图片一起发到群里。': 'Copy this, then send the QR code image above to the group.',
    '复制成员说明': 'Copy member message',
    '成员说明已复制，记得把二维码图片一起发出去': 'Member message copied. Remember to send the QR code image too.',
    '复制失败，请手动选中文字复制': 'Copy failed. Select the text and copy it manually.',
    '我们小组的青椒味后台已经准备好了。': 'Our QJW group backend is ready.',
    '1. 安卓手机：在官网下载 App：': '1. Android: download the app from ',
    '2. iPhone 或不想装 App：直接用网页版：': '2. iPhone or prefer not to install: use the web app at ',
    '3. 装好或打开后，扫我发的小组二维码加入。': '3. After installing or opening it, scan the group QR code I sent.',
    '二维码 24 小时内有效，不要转发给小组以外的人。': 'The QR code is valid for 24 hours. Do not share it outside the group.',
    '再生成一个': 'Generate another',
    '已连接的手机': 'Connected phones',
    '手机丢了或者不想让对方继续看，就在这里断开。断开后那台手机需要重新扫码加入。': 'If a phone is lost or should no longer have access, disconnect it here. It will need to scan a new QR code to rejoin.',
    '全部断开': 'Disconnect all',
    '正在读取设备…': 'Loading devices…',
    '还没有手机连接。生成一个小组二维码，让第一台手机加入。': 'No phones connected yet. Generate a group QR code to connect the first one.',
    '未命名设备': 'Unnamed device',
    '还没有连接过': 'Never connected',
    '断开': 'Disconnect',
    '断开这台手机？': 'Disconnect this phone?',
    '」会立刻失去内容访问权限，需要管理员重新生成二维码才能加入。': ' will lose access immediately and must scan a new QR code to rejoin.',
    '已断开': 'Disconnected',
    '断开所有手机？': 'Disconnect all phones?',
    '所有已经加入的手机都会失去访问权限，需要重新生成二维码。': 'Every connected phone will lose access and must scan a new QR code.',
    '已经全部断开': 'All phones disconnected',
    '请稍候…': 'Please wait…',

    '正文': 'Body',
    '通知标题': 'Notification title',
    '通知内容': 'Notification body',
    '测验标题': 'Quiz title',
    '作业标题': 'Homework title',
    '截止时间': 'Due time',
    '音视频文件': 'Audio/video file',
    '来源不合法': 'Invalid request origin',
    '请先登录': 'Sign in first',
    '参数不对': 'Invalid parameter',
    '找不到这场聚会': 'Meeting not found',
    '找不到这条公告': 'Announcement not found',
    '找不到这个系列': 'Series not found',
    '找不到这一讲': 'Episode not found',
    '找不到这个测验': 'Quiz not found',
    '找不到这份作业': 'Homework not found',
    '找不到这份作答': 'Submission not found',
    '找不到这条通知': 'Notification not found',
    '读取失败': 'Could not load',
    '保存失败': 'Could not save',
    '删除失败': 'Could not delete',
    '请求地址不对': 'Invalid request URL',
    '没有这个内容类型': 'Unknown content type',
    '没有选中内容': 'Nothing selected',
    '不支持的操作': 'Unsupported action',
    '操作失败': 'Action failed',
    '这个版本没有开启文件存储': 'File storage is not enabled in this edition',
    '这个版本没有开启文件存储，请用外链': 'File storage is not enabled. Use an external URL.',
    '图片地址不合法': 'Invalid image URL',
    '没有选中图片': 'No images selected',
    '一次最多删除 200 张': 'Delete at most 200 images at a time',
    '接口不存在': 'Endpoint not found',
    '服务器出错了': 'Server error',
    '读取图片库失败，请重试': 'Could not load the media library. Try again.',
    '删除失败，请重试': 'Could not delete. Try again.',
    '不支持的文件类型': 'Unsupported file type',
    '文件太大': 'File too large',
    '没有收到文件': 'No file received',
    '读取上传内容失败': 'Could not read upload',
    '请求内容不合法': 'Invalid request body',
    '这个栏目不支持分页': 'This section does not support pagination',
    '这个系列不存在，可能已经被删掉了': 'This series no longer exists',
    '没有卡片': 'No cards',
    '这类内容没有发布状态': 'This type of content has no publish state',
    '聚会方式只能是线下 / 线上 / 线上线下同步进行': 'Meeting mode must be in person, online, or hybrid',
    '分类只能是普通、特别或生命河': 'Category must be Regular, Special, or Life River',
    '音视频类型只能是 none / youtube / video / audio': 'Media type must be none, YouTube, video, or audio',
    '卡片类型只能是参加聚会或本周公告': 'Card type must be meeting or announcement',
    'App 默认外观只能是跟随系统、浅色或深色': 'App appearance must be follow system, light, or dark'
  };

  var EN_NOUN = {
    '卡片': 'card',
    '公告': 'announcement',
    '聚会': 'meeting',
    '轮播图': 'slide',
    '系列': 'series',
    '单集': 'episode',
    '祷告事项': 'prayer request',
    '小组信息': 'group info'
  };

  function enPlural(n, one, many) {
    return String(n) + ' ' + (Number(n) === 1 ? one : many);
  }

  function enNoun(noun) {
    return EN_NOUN[noun] || tr(noun);
  }

  function enPluralNoun(n, noun) {
    var one = enNoun(noun);
    var many = noun === '系列' ? 'series' : one + 's';
    return enPlural(n, one, many);
  }

  var EN_EMPTY = {
    '轮播图': 'slides',
    '系列': 'series'
  };

  function enEmptyLabel(label) {
    var text = EN_EMPTY[label] || tr(label);
    return text.charAt(0).toLowerCase() + text.slice(1);
  }

  function tr(text) {
    if (text == null) return '';
    var value = String(text);
    if (!IS_EN) return value;
    if (Object.prototype.hasOwnProperty.call(EN, value)) return EN[value];
    var match;
    if ((match = /^(新增|编辑)(.+)$/.exec(value))) {
      return (match[1] === '新增' ? 'Add ' : 'Edit ') + enNoun(match[2]);
    }
    if ((match = /^(.+)不能为空$/.exec(value))) return tr(match[1]) + ' is required';
    if ((match = /^(.+)格式不对$/.exec(value))) return 'Invalid ' + tr(match[1]) + ' format';
    if ((match = /^(.+)不能超过 ([0-9]+) MB$/.exec(value))) {
      return tr(match[1]) + ' must be under ' + match[2] + ' MB';
    }
    if ((match = /^一次最多删除 ([0-9]+) 张$/.exec(value))) {
      return 'Delete at most ' + match[1] + ' images at a time';
    }
    if ((match = /^(.+)必须属于一个系列$/.exec(value))) return tr(match[1]) + ' must belong to a series';
    if ((match = /^搜索(.+)…$/.exec(value))) return 'Search ' + tr(match[1]) + '…';
    if ((match = /^搜索(.+)$/.exec(value))) return 'Search ' + tr(match[1]);
    if ((match = /^[+] 新增(.+)$/.exec(value))) return '+ Add ' + enNoun(match[1]);
    if ((match = /^共 ([0-9]+) 条$/.exec(value))) return enPlural(match[1], 'item', 'items');
    if ((match = /^找到 ([0-9]+) 条$/.exec(value))) return match[1] + ' found';
    if ((match = /^找到 ([0-9]+) 条 · 共 ([0-9]+) 条$/.exec(value))) return match[1] + ' found · ' + match[2] + ' total';
    if ((match = /^已选 ([0-9]+) 条$/.exec(value))) return match[1] + ' selected';
    if ((match = /^全选 ([0-9]+) 条$/.exec(value))) return 'Select all (' + match[1] + ')';
    if ((match = /^共 ([0-9]+) 张图片$/.exec(value))) return enPlural(match[1], 'image', 'images');
    if ((match = /^找到 ([0-9]+) 张 · 共 ([0-9]+) 张图片$/.exec(value))) return match[1] + ' found · ' + enPlural(match[2], 'image', 'images');
    if ((match = /^已选 ([0-9]+) 张$/.exec(value))) return match[1] + ' selected';
    if ((match = /^全选 ([0-9]+) 张$/.exec(value))) return 'Select all (' + match[1] + ')';
    if ((match = /^共 ([0-9]+) 集$/.exec(value))) return enPlural(match[1], 'episode', 'episodes');
    if ((match = /^第 ([0-9]+) [/] ([0-9]+) 页$/.exec(value))) return 'Page ' + match[1] + ' of ' + match[2];
    if ((match = /^第 ([0-9]+) 张 · (公告卡片|聚会卡片)$/.exec(value))) return 'Card ' + match[1] + ' · ' + tr(match[2]);
    if ((match = /^第 ([0-9]+) 讲 · (.+)$/.exec(value))) return 'Lesson ' + match[1] + ' · ' + match[2];
    if ((match = /^编号 #([0-9]+) · 改完点下面的「保存」。$/.exec(value))) return 'ID #' + match[1] + ' · Save below when done.';
    if ((match = /^删除所选 ([0-9]+) 条(.+?)？$/.exec(value))) {
      return 'Delete ' + enPluralNoun(match[1], match[2]) + '?';
    }
    if ((match = /^删除 ([0-9]+) 条$/.exec(value))) return 'Delete ' + match[1];
    if ((match = /^删除后不能恢复，确定删除这条(.+?)？$/.exec(value))) {
      return 'This cannot be undone. Delete this ' + enNoun(match[1]) + '?';
    }
    if ((match = /^删除(.+?)？$/.exec(value))) return 'Delete ' + enNoun(match[1]) + '?';
    if ((match = /^已删除 ([0-9]+) 条$/.exec(value))) return match[1] + ' deleted';
    if ((match = /^已发布 ([0-9]+) 条$/.exec(value))) return match[1] + ' published';
    if ((match = /^已隐藏 ([0-9]+) 条$/.exec(value))) return match[1] + ' hidden';
    if ((match = /^真删除 ([0-9]+) 张$/.exec(value))) return 'Delete ' + match[1] + ' permanently';
    if ((match = /^删除所选 ([0-9]+) 张图片？$/.exec(value))) return 'Delete ' + match[1] + ' selected images?';
    if ((match = /^已删除 ([0-9]+) 张图片$/.exec(value))) return enPlural(match[1], 'image', 'images') + ' deleted';
    if ((match = /^已导入 ([0-9]+) 期$/.exec(value))) return enPlural(match[1], 'episode', 'episodes') + ' imported';
    if ((match = /^新导入 ([0-9]+) 期$/.exec(value))) return enPlural(match[1], 'episode', 'episodes') + ' imported';
    if ((match = /^请求失败（([0-9]+)）$/.exec(value))) return 'Request failed (' + match[1] + ')';
    if ((match = /^排序 ([0-9]+)$/.exec(value))) return 'Sort ' + match[1];
    if ((match = /^(.+) · 排序 ([0-9]+) · ([0-9]+) 集$/.exec(value))) return tr(match[1]) + ' · Sort ' + match[2] + ' · ' + enPlural(match[3], 'episode', 'episodes');
    if ((match = /^轮播 · (.+)$/.exec(value))) return 'Slide · ' + match[1];
    if ((match = /^代祷人：(.+)$/.exec(value))) return 'Requested by ' + match[1];
    if ((match = /^还没有(.+)，点下面的按钮开始添加。$/.exec(value))) return 'No ' + enEmptyLabel(match[1]) + ' yet. Use the button below to add one.';
    if ((match = /^没有找到匹配的(.+)。$/.exec(value))) return 'No matching ' + enEmptyLabel(match[1]) + '.';
    if ((match = /^没有找到文件名包含「(.+)」的图片。$/.exec(value))) return 'No images match “' + match[1] + '”.';
    if ((match = /^(.+) 小时内有效 · 最多 ([0-9]+) 台手机$/.exec(value))) return 'Valid for ' + match[1] + ' hours · up to ' + match[2] + ' phones';
    if ((match = /^过期时间：(.+)$/.exec(value))) return 'Expires: ' + match[1];
    if ((match = /^加入于 (.+)$/.exec(value))) return 'Joined ' + match[1];
    if ((match = /^最近连接 (.+)$/.exec(value))) return 'Last seen ' + match[1];
    if ((match = /^共 ([0-9]+) 张卡片 · 从上到下就是 App 里的顺序$/.exec(value))) return enPlural(match[1], 'card', 'cards') + ' · top to bottom is the app order';
    if ((match = /^(.+) · 已选 ([0-9]+) 条$/.exec(value))) return tr(match[1]) + ' · ' + match[2] + ' selected';
    return value;
  }

  var PAGE_SIZE = 10;
  // 系列详情里的单集列表，一页少一点，免得整页太长
  var EP_PAGE_SIZE = 8;
  // 这两栏内容多，列表和搜索都向后端按页要，不在浏览器里一次性载入
  var SERVER_PAGED = { series: true, episodes: true };
  var SEARCH_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.2-3.2"></path></svg>';

  function isOn(value) {
    return value === 1 || value === true || value === '1';
  }

  function firstChar(text) {
    if (!text) return '';
    var trimmed = String(text).trim();
    return trimmed ? trimmed.slice(0, 1) : '';
  }

  function clip(text, max) {
    if (!text) return '';
    var flat = String(text).split('\\n').join(' ').split('\\r').join(' ').trim();
    return flat.length > max ? flat.slice(0, max) + '…' : flat;
  }

  // 后台里的时间一律按北京时间显示和填写：人在美国也不会把国内的时间弄乱
  var BEIJING_OFFSET = 8 * 60 * 60 * 1000;

  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  function beijingDate(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return new Date(date.getTime() + BEIJING_OFFSET);
  }

  function dateLabel(value, withTime) {
    var d = beijingDate(value);
    if (!d) return '';
    var now = new Date(Date.now() + BEIJING_OFFSET);
    var label = (d.getUTCFullYear() === now.getUTCFullYear() ? '' : d.getUTCFullYear() + '/') +
      (d.getUTCMonth() + 1) + '/' + d.getUTCDate();
    if (withTime) label += ' ' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes());
    return label;
  }

  function categoryLabel(value) {
    if (value === 'study') return IS_EN ? 'Special' : '特别';
    if (value === 'rolcc') return IS_EN ? 'Life River' : '生命河';
    return IS_EN ? 'Regular' : '普通';
  }

  function weekdayLabel(value) {
    var names = IS_EN
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    var n = Number(value);
    return n >= 1 && n <= 7 ? names[n - 1] : '';
  }

  function weeklyWhen(weekday, start, end) {
    return (IS_EN ? 'Every ' : '每周') + weekdayLabel(weekday) + ' ' + start + ' - ' + end;
  }

  function modeLabel(value) {
    if (value === 'online') return IS_EN ? 'Online' : '线上';
    if (value === 'hybrid') return IS_EN ? 'Hybrid' : '线上线下同步进行';
    return IS_EN ? 'In person' : '线下';
  }

  function isWeekly(row) { return isOn(row.repeatWeekly); }
  function hasPlace(row) { return row.mode !== 'online'; }
  function hasOnline(row) { return row.mode !== 'offline'; }

  function findById(list, id) {
    var key = String(id == null ? '' : id);
    for (var i = 0; i < (list || []).length; i += 1) {
      if (String(list[i].id) === key) return list[i];
    }
    return null;
  }

  function homeCardMeeting(row) {
    return findById((state.data && state.data.meetings) || [], row.meetingId);
  }

  function homeCardAnnouncement(row) {
    return findById((state.data && state.data.announcements) || [], row.announcementId);
  }

  function homeCardTitle(row) {
    if (row.title) return row.title;
    if (row.kind === 'announcement') {
      var announcement = homeCardAnnouncement(row);
      return announcement ? announcement.title : '公告（内容已删除）';
    }
    return homeCardMeeting(row) ? '参加聚会' : '参加聚会（内容已删除）';
  }

  function homeCardSubtitle(row) {
    if (row.kind === 'announcement') {
      var announcement = homeCardAnnouncement(row);
      if (!announcement) return '这条公告已经删掉了';
      var bits = [];
      if (announcement.summary) bits.push(clip(announcement.summary, 50));
      if (!isOn(announcement.isPublished)) bits.push(IS_EN ? 'Hidden in the app' : '已隐藏，App 不显示');
      if (announcement.publishedAt) bits.push(dateLabel(announcement.publishedAt));
      return bits.join(' · ');
    }
    var meeting = homeCardMeeting(row);
    if (!meeting) return '这场聚会已经删掉了';
    var parts = [meeting.topic];
    if (isWeekly(meeting) && meeting.startTime && meeting.endTime) {
      parts.push(weeklyWhen(meeting.weekday, meeting.startTime, meeting.endTime));
    } else {
      parts.push(dateLabel(meeting.startsAt, true));
    }
    parts.push(modeLabel(meeting.mode));
    return parts.join(' · ');
  }

  function homeCardCover(row) {
    if (row.coverUrl) return row.coverUrl;
    if (row.kind === 'announcement') {
      var announcement = homeCardAnnouncement(row);
      return announcement ? announcement.coverUrl : '';
    }
    var meeting = homeCardMeeting(row);
    return meeting ? meeting.coverUrl : '';
  }

  function mediaLabel(value) {
    if (value === 'youtube') return 'YouTube';
    if (value === 'video') return IS_EN ? 'Video' : '视频';
    if (value === 'audio') return IS_EN ? 'Audio' : '音频';
    return IS_EN ? 'No media' : '无音视频';
  }

  var state = {
    ready: false,
    hasPassword: false,
    canSetup: false,
    initialized: false,
    // 轻量版没有 R2 时由 /admin/api/status 置 false，后台隐藏图片库和上传按钮。
    mediaEnabled: false,
    // 自部署版第一次设置强制填设置码。
    requiresSetupCode: true,
    authed: false,
    data: null,
    tab: 'announcements',
    query: {},
    filter: {},
    page: {},
    listTotal: {},
    // 批量模式：按栏目记用的；selected 里存 id
    bulk: {},
    selected: {},
    media: [],
    mediaLoading: false,
    mediaError: '',
    mediaQuery: '',
    mediaBulk: false,
    mediaSelected: {},
    // 邀请和设备：只在「安全」页用
    accessInvite: null,
    accessDevices: [],
    accessLoaded: false,
    // 生命河自动同步：只在「自动同步」页用
    sync: null,
    syncLoaded: false,
    syncError: '',
    syncBusy: false,
    // 正在整页编辑的内容；null 表示在列表页
    editing: null
  };

  function selectionOf(name) {
    if (!state.selected[name]) state.selected[name] = {};
    return state.selected[name];
  }

  function selectedIds(name) {
    return Object.keys(selectionOf(name)).map(function (key) {
      return Number(key);
    }).filter(function (id) { return id > 0; });
  }

  function selectedCount(name) {
    return Object.keys(selectionOf(name)).length;
  }

  function toggleSelected(name, id) {
    var picked = selectionOf(name);
    if (picked[id]) delete picked[id];
    else picked[id] = true;
  }

  function clearSelection(name) {
    state.selected[name] = {};
  }

  function mediaSelectedKeys() {
    return Object.keys(state.mediaSelected);
  }

  function clearMediaSelection() {
    state.mediaSelected = {};
  }

  // 当前列表的重绘函数：勾选后用它刷新行状态和顶部计数
  var listPaint = null;
  var mediaPaint = null;

  var SCHEMA = {
    home: {
      label: '首页',
      noun: '卡片',
      fields: [
        { k: 'kind', l: '卡片类型', t: 'select', default: 'meeting', options: [['meeting', '参加聚会'], ['announcement', '本周公告']] },
        { k: 'meetingId', l: '选择哪场聚会', t: 'ref', collection: 'meetings', optionLabel: function (row) {
          if (isWeekly(row) && row.startTime && row.endTime) {
            return row.topic + (IS_EN ? ' (' : '（') + weeklyWhen(row.weekday, row.startTime, row.endTime) + (IS_EN ? ')' : '）');
          }
          return row.topic + (IS_EN ? ' (' : '（') + dateLabel(row.startsAt, true) + (IS_EN ? ')' : '）');
        }, when: function (row) { return row.kind !== 'announcement'; } },
        { k: 'announcementId', l: '选择哪条公告', t: 'ref', collection: 'announcements', optionLabel: function (row) {
          return row.title + (isOn(row.isPublished) ? '' : '（已隐藏）');
        }, when: function (row) { return row.kind === 'announcement'; } },
        { k: 'title', l: '卡片标题（留空自动）', t: 'text', placeholder: '留空：聚会卡显示「参加聚会」，公告卡显示公告标题' },
        { k: 'coverUrl', l: '卡片背景图（留空用内容自己的图）', t: 'image' }
      ],
      list: {
        title: function (row) { return homeCardTitle(row); },
        subtitle: function (row) { return homeCardSubtitle(row); },
        meta: function (row) { return row.kind === 'announcement' ? '公告卡片' : '聚会卡片'; },
        mark: function () { return '首'; },
        badge: function (row) {
          if (row.kind === 'announcement') return { text: '公告', tone: 'info' };
          return { text: '聚会', tone: 'on' };
        }
      }
    },
    announcements: {
      label: '公告',
      noun: '公告',
      fields: [
        { k: 'title', l: '标题', t: 'text', placeholder: '例如：本周公告' },
        { k: 'summary', l: '摘要（首页卡片副标题）', t: 'text', placeholder: '一句话说清楚' },
        { k: 'body', l: '正文（空行分段）', t: 'textarea', rows: 7 },
        { k: 'coverUrl', l: '背景图（首页「本周公告」卡片，可留空）', t: 'image' },
        { k: 'publishedAt', l: '发布时间（留空表示现在）', t: 'datetime' },
        { k: 'isPublished', l: '前台显示', t: 'bool', default: 1 }
      ],
      list: {
        image: function (row) { return row.coverUrl; },
        title: function (row) { return row.title || '（未命名公告）'; },
        subtitle: function (row) { return row.summary || clip(row.body, 90); },
        meta: function (row) { return dateLabel(row.publishedAt); },
        mark: function (row) { return firstChar(row.title) || '告'; },
        published: function (row) { return isOn(row.isPublished); },
        badge: function (row) {
          return isOn(row.isPublished)
            ? { text: '已发布', tone: 'on' }
            : { text: '隐藏', tone: 'off' };
        }
      }
    },
    meetings: {
      label: '聚会',
      noun: '聚会',
      fields: [
        { k: 'topic', l: '聚会主题', t: 'text', placeholder: '例如：腓立比书 第二章' },
        { k: 'scripture', l: '经文', t: 'text' },
        { k: 'leader', l: '带领人', t: 'text' },
        { k: 'coverUrl', l: '背景图（首页「参加聚会」卡片，可留空）', t: 'image' },
        { k: 'mode', l: '聚会方式', t: 'select', default: 'offline', options: [['offline', '线下'], ['online', '线上'], ['hybrid', '线上线下同步进行']] },
        { k: 'repeatWeekly', l: '每周重复（固定周几、几点，设一次一直用）', t: 'bool', default: 0 },
        { k: 'weekday', l: '每周几', t: 'select', default: '6', options: [['1', '周一'], ['2', '周二'], ['3', '周三'], ['4', '周四'], ['5', '周五'], ['6', '周六'], ['7', '周日']], when: isWeekly },
        { k: 'startTime', l: '开始时间（北京时间）', t: 'time', default: '19:30', when: isWeekly },
        { k: 'endTime', l: '结束时间（北京时间）', t: 'time', default: '21:00', when: isWeekly },
        { k: 'startsAt', l: '开始时间（北京时间，只办这一次）', t: 'datetime', when: function (row) { return !isWeekly(row); } },
        { k: 'endsAt', l: '结束时间（北京时间，留空默认 2 小时）', t: 'datetime', when: function (row) { return !isWeekly(row); } },
        { k: 'place', l: '线下地点', t: 'text', when: hasPlace },
        { k: 'onlineUrl', l: 'Zoom 会议链接（整段粘贴，带密码也可以）', t: 'text', when: hasOnline },
        { k: 'onlineOverride', l: '手动开放线上入口（临时改时间时用）', t: 'bool', default: 0, when: hasOnline }
      ],
      list: {
        image: function (row) { return row.coverUrl; },
        title: function (row) { return row.topic || '（未命名聚会）'; },
        subtitle: function (row) {
          var bits = [modeLabel(row.mode)];
          if (hasPlace(row) && row.place) bits.push(row.place);
          if (row.scripture) bits.push(row.scripture);
          if (row.leader) bits.push(row.leader);
          return bits.join(' · ');
        },
        meta: function (row) {
          if (isWeekly(row) && row.startTime && row.endTime) {
            return weeklyWhen(row.weekday, row.startTime, row.endTime);
          }
          return dateLabel(row.startsAt, true);
        },
        mark: function () { return '会'; },
        badge: function (row) {
          if (row.mode === 'online') return { text: '线上', tone: 'info' };
          if (row.mode === 'hybrid') return { text: '线上线下同步进行', tone: 'on' };
          return { text: '线下', tone: 'off' };
        }
      }
    },
    slides: {
      label: '轮播图',
      noun: '轮播图',
      fields: [
        { k: 'imageUrl', l: '图片', t: 'image' },
        { k: 'linkUrl', l: '点击后跳转的链接（可留空）', t: 'text' },
        { k: 'sort', l: '排序（数字小的在前）', t: 'number', default: 0 },
        { k: 'published', l: '显示', t: 'bool', default: 1 }
      ],
      list: {
        image: function (row) { return row.imageUrl; },
        title: function (row) {
          return row.linkUrl ? '轮播 · ' + row.linkUrl : '轮播图';
        },
        subtitle: function (row) { return row.imageUrl || '还没有上传图片'; },
        meta: function (row) { return '排序 ' + (row.sort == null ? 0 : row.sort); },
        mark: function () { return '图'; },
        published: function (row) { return isOn(row.published); },
        badge: function (row) {
          return isOn(row.published)
            ? { text: '显示中', tone: 'on' }
            : { text: '隐藏', tone: 'off' };
        }
      }
    },
    series: {
      label: '系列',
      noun: '系列',
      fields: [
        { k: 'title', l: '系列名', t: 'text' },
        { k: 'subtitle', l: '副标题', t: 'text' },
        { k: 'coverUrl', l: '封面图', t: 'image' },
        { k: 'mark', l: '封面占位字（没图时显示，一个汉字最好）', t: 'text' },
        { k: 'category', l: '分类', t: 'select', default: 'sermon', options: [['sermon', '普通'], ['study', '特别'], ['rolcc', '生命河']] },
        { k: 'sort', l: '排序（数字小的在前；留 0 表示不指定，按添加时间最新的在前）', t: 'number', default: 0 }
      ],
      list: {
        image: function (row) { return row.coverUrl; },
        title: function (row) { return row.title || '（未命名系列）'; },
        subtitle: function (row) { return row.subtitle || ''; },
        meta: function (row) {
          return categoryLabel(row.category) + ' · 排序 ' + (row.sort == null ? 0 : row.sort) +
            ' · ' + (row.episodeCount == null ? 0 : row.episodeCount) + ' 集';
        },
        mark: function (row) { return row.mark || firstChar(row.title) || '系'; },
        badge: function (row) {
          return { text: categoryLabel(row.category), tone: 'info' };
        }
      }
    },
    episodes: {
      label: '单集',
      noun: '单集',
      fields: [
        { k: 'title', l: '标题', t: 'text' },
        { k: 'episodeNo', l: '第几讲', t: 'number', default: 0 },
        { k: 'speaker', l: '讲员', t: 'text' },
        { k: 'duration', l: '时长（直接填数字，自动补「分钟」）', t: 'text', placeholder: '例如：38' },
        { k: 'summary', l: '简介', t: 'textarea', rows: 4 },
        { k: 'resourceUrl', l: '资料链接', t: 'text', placeholder: 'PPT / 讲义等网页链接，填了 App 本讲简介下面就能直接看' },
        { k: 'coverUrl', l: '封面图（列表里的缩略图，留空就用系列封面）', t: 'image' },
        { k: 'mediaType', l: '音视频类型', t: 'select', default: 'none', options: [['none', '没有'], ['youtube', 'YouTube 链接'], ['video', '视频直链'], ['audio', '音频直链']] },
        { k: 'mediaUrl', l: '音视频地址', t: 'text' },
        { k: 'publishedAt', l: '发布时间（留空表示现在）', t: 'datetime' },
        { k: 'sort', l: '排序', t: 'number', default: 0 }
      ],
      list: {
        image: function (row) { return row.coverUrl || seriesCoverFor(row.seriesId); },
        title: function (row) { return row.title || '（未命名单集）'; },
        subtitle: function (row) {
          var series = seriesTitleFor(row.seriesId);
          return [series, row.speaker].filter(Boolean).join(' · ') || clip(row.summary, 80);
        },
        meta: function (row) {
          var parts = [mediaLabel(row.mediaType)];
          if (row.resourceUrl) parts.push(IS_EN ? 'Handout' : '含资料');
          if (row.publishedAt) parts.push(dateLabel(row.publishedAt));
          return parts.join(' · ');
        },
        mark: function (row) { return row.episodeNo ? String(row.episodeNo) : '集'; },
        badge: function (row) {
          return row.mediaType && row.mediaType !== 'none'
            ? { text: mediaLabel(row.mediaType), tone: 'info' }
            : { text: '无音视频', tone: 'off' };
        }
      }
    },
    prayers: {
      label: '祷告事项',
      noun: '祷告事项',
      fields: [
        { k: 'author', l: '代祷人', t: 'text' },
        { k: 'content', l: '祷告内容', t: 'textarea', rows: 5 },
        { k: 'isPublished', l: '前台显示', t: 'bool', default: 1 },
        { k: 'createdAt', l: '时间（留空表示现在）', t: 'datetime' }
      ],
      list: {
        title: function (row) { return clip(row.content, 70) || '（空内容）'; },
        subtitle: function (row) { return row.author ? '代祷人：' + row.author : ''; },
        meta: function (row) { return dateLabel(row.createdAt, true); },
        mark: function () { return '祷'; },
        published: function (row) { return isOn(row.isPublished); },
        badge: function (row) {
          return isOn(row.isPublished)
            ? { text: '显示中', tone: 'on' }
            : { text: '隐藏', tone: 'off' };
        }
      }
    },
    group: {
      label: '小组信息',
      noun: '小组信息',
      single: true,
      fields: [
        { k: 'name', l: '小组名称', t: 'text' },
        { k: 'intro', l: '一句话简介', t: 'text' },
        { k: 'leader', l: '组织', t: 'text' },
        { k: 'themeMode', l: 'App 默认外观（手机没单独选过时用）', t: 'select', default: 'system', options: [['system', '跟随手机系统'], ['light', '浅色'], ['dark', '深色']] }
      ]
    }
  };

  // 单集没有独立栏目：从系列的编辑页里进去管理
  var TAB_ORDER = ['home', 'announcements', 'meetings', 'slides', 'media', 'series', 'classroom', 'sync', 'prayers', 'group', 'access'];

  // 图片库不是普通的「一条条内容」，单独渲染
  var MEDIA_TAB = { label: '图片库', single: false };
  // 安全页：邀请新手机、查看已连接的设备
  var ACCESS_TAB = { label: '安全', single: true };
  // 自动同步页：生命河主日讲道，只读状态 + 手动抓一次
  var SYNC_TAB = { label: '自动同步', single: true };
  // 课堂：独立的一整套页面（测验、以后的作业和通知），点开是新标签页，不挤在这里
  var CLASSROOM_TAB = { label: '课堂', single: true, external: true };

  var app = document.getElementById('app');
  var tabsEl = document.getElementById('tabs');
  var refreshButton = document.getElementById('refresh');
  var accountButton = document.getElementById('account');
  var logoutButton = document.getElementById('logout');
  var langButton = document.getElementById('lang');
  var themeButton = document.getElementById('theme');

  // 英文设置页/登录页的页头也跟着换，避免一半英文一半中文。
  if (IS_EN) {
    var brandNode = document.querySelector('.brand');
    if (brandNode) brandNode.innerHTML = 'QJW<span>Admin</span>';
    var brandLogo = document.querySelector('.brand-logo');
    if (brandLogo) brandLogo.alt = 'QJW';
    refreshButton.textContent = 'Refresh';
    accountButton.textContent = 'Account';
    logoutButton.textContent = 'Sign out';
  }

  // 管理后台自己的外观：只存在这个浏览器里，不改小组内容。
  var THEME_KEY = 'qjw.admin.theme';
  var THEME_LABELS = IS_EN
    ? { system: 'Follow system', light: 'Light', dark: 'Dark' }
    : { system: '跟随系统', light: '浅色', dark: '深色' };

  function readTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      return saved === 'light' || saved === 'dark' ? saved : 'system';
    } catch (e) {
      return 'system';
    }
  }

  function applyTheme(mode, persist) {
    if (mode !== 'light' && mode !== 'dark') mode = 'system';
    var root = document.documentElement;
    if (mode === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    if (persist) {
      try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
    }
    if (themeButton) {
      themeButton.textContent = THEME_LABELS[mode];
      themeButton.title = IS_EN
        ? 'Current appearance: ' + THEME_LABELS[mode] + '. Click to switch.'
        : '当前外观：' + THEME_LABELS[mode] + '，点击切换';
    }
  }

  themeButton.onclick = function () {
    var current = readTheme();
    applyTheme(current === 'system' ? 'light' : (current === 'light' ? 'dark' : 'system'), true);
  };
  applyTheme(readTheme(), false);

  if (langButton) {
    langButton.textContent = IS_EN ? '中文' : 'English';
    langButton.onclick = function () {
      var next = IS_EN ? 'zh' : 'en';
      document.cookie = 'qjw_lang=' + next + '; Path=/; Max-Age=31536000; SameSite=Lax';
      window.location.href = window.location.pathname + '?lang=' + next;
    };
  }

  function h(tag, opts, kids) {
    var node = document.createElement(tag);
    opts = opts || {};
    var raw = opts.raw === true;
    Object.keys(opts).forEach(function (key) {
      var value = opts[key];
      if (key === 'class') node.className = value;
      else if (key === 'raw') { /* 标记，不是 DOM 属性 */ }
      else if (key === 'text') node.textContent = value == null ? '' : (raw ? String(value) : tr(value));
      else if (key === 'placeholder' || key === 'title' || key === 'aria-label' || key === 'alt') {
        if (value !== null && value !== undefined) node.setAttribute(key, tr(value));
      }
      else if (key === 'onclick') node.onclick = value;
      else if (key === 'oninput') node.oninput = value;
      else if (key === 'onchange') node.onchange = value;
      else if (key === 'onsubmit') node.onsubmit = value;
      else if (key === 'rows') node.rows = value;
      else if (value !== null && value !== undefined) node.setAttribute(key, String(value));
    });
    (kids || []).forEach(function (kid) {
      if (kid) node.appendChild(kid);
    });
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function api(path, options) {
    options = options || {};
    options.credentials = 'same-origin';
    options.headers = options.headers || {};
    if (IS_EN) options.headers['accept-language'] = 'en';
    if (typeof options.body === 'string') {
      options.headers['content-type'] = 'application/json';
    }
    return fetch(path, options).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) {
        if (!response.ok) {
          var fallback = IS_EN
            ? 'Request failed (' + response.status + ')'
            : '请求失败（' + response.status + '）';
          var error = new Error(body && body.error ? body.error : fallback);
          error.status = response.status;
          throw error;
        }
        return body;
      });
    });
  }

  var toastTimer = null;
  function toast(text, isError) {
    var node = document.getElementById('toast');
    if (!node) {
      node = h('div', { id: 'toast', class: 'toast', role: 'status' });
      document.body.appendChild(node);
    }
    node.textContent = tr(text);
    node.className = 'toast show' + (isError ? ' err' : '');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      node.className = 'toast';
    }, isError ? 6000 : 3000);
  }

  function setHeaderVisible(visible) {
    refreshButton.className = visible ? 'btn ghost' : 'btn ghost hidden';
    accountButton.className = visible ? 'btn ghost' : 'btn ghost hidden';
    logoutButton.className = visible ? 'btn ghost' : 'btn ghost hidden';
    if (langButton) langButton.className = visible ? 'btn ghost' : 'btn ghost hidden';
  }

  function seriesTitleFor(seriesId) {
    var series = (state.data && state.data.series) || [];
    for (var i = 0; i < series.length; i += 1) {
      if (String(series[i].id) === String(seriesId)) return series[i].title || '';
    }
    return '';
  }

  function seriesCoverFor(seriesId) {
    var series = (state.data && state.data.series) || [];
    for (var i = 0; i < series.length; i += 1) {
      if (String(series[i].id) === String(seriesId)) return series[i].coverUrl || '';
    }
    return '';
  }

  function clone(value) {
    var out = {};
    Object.keys(value || {}).forEach(function (key) { out[key] = value[key]; });
    return out;
  }

  function blankItem(name) {
    var item = {};
    SCHEMA[name].fields.forEach(function (field) {
      if (field.t === 'bool') item[field.k] = isOn(field.default) ? 1 : 0;
      else if (field.t === 'number') item[field.k] = typeof field.default === 'number' ? field.default : 0;
      else if (field.t === 'select') item[field.k] = field.default || (field.options && field.options[0] ? field.options[0][0] : '');
      else if (field.t === 'time') item[field.k] = field.default || '';
      else if (field.t === 'ref') {
        var rows = (state.data && state.data[field.collection]) || [];
        item[field.k] = rows.length ? String(rows[0].id) : '';
      } else item[field.k] = '';
    });
    return item;
  }

  function refresh() {
    return api('/admin/api/status').then(function (status) {
      state.hasPassword = !!status.hasPassword;
      state.canSetup = !!status.canSetup;
      state.initialized = !!status.initialized;
      state.mediaEnabled = status.mediaEnabled !== false;
      state.requiresSetupCode = !!status.requiresSetupCode;
      state.ready = true;
      if (state.canSetup) {
        state.authed = false;
        render();
        return null;
      }
      return api('/admin/api/session').then(function (session) {
        state.authed = !!session.authenticated;
        if (!state.authed) {
          render();
          return null;
        }
        return loadData();
      });
    }).catch(function (error) {
      state.ready = true;
      render();
      toast(error.message, true);
    });
  }

  function loadMedia() {
    if (!state.mediaEnabled) {
      state.media = [];
      state.mediaLoading = false;
      state.mediaError = '';
      return Promise.resolve([]);
    }
    state.mediaLoading = true;
    state.mediaError = '';
    return api('/admin/api/media').then(function (result) {
      state.media = (result && result.items) || [];
      state.mediaLoading = false;
      return state.media;
    }).catch(function (error) {
      state.mediaLoading = false;
      state.mediaError = error.message || '读取图片库失败';
      throw error;
    });
  }

  function loadData() {
    return api('/admin/api/data').then(function (data) {
      state.data = data;
      state.authed = true;
      state.ready = true;
      // 重新读数据后旧的勾选可能已经不存在了，直接清掉最稳
      state.selected = {};
      state.mediaSelected = {};
      if (!SCHEMA[state.tab] && state.tab !== 'media' && state.tab !== 'access' && state.tab !== 'sync') {
        state.tab = 'announcements';
      }
      if (!state.mediaEnabled && state.tab === 'media') {
        state.tab = 'announcements';
        state.mediaBulk = false;
      }
      // 图片库读失败不影响其他栏目；轻量版直接跳过
      if (!state.mediaEnabled) {
        return Promise.resolve().then(function () { render(); });
      }
      return loadMedia().catch(function () {}).then(function () { render(); });
    }).catch(function (error) {
      if (error.status === 401) {
        state.authed = false;
        state.ready = true;
        state.editing = null;
        render();
        toast('登录已过期，请重新登录', true);
      }
      throw error;
    });
  }

  function formatBytes(size) {
    if (!size) return '';
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return Math.max(1, Math.round(size / 1024)) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast('链接已复制');
      }).catch(function () {
        window.prompt(tr('复制这个链接'), tr(text));
      });
    } else {
      window.prompt(tr('复制这个链接'), tr(text));
    }
  }

  function copyInviteText(field) {
    var done = function () {
      toast('成员说明已复制，记得把二维码图片一起发出去');
    };
    var fallback = function () {
      field.focus();
      field.select();
      try {
        if (document.execCommand('copy')) done();
        else toast('复制失败，请手动选中文字复制', true);
      } catch (error) {
        toast('复制失败，请手动选中文字复制', true);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(field.value).then(done).catch(fallback);
    } else {
      fallback();
    }
  }

  function webpName(name) {
    var text = String(name || 'image');
    var dot = text.lastIndexOf('.');
    if (dot > 0) text = text.slice(0, dot);
    return text.slice(0, 80) + '.webp';
  }

  function imageFromFile(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('浏览器读不了这个图片格式，换 JPG / PNG 再试'));
      };
      img.src = url;
    });
  }

  /** 不管原图什么格式，统一缩到长边 2000 以内、转成 WebP 再上传 */
  function compressImage(file) {
    if (file.type === 'image/webp' && file.size <= 1024 * 1024) {
      return Promise.resolve(file);
    }
    return imageFromFile(file).then(function (img) {
      var scale = Math.min(1, 2000 / Math.max(img.naturalWidth, img.naturalHeight));
      var width = Math.max(1, Math.round(img.naturalWidth * scale));
      var height = Math.max(1, Math.round(img.naturalHeight * scale));
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      return new Promise(function (resolve, reject) {
        canvas.toBlob(function (blob) {
          if (!blob) {
            reject(new Error('转 WebP 失败，换一张图试试'));
            return;
          }
          if (blob.type !== 'image/webp') {
            reject(new Error('这个浏览器不支持转 WebP，请用 Chrome / Edge 打开后台'));
            return;
          }
          resolve(new File([blob], webpName(file.name), { type: 'image/webp' }));
        }, 'image/webp', 0.86);
      });
    });
  }

  function uploadImage(file) {
    return compressImage(file).then(function (webp) {
      var form = new FormData();
      form.append('file', webp, webp.name || webpName(file.name));
      return api('/admin/api/upload', { method: 'POST', body: form });
    });
  }

  function mediaSection() {
    listPaint = null;
    var wrap = h('div');
    var toolbar = h('div', { class: 'media-toolbar' });

    var search = h('div', { class: 'search' });
    var icon = h('span', { class: 'search-icon', 'aria-hidden': 'true' });
    icon.innerHTML = SEARCH_ICON;
    var input = h('input', {
      id: 'media-search-input',
      type: 'search',
      placeholder: '搜索图片文件名…',
      autocomplete: 'off',
      'aria-label': '搜索图片文件名'
    });
    input.value = state.mediaQuery;
    input.oninput = function () {
      state.mediaQuery = input.value;
      paintGrid();
    };
    search.appendChild(icon);
    search.appendChild(input);
    toolbar.appendChild(search);

    var info = h('div', { class: 'list-meta' });
    toolbar.appendChild(info);

    var bulkButton = h('button', {
      type: 'button',
      class: 'btn' + (state.mediaBulk ? ' on' : ''),
      text: state.mediaBulk ? '✓ 完成选择' : '批量管理'
    });
    bulkButton.onclick = function () {
      state.mediaBulk = !state.mediaBulk;
      if (!state.mediaBulk) clearMediaSelection();
      render();
    };
    toolbar.appendChild(bulkButton);

    var upload = h('button', { type: 'button', class: 'btn primary', text: '+ 上传图片' });
    var picker = h('input', { type: 'file', accept: 'image/*', class: 'hidden' });
    upload.onclick = function () { picker.click(); };
    picker.onchange = function () {
      var file = picker.files && picker.files[0];
      if (!file) return;
      picker.value = '';
      upload.disabled = true;
      info.textContent = tr('正在转 WebP 并上传…');
      uploadImage(file).then(function () {
        toast('图片已上传');
        return loadMedia();
      }).then(function () {
        render();
      }).catch(function (error) {
        toast(error.message, true);
        upload.disabled = false;
        render();
      }).then(function () {
        upload.disabled = false;
      });
    };
    toolbar.appendChild(upload);
    toolbar.appendChild(picker);
    wrap.appendChild(toolbar);

    var bulkBar = null;
    var bulkCount = null;
    var bulkAll = null;
    var bulkClear = null;
    var bulkDelete = null;
    var lastItems = [];

    function mediaRows() {
      var query = (state.mediaQuery || '').trim().toLowerCase();
      if (!query) return state.media.slice();
      return state.media.filter(function (item) {
        var hay = [item.name || '', item.key || '', item.path || ''].join(' ');
        return hay.toLowerCase().indexOf(query) !== -1;
      });
    }

    function refreshBulkButtons() {
      if (!bulkBar) return;
      var count = mediaSelectedKeys().length;
      bulkCount.textContent = count
        ? tr('已选 ' + count + ' 张')
        : tr('勾选图片后可以一起删除');
      if (bulkAll) {
        bulkAll.textContent = tr('全选 ' + lastItems.length + ' 张');
        bulkAll.disabled = lastItems.length === 0;
      }
      if (bulkClear) bulkClear.disabled = count === 0;
      if (bulkDelete) bulkDelete.disabled = count === 0;
    }

    function bulkDeleteSelected() {
      var keys = mediaSelectedKeys();
      if (!keys.length) return;
      var usage = [];
      keys.forEach(function (key) {
        var item = null;
        for (var i = 0; i < state.media.length; i += 1) {
          if (state.media[i].key === key) { item = state.media[i]; break; }
        }
        if (!item) return;
        mediaUsage(item).forEach(function (label) {
          if (usage.indexOf(label) === -1) usage.push(label);
        });
      });
      var message = IS_EN
        ? 'This permanently deletes from R2 and cannot be undone.'
        : '会从 R2 真正删掉，不能恢复。';
      if (usage.length) {
        message += IS_EN
          ? ' ' + usage.length + ' places use ' + (usage.length === 1 ? 'this image' : 'these images') + ': ' +
            usage.slice(0, 3).join(', ') + (usage.length > 3 ? ', …' : '') +
            '. They will lose the image after deletion.'
          : '其中 ' + usage.length + ' 处内容正在使用：' +
            usage.slice(0, 3).join('、') + (usage.length > 3 ? ' 等' : '') +
            '，删除后那些地方就没有图了。';
      }
      confirmAction(
        '删除所选 ' + keys.length + ' 张图片？',
        message,
        '真删除 ' + keys.length + ' 张',
        function () {
          api('/admin/api/media/bulk-delete', {
            method: 'POST',
            body: JSON.stringify({ keys: keys })
          }).then(function (result) {
            var count = result && typeof result.count === 'number'
              ? result.count
              : keys.length;
            state.media = state.media.filter(function (row) {
              return keys.indexOf(row.key) === -1;
            });
            clearMediaSelection();
            toast('已删除 ' + count + ' 张图片');
            render();
          }).catch(function (error) {
            toast(error.message, true);
          });
        }
      );
    }

    function buildBulkBar() {
      var bar = h('div', { class: 'bulkbar' });
      bulkCount = h('span', { class: 'bulk-count' });
      bar.appendChild(bulkCount);
      bar.appendChild(h('span', { class: 'grow' }));

      bulkAll = h('button', { type: 'button', class: 'btn' });
      bulkAll.onclick = function () {
        lastItems.forEach(function (item) { state.mediaSelected[item.key] = true; });
        paintGrid();
      };
      bar.appendChild(bulkAll);

      bulkClear = h('button', { type: 'button', class: 'btn ghost', text: '清空' });
      bulkClear.onclick = function () {
        clearMediaSelection();
        paintGrid();
      };
      bar.appendChild(bulkClear);

      bulkDelete = h('button', { type: 'button', class: 'btn danger', text: '删除所选' });
      bulkDelete.onclick = bulkDeleteSelected;
      bar.appendChild(bulkDelete);
      return bar;
    }

    var grid = h('div', { class: 'media-grid' });

    function paintGrid() {
      if (state.mediaLoading) {
        info.textContent = tr('正在读取图片库…');
        clear(grid);
        grid.appendChild(h('p', { class: 'loading' }, [
          h('span', { class: 'spinner' }),
          h('span', { text: '正在读取图片库…' })
        ]));
        return;
      }
      if (state.mediaError && !state.media.length) {
        info.textContent = tr(state.mediaError);
        clear(grid);
        grid.appendChild(h('div', { class: 'media-empty', text: state.mediaError }));
        return;
      }

      var items = mediaRows();
      lastItems = items;
      var searching = Boolean((state.mediaQuery || '').trim());
      info.textContent = tr(searching
        ? '找到 ' + items.length + ' 张 · 共 ' + state.media.length + ' 张图片'
        : '共 ' + state.media.length + ' 张图片');

      clear(grid);
      if (!state.media.length) {
        grid.appendChild(h('div', {
          class: 'media-empty',
          text: '图片库还是空的。点右上角「上传图片」，传一次以后就能在公告、聚会、系列、轮播图里反复选用。'
        }));
        refreshBulkButtons();
        return;
      }
      if (!items.length) {
        var empty = h('div', { class: 'media-empty' });
        empty.appendChild(h('div', { text: '没有找到文件名包含「' + state.mediaQuery.trim() + '」的图片。' }));
        var clearSearch = h('button', { type: 'button', class: 'btn', text: '清除搜索' });
        clearSearch.style.marginTop = '12px';
        clearSearch.onclick = function () {
          state.mediaQuery = '';
          input.value = '';
          paintGrid();
          input.focus();
        };
        empty.appendChild(clearSearch);
        grid.appendChild(empty);
        refreshBulkButtons();
        return;
      }

      items.forEach(function (item) { grid.appendChild(mediaCard(item)); });
      refreshBulkButtons();
    }

    if (state.mediaBulk) bulkBar = buildBulkBar();
    if (bulkBar) wrap.appendChild(bulkBar);
    wrap.appendChild(grid);
    wrap.appendChild(h('p', {
      class: 'footnote',
      text: '以后改公告、聚会、系列或轮播图时，图片那一栏点「从图片库选择」就能直接用这里的图。图片多的时候可以用上面的搜索找文件名，或者点「批量管理」一次删除多张。'
    }));

    mediaPaint = paintGrid;
    paintGrid();
    return wrap;
  }

  function mediaCard(item, onPick) {
    var selecting = !onPick && state.mediaBulk;
    var picked = selecting && !!state.mediaSelected[item.key];
    var card = h(onPick ? 'button' : 'div', {
      type: onPick ? 'button' : null,
      class: 'media-card' + (onPick ? ' pickable' : '') +
        (selecting ? ' selectable' : '') + (picked ? ' selected' : '')
    });
    if (selecting) {
      card.setAttribute('role', 'checkbox');
      card.setAttribute('aria-checked', picked ? 'true' : 'false');
      card.setAttribute('tabindex', '0');
      card.appendChild(h('span', {
        class: 'tick media-tick' + (picked ? ' on' : ''),
        text: picked ? '✓' : ''
      }));
    }
    var img = h('img', { class: 'shot', src: item.path || item.url, alt: item.name || '', loading: 'lazy' });
    card.appendChild(img);
    var meta = h('div', { class: 'meta' });
    meta.appendChild(h('div', { class: 'name', text: item.name || item.key }));
    var sub = [];
    if (item.uploadedAt) sub.push(dateLabel(item.uploadedAt, true));
    if (item.size) sub.push(formatBytes(item.size));
    meta.appendChild(h('div', { class: 'sub', text: sub.join(' · ') }));
    if (onPick) {
      meta.appendChild(h('div', { class: 'sub', text: '点击选用' }));
    } else if (!selecting) {
      var actions = h('div', { class: 'media-actions' });
      var copy = h('button', { type: 'button', class: 'btn mini', text: '复制链接' });
      copy.onclick = function () { copyText(item.url); };
      actions.appendChild(copy);
      var remove = h('button', { type: 'button', class: 'btn mini danger', text: '删除' });
      remove.onclick = function () { deleteMedia(item); };
      actions.appendChild(remove);
      meta.appendChild(actions);
    }
    card.appendChild(meta);

    function toggle() {
      if (state.mediaSelected[item.key]) delete state.mediaSelected[item.key];
      else state.mediaSelected[item.key] = true;
      if (mediaPaint) mediaPaint();
    }

    if (onPick) {
      card.onclick = function () { onPick(item); };
    } else if (selecting) {
      card.onclick = toggle;
      card.onkeydown = function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      };
    }
    return card;
  }

  /** 找出后台哪些内容正在用这张图，删除前提醒一下 */
  function mediaUsage(item) {
    var data = state.data || {};
    var used = [];
    function hit(url) {
      return typeof url === 'string' && url.indexOf(item.key) !== -1;
    }
    (data.slides || []).forEach(function (row) {
      if (hit(row.imageUrl)) used.push(IS_EN ? 'Carousel' : '轮播图');
    });
    (data.announcements || []).forEach(function (row) {
      if (hit(row.coverUrl)) used.push((IS_EN ? 'Announcement “' : '公告「') + (row.title || row.id) + (IS_EN ? '”' : '」'));
    });
    (data.meetings || []).forEach(function (row) {
      if (hit(row.coverUrl)) used.push((IS_EN ? 'Meeting “' : '聚会「') + (row.topic || row.id) + (IS_EN ? '”' : '」'));
    });
    (data.series || []).forEach(function (row) {
      if (hit(row.coverUrl)) used.push((IS_EN ? 'Series “' : '系列「') + (row.title || row.id) + (IS_EN ? '”' : '」'));
    });
    return used;
  }

  function deleteMedia(item) {
    var name = item.name || item.key;
    var used = mediaUsage(item);
    var message = used.length
      ? (IS_EN
        ? 'This image is used in ' + used.length + ' places: ' + used.slice(0, 3).join(', ') +
          (used.length > 3 ? ', …' : '') + '. They will lose the image, and this cannot be undone.'
        : '这张图正在被 ' + used.length + ' 处使用：' + used.slice(0, 3).join('、') +
          (used.length > 3 ? ' 等' : '') + '。删除后那些地方就没有图了，而且不能恢复。')
      : '会从 R2 真正删掉，不能恢复。';
    confirmAction((IS_EN ? 'Delete “' : '删除「') + name + (IS_EN ? '”?' : '」？'), message, '真删除', function () {
      api('/admin/api/media?key=' + encodeURIComponent(item.key), { method: 'DELETE' }).then(function () {
        state.media = state.media.filter(function (row) { return row.key !== item.key; });
        delete state.mediaSelected[item.key];
        toast('图片已删除');
        render();
      }).catch(function (error) {
        toast(error.message, true);
      });
    });
  }

  function closePicker() {
    var node = document.getElementById('picker-root');
    if (node) node.remove();
  }

  /** 从图片库挑一张，选完把链接回填到当前表单 */
  function newMediaPicker(onPick) {
    closePicker();
    var backdrop = h('div', { class: 'modal-backdrop picker-backdrop', id: 'picker-root' });
    var modal = h('div', { class: 'modal picker-card', role: 'dialog', 'aria-modal': 'true' });
    var head = h('div', { class: 'modal-head' });
    var heading = h('div');
    heading.appendChild(h('h2', { text: '从图片库选择' }));
    heading.appendChild(h('div', { class: 'modal-sub', text: '上传过一次的图都在这里，点一下就填进当前表单。' }));
    head.appendChild(heading);
    var close = h('button', { type: 'button', class: 'icon-btn', text: '×', 'aria-label': '关闭' });
    close.onclick = closePicker;
    head.appendChild(close);

    var searchWrap = h('div', { class: 'picker-search' });
    var searchBox = h('div', { class: 'search' });
    var searchIcon = h('span', { class: 'search-icon', 'aria-hidden': 'true' });
    searchIcon.innerHTML = SEARCH_ICON;
    var searchInput = h('input', {
      type: 'search',
      placeholder: '搜索图片文件名…',
      autocomplete: 'off',
      'aria-label': '搜索图片文件名'
    });
    var pickerQuery = '';
    searchInput.oninput = function () {
      pickerQuery = searchInput.value;
      paint();
    };
    searchBox.appendChild(searchIcon);
    searchBox.appendChild(searchInput);
    searchWrap.appendChild(searchBox);

    var body = h('div', { class: 'modal-body' });
    modal.appendChild(head);
    modal.appendChild(searchWrap);
    modal.appendChild(body);
    backdrop.appendChild(modal);
    backdrop.onclick = function (event) { if (event.target === backdrop) closePicker(); };
    document.body.appendChild(backdrop);

    function paint() {
      clear(body);
      if (state.mediaLoading && !state.media.length) {
        body.appendChild(h('p', { class: 'loading' }, [
          h('span', { class: 'spinner' }),
          h('span', { text: '正在读取图片库…' })
        ]));
        return;
      }
      if (state.mediaError && !state.media.length) {
        body.appendChild(h('div', { class: 'media-empty', text: state.mediaError }));
        return;
      }
      if (!state.media.length) {
        body.appendChild(h('div', {
          class: 'media-empty',
          text: '图片库还没有图。关掉这里，用图片栏下面的「上传」传一张，之后就能反复选用。'
        }));
        return;
      }
      var keyword = pickerQuery.trim().toLowerCase();
      var items = keyword
        ? state.media.filter(function (item) {
            var hay = [item.name || '', item.key || ''].join(' ').toLowerCase();
            return hay.indexOf(keyword) !== -1;
          })
        : state.media;
      if (!items.length) {
        body.appendChild(h('div', {
          class: 'media-empty',
          text: '没有找到文件名包含「' + pickerQuery.trim() + '」的图片。'
        }));
        return;
      }
      var grid = h('div', { class: 'media-grid media-pick' });
      items.forEach(function (item) {
        grid.appendChild(mediaCard(item, function (picked) {
          onPick(picked.path || picked.url);
          closePicker();
          toast('已选好图片，记得保存');
        }));
      });
      body.appendChild(grid);
    }

    if (state.media.length) {
      paint();
    } else {
      state.mediaLoading = true;
      paint();
      loadMedia().then(paint).catch(function (error) {
        state.mediaError = error.message || '读取图片库失败';
        paint();
      });
    }
  }

  var DEVICE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="6" y="2.5" width="12" height="19" rx="2.5"></rect><path d="M10.5 18.5h3"></path></svg>';

  function syncSection() {
    var wrap = h('div', { class: 'access-stack' });
    var card = h('div', { class: 'access-card' });
    card.appendChild(h('h2', { text: '生命河主日讲道 · 自动同步' }));
    card.appendChild(h('p', {
      class: 'access-lead',
      text: '每周一北京时间 21:00 自动去 ROLCC 的主日讲道页面检查一次。有新的一期就自动加进「生命河」分类；只加新的，不会覆盖你改过的内容。'
    }));

    if (!state.syncLoaded) {
      card.appendChild(h('div', { class: 'access-empty', text: '正在读取同步状态…' }));
      api('/admin/api/rolcc/status').then(function (result) {
        state.sync = result;
        state.syncLoaded = true;
        state.syncError = '';
        render();
      }).catch(function (error) {
        state.syncLoaded = true;
        state.syncError = error.message || '读取同步状态失败';
        render();
      });
      wrap.appendChild(card);
      return wrap;
    }

    if (state.syncError) {
      card.appendChild(h('div', { class: 'access-warning', text: state.syncError }));
      var retry = h('button', { type: 'button', class: 'btn', text: '重新读取' });
      retry.onclick = function () {
        state.syncLoaded = false;
        state.syncError = '';
        render();
      };
      var retryRow = h('div', { class: 'access-form' });
      retryRow.appendChild(retry);
      card.appendChild(retryRow);
      wrap.appendChild(card);
      return wrap;
    }

    var status = state.sync || {};
    var lastRun = status.lastRun || null;
    var details = h('div', { class: 'sync-details' });

    function line(label, value) {
      var row = h('div', { class: 'sync-line' });
      row.appendChild(h('span', { class: 'sync-label', text: label }));
      row.appendChild(h('span', { class: 'sync-value', text: value || '—' }));
      return row;
    }

    var lastText = '还没同步过';
    if (lastRun) {
      lastText = dateLabel(lastRun.at, true) + ' · ' + (lastRun.ok
        ? (IS_EN ? 'Succeeded' : '成功')
        : (IS_EN ? 'Failed' : '失败')) +
        (lastRun.message ? ' · ' + tr(lastRun.message) : '');
    }
    details.appendChild(line('上次同步', lastText));
    if (lastRun && lastRun.latest) {
      var latest = lastRun.latest;
      details.appendChild(line(
        '最新一期',
        IS_EN
          ? dateLabel(latest.date, false) + ' “' + latest.title + '”' +
            (latest.speaker ? ' · ' + latest.speaker : '')
          : dateLabel(latest.date, false) + '《' + latest.title + '》' +
            (latest.speaker ? ' · ' + latest.speaker : '')
      ));
    }
    details.appendChild(line(
      '同步到系列',
      status.series ? status.series.title : '第一次同步时自动创建「主日讲道」'
    ));
    details.appendChild(line('已导入到', status.lastDate || '还没导入过内容'));
    details.appendChild(line('自动检查', status.schedule || '每周一 21:00（北京时间）'));
    card.appendChild(details);

    var actions = h('div', { class: 'access-form' });
    var toggle = h('button', {
      type: 'button',
      class: 'btn' + (status.enabled ? ' on' : ''),
      text: status.enabled ? '自动同步：已开启' : '自动同步：已关闭'
    });
    toggle.onclick = function () {
      toggle.disabled = true;
      api('/admin/api/rolcc/enabled', {
        method: 'POST',
        body: JSON.stringify({ enabled: !status.enabled })
      }).then(function (result) {
        state.sync = result;
        render();
        toast(result.enabled ? '已开启自动同步' : '已关闭自动同步');
      }).catch(function (error) {
        toggle.disabled = false;
        toast(error.message, true);
      });
    };
    actions.appendChild(toggle);

    var run = h('button', {
      type: 'button',
      class: 'btn primary',
      text: state.syncBusy ? '正在同步…' : '立即同步'
    });
    run.disabled = state.syncBusy;
    run.onclick = function () {
      if (state.syncBusy) return;
      state.syncBusy = true;
      render();
      api('/admin/api/rolcc/sync', { method: 'POST' }).then(function (result) {
        state.syncBusy = false;
        state.syncLoaded = false;
        toast(result.ok
          ? (result.imported > 0 ? '已导入 ' + result.imported + ' 期' : (result.message || '没有新内容'))
          : (result.message || '同步失败'), !result.ok);
        return loadData();
      }).catch(function (error) {
        state.syncBusy = false;
        render();
        toast(error.message, true);
      });
    };
    actions.appendChild(run);

    var source = h('a', {
      class: 'btn ghost',
      href: status.sourceUrl || 'https://rolcc.net/rolcc2/sunday-media/',
      target: '_blank',
      rel: 'noopener noreferrer',
      text: '打开来源页面'
    });
    actions.appendChild(source);
    card.appendChild(actions);

    card.appendChild(h('div', {
      class: 'access-warning',
      text: '只导入音频、主题和讲义 PDF，不会把音频复制到我们的服务器，App 里直接从生命河网站播放。来源页面只给主题，没有简介和时长，这两项先空着。讲义 PDF 的链接会按音频文件名自动推出来，一起填进单集。'
    }));

    wrap.appendChild(card);
    return wrap;
  }

  function accessSection() {
    var wrap = h('div', { class: 'access-stack' });

    // 小组二维码：24 小时内有效，一个码可以让多台手机加入
    var inviteCard = h('div', { class: 'access-card' });
    inviteCard.appendChild(h('h2', { text: '邀请新手机' }));
    inviteCard.appendChild(h('p', {
      class: 'access-lead',
      text: '生成一个 24 小时内有效的小组二维码。对方面对面在 App 或网页版里扫，或者把二维码图片发给他，让他在 App / 网页版里从相册导入。一个码可以加好几台手机，不用每台都生成。'
    }));
    var uses = h('select', { class: 'filter', 'aria-label': '这个二维码可以加入几台手机' });
    [
      ['1', '只给 1 台手机'],
      ['5', '最多 5 台手机'],
      ['10', '最多 10 台手机'],
      ['20', '最多 20 台手机']
    ].forEach(function (pair) {
      uses.appendChild(h('option', { value: pair[0], text: pair[1] }));
    });
    uses.value = '5';
    var generate = h('button', { type: 'button', class: 'btn primary', text: '生成小组二维码' });
    var form = h('div', { class: 'access-form' });
    form.appendChild(uses);
    form.appendChild(generate);
    inviteCard.appendChild(form);
    var inviteResult = h('div');
    inviteCard.appendChild(inviteResult);

    function paintInvite() {
      clear(inviteResult);
      var invite = state.accessInvite;
      if (!invite) return;
      var box = h('div', { class: 'invite-result' });
      var qr = h('div', { class: 'invite-qr' });
      qr.innerHTML = invite.qrSvg;
      box.appendChild(qr);

      var detail = h('div', { class: 'invite-detail' });
      detail.appendChild(h('strong', {
        text: '24 小时内有效 · 最多 ' + invite.maxUses + ' 台手机'
      }));
      detail.appendChild(h('div', {
        class: 'access-lead',
        text: '过期时间：' + dateLabel(invite.expiresAt, true)
      }));
      var actions = h('div', { class: 'invite-actions' });
      var revokeInviteButton = h('button', {
        type: 'button',
        class: 'btn danger',
        text: '立即作废'
      });
      revokeInviteButton.onclick = function () {
        confirmAction(
          '立即作废这个二维码？',
          '作废后这个二维码不能再加新手机，已经加入的手机不受影响。',
          '立即作废',
          function () {
            revokeInviteButton.disabled = true;
            revokeInviteButton.textContent = tr('作废中…');
            api('/admin/api/invites/' + invite.id + '/revoke', { method: 'POST' })
              .then(function (result) {
                state.accessInvite = null;
                paintInvite();
                toast(result && result.revoked === false
                  ? '这个二维码已经失效了'
                  : '二维码已作废，已经加入的手机不受影响');
              })
              .catch(function (error) {
                revokeInviteButton.disabled = false;
                revokeInviteButton.textContent = tr('立即作废');
                toast(error.message, true);
              });
          }
        );
      };
      actions.appendChild(revokeInviteButton);
      var discard = h('button', { type: 'button', class: 'btn ghost', text: '收起来' });
      discard.onclick = function () {
        state.accessInvite = null;
        paintInvite();
      };
      actions.appendChild(discard);
      detail.appendChild(actions);

      var shareLines = [
        tr('我们小组的青椒味后台已经准备好了。'),
        tr('1. 安卓手机：在官网下载 App：') + 'https://qingjiaowei.gracelink.cc/download',
        tr('2. iPhone 或不想装 App：直接用网页版：') + 'https://qingjiaowei.gracelink.cc/app',
        tr('3. 装好或打开后，扫我发的小组二维码加入。'),
        tr('二维码 24 小时内有效，不要转发给小组以外的人。')
      ];
      var share = h('div', { class: 'invite-share' });
      share.appendChild(h('strong', { text: '发给成员的话' }));
      share.appendChild(h('p', {
        class: 'access-lead',
        text: '复制后，把上面的二维码图片一起发到群里。'
      }));
      var shareText = h('textarea', {
        class: 'invite-share-text',
        readonly: 'readonly',
        rows: 7,
        'aria-label': '发给成员的话'
      });
      shareText.value = shareLines.join('\n');
      share.appendChild(shareText);
      var copyShare = h('button', {
        type: 'button',
        class: 'btn mini',
        text: '复制成员说明'
      });
      copyShare.onclick = function () { copyInviteText(shareText); };
      share.appendChild(copyShare);
      detail.appendChild(share);

      detail.appendChild(h('div', {
        class: 'access-warning',
        text: '这个二维码不是网址，只能在青椒味 App 或网页版里扫。只在这里显示一次，到期或用完自动失效。'
      }));
      box.appendChild(detail);
      inviteResult.appendChild(box);
    }
    paintInvite();

    generate.onclick = function () {
      generate.disabled = true;
      uses.disabled = true;
      generate.textContent = tr('生成中…');
      api('/admin/api/invites', {
        method: 'POST',
        body: JSON.stringify({ maxUses: Number(uses.value) })
      }).then(function (result) {
        state.accessInvite = result;
        paintInvite();
        toast('小组二维码生成了，24 小时内有效');
      }).catch(function (error) {
        toast(error.message, true);
      }).then(function () {
        generate.disabled = false;
        uses.disabled = false;
        generate.textContent = tr('再生成一个');
      });
    };

    wrap.appendChild(inviteCard);

    // 已连接的设备
    var deviceCard = h('div', { class: 'access-card' });
    var head = h('div', { class: 'access-form' });
    head.style.marginTop = '0';
    var heading = h('div');
    heading.style.flex = '1';
    heading.appendChild(h('h2', { text: '已连接的手机' }));
    heading.appendChild(h('p', {
      class: 'access-lead',
      text: '手机丢了或者不想让对方继续看，就在这里断开。断开后那台手机需要重新扫码加入。'
    }));
    head.appendChild(heading);
    var revokeAll = h('button', { type: 'button', class: 'btn danger', text: '全部断开' });
    head.appendChild(revokeAll);
    deviceCard.appendChild(head);
    var deviceList = h('div', { class: 'device-list' });
    deviceCard.appendChild(deviceList);

    function paintDevices() {
      clear(deviceList);
      var items = state.accessDevices || [];
      revokeAll.disabled = items.length === 0;
      if (!state.accessLoaded) {
        deviceList.appendChild(h('div', { class: 'access-empty', text: '正在读取设备…' }));
        return;
      }
      if (!items.length) {
        deviceList.appendChild(h('div', { class: 'access-empty', text: '还没有手机连接。生成一个小组二维码，让第一台手机加入。' }));
        return;
      }
      items.forEach(function (device) {
        var row = h('div', { class: 'device-row' });
        var dot = h('div', { class: 'device-dot' });
        dot.innerHTML = DEVICE_ICON;
        row.appendChild(dot);
        var main = h('div', { class: 'device-main' });
        main.appendChild(h('div', { class: 'device-name', text: device.name || '未命名设备', raw: Boolean(device.name) }));
        var bits = [(IS_EN ? 'Joined ' : '加入于 ') + dateLabel(device.createdAt, true)];
        bits.push(device.lastSeenAt
          ? (IS_EN ? 'Last seen ' : '最近连接 ') + dateLabel(device.lastSeenAt, true)
          : '还没有连接过');
        main.appendChild(h('div', { class: 'device-sub', text: bits.join(' · ') }));
        row.appendChild(main);
        var revoke = h('button', { type: 'button', class: 'btn mini danger', text: '断开' });
        revoke.onclick = function () {
          confirmAction(
            '断开这台手机？',
            (IS_EN ? '“' : '「') + (device.name || '未命名设备') + (IS_EN
              ? '” will lose access immediately and must scan a new QR code to rejoin.'
              : '」会立刻失去内容访问权限，需要管理员重新生成二维码才能加入。'),
            '断开',
            function () {
              api('/admin/api/devices/' + device.id, { method: 'DELETE' }).then(function () {
                state.accessDevices = state.accessDevices.filter(function (item) {
                  return String(item.id) !== String(device.id);
                });
                paintDevices();
                toast('已断开');
              }).catch(function (error) { toast(error.message, true); });
            }
          );
        };
        row.appendChild(revoke);
        deviceList.appendChild(row);
      });
    }

    if (!state.accessLoaded) {
      api('/admin/api/devices').then(function (result) {
        state.accessDevices = (result && result.items) || [];
        state.accessLoaded = true;
        paintDevices();
      }).catch(function (error) {
        state.accessLoaded = true;
        paintDevices();
        toast(error.message, true);
      });
    }
    paintDevices();

    revokeAll.onclick = function () {
      if (!state.accessDevices.length) return;
      confirmAction(
        '断开所有手机？',
        '所有已经加入的手机都会失去访问权限，需要重新生成二维码。',
        '全部断开',
        function () {
          api('/admin/api/devices/revoke-all', { method: 'POST' }).then(function () {
            state.accessDevices = [];
            paintDevices();
            toast('已经全部断开');
          }).catch(function (error) { toast(error.message, true); });
        }
      );
    };

    wrap.appendChild(deviceCard);
    return wrap;
  }

  /** 首页布局：轮播下面的卡片，能增删、选内容、上下调序 */
  function homeSection() {
    listPaint = null;
    var wrap = h('div');
    var cards = ((state.data && state.data.home) || []).slice();

    var intro = h('div', { class: 'home-intro' });
    intro.appendChild(h('strong', { text: '首页卡片' }));
    intro.appendChild(h('span', {
      text: ' 轮播图在「轮播图」栏目里管理。这里决定轮播下面显示哪些卡片：可以加卡片、选具体哪场聚会或哪条公告，也能上移 / 下移调整顺序。'
    }));
    wrap.appendChild(intro);

    var toolbar = h('div', { class: 'toolbar' });
    toolbar.appendChild(h('div', {
      class: 'list-meta',
      text: cards.length
        ? '共 ' + cards.length + ' 张卡片 · 从上到下就是 App 里的顺序'
        : ''
    }));
    toolbar.appendChild(h('span', { class: 'grow' }));
    var add = h('button', { type: 'button', class: 'btn primary', text: '+ 新增卡片' });
    add.onclick = function () { openEditor('home', null); };
    toolbar.appendChild(add);
    wrap.appendChild(toolbar);

    var list = h('div', { class: 'list' });
    if (!cards.length) {
      var empty = h('div', { class: 'empty' });
      empty.appendChild(h('div', { class: 'empty-icon', text: '首' }));
      empty.appendChild(h('p', {
        text: '还没有配置首页卡片。App 现在按默认显示最近一场聚会和最新公告；加一张卡片后，首页就只显示你配的这些。'
      }));
      var emptyAdd = h('button', { type: 'button', class: 'btn primary', text: '+ 新增第一张卡片' });
      emptyAdd.onclick = function () { openEditor('home', null); };
      empty.appendChild(emptyAdd);
      list.appendChild(empty);
    } else {
      cards.forEach(function (card, index) {
        list.appendChild(homeCardRow(card, index, cards));
      });
    }
    wrap.appendChild(list);

    if (cards.length) {
      wrap.appendChild(h('p', {
        class: 'footnote',
        text: '提示：公告设成「隐藏」后，这张卡片在 App 里会自动不显示；改回发布就会恢复。删除卡片不会删掉对应的聚会或公告。'
      }));
    }
    return wrap;
  }

  function homeCardRow(card, index, cards) {
    var node = h('div', { class: 'row home-card-row' });

    var thumbBox = h('div', { class: 'thumb' });
    thumbBox.appendChild(h('span', {
      class: 'thumb-mark',
      text: card.kind === 'announcement' ? '告' : '会'
    }));
    var cover = homeCardCover(card);
    if (cover) {
      var img = h('img', { src: cover, alt: '', loading: 'lazy' });
      img.onerror = function () {
        if (img.parentNode) img.parentNode.removeChild(img);
      };
      thumbBox.appendChild(img);
    }
    node.appendChild(thumbBox);

    var main = h('div', { class: 'row-main' });
    var cardTitle = homeCardTitle(card);
    main.appendChild(h('div', { class: 'row-title', text: cardTitle, raw: Boolean(card.title) }));
    var subtitle = homeCardSubtitle(card);
    if (subtitle) main.appendChild(h('div', { class: 'row-sub', text: subtitle }));
    main.appendChild(h('div', {
      class: 'row-meta',
      text: '第 ' + (index + 1) + ' 张 · ' + (card.kind === 'announcement' ? '公告卡片' : '聚会卡片')
    }));

    var actions = h('div', { class: 'home-card-actions' });
    var up = h('button', { type: 'button', class: 'btn mini', text: '↑ 上移' });
    up.disabled = index === 0;
    var down = h('button', { type: 'button', class: 'btn mini', text: '↓ 下移' });
    down.disabled = index === cards.length - 1;

    function move(delta) {
      var target = index + delta;
      if (target < 0 || target >= cards.length) return;
      var ids = cards.map(function (row) { return Number(row.id); });
      var temp = ids[index];
      ids[index] = ids[target];
      ids[target] = temp;
      up.disabled = true;
      down.disabled = true;
      api('/admin/api/home/reorder', {
        method: 'POST',
        body: JSON.stringify({ ids: ids })
      }).then(function () {
        return loadData();
      }).catch(function (error) {
        toast(error.message || '排序失败', true);
        up.disabled = index === 0;
        down.disabled = index === cards.length - 1;
      });
    }

    up.onclick = function () { move(-1); };
    down.onclick = function () { move(1); };
    actions.appendChild(up);
    actions.appendChild(down);

    var edit = h('button', { type: 'button', class: 'btn mini', text: '编辑' });
    edit.onclick = function () { openEditor('home', card); };
    actions.appendChild(edit);

    var remove = h('button', { type: 'button', class: 'btn mini danger', text: '删除' });
    remove.onclick = function () {
      confirmAction(
        '删除这张首页卡片？',
        '只是从首页移除，不会删掉对应的聚会或公告。',
        '删除',
        function () {
          remove.disabled = true;
          remove.textContent = tr('删除中…');
          api('/admin/api/data/home/' + card.id, { method: 'DELETE' }).then(function () {
            toast('已删除');
            return loadData();
          }).catch(function (error) {
            remove.disabled = false;
            remove.textContent = tr('删除');
            toast(error.message, true);
          });
        }
      );
    };
    actions.appendChild(remove);
    main.appendChild(actions);
    node.appendChild(main);

    var side = h('div', { class: 'row-side' });
    if (card.kind === 'announcement') {
      var announcement = homeCardAnnouncement(card);
      if (!announcement) {
        side.appendChild(h('span', { class: 'badge off', text: '内容已删除' }));
      } else if (!isOn(announcement.isPublished)) {
        side.appendChild(h('span', { class: 'badge off', text: '公告已隐藏' }));
      } else {
        side.appendChild(h('span', { class: 'badge info', text: '公告' }));
      }
    } else if (!homeCardMeeting(card)) {
      side.appendChild(h('span', { class: 'badge off', text: '内容已删除' }));
    } else {
      side.appendChild(h('span', { class: 'badge on', text: '聚会' }));
    }
    node.appendChild(side);
    return node;
  }

  function renderTabs() {
    clear(tabsEl);
    var bar = h('div', { class: 'tabs' });
    TAB_ORDER.forEach(function (name) {
      // 没有 R2 就不显示图片库，避免用户点进去看到一堆上传失败。
      if (name === 'media' && !state.mediaEnabled) return;
      var def = SCHEMA[name] || (name === 'access' ? ACCESS_TAB : (name === 'sync' ? SYNC_TAB : (name === 'classroom' ? CLASSROOM_TAB : MEDIA_TAB)));
      var button = h('button', {
        type: 'button',
        class: 'tab' + (state.tab === name ? ' on' : '')
      });
      button.appendChild(h('span', { text: def.label }));
      if (!def.single) {
        var totals = (state.data && state.data._totals) || {};
        var count = name === 'media'
          ? state.media.length
          : (totals[name] != null
            ? totals[name]
            : ((state.data && state.data[name]) || []).length);
        if (count > 0) {
          button.appendChild(h('span', { class: 'tab-count', text: count }));
        }
      }
      button.onclick = function () {
        // 课堂是独立页面，在新标签页里打开，主后台保持原样
        if (def.external) {
          window.open('/classroom', '_blank', 'noopener');
          return;
        }
        if (!state.editing && state.tab === name) return;
        leaveEditor(function () {
          state.tab = name;
          state.selected = {};
          state.mediaSelected = {};
          if (name !== 'media') {
            state.mediaBulk = false;
            state.mediaQuery = '';
          }
          render();
        });
      };
      bar.appendChild(button);
    });
    tabsEl.appendChild(bar);
  }

  function sectionContent() {
    var name = state.tab;
    if (name === 'home') return homeSection();
    if (name === 'media') return mediaSection();
    if (name === 'sync') return syncSection();
    if (name === 'access') return accessSection();
    var def = SCHEMA[name];
    if (def.single) return groupCard(name, def);

    var total = ((state.data && state.data[name]) || []).length;
    var query = state.query[name] || '';
    var filter = state.filter[name] || 'all';
    var bulkMode = !!state.bulk[name];
    var canPublish = typeof def.list.published === 'function';
    var lastRows = [];
    var bulkBusy = false;
    var serverPaged = SERVER_PAGED[name] === true;
    var serverToken = 0;
    var searchTimer = null;

    var toolbar = h('div', { class: 'toolbar' });
    var search = h('div', { class: 'search' });
    var icon = h('span', { class: 'search-icon', 'aria-hidden': 'true' });
    icon.innerHTML = SEARCH_ICON;
    var input = h('input', {
      id: 'search-input',
      type: 'search',
      placeholder: '搜索' + def.label + '…',
      autocomplete: 'off',
      'aria-label': '搜索' + def.label
    });
    input.value = query;
    input.oninput = function () {
      state.query[name] = input.value;
      state.page[name] = 0;
      clearSelection(name);
      if (serverPaged) {
        // 每敲一个字就发请求太浪费，停下来 250ms 再搜
        if (searchTimer) window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(paint, 250);
      } else {
        paint();
      }
    };
    search.appendChild(icon);
    search.appendChild(input);
    toolbar.appendChild(search);

    if (canPublish) {
      var select = h('select', { class: 'filter', 'aria-label': '按显示状态筛选' });
      [['all', '全部状态'], ['on', '已发布'], ['off', '隐藏']].forEach(function (pair) {
        select.appendChild(h('option', { value: pair[0], text: pair[1] }));
      });
      select.value = filter;
      select.onchange = function () {
        state.filter[name] = select.value;
        state.page[name] = 0;
        clearSelection(name);
        paint();
      };
      toolbar.appendChild(select);
    }

    var bulkButton = h('button', {
      type: 'button',
      class: 'btn' + (bulkMode ? ' on' : ''),
      text: bulkMode ? '✓ 完成选择' : '批量管理'
    });
    bulkButton.onclick = function () {
      if (bulkMode) clearSelection(name);
      state.bulk[name] = !bulkMode;
      render();
    };
    toolbar.appendChild(bulkButton);

    var addButton = h('button', {
      type: 'button',
      class: 'btn primary',
      text: '+ 新增' + def.noun
    });
    addButton.onclick = function () { openEditor(name, null); };
    toolbar.appendChild(addButton);

    var metaLine = h('div', { class: 'list-meta' });
    var listArea = h('div', { class: 'list' });

    var bulkBar = null;
    var bulkCount = null;
    var bulkAll = null;
    var bulkClear = null;
    var bulkPublish = null;
    var bulkHide = null;
    var bulkDelete = null;

    function refreshBulkButtons() {
      if (!bulkBar) return;
      var count = selectedCount(name);
      bulkCount.textContent = count
        ? tr('已选 ' + count + ' 条')
        : tr('勾选后一起处理');
      var none = count === 0 || bulkBusy;
      if (bulkPublish) bulkPublish.disabled = none;
      if (bulkHide) bulkHide.disabled = none;
      if (bulkDelete) bulkDelete.disabled = none;
      if (bulkClear) bulkClear.disabled = none;
      if (bulkAll) {
        bulkAll.textContent = tr('全选 ' + lastRows.length + ' 条');
        bulkAll.disabled = bulkBusy || lastRows.length === 0;
      }
    }

    function bulkSetBusy(busy) {
      bulkBusy = busy;
      bulkButton.disabled = busy;
      addButton.disabled = busy;
      refreshBulkButtons();
    }

    function bulkRun(action, doneLabel) {
      if (bulkBusy) return;
      var ids = selectedIds(name);
      if (!ids.length) return;
      bulkSetBusy(true);
      api('/admin/api/data/' + name + '/bulk', {
        method: 'POST',
        body: JSON.stringify({ action: action, ids: ids })
      }).then(function (result) {
        var count = result && typeof result.count === 'number' ? result.count : ids.length;
        toast(doneLabel + ' ' + count + ' 条');
        clearSelection(name);
        return loadData();
      }).catch(function (error) {
        toast(error.message, true);
      }).then(function () {
        bulkSetBusy(false);
      });
    }

    function bulkAskDelete() {
      var ids = selectedIds(name);
      if (!ids.length) return;
      var message = name === 'series'
        ? '系列下面的单集也会一起删掉，不能恢复。'
        : '删除后不能恢复。';
      confirmAction(
        '删除所选 ' + ids.length + ' 条' + def.noun + '？',
        message,
        '删除 ' + ids.length + ' 条',
        function () { bulkRun('delete', '已删除'); }
      );
    }

    function buildBulkBar() {
      var bar = h('div', { class: 'bulkbar' });
      bulkCount = h('span', { class: 'bulk-count' });
      bar.appendChild(bulkCount);
      bar.appendChild(h('span', { class: 'grow' }));

      bulkAll = h('button', { type: 'button', class: 'btn', text: '全选' });
      bulkAll.onclick = function () {
        var picked = selectionOf(name);
        lastRows.forEach(function (row) {
          if (row.id) picked[row.id] = true;
        });
        paint();
      };
      bar.appendChild(bulkAll);

      bulkClear = h('button', { type: 'button', class: 'btn ghost', text: '清空' });
      bulkClear.onclick = function () {
        clearSelection(name);
        paint();
      };
      bar.appendChild(bulkClear);

      if (canPublish) {
        bulkPublish = h('button', { type: 'button', class: 'btn', text: '设为发布' });
        bulkPublish.onclick = function () { bulkRun('publish', '已发布'); };
        bar.appendChild(bulkPublish);

        bulkHide = h('button', { type: 'button', class: 'btn', text: '设为隐藏' });
        bulkHide.onclick = function () { bulkRun('unpublish', '已隐藏'); };
        bar.appendChild(bulkHide);
      }

      bulkDelete = h('button', { type: 'button', class: 'btn danger', text: '删除所选' });
      bulkDelete.onclick = bulkAskDelete;
      bar.appendChild(bulkDelete);
      return bar;
    }

    /** 系列 / 单集：只把当前这一页和总条数取回来 */
    function paintServerPage() {
      var page = Math.max(0, state.page[name] || 0);
      var query = (state.query[name] || '').trim();
      var token = ++serverToken;
      metaLine.textContent = tr('加载中…');
      clear(listArea);
      listArea.appendChild(h('p', { class: 'loading' }, [
        h('span', { class: 'spinner' }),
        h('span', { text: '正在加载…' })
      ]));

      api('/admin/api/list/' + name + '?page=' + (page + 1) +
        '&pageSize=' + PAGE_SIZE +
        '&q=' + encodeURIComponent(query)
      ).then(function (result) {
        if (token !== serverToken) return;
        var items = (result && result.items) || [];
        var total = result && typeof result.total === 'number' ? result.total : items.length;
        var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        var current = Math.min(page, pages - 1);
        if (current !== page) {
          state.page[name] = current;
          paintServerPage();
          return;
        }
        lastRows = items;
        state.listTotal[name] = total;
        if (total === 0) {
          metaLine.textContent = '';
        } else {
          metaLine.textContent = tr(query ? '找到 ' + total + ' 条' : '共 ' + total + ' 条');
        }
        if (bulkMode && selectedCount(name)) {
          metaLine.textContent += ' · ' + tr('已选 ' + selectedCount(name) + ' 条');
        }

        clear(listArea);
        if (!items.length) {
          listArea.appendChild(emptyState(name, total));
          refreshBulkButtons();
          return;
        }
        items.forEach(function (row) {
          listArea.appendChild(listRow(name, row, bulkMode));
        });
        if (pages > 1) {
          listArea.appendChild(pager(current, pages, function (next) {
            state.page[name] = next;
            paint();
            var top = document.querySelector('main');
            if (top) window.scrollTo({ top: 0, behavior: 'smooth' });
          }));
        }
        refreshBulkButtons();
      }).catch(function (error) {
        if (token !== serverToken) return;
        metaLine.textContent = '';
        clear(listArea);
        var box = h('div', { class: 'empty' });
        box.appendChild(h('div', { class: 'empty-icon', text: '!' }));
        box.appendChild(h('p', { text: error.message || '读取失败，请稍后再试' }));
        var retry = h('button', { type: 'button', class: 'btn', text: '再试一次' });
        retry.onclick = paintServerPage;
        box.appendChild(retry);
        listArea.appendChild(box);
        refreshBulkButtons();
      });
    }

    function paint() {
      if (serverPaged) return paintServerPage();
      var rows = filteredRows(name);
      lastRows = rows;
      var pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
      var page = Math.min(Math.max(state.page[name] || 0, 0), pages - 1);
      state.page[name] = page;

      if (rows.length === 0) {
        metaLine.textContent = '';
      } else if (rows.length === total) {
        metaLine.textContent = tr('共 ' + total + ' 条');
      } else {
        metaLine.textContent = tr('找到 ' + rows.length + ' 条 · 共 ' + total + ' 条');
      }
      if (bulkMode && rows.length && selectedCount(name)) {
        metaLine.textContent += ' · ' + tr('已选 ' + selectedCount(name) + ' 条');
      }

      clear(listArea);
      if (rows.length === 0) {
        listArea.appendChild(emptyState(name, total));
        refreshBulkButtons();
        return;
      }

      var start = page * PAGE_SIZE;
      rows.slice(start, start + PAGE_SIZE).forEach(function (row) {
        listArea.appendChild(listRow(name, row, bulkMode));
      });
      if (pages > 1) {
        listArea.appendChild(pager(page, pages, function (next) {
          state.page[name] = next;
          paint();
          var top = document.querySelector('main');
          if (top) window.scrollTo({ top: 0, behavior: 'smooth' });
        }));
      }
      refreshBulkButtons();
    }

    listPaint = paint;
    if (bulkMode) bulkBar = buildBulkBar();
    paint();
    refreshBulkButtons();

    var section = h('div');
    section.appendChild(toolbar);
    if (bulkBar) section.appendChild(bulkBar);
    section.appendChild(metaLine);
    section.appendChild(listArea);
    return section;
  }

  function filteredRows(name) {
    var def = SCHEMA[name];
    var rows = ((state.data && state.data[name]) || []).slice();
    var query = (state.query[name] || '').trim().toLowerCase();
    var filter = state.filter[name] || 'all';

    if (query) {
      rows = rows.filter(function (row) {
        return searchText(name, row).indexOf(query) !== -1;
      });
    }
    if (filter !== 'all' && typeof def.list.published === 'function') {
      rows = rows.filter(function (row) {
        var published = !!def.list.published(row);
        return filter === 'on' ? published : !published;
      });
    }
    return rows;
  }

  function searchText(name, row) {
    var def = SCHEMA[name];
    var list = def.list;
    var parts = [];
    [list.title, list.subtitle, list.meta].forEach(function (fn) {
      if (typeof fn === 'function') parts.push(fn(row) || '');
    });
    if (typeof list.badge === 'function') {
      var badge = list.badge(row);
      if (badge) parts.push(badge.text || '');
    }
    Object.keys(row).forEach(function (key) {
      var value = row[key];
      if (value !== null && value !== undefined && typeof value !== 'object') {
        parts.push(String(value));
      }
    });
    return parts.join(' ').toLowerCase();
  }

  function listRow(name, row, selectable) {
    var def = SCHEMA[name];
    var list = def.list;
    var rowId = Number(row.id) || 0;
    var picked = selectable && !!selectionOf(name)[rowId];

    var node = h(selectable ? 'div' : 'button', {
      type: selectable ? null : 'button',
      class: 'row' + (selectable ? ' selectable' : '') + (picked ? ' selected' : '')
    });
    if (selectable) {
      node.setAttribute('role', 'checkbox');
      node.setAttribute('tabindex', '0');
      node.setAttribute('aria-checked', picked ? 'true' : 'false');
      node.appendChild(h('span', {
        class: 'tick' + (picked ? ' on' : ''),
        text: picked ? '✓' : ''
      }));
    }
    node.appendChild(thumb(list, row));

    var main = h('div', { class: 'row-main' });
    var rowTitle = list.title(row);
    main.appendChild(h('div', { class: 'row-title', text: rowTitle || tr('（未命名）'), raw: Boolean(rowTitle) }));
    var subtitle = typeof list.subtitle === 'function' ? list.subtitle(row) : '';
    if (subtitle) {
      main.appendChild(h('div', { class: 'row-sub', text: subtitle }));
    }
    var meta = typeof list.meta === 'function' ? list.meta(row) : '';
    if (meta) {
      main.appendChild(h('div', { class: 'row-meta', text: meta }));
    }
    node.appendChild(main);

    var side = h('div', { class: 'row-side' });
    var badge = typeof list.badge === 'function' ? list.badge(row) : null;
    if (badge) {
      side.appendChild(h('span', { class: 'badge ' + (badge.tone || 'info'), text: badge.text }));
    }
    side.appendChild(h('span', { class: 'row-hint', text: selectable ? '勾选' : '编辑 ›' }));
    node.appendChild(side);

    function activate() {
      if (selectable) {
        toggleSelected(name, rowId);
        if (listPaint) listPaint();
        return;
      }
      openEditor(name, row);
    }

    node.onclick = activate;
    if (selectable) {
      node.onkeydown = function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      };
    }
    return node;
  }

  function thumb(list, row) {
    var box = h('div', { class: 'thumb' });
    var mark = typeof list.mark === 'function' ? list.mark(row) : '';
    box.appendChild(h('span', { class: 'thumb-mark', text: mark || '·' }));
    var url = typeof list.image === 'function' ? list.image(row) : '';
    if (url) {
      var img = h('img', { src: url, alt: '', loading: 'lazy' });
      img.onerror = function () {
        if (img.parentNode) img.parentNode.removeChild(img);
      };
      box.appendChild(img);
    }
    return box;
  }

  function emptyState(name, total) {
    var def = SCHEMA[name];
    var hasQuery = Boolean((state.query[name] || '').trim());
    var filter = state.filter[name] || 'all';
    var hasFilter = filter !== 'all';
    var box = h('div', { class: 'empty' });
    box.appendChild(h('div', { class: 'empty-icon', text: hasQuery || hasFilter ? '⌕' : '○' }));

    if (total === 0) {
      box.appendChild(h('p', { text: '还没有' + def.label + '，点下面的按钮开始添加。' }));
      var add = h('button', { type: 'button', class: 'btn primary', text: '+ 新增' + def.noun });
      add.onclick = function () { openEditor(name, null); };
      box.appendChild(add);
      return box;
    }

    box.appendChild(h('p', { text: '没有找到匹配的' + def.label + '。' }));
    var reset = h('button', { type: 'button', class: 'btn', text: '清除搜索和筛选' });
    reset.onclick = function () {
      state.query[name] = '';
      state.filter[name] = 'all';
      state.page[name] = 0;
      render();
    };
    box.appendChild(reset);
    return box;
  }

  function pager(page, pages, go) {
    var wrap = h('div', { class: 'pager' });
    wrap.appendChild(h('span', { text: '第 ' + (page + 1) + ' / ' + pages + ' 页' }));
    var buttons = h('div', { class: 'pager-buttons' });

    var prev = h('button', { type: 'button', class: 'btn', text: '上一页' });
    prev.disabled = page <= 0;
    prev.onclick = function () { if (page > 0) go(page - 1); };

    var next = h('button', { type: 'button', class: 'btn', text: '下一页' });
    next.disabled = page >= pages - 1;
    next.onclick = function () { if (page < pages - 1) go(page + 1); };

    buttons.appendChild(prev);
    buttons.appendChild(next);
    wrap.appendChild(buttons);
    return wrap;
  }

  function groupCard(name, def) {
    var group = (state.data && state.data.group) || {};
    var card = h('div', { class: 'group-card' });
    card.appendChild(h('h2', { text: group.name || '还没有写小组名称', raw: Boolean(group.name) }));
    card.appendChild(h('p', { class: 'intro', text: group.intro || '还没有写简介。', raw: Boolean(group.intro) }));
    var detail = h('div', { class: 'detail-row' });
    detail.appendChild(h('span', { class: 'detail-key', text: '组织' }));
    detail.appendChild(h('span', { text: group.leader || '未填写', raw: Boolean(group.leader) }));
    card.appendChild(detail);

    var actions = h('div', { class: 'actions' });
    var edit = h('button', { type: 'button', class: 'btn primary', text: '编辑小组信息' });
    edit.onclick = function () { openEditor(name, group.id ? group : null); };
    actions.appendChild(edit);
    card.appendChild(actions);
    return card;
  }

  /** UTC ISO → 北京时间 'YYYY-MM-DDTHH:mm'，直接放 datetime-local */
  function toBeijingInput(iso) {
    var date = beijingDate(iso);
    if (!date) return '';
    return date.getUTCFullYear() + '-' + pad2(date.getUTCMonth() + 1) + '-' + pad2(date.getUTCDate()) +
      'T' + pad2(date.getUTCHours()) + ':' + pad2(date.getUTCMinutes());
  }

  /** 后台里填的北京时间 → 带时区的 ISO */
  function fromBeijingInput(local) {
    var match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local || '');
    if (!match) return null;
    var ms = Date.UTC(
      Number(match[1]), Number(match[2]) - 1, Number(match[3]),
      Number(match[4]), Number(match[5])
    ) - BEIJING_OFFSET;
    return new Date(ms).toISOString();
  }

  function fieldControl(field, item, notify) {
    var value = item[field.k];

    if (field.t === 'datetime') {
      var when = h('input', { type: 'datetime-local' });
      when.value = toBeijingInput(value);
      when.oninput = function () {
        item[field.k] = when.value ? fromBeijingInput(when.value) : null;
        if (notify) notify();
      };
      return when;
    }

    if (field.t === 'time') {
      // 老聚会刚改成「每周重复」时还没有时间，先用默认值顶上，免得显示空框却存不进去
      if (value == null || value === '') {
        value = field.default || '';
        item[field.k] = value;
      }
      var clock = h('input', { type: 'time' });
      clock.value = value == null ? '' : String(value);
      clock.oninput = function () {
        item[field.k] = clock.value;
        if (notify) notify();
      };
      return clock;
    }

    if (field.t === 'textarea') {
      var area = h('textarea', { rows: field.rows || 5 });
      area.value = value == null ? '' : String(value);
      area.oninput = function () {
        item[field.k] = area.value;
        if (notify) notify();
      };
      return area;
    }

    if (field.t === 'bool') {
      var box = h('input', { type: 'checkbox' });
      box.checked = isOn(value);
      box.onchange = function () {
        item[field.k] = box.checked ? 1 : 0;
        if (notify) notify();
      };
      return h('label', { class: 'check-row' }, [
        box,
        h('span', { text: field.l })
      ]);
    }

    if (field.t === 'select') {
      var select = h('select');
      (field.options || []).forEach(function (pair) {
        select.appendChild(h('option', { value: pair[0], text: pair[1] }));
      });
      if (value == null || value === '') {
        select.value = field.default || select.options[0].value;
        // 下拉框显示的默认值也要写回数据，不然直接保存会漏字段
        item[field.k] = select.value;
      } else {
        select.value = String(value);
      }
      select.onchange = function () {
        item[field.k] = select.value;
        if (notify) notify();
      };
      return select;
    }

    if (field.t === 'series') {
      var seriesSelect = h('select');
      seriesSelect.appendChild(h('option', { value: '', text: '（不属于任何系列）' }));
      var series = (state.data && state.data.series) || [];
      series.forEach(function (row) {
        seriesSelect.appendChild(h('option', { value: String(row.id), text: row.title, raw: true }));
      });
      seriesSelect.value = value == null ? '' : String(value);
      seriesSelect.onchange = function () {
        item[field.k] = seriesSelect.value;
        if (notify) notify();
      };
      return seriesSelect;
    }

    if (field.t === 'ref') {
      var refRows = (state.data && state.data[field.collection]) || [];
      var refSelect = h('select');
      if (!refRows.length) {
        refSelect.appendChild(h('option', { value: '', text: '还没有可选内容' }));
        refSelect.disabled = true;
        item[field.k] = '';
        return refSelect;
      }
      refRows.forEach(function (row) {
        var label = typeof field.optionLabel === 'function'
          ? field.optionLabel(row)
          : (row.title || row.topic || ('#' + row.id));
        refSelect.appendChild(h('option', { value: String(row.id), text: label, raw: true }));
      });
      var known = refRows.some(function (row) { return String(row.id) === String(value); });
      if (!known) {
        refSelect.value = String(refRows[0].id);
        item[field.k] = refSelect.value;
      } else {
        refSelect.value = String(value);
      }
      refSelect.onchange = function () {
        item[field.k] = refSelect.value;
        if (notify) notify();
      };
      return refSelect;
    }

    if (field.t === 'image') {
      var wrap = h('div');
      var input = h('input', { type: 'text', placeholder: '/media/... 或者外部图片链接' });
      input.value = value == null ? '' : String(value);
      input.oninput = function () {
        item[field.k] = input.value;
        paintPreview();
        if (notify) notify();
      };
      wrap.appendChild(input);

      var preview = h('div', { class: 'upload-preview' });
      function paintPreview() {
        clear(preview);
        var url = item[field.k];
        if (!url) return;
        var img = h('img', { src: url, alt: '' });
        img.onerror = function () { if (img.parentNode) img.parentNode.removeChild(img); };
        preview.appendChild(img);
      }

      var row = h('div', { class: 'upload-row' });
      if (state.mediaEnabled) {
        var picker = h('input', { type: 'file', accept: 'image/*' });
        var status = h('span', { class: 'muted', text: '自动转 WebP' });
        var library = h('button', { type: 'button', class: 'btn mini', text: '从图片库选择' });
        picker.onchange = function () {
          if (!picker.files || !picker.files[0]) return;
          var file = picker.files[0];
          picker.value = '';
          status.textContent = tr('正在转 WebP 并上传…');
          uploadImage(file).then(function (result) {
            item[field.k] = result.path;
            input.value = result.path;
            paintPreview();
            status.textContent = tr('上传好了，记得保存');
            toast('图片已上传');
            if (notify) notify();
            // 顺手刷新图片库，下次可以直接选
            loadMedia().catch(function () {});
          }).catch(function (error) {
            status.textContent = tr('上传失败');
            toast(error.message, true);
          });
        };
        library.onclick = function () {
          newMediaPicker(function (url) {
            item[field.k] = url;
            input.value = url;
            paintPreview();
            if (notify) notify();
          });
        };
        row.appendChild(picker);
        row.appendChild(library);
        row.appendChild(status);
      } else {
        row.appendChild(h('span', {
          class: 'muted',
          text: '这个版本不开文件上传，请填外部图片直链（https://…）'
        }));
      }
      wrap.appendChild(row);
      wrap.appendChild(preview);
      paintPreview();
      return wrap;
    }

    var text = h('input', {
      type: field.t === 'number' ? 'number' : 'text',
      placeholder: field.placeholder || ''
    });
    var displayValue = value == null ? '' : String(value);
    if (IS_EN && field.k === 'duration') {
      var minutesOnly = /^([0-9.]+) 分钟$/.exec(displayValue);
      if (minutesOnly) displayValue = minutesOnly[1];
    }
    text.value = displayValue;
    text.oninput = function () {
      item[field.k] = field.t === 'number' ? Number(text.value) : text.value;
      if (notify) notify();
    };
    return text;
  }

  function confirmAction(title, message, confirmLabel, onConfirm) {
    if (document.getElementById('confirm-root')) return;
    var backdrop = h('div', { class: 'modal-backdrop confirm-backdrop', id: 'confirm-root' });
    var card = h('div', { class: 'confirm-card', role: 'alertdialog', 'aria-modal': 'true' });
    card.appendChild(h('h2', { text: title }));
    card.appendChild(h('p', { class: 'confirm-text', text: message }));

    function close() {
      backdrop.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(event) {
      if (event.key === 'Escape') close();
    }

    var actions = h('div', { class: 'confirm-actions' });
    var cancel = h('button', { type: 'button', class: 'btn', text: '取消' });
    cancel.onclick = close;
    var confirm = h('button', { type: 'button', class: 'btn danger', text: confirmLabel });
    confirm.onclick = function () {
      close();
      onConfirm();
    };
    actions.appendChild(cancel);
    actions.appendChild(confirm);
    card.appendChild(actions);

    backdrop.appendChild(card);
    backdrop.onclick = function (event) { if (event.target === backdrop) close(); };
    document.addEventListener('keydown', onKey);
    document.body.appendChild(backdrop);
    confirm.focus();
  }

  function editorDirty() {
    if (!state.editing) return false;
    return JSON.stringify(state.editing.item) !== state.editing.snapshot;
  }

  /** 离开编辑页：有未保存改动时先问一句，避免手滑丢内容 */
  function leaveEditor(next) {
    if (!state.editing) { next(); return; }
    if (!editorDirty()) {
      state.editing = null;
      next();
      return;
    }
    confirmAction(
      '放弃未保存的修改？',
      '这一页还有没保存的内容，离开后这些修改就没了。',
      '放弃修改',
      function () {
        state.editing = null;
        next();
      }
    );
  }

  function openEditor(name, row) {
    var isNew = !row;
    var item = isNew ? blankItem(name) : clone(row);
    // 新首页卡片默认排在最后，不会打断已经调好的顺序
    if (name === 'home' && isNew) {
      var cards = (state.data && state.data.home) || [];
      var maxSort = 0;
      cards.forEach(function (card) {
        if (Number(card.sort) > maxSort) maxSort = Number(card.sort);
      });
      item.sort = maxSort + 10;
    }
    state.editing = {
      name: name,
      item: item,
      isNew: isNew,
      snapshot: JSON.stringify(item)
    };
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /** 从系列页进入单集：上一页（系列）暂存起来，返回时回到那个页面 */
  function openEpisode(seriesId, row) {
    var parent = state.editing;
    var item = row ? clone(row) : blankItem('episodes');
    item.seriesId = seriesId;
    state.editing = {
      name: 'episodes',
      item: item,
      isNew: !row,
      snapshot: JSON.stringify(item),
      parent: parent
    };
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /** 从单集返回系列页（不是直接回列表） */
  function leaveEpisode(next) {
    var editing = state.editing;
    var parent = editing && editing.parent;
    if (!editing || !parent) {
      leaveEditor(next);
      return;
    }
    if (!editorDirty()) {
      state.editing = parent;
      next();
      return;
    }
    confirmAction(
      '放弃未保存的修改？',
      '这一页还有没保存的内容，离开后这些修改就没了。',
      '放弃修改',
      function () {
        state.editing = parent;
        next();
      }
    );
  }

  /** 系列编辑页里的单集区：只有这个系列的单集，能分页、新增和点进去编辑 */
  function seriesEpisodesSection(series, editing) {
    var wrap = h('div', { class: 'series-episodes' });
    var head = h('div', { class: 'series-ep-head' });
    head.appendChild(h('h3', { text: '这个系列的单集' }));
    var count = h('span', { class: 'count' });
    head.appendChild(count);
    head.appendChild(h('span', { class: 'grow' }));
    var add = h('button', { type: 'button', class: 'btn primary', text: '+ 新增单集' });
    add.onclick = function () { openEpisode(series.id, null); };
    head.appendChild(add);
    wrap.appendChild(head);

    var listEl = h('div', { class: 'list' });
    wrap.appendChild(listEl);

    var ep = editing.episodes;
    if (!ep) {
      ep = editing.episodes = {
        page: 0,
        items: [],
        total: 0,
        loading: false,
        loaded: false,
        error: ''
      };
    }

    function paint() {
      if (ep.loading && !ep.items.length) {
        count.textContent = tr('正在加载…');
        clear(listEl);
        listEl.appendChild(h('p', { class: 'loading' }, [
          h('span', { class: 'spinner' }),
          h('span', { text: '正在加载…' })
        ]));
        return;
      }
      if (ep.error) {
        count.textContent = '';
        clear(listEl);
        var box = h('div', { class: 'empty' });
        box.appendChild(h('div', { class: 'empty-icon', text: '!' }));
        box.appendChild(h('p', { text: ep.error }));
        var retry = h('button', { type: 'button', class: 'btn', text: '再试一次' });
        retry.onclick = function () { load(ep.page); };
        box.appendChild(retry);
        listEl.appendChild(box);
        return;
      }

      count.textContent = tr('共 ' + ep.total + ' 集');
      clear(listEl);
      if (!ep.items.length) {
        listEl.appendChild(h('p', {
          class: 'series-ep-empty',
          text: '还没有单集，点右上角「新增单集」添加。'
        }));
        return;
      }
      ep.items.forEach(function (row) {
        listEl.appendChild(episodeRow(row));
      });
      var pages = Math.max(1, Math.ceil(ep.total / EP_PAGE_SIZE));
      if (pages > 1) {
        listEl.appendChild(pager(ep.page, pages, function (next) { load(next); }));
      }
    }

    function episodeRow(row) {
      var node = h('button', { type: 'button', class: 'row' });
      var thumbBox = h('div', { class: 'thumb' });
      thumbBox.appendChild(h('span', {
        class: 'thumb-mark',
        text: row.episodeNo ? String(row.episodeNo) : '集'
      }));
      node.appendChild(thumbBox);

      var main = h('div', { class: 'row-main' });
      main.appendChild(h('div', {
        class: 'row-title',
        text: (row.episodeNo ? '第 ' + row.episodeNo + ' 讲 · ' : '') +
          (row.title || '（未命名单集）')
      }));
      var bits = [];
      if (row.speaker) bits.push(row.speaker);
      if (row.duration) bits.push(IS_EN
        ? String(row.duration).split('小时').join('hr').split('分钟').join('min')
        : row.duration);
      if (bits.length) {
        main.appendChild(h('div', { class: 'row-sub', text: bits.join(' · ') }));
      }
      main.appendChild(h('div', {
        class: 'row-meta',
        text: mediaLabel(row.mediaType)
      }));
      node.appendChild(main);

      var side = h('div', { class: 'row-side' });
      side.appendChild(h('span', { class: 'row-hint', text: '编辑 ›' }));
      node.appendChild(side);
      node.onclick = function () { openEpisode(series.id, row); };
      return node;
    }

    function load(page) {
      ep.loading = true;
      ep.error = '';
      ep.page = Math.max(0, page || 0);
      paint();
      api('/admin/api/list/episodes?page=' + (ep.page + 1) +
        '&pageSize=' + EP_PAGE_SIZE +
        '&seriesId=' + encodeURIComponent(series.id)
      ).then(function (result) {
        ep.items = (result && result.items) || [];
        ep.total = result && typeof result.total === 'number'
          ? result.total
          : ep.items.length;
        ep.loading = false;
        ep.loaded = true;
        var pages = Math.max(1, Math.ceil(ep.total / EP_PAGE_SIZE));
        if (ep.page > pages - 1) {
          load(pages - 1);
          return;
        }
        paint();
      }).catch(function (error) {
        ep.loading = false;
        ep.error = error.message || '单集读取失败';
        paint();
      });
    }

    if (!ep.loaded && !ep.loading) load(0);
    else paint();

    return wrap;
  }

  function editorPage() {
    var editing = state.editing;
    var name = editing.name;
    var def = SCHEMA[name];
    var item = editing.item;
    var isNew = editing.isNew;

    var page = h('div', { class: 'editor-page' });

    var parent = editing.parent || null;
    var head = h('div', { class: 'editor-head' });
    var back = h('button', {
      type: 'button',
      class: 'editor-back',
      text: parent ? '← 返回系列' : '← 返回列表'
    });
    back.onclick = function () {
      if (parent) leaveEpisode(function () { render(); });
      else leaveEditor(function () { render(); });
    };
    head.appendChild(back);

    var heading = h('div');
    heading.appendChild(h('h2', { text: (isNew ? '新增' : '编辑') + (def.noun || def.label) }));
    heading.appendChild(h('div', {
      class: 'editor-sub',
      text: isNew
        ? '填好后点下面的「保存」。这是整页编辑，点到旁边不会关掉。'
        : '编号 #' + item.id + ' · 改完点下面的「保存」。'
    }));
    head.appendChild(heading);

    var dirtyHint = h('div', { class: 'editor-dirty' });
    head.appendChild(dirtyHint);
    page.appendChild(head);

    function markState() {
      dirtyHint.textContent = editorDirty() ? tr('有未保存的修改') : '';
    }

    var body = h('div', { class: 'editor-body' });
    var visibility = [];
    // 按当前填的内容显示/隐藏字段：纯线上不需要地点，每周重复不需要具体日期
    function refreshVisibility() {
      visibility.forEach(function (entry) {
        entry.group.style.display = entry.when(item) ? '' : 'none';
      });
      markState();
    }
    def.fields.forEach(function (field) {
      if (field.t === 'bool') {
        var box = fieldControl(field, item, refreshVisibility);
        if (field.when) visibility.push({ group: box, when: field.when });
        body.appendChild(box);
        return;
      }
      var group = h('label', { class: 'field' });
      group.appendChild(h('span', { class: 'field-label', text: field.l }));
      group.appendChild(fieldControl(field, item, refreshVisibility));
      if (field.when) visibility.push({ group: group, when: field.when });
      body.appendChild(group);
    });
    refreshVisibility();
    page.appendChild(body);

    // 系列下面直接管理单集：每一集都必须属于一个系列，所以不做独立的单集栏目
    if (name === 'series' && !isNew && item.id) {
      page.appendChild(seriesEpisodesSection(item, editing));
    }

    var foot = h('div', { class: 'editor-foot' });
    if (!isNew && !def.single && item.id) {
      var deleteButton = h('button', { type: 'button', class: 'btn danger', text: '删除' });
      deleteButton.onclick = function () {
        confirmAction(
          '删除' + def.noun + '？',
          name === 'series'
            ? '删除后不能恢复，这个系列下面的单集也会一起删除。'
            : '删除后不能恢复，确定删除这条' + def.noun + '？',
          '删除',
          function () { doDelete(); }
        );
      };
      function doDelete() {
        deleteButton.disabled = true;
        deleteButton.textContent = tr('删除中…');
        api('/admin/api/data/' + name + '/' + item.id, { method: 'DELETE' }).then(function () {
          var parent = state.editing && state.editing.parent;
          toast('已删除');
          if (parent) {
            parent.episodes = null;
            state.editing = parent;
            render();
            return;
          }
          state.editing = null;
          return loadData().catch(function (error) { toast(error.message, true); });
        }).catch(function (error) {
          deleteButton.disabled = false;
          deleteButton.textContent = tr('删除');
          toast(error.message, true);
        });
      }
      foot.appendChild(deleteButton);
    }

    foot.appendChild(h('span', { class: 'spacer' }));

    var cancel = h('button', { type: 'button', class: 'btn', text: parent ? '返回系列' : '返回列表' });
    cancel.onclick = function () {
      if (parent) leaveEpisode(function () { render(); });
      else leaveEditor(function () { render(); });
    };
    foot.appendChild(cancel);

    var save = h('button', { type: 'button', class: 'btn primary', text: '保存' });
    save.onclick = function () {
      save.disabled = true;
      save.textContent = tr('保存中…');
      var path = '/admin/api/data/' + name;
      var method = 'POST';
      if (!isNew && item.id) {
        path += '/' + item.id;
        method = 'PUT';
      }
      api(path, { method: method, body: JSON.stringify(item) }).then(function () {
        var parent = state.editing && state.editing.parent;
        toast(isNew ? '已新增' : '已保存');
        if (parent) {
          // 回到系列页，并重新拉这个系列的单集
          parent.episodes = null;
          state.editing = parent;
          render();
          window.scrollTo({ top: 0, behavior: 'auto' });
          return;
        }
        state.editing = null;
        return loadData().catch(function (error) { toast(error.message, true); });
      }).catch(function (error) {
        save.disabled = false;
        save.textContent = tr('保存');
        toast(error.message, true);
      });
    };
    foot.appendChild(save);
    page.appendChild(foot);

    return page;
  }

  function closeModal() {
    var node = document.getElementById('modal-root');
    if (node) node.remove();
    document.body.classList.remove('modal-open');
  }

  function openAccount() {
    closeModal();
    var backdrop = h('div', { class: 'modal-backdrop', id: 'modal-root' });
    var modal = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' });
    var head = h('div', { class: 'modal-head' });
    var heading = h('div');
    heading.appendChild(h('h2', { text: '账号' }));
    heading.appendChild(h('div', { class: 'modal-sub', text: '修改管理员密码，其他设备会退出登录。' }));
    head.appendChild(heading);
    var close = h('button', { type: 'button', class: 'icon-btn', text: '×', 'aria-label': '关闭' });
    close.onclick = closeModal;
    head.appendChild(close);

    var body = h('div', { class: 'modal-body' });
    var current = h('input', { type: 'password', placeholder: '现在的密码', autocomplete: 'current-password' });
    var next = h('input', { type: 'password', placeholder: '至少 8 位', autocomplete: 'new-password' });
    var again = h('input', { type: 'password', placeholder: '再输一次', autocomplete: 'new-password' });
    body.appendChild(h('label', { class: 'field' }, [
      h('span', { class: 'field-label', text: '现在的密码' }), current
    ]));
    body.appendChild(h('label', { class: 'field' }, [
      h('span', { class: 'field-label', text: '新密码（至少 8 位）' }), next
    ]));
    body.appendChild(h('label', { class: 'field' }, [
      h('span', { class: 'field-label', text: '再输一次新密码' }), again
    ]));

    var foot = h('div', { class: 'modal-foot' });
    foot.appendChild(h('span', { class: 'spacer' }));
    var cancel = h('button', { type: 'button', class: 'btn', text: '取消' });
    cancel.onclick = closeModal;
    foot.appendChild(cancel);
    var save = h('button', { type: 'button', class: 'btn primary', text: '修改密码' });
    save.onclick = function () {
      if (next.value.length < 8) { toast('新密码至少 8 位', true); next.focus(); return; }
      if (next.value !== again.value) { toast('两次输入的新密码不一样', true); again.focus(); return; }
      save.disabled = true;
      save.textContent = tr('修改中…');
      api('/admin/api/password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: current.value, newPassword: next.value })
      }).then(function () {
        closeModal();
        toast('密码改好了，其他设备需要重新登录');
      }).catch(function (error) {
        save.disabled = false;
        save.textContent = tr('修改密码');
        toast(error.message, true);
      });
    };
    foot.appendChild(save);

    modal.appendChild(head);
    modal.appendChild(body);
    modal.appendChild(foot);
    backdrop.appendChild(modal);
    backdrop.onclick = function (event) {
      if (event.target === backdrop) closeModal();
    };
    document.body.appendChild(backdrop);
    document.body.classList.add('modal-open');
    window.setTimeout(function () { current.focus(); }, 0);
  }

  function passwordForm(container, fields, buttonLabel, onSubmit) {
    var form = h('form', { class: 'auth-form' });
    var inputs = [];
    fields.forEach(function (field) {
      var label = h('label', { class: 'field' });
      label.appendChild(h('span', { class: 'field-label', text: field.label }));
      var input = h('input', {
        type: field.type || 'password',
        placeholder: field.placeholder || '',
        autocomplete: field.autocomplete || 'current-password'
      });
      label.appendChild(input);
      inputs.push(input);
      form.appendChild(label);
    });

    var error = h('p', { class: 'form-error', role: 'alert' });
    var button = h('button', { type: 'submit', class: 'btn primary wide', text: buttonLabel });
    form.appendChild(button);
    form.appendChild(error);

    form.onsubmit = function (event) {
      event.preventDefault();
      error.textContent = '';
      button.disabled = true;
      var original = button.textContent;
      button.textContent = IS_EN ? 'Please wait…' : '请稍候…';
      onSubmit(inputs.map(function (input) { return input.value; }), function (message) {
        button.disabled = false;
        button.textContent = original;
        error.textContent = tr(message || '');
      });
    };

    container.appendChild(form);
  }

  function authScreen() {
    var wrap = h('div', { class: 'auth-wrap' });
    var card = h('div', { class: 'auth-card' });
    card.appendChild(h('img', { class: 'auth-logo', src: '/logo.webp?v=20261029', alt: A.alt }));

    // 设置页/登录页和后台其余栏目共用右上角的语言选择。
    var langRow = h('div', { style: 'display:flex; justify-content:flex-end; margin-bottom:6px;' });
    var langSwitch = h('button', { type: 'button', class: 'btn mini', text: A.langSwitch });
    langSwitch.onclick = function () {
      var next = IS_EN ? 'zh' : 'en';
      document.cookie = 'qjw_lang=' + next + '; Path=/; Max-Age=31536000; SameSite=Lax';
      window.location.href = window.location.pathname + '?lang=' + next;
    };
    langRow.appendChild(langSwitch);
    card.appendChild(langRow);

    if (state.canSetup) {
      card.appendChild(h('h1', { text: A.setupTitle }));
      card.appendChild(h('p', { class: 'hint', text: A.setupHint }));

      var setupFields = [];
      var codeIndex = -1;
      if (state.requiresSetupCode) {
        codeIndex = setupFields.length;
        setupFields.push({
          label: A.setupCode,
          placeholder: A.setupCodePlaceholder,
          type: 'text',
          autocomplete: 'one-time-code'
        });
      }
      var nameIndex = setupFields.length;
      setupFields.push({
        label: A.groupName,
        placeholder: A.groupNamePlaceholder,
        type: 'text',
        autocomplete: 'organization'
      });
      var passwordIndex = setupFields.length;
      setupFields.push({
        label: A.password,
        placeholder: A.passwordPlaceholder,
        autocomplete: 'new-password'
      });
      var confirmIndex = setupFields.length;
      setupFields.push({
        label: A.passwordAgain,
        placeholder: A.passwordAgainPlaceholder,
        autocomplete: 'new-password'
      });

      passwordForm(card, setupFields, A.setupButton, function (values, fail) {
        var setupCode = codeIndex >= 0 ? (values[codeIndex] || '').trim() : '';
        var groupName = (values[nameIndex] || '').trim();
        var password = values[passwordIndex] || '';
        if (codeIndex >= 0 && !setupCode) { fail(A.codeRequired); return; }
        if (!groupName) { fail(A.groupRequired); return; }
        if (password.length < 8) { fail(A.passwordShort); return; }
        if (password !== values[confirmIndex]) { fail(A.passwordMismatch); return; }
        api('/admin/api/setup', {
          method: 'POST',
          body: JSON.stringify({
            password: password,
            groupName: groupName,
            setupCode: setupCode,
            lang: LANG
          })
        }).then(function () {
          state.hasPassword = true;
          state.canSetup = false;
          state.initialized = true;
          state.authed = true;
          toast(A.setupDone);
          return loadData();
        }).catch(function (error) { fail(error.message); });
      });
      wrap.appendChild(card);
      return wrap;
    }

    card.appendChild(h('h1', { text: A.loginTitle }));
    card.appendChild(h('p', { class: 'hint', text: A.loginHint }));
    passwordForm(card, [
      { label: A.loginPassword, placeholder: A.loginPasswordPlaceholder }
    ], A.loginButton, function (values, fail) {
      api('/admin/api/login', {
        method: 'POST',
        body: JSON.stringify({ password: values[0], lang: LANG })
      }).then(function () {
        state.authed = true;
        toast(A.welcomeBack);
        return loadData();
      }).catch(function (error) { fail(error.message); });
    });
    wrap.appendChild(card);
    return wrap;
  }

  function render() {
    clear(app);
    clear(tabsEl);

    if (!state.ready) {
      setHeaderVisible(false);
      app.appendChild(h('p', { class: 'loading' }, [
        h('span', { class: 'spinner' }),
        h('span', { text: '正在加载…' })
      ]));
      return;
    }

    if (state.canSetup || !state.authed) {
      setHeaderVisible(false);
      app.appendChild(authScreen());
      return;
    }

    setHeaderVisible(true);
    if (!state.data) {
      app.appendChild(h('p', { class: 'loading' }, [
        h('span', { class: 'spinner' }),
        h('span', { text: '正在读取内容…' })
      ]));
      return;
    }

    // 单集栏目已经并进系列页；老的页面状态进来时兜底一下
    if (state.tab === 'episodes') state.tab = 'series';
    renderTabs();
    if (state.editing) {
      app.appendChild(editorPage());
      return;
    }
    app.appendChild(sectionContent());
    if (state.tab !== 'access' && state.tab !== 'sync') {
      app.appendChild(h('p', {
        class: 'footnote',
        text: IS_EN
          ? 'Press Ctrl / ⌘ + K to search the current section. Use “Bulk actions” to select several items and delete or publish them together. ' +
            (state.mediaEnabled ? 'The media library is searchable by file name. ' : 'This edition uses external image, audio, and video URLs. ') +
            'Saved changes take effect immediately.'
          : '按 Ctrl / ⌘ + K 可以快速搜索当前分类。点「批量管理」可以勾选多条一起删除或发布；' +
            (state.mediaEnabled ? '图片库也能按文件名搜索。' : '这个版本用外链图片和音视频。') +
            '改完的内容保存后立即生效。'
      }));
    }
  }

  refreshButton.onclick = function () {
    if (refreshButton.disabled) return;
    leaveEditor(function () {
      refreshButton.disabled = true;
      state.accessLoaded = false;
      loadData().then(function () {
        toast('已刷新');
      }).catch(function (error) {
        toast(error.message, true);
      }).then(function () {
        refreshButton.disabled = false;
      });
    });
  };

  accountButton.onclick = openAccount;

  logoutButton.onclick = function () {
    api('/admin/api/logout', { method: 'POST' }).then(function () {
      closeModal();
      state.authed = false;
      state.data = null;
      state.editing = null;
      state.media = [];
      render();
      toast('已退出');
    }).catch(function (error) { toast(error.message, true); });
  };

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (document.getElementById('picker-root')) closePicker();
      else closeModal();
    }
    if ((event.metaKey || event.ctrlKey) && String(event.key).toLowerCase() === 'k') {
      var input = document.getElementById('search-input') ||
        document.getElementById('media-search-input');
      if (input && !document.getElementById('modal-root') && !state.editing) {
        event.preventDefault();
        input.focus();
        input.select();
      }
    }
  });

  refresh();
})();
</script>
</body>
</html>`;
