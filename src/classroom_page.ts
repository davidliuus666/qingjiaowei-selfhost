export const CLASSROOM_PAGE_HTML = `<!doctype html>
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
    --accent-hover: #9fe062;
    --danger: #ff9b9b;
    --danger-bg: #3a1f22;
    --glow: rgba(139, 212, 80, .10);
    --header-bg: rgba(10, 10, 12, .88);
    --modal-backdrop: rgba(0, 0, 0, .62);
    --fab-line: #a5e070;
    --chip-bg: #23232a;
    --badge-off-text: #8d8d98;
    --surface-raised: #1d1d23;
    --row-meta: #66666f;
    --blank-text: #6c6c77;
    --info-text: #9cc7ff;
    --access-warning-bg: #2b1b1e;
    --access-warning-line: #5a2a30;
    --access-warning-text: #ffc2c2;
    --toast-bg: #1d1d23;
    --toast-err-bg: #2b1b1e;
    --toast-err-line: #5a2a30;
    --toast-err-text: #ffc2c2;
    --editor-fade: rgba(10, 10, 12, 0);
    --hover-bg: #15151a;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background:
      radial-gradient(900px 420px at 50% -180px, var(--glow), transparent 70%),
      var(--bg);
    color: var(--text);
    font: 15px/1.55 system-ui, -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif;
  }
  button, input, textarea, select { font: inherit; }
  button { color: inherit; }
  .grow { flex: 1; }
  .hidden { display: none !important; }

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
    max-width: 980px;
    margin: 0 auto;
    padding: 12px 20px;
  }
  .brand-logo { width: 26px; height: 26px; border-radius: 8px; object-fit: cover; }
  .brand { font-size: 16px; font-weight: 800; white-space: nowrap; }
  .brand span { margin-left: 6px; color: var(--muted); font-size: 13px; font-weight: 500; }
  .tabs-wrap { overflow-x: auto; scrollbar-width: none; }
  .tabs-wrap::-webkit-scrollbar { display: none; }
  .tabs { display: flex; gap: 2px; max-width: 980px; margin: 0 auto; padding: 0 12px; }
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
  .tab.on { color: var(--text); border-bottom-color: var(--accent); font-weight: 650; }
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
  .tab .soon { color: var(--row-meta); font-size: 11px; }

  main { max-width: 980px; margin: 0 auto; padding: 22px 20px 80px; }

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
  }
  .btn:hover { border-color: #4a4a55; background: var(--surface-raised); }
  .btn:disabled { opacity: .5; cursor: default; }
  .btn.primary { border-color: transparent; background: var(--accent); color: var(--accent-ink); font-weight: 600; }
  .btn.primary:hover { background: var(--accent-hover); }
  .btn.danger { border-color: var(--access-warning-line); background: var(--danger-bg); color: var(--danger); }
  .btn.ghost { border-color: transparent; background: transparent; color: var(--muted); }
  .btn.ghost:hover { background: var(--panel-2); color: var(--text); }
  .btn.mini { min-height: 30px; padding: 4px 10px; border-radius: 9px; font-size: 12.5px; }

  .home-intro {
    margin-bottom: 18px;
    padding: 14px 16px;
    border: 1px solid var(--line);
    border-radius: 13px;
    background: var(--panel);
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
  }
  .home-intro strong { color: var(--text); }

  .toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 14px; }
  .search { position: relative; flex: 1 1 220px; min-width: 160px; }
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    display: inline-flex;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
  }
  .search input {
    width: 100%;
    height: 40px;
    padding: 0 14px 0 36px;
    border: 1px solid var(--line);
    border-radius: 11px;
    background: var(--panel);
    color: var(--text);
    outline: none;
  }
  .search input:focus { border-color: var(--line-strong); }
  .list-meta { margin: 0 2px 10px; color: var(--muted); font-size: 12.5px; }
  .list { display: flex; flex-direction: column; gap: 8px; }
  .row {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr) auto;
    align-items: center;
    gap: 13px;
    width: 100%;
    padding: 12px;
    border: 1px solid var(--line);
    border-radius: 13px;
    background: var(--panel);
    color: var(--text);
    text-align: left;
    cursor: pointer;
  }
  .row:hover { border-color: var(--line-strong); background: var(--hover-bg); }
  .thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: var(--surface-raised);
    color: var(--muted);
    font-size: 17px;
    font-weight: 700;
    overflow: hidden;
  }
  .thumb-mark { color: var(--accent); }
  .row-main { min-width: 0; }
  .row-title { overflow: hidden; font-size: 14.5px; font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
  .row-sub { margin-top: 4px; color: var(--muted); font-size: 12.5px; }
  .row-meta { margin-top: 3px; color: var(--row-meta); font-size: 11.5px; }
  .row-side { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
  .row-hint { color: var(--muted); font-size: 12px; }
  .badge { padding: 2px 8px; border-radius: 999px; background: var(--chip-bg); color: var(--muted); font-size: 11px; }
  .badge.on { background: rgba(139, 212, 80, .14); color: var(--accent); }
  .badge.info { background: rgba(120, 180, 255, .12); color: var(--info-text); }
  .badge.off { background: var(--chip-bg); color: var(--badge-off-text); }

  .loading { display: flex; align-items: center; gap: 9px; padding: 22px 2px; color: var(--muted); font-size: 13px; }
  .spinner {
    width: 15px;
    height: 15px;
    border: 2px solid var(--line-strong);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .empty {
    padding: 34px 18px;
    border: 1px dashed var(--line-strong);
    border-radius: 14px;
    color: var(--muted);
    text-align: center;
  }
  .empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    margin-bottom: 10px;
    border-radius: 12px;
    background: var(--surface-raised);
    color: var(--accent);
    font-weight: 700;
  }
  .empty p { margin: 6px 0; }
  .empty .btn { margin-top: 10px; }

  .editor-page { display: flex; flex-direction: column; }
  .editor-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 4px 0 14px;
    border-bottom: 1px solid var(--line);
  }
  .editor-back {
    padding: 6px 10px;
    border: 1px solid var(--line);
    border-radius: 9px;
    background: var(--panel);
    color: var(--muted);
    font-size: 12.5px;
    cursor: pointer;
  }
  .editor-back:hover { color: var(--text); border-color: var(--line-strong); }
  .editor-head h2 { margin: 0; font-size: 20px; }
  .editor-sub { margin-top: 3px; color: var(--muted); font-size: 12.5px; }
  .editor-dirty { width: 100%; color: var(--accent); font-size: 12px; }
  .editor-body { padding: 18px 0 24px; }

  .field { display: block; margin-bottom: 16px; }
  .field-label { display: block; margin-bottom: 6px; color: var(--muted); font-size: 12.5px; }
  .field input, .field textarea, .field select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--panel);
    color: var(--text);
    outline: none;
  }
  .field textarea { resize: vertical; line-height: 1.6; }
  .field input:focus, .field textarea:focus, .field select:focus { border-color: var(--line-strong); }
  .check-row {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin: 2px 0 18px;
    color: var(--text);
    font-size: 13.5px;
    line-height: 1.5;
    cursor: pointer;
  }
  .check-row input { width: 17px; height: 17px; margin: 2px 0 0; accent-color: var(--accent); }
  .check-hint { margin: -10px 0 18px 26px; color: var(--muted); font-size: 12px; line-height: 1.6; }

  .quiz-question {
    margin-bottom: 12px;
    padding: 14px;
    border: 1px solid var(--line);
    border-radius: 13px;
    background: var(--panel-2);
  }
  .quiz-q-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .quiz-q-head h3 { flex: 1; margin: 0; font-size: 14px; }
  .quiz-q-tools { display: flex; gap: 6px; }
  .quiz-question .field:last-child { margin-bottom: 0; }
  .quiz-submissions-head { display: flex; align-items: center; gap: 8px; margin: 24px 0 10px; }
  .quiz-submissions-head h3 { margin: 0; font-size: 15px; }
  .quiz-submissions-head .count { color: var(--muted); font-size: 12.5px; }
  .quiz-grade-entry {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    margin: 4px 0 22px;
    padding: 14px 16px;
    border: 1px solid var(--line);
    border-radius: 13px;
    background: var(--panel-2);
    color: var(--text);
    text-align: left;
    cursor: pointer;
  }
  .quiz-grade-entry:hover { border-color: var(--line-strong); }
  .quiz-grade-entry .main { flex: 1; min-width: 0; }
  .quiz-grade-entry .title { font-size: 14px; font-weight: 600; }
  .quiz-grade-entry .sub { margin-top: 3px; color: var(--muted); font-size: 12px; }
  .quiz-grade-entry .arrow { color: var(--muted); font-size: 19px; }
  .quiz-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .quiz-add-fab {
    position: fixed;
    right: 24px;
    bottom: 86px;
    z-index: 8;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 18px;
    border: 1px solid var(--fab-line);
    border-radius: 999px;
    background: var(--accent);
    color: var(--accent-ink);
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 10px 28px rgba(0, 0, 0, .5);
  }
  .quiz-add-fab:hover { background: var(--accent-hover); }
  .quiz-answer {
    margin-bottom: 10px;
    padding: 12px 14px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--panel-2);
  }
  .quiz-answer .prompt { margin-bottom: 6px; font-size: 13.5px; font-weight: 600; white-space: pre-wrap; }
  .quiz-answer .answer { color: var(--muted); font-size: 13.5px; white-space: pre-wrap; }
  .quiz-answer .answer.blank { color: var(--blank-text); font-style: italic; }
  .quiz-answer-key {
    margin-top: 9px;
    padding-top: 9px;
    border-top: 1px dashed var(--line);
    color: var(--muted);
    font-size: 12.5px;
    line-height: 1.6;
    white-space: pre-wrap;
  }
  .quiz-answer-key b { color: var(--accent); font-weight: 600; }
  .quiz-answer-key .same { margin-left: 8px; color: var(--accent); }
  .quiz-answer-key .diff { margin-left: 8px; color: var(--danger); }
  .quiz-paper-meta { margin: 4px 0 18px; color: var(--muted); font-size: 12.5px; }
  .access-warning {
    margin-bottom: 18px;
    padding: 12px 14px;
    border: 1px solid var(--access-warning-line);
    border-radius: 12px;
    background: var(--access-warning-bg);
    color: var(--access-warning-text);
    font-size: 12.5px;
    line-height: 1.6;
  }
  .series-ep-empty {
    padding: 18px;
    border: 1px dashed var(--line-strong);
    border-radius: 12px;
    color: var(--muted);
    font-size: 13px;
    text-align: center;
  }
  .homework-answer {
    margin-bottom: 12px;
    padding: 14px;
    border: 1px solid var(--line);
    border-radius: 13px;
    background: var(--panel-2);
  }
  .homework-answer .prompt {
    margin-bottom: 7px;
    font-size: 14px;
    font-weight: 600;
    white-space: pre-wrap;
  }
  .homework-answer .answer {
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--panel);
    color: var(--text);
    font-size: 13.5px;
    line-height: 1.65;
    white-space: pre-wrap;
  }
  .homework-answer .answer.blank { color: var(--blank-text); font-style: italic; }
  .homework-grade-grid {
    display: grid;
    grid-template-columns: minmax(0, 150px) minmax(0, 1fr);
    gap: 10px;
    margin-top: 12px;
  }
  .homework-grade-grid .field { margin-bottom: 0; }
  .homework-note {
    margin: 14px 0;
    padding: 12px 14px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--panel);
    color: var(--muted);
    font-size: 12.5px;
    line-height: 1.65;
  }
  .homework-note b { color: var(--text); }
  @media (max-width: 620px) {
    .homework-grade-grid { grid-template-columns: 1fr; }
  }

  .editor-foot {
    position: sticky;
    bottom: 0;
    z-index: 6;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
    border-top: 1px solid var(--line);
    background: linear-gradient(to top, var(--bg) 70%, var(--editor-fade));
  }
  .editor-foot .spacer { flex: 1; }

  .placeholder-page {
    padding: 46px 20px;
    border: 1px dashed var(--line-strong);
    border-radius: 16px;
    text-align: center;
    color: var(--muted);
  }
  .placeholder-page .mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    margin-bottom: 14px;
    border-radius: 16px;
    background: var(--surface-raised);
    color: var(--accent);
    font-size: 22px;
    font-weight: 700;
  }
  .placeholder-page h2 { margin: 0 0 8px; color: var(--text); font-size: 20px; }
  .placeholder-page p { margin: 6px 0; font-size: 13px; line-height: 1.7; }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: var(--modal-backdrop);
    backdrop-filter: blur(3px);
  }
  .confirm-card {
    width: 100%;
    max-width: 390px;
    padding: 20px;
    border: 1px solid var(--line-strong);
    border-radius: 16px;
    background: var(--panel-2);
    box-shadow: 0 24px 60px rgba(0, 0, 0, .55);
  }
  .confirm-card h2 { margin: 0 0 8px; font-size: 17px; }
  .confirm-text { margin: 0 0 18px; color: var(--muted); font-size: 13.5px; line-height: 1.65; }
  .confirm-actions { display: flex; justify-content: flex-end; gap: 9px; }

  .toast {
    position: fixed;
    left: 50%;
    bottom: 26px;
    z-index: 80;
    max-width: min(92vw, 460px);
    padding: 11px 16px;
    border: 1px solid var(--line-strong);
    border-radius: 12px;
    background: var(--surface-raised);
    color: var(--text);
    font-size: 13.5px;
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, 10px);
    transition: opacity .18s, transform .18s;
  }
  .toast.show { opacity: 1; transform: translate(-50%, 0); }
  .toast.err { border-color: var(--access-warning-line); background: var(--access-warning-bg); color: var(--access-warning-text); }

  @media (max-width: 620px) {
    .header-inner { padding: 10px 14px; }
    .brand span { display: none; }
    .brand { font-size: 15px; }
    .tabs { padding: 0 8px; }
    main { padding: 16px 14px 76px; }
    .row { grid-template-columns: 44px minmax(0, 1fr) auto; gap: 11px; padding: 10px; }
    .thumb { width: 44px; height: 44px; border-radius: 10px; }
    .row-meta, .row-hint { display: none; }
    .search { flex-basis: 100%; }
    .toolbar > .btn.primary { margin-left: auto; }
    .quiz-add-fab { right: 14px; bottom: 78px; padding: 11px 15px; }
  }

  /* 跟随系统：浅色模式下整套换成米白底；手动选深色时这段不生效 */
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
      --glow: rgba(76, 143, 43, .06);
      --header-bg: rgba(255, 255, 255, .88);
      --modal-backdrop: rgba(20, 26, 18, .35);
      --fab-line: #5f8a47;
      --chip-bg: #e7ebe2;
      --badge-off-text: #646b60;
      --surface-raised: #ffffff;
      --row-meta: #6f776b;
      --blank-text: #7a8175;
      --info-text: #2e5f9e;
      --access-warning-bg: #fdeceb;
      --access-warning-line: #e3b4b0;
      --access-warning-text: #b3261e;
      --toast-bg: #ffffff;
      --toast-err-bg: #fdeceb;
      --toast-err-line: #e3b4b0;
      --toast-err-text: #b3261e;
      --editor-fade: rgba(244, 246, 241, 0);
      --hover-bg: #eef2ea;
    }
    .confirm-card { background: var(--panel); }
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
    --glow: rgba(76, 143, 43, .06);
    --header-bg: rgba(255, 255, 255, .88);
    --modal-backdrop: rgba(20, 26, 18, .35);
    --fab-line: #5f8a47;
    --chip-bg: #e7ebe2;
    --badge-off-text: #646b60;
    --surface-raised: #ffffff;
    --row-meta: #6f776b;
    --blank-text: #7a8175;
    --info-text: #2e5f9e;
    --access-warning-bg: #fdeceb;
    --access-warning-line: #e3b4b0;
    --access-warning-text: #b3261e;
    --toast-bg: #ffffff;
    --toast-err-bg: #fdeceb;
    --toast-err-line: #e3b4b0;
    --toast-err-text: #b3261e;
    --editor-fade: rgba(244, 246, 241, 0);
    --hover-bg: #eef2ea;
  }
  :root[data-theme="light"] .confirm-card { background: var(--panel); }
</style>
</head>
<body>
<header>
  <div class="header-inner">
    <img class="brand-logo" src="/logo.webp?v=20261029" alt="青椒味" width="26" height="26" />
    <div class="brand">课堂<span>测验 · 作业 · 通知</span></div>
    <span class="grow"></span>
    <button id="lang" class="btn ghost" type="button">English</button>
    <button id="theme" class="btn ghost" type="button" title="切换管理后台外观">跟随系统</button>
    <a id="admin-link" class="btn ghost" href="/admin">管理后台</a>
  </div>
  <div class="tabs-wrap"><div id="tabs" class="tabs"></div></div>
</header>
<main id="app"><p class="loading"><span class="spinner"></span>__QJW_LOADING__</p></main>
<div id="toast" class="toast" role="status"></div>
<script>
(function () {
  'use strict';

  var NEWLINE = String.fromCharCode(10);
  var SEARCH_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.2-3.2"></path></svg>';

  // 服务端按 ?lang= > cookie > Accept-Language 算好语言再注入，页面不会先闪中文。
  var LANG = '__QJW_LANG__' === 'en' ? 'en' : 'zh';
  var IS_EN = LANG === 'en';

  var EN = {
    '课堂': 'Classroom',
    '测验': 'Quizzes',
    '作业': 'Homework',
    '通知': 'Notices',
    '待做': 'Soon',
    '管理后台': 'Admin',
    '取消': 'Cancel',
    '删除': 'Delete',
    '保存': 'Save',
    '已发布': 'Published',
    '草稿': 'Draft',
    '已批改': 'Graded',
    '已发回修正': 'Returned',
    '已发回': 'Returned',
    '待批改': 'Needs grading',
    '未提交': 'Not submitted',
    '已锁定': 'Locked',
    '锁定': 'Locked',
    '全部': 'All',
    '返回列表': 'Back to list',
    '上移': 'Move up',
    '下移': 'Move down',
    '关闭': 'Close',
    '再试一次': 'Try again',
    '正在读取…': 'Loading…',
    '正在加载…': 'Loading…',

    '小组测验': 'Group quizzes',
    ' 发布后，App 小组页的课堂里会出现「新测验：标题」。编辑题目和批改是分开的两个页面；一台手机同一个测验只能交一份；离开测验页面超过 5 秒或截屏会锁定，可以在批改页解除。': ' Once published, “New quiz: title” appears in Classroom on the group page. Questions and grading live on separate pages. One phone can submit a quiz once. Leaving the quiz for more than 5 seconds or taking a screenshot locks it; you can unlock it on the grading page.',
    '搜索测验…': 'Search quizzes…',
    '搜索测验': 'Search quizzes',
    '+ 新建测验': '+ New quiz',
    '正在新建…': 'Creating…',
    '正在读取测验…': 'Loading quizzes…',
    '还没有测验': 'No quizzes yet',
    '点右上角「新建测验」，发布后会出现在 App 的小组课堂里。': 'Use “New quiz” in the top right. After publishing, it appears in Classroom in the app.',
    '没有匹配的测验': 'No matching quizzes',
    '（未命名测验）': '(Untitled quiz)',
    '测': 'Q',
    '作': 'H',
    '通': 'N',
    '最近修改': 'Last edited',
    '测验建好了，接着填题目': 'Quiz created. Add the questions next.',
    '编辑测验': 'Edit quiz',
    '测验标题': 'Quiz title',
    '例如：腓立比书 第二章': 'e.g. Philippians 2',
    '说明（学生开始答题前会看到）': 'Description (shown before students start)',
    '例如：这周的查经作业，共 5 题，认真读经后再填写。': 'e.g. This week’s Bible study has 5 questions. Read the passage carefully first.',
    '批改作答': 'Grade submissions',
    '还没有人交卷': 'No submissions yet',
    '还没有人提交': 'No submissions yet',
    '一个测验最多 50 道题': 'A quiz can have up to 50 questions',
    '删除测验': 'Delete quiz',
    '删除这个测验？': 'Delete this quiz?',
    '题目和已经收上来的作答都会一起删掉，不能恢复。': 'Questions and submitted answers will also be deleted. This cannot be undone.',
    '测验已删除': 'Quiz deleted',
    '测验标题不能为空': 'Quiz title is required',
    '这个测验打不开': 'This quiz cannot be opened',
    '测验打不开': 'Quiz cannot be opened',
    '有未保存的修改': 'Unsaved changes',
    '保存中…': 'Saving…',
    '已保存': 'Saved',
    '题目': 'Question',
    '+ 添加题目': '+ Add question',
    '把题目写在这里': 'Write the question here',
    '题型': 'Question type',
    '单选（几个选项选一个）': 'Multiple choice (pick one)',
    '简答（自己写一段）': 'Short answer',
    '选项（一行一个，2–8 个）': 'Options (one per line, 2–8)',
    '正确答案（选填，只有后台能看到，批改时给你当参考）': 'Correct answer (optional; only visible in admin, shown as a grading reference)',
    '例如：参考答案的要点': 'e.g. Key points for the answer',
    '（不设置）': '(Not set)',
    '删除这道题？': 'Delete this question?',
    '保存后这道题会从测验里移除，已经收到的对应答案也会一起删掉。': 'After saving, this question is removed from the quiz and any matching answers are deleted.',
    '单选题至少要两个选项': 'Multiple-choice questions need at least two options',
    '题干不能为空': 'Question text is required',
    '题目格式不对': 'Invalid question format',
    '读取测验失败': 'Could not load quizzes',
    '查看 ›': 'View ›',
    '成绩': 'Grade',
    '原因：': 'Reason: ',
    '← 返回测验列表': '← Back to quizzes',
    '← 返回测验编辑': '← Back to quiz editor',
    '题目还有没保存的修改，去批改会丢掉这些修改。': 'This quiz has unsaved changes. Going to grading will discard them.',
    '先打开一个测验再进来。': 'Open a quiz first.',
    '还没有打开测验': 'No quiz opened',
    '还没有人作答': 'No submissions yet',
    '这个分类里还没有作答': 'No submissions in this filter.',
    '返回测验编辑': 'Back to quiz editor',
    '读取作答失败': 'Could not load submission',
    '这份作答打不开': 'This submission cannot be opened',
    '正在读取作答…': 'Loading submission…',
    '锁定原因：': 'Lock reason: ',
    '这份作答被锁定了。': 'This submission is locked.',
    ' 学生中途离开了测验页面超过 5 秒，或者尝试截屏。可以在这里解锁：已经写的内容会保留，学生重新打开测验就能接着写。': ' The student left the quiz for more than 5 seconds or tried to take a screenshot. You can unlock it here: what they wrote is kept, and they can continue when they reopen the quiz.',
    '还没有写到任何题目。': 'No answers written yet.',
    '参考答案：': 'Reference answer: ',
    '作答一致': 'Matches',
    '作答不一致': 'Does not match',
    '成绩（填分数或 A–E 等级都行）': 'Score (number or A–E)',
    '例如：85 或者 A': 'e.g. 85 or A',
    '评语（学生能看到，可留空）': 'Comment (visible to the student; optional)',
    '允许这名学生查看题目、自己的作答和参考答案': 'Allow this student to see the questions, their answers, and the reference answers',
    '勾上以后，学生的成绩和评语下面会多一个「查看题目」按钮；不勾就看不到。每次保存批改都会按这里的勾选来。': 'When checked, a “View questions” button appears below the student’s grade and comment. Unchecked means they cannot see it. Each save uses this setting.',
    '保存批改': 'Save grading',
    '请填写成绩或等级': 'Enter a score or grade',
    '批改已保存，学生能看到成绩、题目和参考答案': 'Grading saved. The student can see the score, questions, and reference answers.',
    '批改已保存，学生只能看到成绩和评语': 'Grading saved. The student can only see the score and comment.',
    '解除锁定，允许继续作答': 'Unlock and allow the student to continue',
    '解锁中…': 'Unlocking…',
    '已解除锁定，学生重新打开测验就能接着写': 'Unlocked. The student can reopen the quiz and continue.',
    '这份作答还没提交（学生写了一半，或者被锁定了）。': 'This submission is not complete (the student is still writing or it was locked).',
    '删除这份作答': 'Delete submission',
    '删除这份作答？': 'Delete this submission?',
    '删除后这台手机可以重新做这个测验，已经写的内容不能恢复。': 'This phone can retake the quiz after deletion. Written answers cannot be recovered.',
    '已删除，这台手机可以重做': 'Deleted. This phone can retake the quiz.',

    '课堂作业': 'Class homework',
    ' 作业是一份轻量问卷：学生在截止前随便改，草稿留在手机上，老师看不到；提交后老师逐题打分/写评语，最后选「无需修正」定稿或「发回修正」。': ' Homework is a lightweight questionnaire. Students can edit until the due time; drafts stay on their phone and teachers cannot see them. After submission, teachers grade each question and either finalize or return it for revision.',
    '搜索作业…': 'Search homework…',
    '搜索作业': 'Search homework',
    '+ 新建作业': '+ New homework',
    '正在读取作业…': 'Loading homework…',
    '检查一下网络，再试一次。': 'Check your connection and try again.',
    '没有匹配的作业': 'No matching homework',
    '换个关键词试试。': 'Try another keyword.',
    '还没有作业': 'No homework yet',
    '点右上角「新建作业」，发布后会出现在 App 的课堂里。': 'Use “New homework” in the top right. After publishing, it appears in Classroom in the app.',
    '（未命名作业）': '(Untitled homework)',
    '管理 ›': 'Manage ›',
    '放弃未保存的修改？': 'Discard unsaved changes?',
    '这份作业还有没保存的内容，离开后这些修改就没了。': 'This homework has unsaved changes. They will be lost if you leave.',
    '放弃修改': 'Discard changes',
    '题干': 'Question text',
    '把问题写在这里': 'Write the question here',
    '保存后这道题会从作业里移除，已经收到的对应答案也会一起删掉。': 'After saving, this question is removed from the homework and matching answers are deleted.',
    '（没写名字）': '(No name)',
    '批改 ›': 'Grade ›',
    '编辑作业': 'Edit homework',
    '作业标题': 'Homework title',
    '例如：腓立比书第二章作业': 'e.g. Philippians 2 homework',
    '说明（学生打开作业时会看到，可留空）': 'Description (shown to students; optional)',
    '例如：读完经文再回答，用自己的话写就行。': 'e.g. Read the passage first, then answer in your own words.',
    '截止时间（北京时间，过了就不能再提交）': 'Due time (Beijing time; no submissions after this)',
    '发布到 App（关掉就是草稿，学生看不到）': 'Publish to app (off = draft, hidden from students)',
    '批改提交': 'Grade submissions',
    '作业标题不能为空': 'Homework title is required',
    '请设置截止时间': 'Set a due time',
    '至少加一道题再发布': 'Add at least one question before publishing',
    '删除作业': 'Delete homework',
    '删除这份作业？': 'Delete this homework?',
    '题目和已经收到的提交都会一起删掉，不能恢复。': 'Questions and submissions will also be deleted. This cannot be undone.',
    '删除中…': 'Deleting…',
    '作业已删除': 'Homework deleted',
    '作业已创建': 'Homework created',
    '作业已创建，学生可以看到了': 'Homework created. Students can see it now.',
    '作业已创建，还是草稿': 'Homework created. Still a draft.',
    '，学生可以看到了': ', students can see it',
    '，还是草稿': ', still a draft',
    '作业打不开': 'Homework cannot be opened',
    '这份作业打不开': 'This homework cannot be opened',
    '读取作业失败': 'Could not load homework',
    '← 返回作业列表': '← Back to homework',
    '← 返回作业编辑': '← Back to homework editor',
    '返回作业编辑': 'Back to homework editor',
    '新建作业：填好内容、截止时间和题目，再保存': 'New homework: fill in the content, due time, and questions, then save',
    '还没有题目，点「添加题目」开始。单选题至少要有两个选项。': 'No questions yet. Use “Add question” to start. Multiple-choice questions need at least two options.',
    '一份作业最多 30 道题': 'A homework assignment can have up to 30 questions',
    '还没有人提交。学生提交之后才会出现在这里。': 'No submissions yet. They appear here after students submit.',
    '还没有人作答。发布后，学生交卷就会出现在这里。': 'No submissions yet. They appear here after students submit a quiz.',
    '先打开一份作业再进来。': 'Open a homework assignment first.',
    '还没有打开作业': 'No homework opened',
    '这个分类里还没有提交。': 'No submissions in this filter.',
    '读取提交失败': 'Could not load submissions',
    '← 返回批改列表': '← Back to submissions',
    '逐题批改': 'Grade by question',
    '这份提交打不开': 'This submission cannot be opened',
    '正在读取提交…': 'Loading submission…',
    '学生': 'Student',
    ' 的作业': '’s homework',
    '设备：': 'Device: ',
    '状态：': 'Status: ',
    '提交：': 'Submitted: ',
    '逐题批改：': 'Grade each question: ',
    '每道题的分数和评语可以只填一个。全部题都至少有一项后，才能定稿或发回修正。': 'A score or a comment is enough for each question. Every question needs at least one before you can finalize or return.',
    '已发回修正。': 'Returned for revision.',
    '学生现在可以修改并重新提交；这轮批改学生能看到。重新提交后，再回到这里重新批。': 'The student can edit and submit again. They can see this round of grading. After resubmission, come back and grade again.',
    '已经定稿。': 'Finalized.',
    '学生看到的就是下面这份逐题结果，作业不能再修改。': 'The student sees the per-question result below. The homework can no longer be edited.',
    '（题目已删除）': '(Question deleted)',
    '（没有作答）': '(No answer)',
    '分数/等级（选填）': 'Score/grade (optional)',
    '例如：8 或 A': 'e.g. 8 or A',
    '评语（选填）': 'Comment (optional)',
    '这一题写得怎么样？': 'How did they do on this question?',
    '这份作业还没有题目。': 'This homework has no questions yet.',
    '批改进度已保存': 'Grading progress saved',
    '已定稿，学生能看到逐题结果': 'Finalized. The student can see the per-question result.',
    '已发回修正，学生可以改了': 'Returned. The student can edit it now.',
    '返回批改列表': 'Back to submissions',
    '保存进度': 'Save progress',
    '发回修正': 'Return for revision',
    '发回修正？': 'Return for revision?',
    '学生可以重新修改并再次提交；这轮逐题批改学生能看到，重新提交后需要你重新批。': 'The student can edit and submit again. They can see this round of grading. After resubmission, you need to grade again.',
    '无需修正，定稿': 'No revision needed, finalize',
    '定稿？': 'Finalize?',
    '定稿后学生看到逐题结果，作业不能再修改。': 'After finalizing, the student sees the per-question result and the homework cannot be edited.',
    '定稿': 'Finalize',

    '课堂通知': 'Classroom notices',
    ' 发布后，App 的课堂流里会出现「通知：标题」，和测验按发布时间排在一起；学生点一下就能看通知全文。': ' After publishing, “Notice: title” appears in the Classroom feed in the app, ordered with quizzes by publish time. Students can tap it to read the full notice.',
    '搜索通知…': 'Search notices…',
    '搜索通知': 'Search notices',
    '+ 新建通知': '+ New notice',
    '正在读取通知…': 'Loading notices…',
    '没有匹配的通知': 'No matching notices',
    '还没有通知': 'No notices yet',
    '点右上角「新建通知」，发布后会出现在 App 的课堂里。': 'Use “New notice” in the top right. After publishing, it appears in Classroom in the app.',
    '（未命名通知）': '(Untitled notice)',
    '编辑通知': 'Edit notice',
    '新建通知': 'New notice',
    '填好标题和内容，勾选发布再保存': 'Fill in the title and body, check publish, then save',
    '通知标题': 'Notice title',
    '例如：下周三聚会改到线上': 'e.g. Next Wednesday’s meeting is now online',
    '通知内容': 'Notice body',
    '把要通知的事情写清楚，可以分行。': 'Write the notice clearly. Line breaks are fine.',
    '删除通知': 'Delete notice',
    '删除这条通知？': 'Delete this notice?',
    '删除后 App 里也会消失，不能恢复。': 'It will also disappear from the app. This cannot be undone.',
    '通知已删除': 'Notice deleted',
    '读取通知失败': 'Could not load notices',
    '通知标题不能为空': 'Notice title is required',
    '通知内容不能为空': 'Notice body is required',
    '已发布，App 课堂里能看到': 'Published. It is visible in Classroom in the app.',
    '已保存，学生可以看到了': 'Saved. Students can see it now.',
    '已保存，还是草稿': 'Saved. Still a draft.',
    '这条通知已经不在列表里了': 'This notice is no longer in the list',
    '这条通知还有没保存的内容，离开后这些修改就没了。': 'This notice has unsaved changes. They will be lost if you leave.',
    '← 返回通知列表': '← Back to notices',
    '通知：标题': 'Notice: title',

    // 服务端会把这些错误原文返回给页面，EN 下由 tr() 翻成英文。
    '截止时间格式不对': 'Invalid due time',
    '找不到这份作业': 'This homework cannot be found',
    '找不到这个测验': 'This quiz cannot be found',
    '保存失败，请再试一次': 'Could not save. Try again.',
    '提交失败，请再试一次': 'Could not submit. Try again.',
    '这个测验已经下架了': 'This quiz is no longer available',
    '这个测验已经交过了，不能再改': 'This quiz was already submitted and cannot be changed',
    '这个测验还没有题目': 'This quiz has no questions yet',
    '这份作业已经下架了': 'This homework is no longer available',
    '这份作业现在不能批改': 'This homework cannot be graded right now',
    '这份作业还没有题目': 'This homework has no questions yet',
    '这份作答现在不能批改': 'This submission cannot be graded right now',
    '这份作答没有被锁定': 'This submission is not locked',
    '还有题目没有作答': 'Some questions are not answered',
    '还有题目没有打分或写评语': 'Some questions need a score or comment',
    '请先填写姓名': 'Enter your name first',
    '作业已经截止，不能再提交': 'The due time has passed; it can no longer be submitted',
    '作业已经批改完成，不能再改': 'This homework was finalized and cannot be changed',
    '已经提交了，不能重做': 'Already submitted; it cannot be redone',
    '已经提交了，等老师批改': 'Already submitted. Waiting for the teacher to grade.',
    '作答已锁定，请联系发布者解除锁定': 'This submission is locked. Contact the organizer to unlock it.'
  };

  function tr(text) {
    if (text == null) return '';
    var value = String(text);
    if (!IS_EN) return value;
    if (Object.prototype.hasOwnProperty.call(EN, value)) return EN[value];
    var match;
    if ((match = /^共 ([0-9]+) 份作业$/.exec(value))) return match[1] + (match[1] === '1' ? ' homework assignment' : ' homework assignments');
    if ((match = /^找到 ([0-9]+) 份作业$/.exec(value))) return match[1] + ' found';
    if ((match = /^共 ([0-9]+) 条通知$/.exec(value))) return match[1] + (match[1] === '1' ? ' notice' : ' notices');
    if ((match = /^找到 ([0-9]+) 条通知$/.exec(value))) return match[1] + ' found';
    if ((match = /^共 ([0-9]+) 个测验$/.exec(value))) return match[1] + (match[1] === '1' ? ' quiz' : ' quizzes');
    if ((match = /^找到 ([0-9]+) 个测验$/.exec(value))) return match[1] + ' found';
    if ((match = /^共 ([0-9]+) 题$/.exec(value))) return match[1] + (match[1] === '1' ? ' question' : ' questions');
    if ((match = /^([0-9]+) 题$/.exec(value))) return match[1] + (match[1] === '1' ? ' question' : ' questions');
    if ((match = /^共 ([0-9]+) 份$/.exec(value))) return match[1] + (match[1] === '1' ? ' submission' : ' submissions');
    if ((match = /^([0-9]+) 份$/.exec(value))) return match[1] + (match[1] === '1' ? ' submission' : ' submissions');
    if ((match = /^截止 (.+)$/.exec(value))) return 'Due ' + match[1];
    if ((match = /^提交 (.+)$/.exec(value))) return 'Submitted ' + match[1];
    if ((match = /^最近修改 (.+)$/.exec(value))) return 'Last edited ' + match[1];
    if ((match = /^已交 ([0-9]+)$/.exec(value))) return match[1] + ' submitted';
    if ((match = /^待批 ([0-9]+)$/.exec(value))) return match[1] + ' to grade';
    if ((match = /^待批改 ([0-9]+)( 份)?$/.exec(value))) return match[1] + ' to grade';
    if ((match = /^已批改 ([0-9]+)$/.exec(value))) return match[1] + ' graded';
    if ((match = /^发回 ([0-9]+)$/.exec(value))) return match[1] + ' returned';
    if ((match = /^已发回 ([0-9]+)$/.exec(value))) return match[1] + ' returned';
    if ((match = /^锁定 ([0-9]+) 份$/.exec(value))) return match[1] + ' locked';
    if ((match = /^成绩 (.+)$/.exec(value))) return 'Grade ' + match[1];
    if ((match = /^编号 #([0-9]+) · 保存后 App 里立刻更新$/.exec(value))) return 'ID #' + match[1] + ' · Updates in the app immediately after saving';
    if ((match = /^编号 #([0-9]+) · 这一页只改题目，批改在另一个页面$/.exec(value))) return 'ID #' + match[1] + ' · This page only edits questions; grade on the other page';
    if ((match = /^第 ([0-9]+) 题$/.exec(value))) return 'Question ' + match[1];
    if ((match = /^第 ([0-9]+) 题 · (.+)$/.exec(value))) return 'Question ' + match[1] + ' · ' + match[2];
    if ((match = /^编号 #([0-9]+) · 截止 (.+) · 这一页只改题目，批改在另一个页面$/.exec(value))) {
      return 'ID #' + match[1] + ' · Due ' + match[2] + ' · This page only edits questions; grade on the other page';
    }
    if ((match = /^第 ([0-9]+) 题的题干还没写$/.exec(value))) return 'Question ' + match[1] + ' needs text';
    if ((match = /^第 ([0-9]+) 题至少要有两个选项$/.exec(value))) return 'Question ' + match[1] + ' needs at least two options';
    if ((match = /^第 ([0-9]+) 题还没有打分或写评语$/.exec(value))) return 'Question ' + match[1] + ' needs a score or comment';
    if ((match = /^提交 ([0-9]+)$/.exec(value))) return 'Submitted ' + match[1];
    if ((match = /^锁定 ([0-9]+)$/.exec(value))) return 'Locked ' + match[1];
    if ((match = /^(.+) 的作答$/.exec(value))) return tr(match[1]) + '’s submission';
    if ((match = /^(.+) 的作业$/.exec(value))) return tr(match[1]) + '’s homework';
    return value;
  }

  var BEIJING_OFFSET = 8 * 60 * 60 * 1000;

  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  function clip(text, max) {
    if (!text) return '';
    var flat = String(text).split(String.fromCharCode(10)).join(' ').split(String.fromCharCode(13)).join(' ').trim();
    return flat.length > max ? flat.slice(0, max) + '…' : flat;
  }

  function dateLabel(value, withTime) {
    if (!value) return '';
    var date = new Date(value);
    if (isNaN(date.getTime())) return '';
    var d = new Date(date.getTime() + BEIJING_OFFSET);
    var now = new Date(Date.now() + BEIJING_OFFSET);
    var label = (d.getUTCFullYear() === now.getUTCFullYear() ? '' : d.getUTCFullYear() + '/') +
      (d.getUTCMonth() + 1) + '/' + d.getUTCDate();
    if (withTime) label += ' ' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes());
    return label;
  }

  /** UTC ISO → 北京时间 'YYYY-MM-DDTHH:mm'，直接放 datetime-local */
  function toBeijingInput(iso) {
    if (!iso) return '';
    var date = new Date(iso);
    if (isNaN(date.getTime())) return '';
    var d = new Date(date.getTime() + BEIJING_OFFSET);
    return d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate()) +
      'T' + pad2(d.getUTCHours()) + ':' + pad2(d.getUTCMinutes());
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

  /** 新建作业时默认给一周后的北京时间 23:59 */
  function defaultDueIso() {
    var d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    d.setUTCHours(15, 59, 0, 0);
    return d.toISOString();
  }

  var state = {
    tab: 'quizzes',
    quiz: {
      view: 'list',
      list: [],
      loaded: false,
      loading: false,
      error: '',
      query: '',
      creating: false,
      detail: null,
      detailLoading: false,
      detailError: '',
      snapshot: '',
      paper: null,
      paperLoading: false,
      paperError: '',
      gradeFilter: 'all'
    },
    notice: {
      view: 'list',
      list: [],
      loaded: false,
      loading: false,
      error: '',
      query: '',
      detail: null,
      snapshot: ''
    },
    homework: {
      view: 'list',
      list: [],
      loaded: false,
      loading: false,
      error: '',
      query: '',
      detail: null,
      detailLoading: false,
      detailError: '',
      snapshot: '',
      paper: null,
      paperLoading: false,
      paperError: '',
      filter: 'all'
    }
  };

  var app = document.getElementById('app');
  var tabsEl = document.getElementById('tabs');
  var themeButton = document.getElementById('theme');
  var langButton = document.getElementById('lang');
  var adminLink = document.getElementById('admin-link');

  if (IS_EN) {
    document.documentElement.lang = 'en';
    document.title = 'QJW · Classroom';
    var brandNode = document.querySelector('.brand');
    if (brandNode) brandNode.innerHTML = 'QJW<span>Classroom</span>';
    var brandLogo = document.querySelector('.brand-logo');
    if (brandLogo) brandLogo.alt = 'QJW';
    if (adminLink) adminLink.textContent = 'Admin';
  }
  if (langButton) {
    langButton.textContent = IS_EN ? '中文' : 'English';
    langButton.onclick = function () {
      var next = IS_EN ? 'zh' : 'en';
      document.cookie = 'qjw_lang=' + next + '; Path=/; Max-Age=31536000; SameSite=Lax';
      window.location.href = window.location.pathname + '?lang=' + next;
    };
  }

  // 课堂和管理后台共用同一个浏览器外观偏好。
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

  function h(tag, opts, kids) {
    var node = document.createElement(tag);
    opts = opts || {};
    var raw = opts.raw === true;
    Object.keys(opts).forEach(function (key) {
      var value = opts[key];
      if (key === 'class') node.className = value;
      else if (key === 'raw') { /* marker only */ }
      else if (key === 'text') node.textContent = value == null ? '' : (raw ? String(value) : tr(value));
      else if (key === 'placeholder' || key === 'title' || key === 'aria-label' || key === 'alt') {
        if (value !== null && value !== undefined) node.setAttribute(key, tr(value));
      }
      else if (key === 'onclick') node.onclick = value;
      else if (key === 'oninput') node.oninput = value;
      else if (key === 'onchange') node.onchange = value;
      else if (key === 'rows') node.rows = value;
      else if (value !== null && value !== undefined) node.setAttribute(key, String(value));
    });
    (kids || []).forEach(function (kid) { if (kid) node.appendChild(kid); });
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function api(path, options) {
    options = options || {};
    options.credentials = 'same-origin';
    options.headers = options.headers || {};
    if (IS_EN) options.headers['accept-language'] = 'en';
    if (typeof options.body === 'string') options.headers['content-type'] = 'application/json';
    return fetch(path, options).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) {
        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = '/admin';
            throw new Error(IS_EN ? 'Your session expired' : '登录已过期');
          }
          var error = new Error(body && body.error ? body.error : (IS_EN
            ? 'Request failed (' + response.status + ')'
            : '请求失败（' + response.status + '）'));
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
    node.textContent = tr(text);
    node.className = 'toast show' + (isError ? ' err' : '');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { node.className = 'toast'; }, isError ? 6000 : 3000);
  }

  function confirmAction(title, message, confirmLabel, onConfirm) {
    if (document.getElementById('confirm-root')) return;
    var backdrop = h('div', { class: 'modal-backdrop', id: 'confirm-root' });
    var card = h('div', { class: 'confirm-card', role: 'alertdialog', 'aria-modal': 'true' });
    card.appendChild(h('h2', { text: title }));
    card.appendChild(h('p', { class: 'confirm-text', text: message }));
    function close() {
      backdrop.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(event) { if (event.key === 'Escape') close(); }
    var actions = h('div', { class: 'confirm-actions' });
    var cancel = h('button', { type: 'button', class: 'btn', text: '取消' });
    cancel.onclick = close;
    var confirm = h('button', { type: 'button', class: 'btn danger', text: confirmLabel });
    confirm.onclick = function () { close(); onConfirm(); };
    actions.appendChild(cancel);
    actions.appendChild(confirm);
    card.appendChild(actions);
    backdrop.appendChild(card);
    backdrop.onclick = function (event) { if (event.target === backdrop) close(); };
    document.addEventListener('keydown', onKey);
    document.body.appendChild(backdrop);
    confirm.focus();
  }

  // ------------------------------------------------------------------ 框架

  function renderTabs() {
    clear(tabsEl);
    var defs = [
      ['quizzes', '测验', false],
      ['homework', '作业', false],
      ['notices', '通知', false]
    ];
    defs.forEach(function (def) {
      var name = def[0];
      var button = h('button', { type: 'button', class: 'tab' + (state.tab === name ? ' on' : '') });
      button.appendChild(h('span', { text: def[1] }));
      if (def[2]) button.appendChild(h('span', { class: 'soon', text: '待做' }));
      if (name === 'quizzes' && state.quiz.list.length) {
        button.appendChild(h('span', { class: 'tab-count', text: state.quiz.list.length }));
      }
      if (name === 'notices' && state.notice.list.length) {
        button.appendChild(h('span', { class: 'tab-count', text: state.notice.list.length }));
      }
      if (name === 'homework' && state.homework.list.length) {
        button.appendChild(h('span', { class: 'tab-count', text: state.homework.list.length }));
      }
      button.onclick = function () {
        var go = function () {
          state.tab = name;
          if (name === 'notices') state.notice.view = 'list';
          if (name === 'homework') state.homework.view = 'list';
          render();
          window.scrollTo({ top: 0, behavior: 'auto' });
        };
        // 正在编辑通知/作业时换栏目，先确认未保存的修改
        if (state.tab === 'notices' && state.notice.view === 'detail') {
          if (name === 'notices') return;
          leaveNoticeDetail(go);
          return;
        }
        if (state.tab === 'homework' && state.homework.view === 'detail') {
          if (name === 'homework') return;
          leaveHomeworkDetail(go);
          return;
        }
        if (state.tab === name) return;
        go();
      };
      tabsEl.appendChild(button);
    });
  }

  function render() {
    renderTabs();
    clear(app);
    if (state.tab === 'quizzes') {
      app.appendChild(quizSection());
      return;
    }
    if (state.tab === 'notices') {
      app.appendChild(noticeSection());
      return;
    }
    if (state.tab === 'homework') {
      app.appendChild(homeworkSection());
      return;
    }
    app.appendChild(placeholderPage(state.tab));
  }

  function placeholderPage(kind) {
    var wrap = h('div', { class: 'placeholder-page' });
    wrap.appendChild(h('div', { class: 'mark', text: kind === 'homework' ? '作' : '通' }));
    wrap.appendChild(h('h2', { text: kind === 'homework' ? '作业' : '通知' }));
    wrap.appendChild(h('p', {
      text: kind === 'homework'
        ? '这里以后放作业：发布、收作业、批改，都跟测验一样一台手机一份。'
        : '这里以后放课堂通知：发布一条，App 的课堂里就能看到。'
    }));
    wrap.appendChild(h('p', { text: '先占个位置，功能还没开始做。' }));
    var back = h('button', { type: 'button', class: 'btn', text: '先去看测验' });
    back.onclick = function () {
      state.tab = 'quizzes';
      render();
    };
    wrap.appendChild(h('br'));
    wrap.appendChild(back);
    return wrap;
  }

  // ------------------------------------------------------------------ 作业

  function homeworkStatusLabel(status) {
    if (status === 'graded') return IS_EN ? 'Graded' : '已批改';
    if (status === 'returned') return IS_EN ? 'Returned' : '已发回修正';
    if (status === 'submitted') return IS_EN ? 'Needs grading' : '待批改';
    return IS_EN ? 'Not submitted' : '未提交';
  }

  function homeworkStatusTone(status) {
    if (status === 'graded') return 'on';
    if (status === 'submitted') return 'info';
    return 'off';
  }

  function homeworkPayloadOf(detail) {
    return {
      title: (detail.title || '').trim(),
      description: (detail.description || '').trim(),
      dueAt: detail.dueAt || null,
      isPublished: !!detail.isPublished,
      questions: (detail.questions || []).map(function (question) {
        return {
          id: Number(question.id) || 0,
          kind: question.kind === 'essay' ? 'essay' : 'single',
          prompt: (question.prompt || '').trim(),
          options: question.kind === 'essay' ? [] : (question.options || [])
        };
      })
    };
  }

  function homeworkSnapshotOf(detail) {
    return JSON.stringify(homeworkPayloadOf(detail));
  }

  function homeworkSection() {
    if (state.homework.view === 'paper') return homeworkPaperPage();
    if (state.homework.view === 'grade') return homeworkGradePage();
    if (state.homework.view === 'detail') return homeworkDetailPage();
    return homeworkListPage();
  }

  function loadHomeworkList(force) {
    var homework = state.homework;
    if (homework.loading) return;
    if (homework.loaded && !force) return;
    homework.loading = true;
    homework.error = '';
    api('/admin/api/homeworks').then(function (result) {
      homework.list = (result && result.items) || [];
      homework.loaded = true;
      homework.loading = false;
      render();
    }).catch(function (error) {
      homework.loading = false;
      homework.error = error.message || '读取作业失败';
      render();
    });
  }

  function filteredHomeworkRows() {
    var list = state.homework.list || [];
    var query = (state.homework.query || '').trim().toLowerCase();
    if (!query) return list;
    return list.filter(function (item) {
      return [item.title, item.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .indexOf(query) !== -1;
    });
  }

  function newHomework() {
    var homework = state.homework;
    homework.detail = {
      id: 0,
      title: '',
      description: '',
      dueAt: defaultDueIso(),
      isPublished: false,
      questions: [{ id: 0, kind: 'single', prompt: '', options: ['', ''] }],
      submissions: []
    };
    homework.snapshot = homeworkSnapshotOf(homework.detail);
    homework.view = 'detail';
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function openHomeworkDetail(id) {
    var homework = state.homework;
    homework.view = 'detail';
    homework.detail = null;
    homework.detailLoading = true;
    homework.detailError = '';
    homework.paper = null;
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
    api('/admin/api/homeworks/' + id).then(function (detail) {
      homework.detail = detail;
      homework.detailLoading = false;
      homework.snapshot = homeworkSnapshotOf(detail);
      render();
    }).catch(function (error) {
      homework.detailLoading = false;
      homework.detailError = error.message || '读取作业失败';
      render();
    });
  }

  function refreshHomeworkDetail(id, nextView) {
    return api('/admin/api/homeworks/' + id).then(function (detail) {
      var homework = state.homework;
      homework.detail = detail;
      homework.detailLoading = false;
      homework.snapshot = homeworkSnapshotOf(detail);
      homework.view = nextView || 'detail';
      homework.paper = null;
      homework.paperError = '';
      homework.loaded = false;
      render();
      return detail;
    });
  }

  function leaveHomeworkDetail(next) {
    var homework = state.homework;
    if (!homework.detail || homeworkSnapshotOf(homework.detail) === homework.snapshot) {
      next();
      return;
    }
    confirmAction(
      '放弃未保存的修改？',
      '这份作业还有没保存的内容，离开后这些修改就没了。',
      '放弃修改',
      next
    );
  }

  function homeworkQuestionCard(detail, question, index, refreshDirty) {
    var card = h('div', { class: 'quiz-question' });
    var head = h('div', { class: 'quiz-q-head' });
    head.appendChild(h('h3', { text: '第 ' + (index + 1) + ' 题' }));
    var tools = h('div', { class: 'quiz-q-tools' });

    var up = h('button', { type: 'button', class: 'btn mini', text: '上移' });
    up.disabled = index === 0;
    up.onclick = function () {
      if (index === 0) return;
      var list = detail.questions;
      var tmp = list[index - 1];
      list[index - 1] = list[index];
      list[index] = tmp;
      render();
    };
    tools.appendChild(up);

    var down = h('button', { type: 'button', class: 'btn mini', text: '下移' });
    down.disabled = index >= detail.questions.length - 1;
    down.onclick = function () {
      if (index >= detail.questions.length - 1) return;
      var list = detail.questions;
      var tmp = list[index + 1];
      list[index + 1] = list[index];
      list[index] = tmp;
      render();
    };
    tools.appendChild(down);

    var del = h('button', { type: 'button', class: 'btn mini danger', text: '删除' });
    del.onclick = function () {
      var remove = function () {
        detail.questions.splice(index, 1);
        render();
      };
      if (question.id) {
        confirmAction(
          '删除这道题？',
          '保存后这道题会从作业里移除，已经收到的对应答案也会一起删掉。',
          '删除',
          remove
        );
      } else {
        remove();
      }
    };
    tools.appendChild(del);
    head.appendChild(tools);
    card.appendChild(head);

    var promptField = h('label', { class: 'field' });
    promptField.appendChild(h('span', { class: 'field-label', text: '题干' }));
    var promptArea = h('textarea', { rows: 2, placeholder: '把问题写在这里' });
    promptArea.value = question.prompt || '';
    promptArea.oninput = function () {
      question.prompt = promptArea.value;
      refreshDirty();
    };
    promptField.appendChild(promptArea);
    card.appendChild(promptField);

    var kindField = h('label', { class: 'field' });
    kindField.appendChild(h('span', { class: 'field-label', text: '题型' }));
    var select = h('select');
    select.appendChild(h('option', { value: 'single', text: '单选（几个选项选一个）' }));
    select.appendChild(h('option', { value: 'essay', text: '简答（自己写一段）' }));
    select.value = question.kind === 'essay' ? 'essay' : 'single';
    kindField.appendChild(select);
    card.appendChild(kindField);

    var optionsField = h('label', { class: 'field' });
    optionsField.appendChild(h('span', { class: 'field-label', text: '选项（一行一个，2–8 个）' }));
    var optionsArea = h('textarea', { rows: 4 });
    optionsArea.value = (question.options || []).join(NEWLINE);
    optionsArea.oninput = function () {
      question.options = optionsArea.value
        .split(NEWLINE)
        .map(function (line) { return line.trim(); })
        .filter(function (line) { return !!line; });
      refreshDirty();
    };
    optionsField.appendChild(optionsArea);
    card.appendChild(optionsField);
    optionsField.style.display = question.kind === 'essay' ? 'none' : '';

    select.onchange = function () {
      question.kind = select.value === 'essay' ? 'essay' : 'single';
      optionsField.style.display = question.kind === 'essay' ? 'none' : '';
      refreshDirty();
    };

    return card;
  }

  function homeworkSubmissionRow(submission) {
    var node = h('button', { type: 'button', class: 'row' });
    var thumbBox = h('div', { class: 'thumb' });
    thumbBox.appendChild(h('span', {
      class: 'thumb-mark',
      text: (submission.name || '？').slice(0, 1)
    }));
    node.appendChild(thumbBox);

    var main = h('div', { class: 'row-main' });
    main.appendChild(h('div', { class: 'row-title', text: submission.name || '（没写名字）' }));
    var bits = [];
    if (submission.deviceName) bits.push(submission.deviceName);
    bits.push(homeworkStatusLabel(submission.status));
    main.appendChild(h('div', { class: 'row-sub', text: bits.join(' · ') }));
    if (submission.submittedAt) {
      main.appendChild(h('div', {
        class: 'row-meta',
        text: '提交 ' + dateLabel(submission.submittedAt, true)
      }));
    }
    node.appendChild(main);

    var side = h('div', { class: 'row-side' });
    side.appendChild(h('span', {
      class: 'badge ' + homeworkStatusTone(submission.status),
      text: homeworkStatusLabel(submission.status)
    }));
    side.appendChild(h('span', { class: 'row-hint', text: '批改 ›' }));
    node.appendChild(side);
    node.onclick = function () { openHomeworkPaper(submission.id); };
    return node;
  }

  function homeworkListPage() {
    loadHomeworkList(false);
    var homework = state.homework;
    var wrap = h('div');

    var intro = h('div', { class: 'home-intro' });
    intro.appendChild(h('strong', { text: '课堂作业' }));
    intro.appendChild(h('span', {
      text: ' 作业是一份轻量问卷：学生在截止前随便改，草稿留在手机上，老师看不到；提交后老师逐题打分/写评语，最后选「无需修正」定稿或「发回修正」。'
    }));
    wrap.appendChild(intro);

    var toolbar = h('div', { class: 'toolbar' });
    var search = h('div', { class: 'search' });
    var icon = h('span', { class: 'search-icon', 'aria-hidden': 'true' });
    icon.innerHTML = SEARCH_ICON;
    var input = h('input', {
      id: 'homework-search-input',
      type: 'search',
      placeholder: '搜索作业…',
      autocomplete: 'off',
      'aria-label': '搜索作业'
    });
    input.value = homework.query || '';
    input.oninput = function () { homework.query = input.value; paint(); };
    search.appendChild(icon);
    search.appendChild(input);
    toolbar.appendChild(search);

    var add = h('button', { type: 'button', class: 'btn primary', text: '+ 新建作业' });
    add.onclick = newHomework;
    toolbar.appendChild(add);
    wrap.appendChild(toolbar);

    var meta = h('div', { class: 'list-meta' });
    var listEl = h('div', { class: 'list' });
    wrap.appendChild(meta);
    wrap.appendChild(listEl);

    function paint() {
      clear(listEl);
      if (!homework.loaded && homework.loading) {
        meta.textContent = '';
        listEl.appendChild(h('p', { class: 'loading' }, [
          h('span', { class: 'spinner' }),
          h('span', { text: '正在读取作业…' })
        ]));
        return;
      }
      if (homework.error) {
        meta.textContent = '';
        listEl.appendChild(quizEmptyBox(homework.error, '检查一下网络，再试一次。', function () {
          loadHomeworkList(true);
        }));
        return;
      }
      var rows = filteredHomeworkRows();
      meta.textContent = rows.length
        ? tr((rows.length === homework.list.length ? '共 ' : '找到 ') + rows.length + ' 份作业')
        : '';
      if (!rows.length) {
        listEl.appendChild(homework.list.length
          ? quizEmptyBox('没有匹配的作业', '换个关键词试试。')
          : quizEmptyBox('还没有作业', '点右上角「新建作业」，发布后会出现在 App 的课堂里。'));
        return;
      }
      rows.forEach(function (item) {
        var node = h('button', { type: 'button', class: 'row' });
        var thumbBox = h('div', { class: 'thumb' });
        thumbBox.appendChild(h('span', { class: 'thumb-mark', text: '作' }));
        node.appendChild(thumbBox);
        var main = h('div', { class: 'row-main' });
        main.appendChild(h('div', { class: 'row-title', text: item.title || '（未命名作业）' }));
        var bits = [tr(item.isPublished ? '已发布' : '草稿'), tr('截止 ' + dateLabel(item.dueAt, true))];
        bits.push(tr((item.questionCount || 0) + ' 题'));
        if (item.submissionCount) bits.push(tr('已交 ' + item.submissionCount));
        if (item.pendingCount) bits.push(tr('待批 ' + item.pendingCount));
        if (item.returnedCount) bits.push(tr('发回 ' + item.returnedCount));
        main.appendChild(h('div', { class: 'row-sub', text: bits.join(' · ') }));
        var preview = clip(item.description, 42);
        if (preview) main.appendChild(h('div', { class: 'row-meta', text: preview }));
        node.appendChild(main);
        var side = h('div', { class: 'row-side' });
        side.appendChild(h('span', {
          class: 'badge ' + (item.isPublished ? 'on' : 'off'),
          text: item.isPublished ? '已发布' : '草稿'
        }));
        side.appendChild(h('span', { class: 'row-hint', text: '管理 ›' }));
        node.appendChild(side);
        node.onclick = function () { openHomeworkDetail(item.id); };
        listEl.appendChild(node);
      });
    }
    paint();
    return wrap;
  }

  function homeworkDetailPage() {
    var homework = state.homework;
    var page = h('div', { class: 'editor-page' });
    var head = h('div', { class: 'editor-head' });
    var back = h('button', { type: 'button', class: 'editor-back', text: '← 返回作业列表' });
    back.onclick = function () {
      leaveHomeworkDetail(function () {
        homework.view = 'list';
        homework.detail = null;
        homework.snapshot = '';
        homework.paper = null;
        homework.loaded = false;
        render();
      });
    };
    head.appendChild(back);

    if (!homework.detail) {
      var headText = h('div');
      headText.appendChild(h('h2', { text: '编辑作业' }));
      headText.appendChild(h('div', {
        class: 'editor-sub',
        text: homework.detailLoading ? '正在读取…' : (homework.detailError || '这份作业打不开')
      }));
      head.appendChild(headText);
      page.appendChild(head);
      var emptyBody = h('div', { class: 'editor-body' });
      if (homework.detailLoading) {
        emptyBody.appendChild(h('p', { class: 'loading' }, [
          h('span', { class: 'spinner' }),
          h('span', { text: '正在读取作业…' })
        ]));
      } else {
        emptyBody.appendChild(quizEmptyBox('作业打不开', '', function () {
          homework.loaded = false;
          homework.view = 'list';
          render();
        }));
      }
      page.appendChild(emptyBody);
      return page;
    }

    var detail = homework.detail;
    var heading = h('div');
    heading.appendChild(h('h2', { text: '编辑作业' }));
    heading.appendChild(h('div', {
      class: 'editor-sub',
      text: detail.id
        ? '编号 #' + detail.id + ' · 截止 ' + dateLabel(detail.dueAt, true) + ' · 这一页只改题目，批改在另一个页面'
        : '新建作业：填好内容、截止时间和题目，再保存'
    }));
    head.appendChild(heading);
    var dirtyHint = h('div', { class: 'editor-dirty' });
    head.appendChild(dirtyHint);
    page.appendChild(head);

    function refreshDirty() {
      dirtyHint.textContent = homeworkSnapshotOf(detail) === homework.snapshot ? '' : tr('有未保存的修改');
    }

    var body = h('div', { class: 'editor-body' });

    var titleField = h('label', { class: 'field' });
    titleField.appendChild(h('span', { class: 'field-label', text: '作业标题' }));
    var titleInput = h('input', { type: 'text', placeholder: '例如：腓立比书第二章作业' });
    titleInput.value = detail.title || '';
    titleInput.oninput = function () {
      detail.title = titleInput.value;
      refreshDirty();
    };
    titleField.appendChild(titleInput);
    body.appendChild(titleField);

    var descField = h('label', { class: 'field' });
    descField.appendChild(h('span', { class: 'field-label', text: '说明（学生打开作业时会看到，可留空）' }));
    var descArea = h('textarea', { rows: 3, placeholder: '例如：读完经文再回答，用自己的话写就行。' });
    descArea.value = detail.description || '';
    descArea.oninput = function () {
      detail.description = descArea.value;
      refreshDirty();
    };
    descField.appendChild(descArea);
    body.appendChild(descField);

    var dueField = h('label', { class: 'field' });
    dueField.appendChild(h('span', { class: 'field-label', text: '截止时间（北京时间，过了就不能再提交）' }));
    var dueInput = h('input', { type: 'datetime-local' });
    dueInput.value = toBeijingInput(detail.dueAt);
    dueInput.oninput = function () {
      detail.dueAt = dueInput.value ? fromBeijingInput(dueInput.value) : null;
      refreshDirty();
    };
    dueField.appendChild(dueInput);
    body.appendChild(dueField);

    var publishBox = h('input', { type: 'checkbox' });
    publishBox.checked = !!detail.isPublished;
    publishBox.onchange = function () {
      detail.isPublished = publishBox.checked;
      refreshDirty();
    };
    body.appendChild(h('label', { class: 'check-row' }, [
      publishBox,
      h('span', { text: '发布到 App（关掉就是草稿，学生看不到）' })
    ]));

    if (detail.id) {
      var submissions = detail.submissions || [];
      var pending = submissions.filter(function (item) { return item.status === 'submitted'; }).length;
      var returned = submissions.filter(function (item) { return item.status === 'returned'; }).length;
      var graded = submissions.filter(function (item) { return item.status === 'graded'; }).length;
      var gradeEntry = h('button', { type: 'button', class: 'quiz-grade-entry' });
      var gradeMain = h('div', { class: 'main' });
      gradeMain.appendChild(h('div', { class: 'title', text: '批改提交' }));
      var gradeBits = [tr('共 ' + submissions.length + ' 份')];
      if (pending) gradeBits.push(tr('待批改 ' + pending));
      if (returned) gradeBits.push(tr('已发回 ' + returned));
      if (graded) gradeBits.push(tr('已批改 ' + graded));
      gradeMain.appendChild(h('div', {
        class: 'sub',
        text: submissions.length ? gradeBits.join(' · ') : '还没有人提交'
      }));
      gradeEntry.appendChild(gradeMain);
      gradeEntry.appendChild(h('span', { class: 'arrow', text: '›' }));
      gradeEntry.onclick = function () {
        var open = function (fresh) {
          if (fresh) {
            homework.detail = fresh;
            homework.snapshot = homeworkSnapshotOf(fresh);
          }
          homework.view = 'grade';
          homework.paper = null;
          homework.paperError = '';
          homework.filter = 'all';
          render();
          window.scrollTo({ top: 0, behavior: 'auto' });
        };
        if (homeworkSnapshotOf(detail) === homework.snapshot) {
          open(null);
          return;
        }
        confirmAction(
          '放弃未保存的修改？',
          '题目还有没保存的修改，去批改会丢掉这些修改。',
          '放弃修改',
          function () {
            api('/admin/api/homeworks/' + detail.id).then(function (fresh) {
              open(fresh);
            }).catch(function (error) { toast(error.message, true); });
          }
        );
      };
      body.appendChild(gradeEntry);
    }

    var questionHead = h('div', { class: 'quiz-submissions-head' });
    questionHead.appendChild(h('h3', { text: '题目' }));
    questionHead.appendChild(h('span', {
      class: 'count',
      text: (detail.questions || []).length + ' 题'
    }));
    body.appendChild(questionHead);

    var addQuestion = h('button', { type: 'button', class: 'quiz-add-fab', text: '+ 添加题目' });
    addQuestion.onclick = function () {
      if (!detail.questions) detail.questions = [];
      if (detail.questions.length >= 30) {
        toast('一份作业最多 30 道题', true);
        return;
      }
      detail.questions.push({ id: 0, kind: 'single', prompt: '', options: ['', ''] });
      render();
    };
    page.appendChild(addQuestion);

    if (!detail.questions || !detail.questions.length) {
      body.appendChild(h('p', {
        class: 'series-ep-empty',
        text: '还没有题目，点「添加题目」开始。单选题至少要有两个选项。'
      }));
    } else {
      detail.questions.forEach(function (question, index) {
        body.appendChild(homeworkQuestionCard(detail, question, index, refreshDirty));
      });
    }

    page.appendChild(body);

    var foot = h('div', { class: 'editor-foot' });
    if (detail.id) {
      var deleteButton = h('button', { type: 'button', class: 'btn danger', text: '删除作业' });
      deleteButton.onclick = function () {
        confirmAction(
          '删除这份作业？',
          '题目和已经收到的提交都会一起删掉，不能恢复。',
          '删除',
          function () {
            deleteButton.disabled = true;
            deleteButton.textContent = tr('删除中…');
            api('/admin/api/homeworks/' + detail.id, { method: 'DELETE' }).then(function () {
              homework.loaded = false;
              homework.view = 'list';
              homework.detail = null;
              homework.snapshot = '';
              homework.paper = null;
              toast('作业已删除');
              render();
            }).catch(function (error) {
              deleteButton.disabled = false;
              deleteButton.textContent = tr('删除作业');
              toast(error.message, true);
            });
          }
        );
      };
      foot.appendChild(deleteButton);
    }
    foot.appendChild(h('span', { class: 'spacer' }));

    var cancel = h('button', { type: 'button', class: 'btn', text: '返回列表' });
    cancel.onclick = back.onclick;
    foot.appendChild(cancel);

    var save = h('button', { type: 'button', class: 'btn primary', text: '保存' });
    save.onclick = function () {
      var payload = homeworkPayloadOf(detail);
      if (!payload.title) {
        toast('作业标题不能为空', true);
        titleInput.focus();
        return;
      }
      if (!payload.dueAt) {
        toast('请设置截止时间', true);
        dueInput.focus();
        return;
      }
      if (payload.isPublished && !payload.questions.length) {
        toast('至少加一道题再发布', true);
        return;
      }
      for (var i = 0; i < payload.questions.length; i += 1) {
        var question = payload.questions[i];
        if (!question.prompt) {
          toast('第 ' + (i + 1) + ' 题的题干还没写', true);
          return;
        }
        if (question.kind === 'single' && question.options.length < 2) {
          toast('第 ' + (i + 1) + ' 题至少要有两个选项', true);
          return;
        }
      }
      save.disabled = true;
      save.textContent = tr('保存中…');
      var path = '/admin/api/homeworks' + (detail.id ? '/' + detail.id : '');
      api(path, {
        method: detail.id ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      }).then(function (result) {
        homework.loaded = false;
        if (!detail.id && result && result.id) {
          toast('作业已创建' + (payload.isPublished ? '，学生可以看到了' : '，还是草稿'));
          openHomeworkDetail(result.id);
          return;
        }
        toast('已保存' + (payload.isPublished ? '，学生可以看到了' : '，还是草稿'));
        return refreshHomeworkDetail(detail.id, 'detail');
      }).catch(function (error) {
        save.disabled = false;
        save.textContent = tr('保存');
        toast(error.message, true);
      });
    };
    foot.appendChild(save);
    page.appendChild(foot);

    refreshDirty();
    return page;
  }

  function homeworkGradePage() {
    var homework = state.homework;
    var page = h('div', { class: 'editor-page' });
    var head = h('div', { class: 'editor-head' });
    var back = h('button', { type: 'button', class: 'editor-back', text: '← 返回作业编辑' });
    back.onclick = function () {
      homework.view = 'detail';
      homework.paper = null;
      homework.paperError = '';
      render();
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    head.appendChild(back);

    var detail = homework.detail;
    if (!detail) {
      var headText = h('div');
      headText.appendChild(h('h2', { text: '批改提交' }));
      headText.appendChild(h('div', { class: 'editor-sub', text: '先打开一份作业再进来。' }));
      head.appendChild(headText);
      page.appendChild(head);
      var emptyBody = h('div', { class: 'editor-body' });
      emptyBody.appendChild(quizEmptyBox('还没有打开作业', '', function () {
        homework.view = 'list';
        homework.loaded = false;
        render();
      }));
      page.appendChild(emptyBody);
      return page;
    }

    var list = detail.submissions || [];
    var counts = { all: list.length, submitted: 0, graded: 0, returned: 0 };
    list.forEach(function (item) {
      if (counts[item.status] !== undefined) counts[item.status] += 1;
    });

    var heading = h('div');
    heading.appendChild(h('h2', { text: '批改提交' }));
    var sub = detail.title || '（未命名作业）';
    sub += ' · ' + tr('共 ' + list.length + ' 份');
    if (counts.submitted) sub += ' · ' + tr('待批改 ' + counts.submitted);
    if (counts.returned) sub += ' · ' + tr('已发回 ' + counts.returned);
    heading.appendChild(h('div', { class: 'editor-sub', text: sub }));
    head.appendChild(heading);
    page.appendChild(head);

    var body = h('div', { class: 'editor-body' });
    var filters = h('div', { class: 'quiz-filters' });
    var filterDefs = [
      ['all', '全部'],
      ['submitted', '待批改'],
      ['graded', '已批改'],
      ['returned', '已发回']
    ];
    filterDefs.forEach(function (def) {
      if (def[0] !== 'all' && !counts[def[0]]) return;
      var chip = h('button', {
        type: 'button',
        class: 'btn mini' + (homework.filter === def[0] ? ' primary' : ''),
        text: tr(def[1]) + ' ' + counts[def[0]]
      });
      chip.onclick = function () {
        homework.filter = def[0];
        render();
      };
      filters.appendChild(chip);
    });
    body.appendChild(filters);

    var rows = list.filter(function (item) {
      return homework.filter === 'all' || item.status === homework.filter;
    });
    if (!list.length) {
      body.appendChild(h('p', {
        class: 'series-ep-empty',
        text: '还没有人提交。学生提交之后才会出现在这里。'
      }));
    } else if (!rows.length) {
      body.appendChild(h('p', { class: 'series-ep-empty', text: '这个分类里还没有提交。' }));
    } else {
      var submissionsList = h('div', { class: 'list' });
      rows.forEach(function (submission) {
        submissionsList.appendChild(homeworkSubmissionRow(submission));
      });
      body.appendChild(submissionsList);
    }
    page.appendChild(body);

    var foot = h('div', { class: 'editor-foot' });
    foot.appendChild(h('span', { class: 'spacer' }));
    var backBottom = h('button', { type: 'button', class: 'btn', text: '返回作业编辑' });
    backBottom.onclick = back.onclick;
    foot.appendChild(backBottom);
    page.appendChild(foot);
    return page;
  }

  function openHomeworkPaper(submissionId) {
    var homework = state.homework;
    homework.view = 'paper';
    homework.paper = null;
    homework.paperLoading = true;
    homework.paperError = '';
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
    api('/admin/api/homeworks/' + homework.detail.id + '/submissions/' + submissionId)
      .then(function (sheet) {
        homework.paper = sheet;
        homework.paperLoading = false;
        render();
      }).catch(function (error) {
        homework.paperLoading = false;
        homework.paperError = error.message || '读取提交失败';
        render();
      });
  }

  function homeworkPaperPage() {
    var homework = state.homework;
    var page = h('div', { class: 'editor-page' });
    var head = h('div', { class: 'editor-head' });
    var back = h('button', { type: 'button', class: 'editor-back', text: '← 返回批改列表' });
    back.onclick = function () {
      homework.view = 'grade';
      homework.paper = null;
      homework.paperError = '';
      render();
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    head.appendChild(back);

    if (!homework.paper) {
      var headText = h('div');
      headText.appendChild(h('h2', { text: '逐题批改' }));
      headText.appendChild(h('div', {
        class: 'editor-sub',
        text: homework.paperLoading ? '正在读取…' : (homework.paperError || '这份提交打不开')
      }));
      head.appendChild(headText);
      page.appendChild(head);
      var emptyBody = h('div', { class: 'editor-body' });
      if (homework.paperLoading) {
        emptyBody.appendChild(h('p', { class: 'loading' }, [
          h('span', { class: 'spinner' }),
          h('span', { text: '正在读取提交…' })
        ]));
      }
      page.appendChild(emptyBody);
      return page;
    }

    var paper = homework.paper;
    var editable = paper.status === 'submitted';
    var heading = h('div');
    heading.appendChild(h('h2', { text: (paper.name || '学生') + ' 的作业' }));
    heading.appendChild(h('div', {
      class: 'editor-sub',
      text: (paper.homeworkTitle || '') + ' · ' + tr('截止 ' + dateLabel(paper.dueAt, true))
    }));
    head.appendChild(heading);
    page.appendChild(head);

    var body = h('div', { class: 'editor-body' });
    var meta = h('div', { class: 'quiz-paper-meta' });
    var bits = [];
    if (paper.deviceName) bits.push(tr('设备：') + paper.deviceName);
    bits.push(tr('状态：') + homeworkStatusLabel(paper.status));
    if (paper.submittedAt) bits.push(tr('提交：') + dateLabel(paper.submittedAt, true));
    meta.textContent = bits.join(' · ');
    body.appendChild(meta);

    var note = h('div', { class: 'homework-note' });
    if (editable) {
      note.appendChild(h('b', { text: '逐题批改：' }));
      note.appendChild(h('span', {
        text: '每道题的分数和评语可以只填一个。全部题都至少有一项后，才能定稿或发回修正。'
      }));
    } else if (paper.status === 'returned') {
      note.appendChild(h('b', { text: '已发回修正。' }));
      note.appendChild(h('span', {
        text: '学生现在可以修改并重新提交；这轮批改学生能看到。重新提交后，再回到这里重新批。'
      }));
    } else {
      note.appendChild(h('b', { text: '已经定稿。' }));
      note.appendChild(h('span', { text: '学生看到的就是下面这份逐题结果，作业不能再修改。' }));
    }
    body.appendChild(note);

    var rows = [];
    (paper.answers || []).forEach(function (answer, index) {
      var card = h('div', { class: 'homework-answer' });
      card.appendChild(h('div', {
        class: 'prompt',
        text: '第 ' + (index + 1) + ' 题 · ' + (answer.prompt || '（题目已删除）')
      }));
      var value = (answer.answer || '').trim();
      card.appendChild(h('div', {
        class: 'answer' + (value ? '' : ' blank'),
        text: value || '（没有作答）'
      }));

      var grid = h('div', { class: 'homework-grade-grid' });
      var scoreField = h('label', { class: 'field' });
      scoreField.appendChild(h('span', { class: 'field-label', text: '分数/等级（选填）' }));
      var scoreInput = h('input', { type: 'text', placeholder: '例如：8 或 A' });
      scoreInput.value = answer.score || '';
      scoreInput.disabled = !editable;
      scoreField.appendChild(scoreInput);
      grid.appendChild(scoreField);

      var commentField = h('label', { class: 'field' });
      commentField.appendChild(h('span', { class: 'field-label', text: '评语（选填）' }));
      var commentArea = h('textarea', { rows: 2, placeholder: '这一题写得怎么样？' });
      commentArea.value = answer.comment || '';
      commentArea.disabled = !editable;
      commentField.appendChild(commentArea);
      grid.appendChild(commentField);
      card.appendChild(grid);
      body.appendChild(card);
      rows.push({
        questionId: answer.questionId,
        scoreInput: scoreInput,
        commentArea: commentArea
      });
    });

    if (!rows.length) {
      body.appendChild(h('p', { class: 'series-ep-empty', text: '这份作业还没有题目。' }));
    }

    function collectAnswers() {
      return rows.map(function (row) {
        return {
          questionId: row.questionId,
          score: row.scoreInput.value.trim(),
          comment: row.commentArea.value.trim()
        };
      });
    }

    function postGrade(action, buttons) {
      buttons.forEach(function (button) { button.disabled = true; });
      api('/admin/api/homeworks/' + homework.detail.id + '/submissions/' + paper.id + '/grade', {
        method: 'POST',
        body: JSON.stringify({ action: action, answers: collectAnswers() })
      }).then(function () {
        if (action === 'save') {
          buttons.forEach(function (button) { button.disabled = false; });
          toast('批改进度已保存');
          return;
        }
        toast(action === 'keep' ? '已定稿，学生能看到逐题结果' : '已发回修正，学生可以改了');
        return refreshHomeworkDetail(homework.detail.id, 'grade');
      }).catch(function (error) {
        buttons.forEach(function (button) { button.disabled = false; });
        toast(error.message, true);
      });
    }

    page.appendChild(body);

    var foot = h('div', { class: 'editor-foot' });
    foot.appendChild(h('span', { class: 'spacer' }));
    var backBottom = h('button', { type: 'button', class: 'btn', text: '返回批改列表' });
    backBottom.onclick = back.onclick;
    foot.appendChild(backBottom);

    if (editable && rows.length) {
      var actionButtons = [];
      var saveButton = h('button', { type: 'button', class: 'btn', text: '保存进度' });
      saveButton.onclick = function () { postGrade('save', actionButtons); };
      actionButtons.push(saveButton);
      foot.appendChild(saveButton);

      var returnButton = h('button', { type: 'button', class: 'btn', text: '发回修正' });
      returnButton.onclick = function () {
        var answers = collectAnswers();
        for (var i = 0; i < answers.length; i += 1) {
          if (!answers[i].score && !answers[i].comment) {
            toast('第 ' + (i + 1) + ' 题还没有打分或写评语', true);
            return;
          }
        }
        confirmAction(
          '发回修正？',
          '学生可以重新修改并再次提交；这轮逐题批改学生能看到，重新提交后需要你重新批。',
          '发回修正',
          function () { postGrade('return', actionButtons); }
        );
      };
      actionButtons.push(returnButton);
      foot.appendChild(returnButton);

      var keepButton = h('button', { type: 'button', class: 'btn primary', text: '无需修正，定稿' });
      keepButton.onclick = function () {
        var answers = collectAnswers();
        for (var i = 0; i < answers.length; i += 1) {
          if (!answers[i].score && !answers[i].comment) {
            toast('第 ' + (i + 1) + ' 题还没有打分或写评语', true);
            return;
          }
        }
        confirmAction(
          '定稿？',
          '定稿后学生看到逐题结果，作业不能再修改。',
          '定稿',
          function () { postGrade('keep', actionButtons); }
        );
      };
      actionButtons.push(keepButton);
      foot.appendChild(keepButton);
    }

    page.appendChild(foot);
    return page;
  }

  // ------------------------------------------------------------------ 通知

  function noticePayloadOf(detail) {
    return {
      title: (detail.title || '').trim(),
      body: (detail.body || '').trim(),
      isPublished: !!detail.isPublished
    };
  }

  function noticeSnapshotOf(detail) {
    return JSON.stringify(noticePayloadOf(detail));
  }

  function noticeSection() {
    if (state.notice.view === 'detail') return noticeDetailPage();
    return noticeListPage();
  }

  function loadNoticeList(force) {
    var notice = state.notice;
    if (notice.loading) return;
    if (notice.loaded && !force) return;
    notice.loading = true;
    notice.error = '';
    api('/admin/api/notices').then(function (result) {
      notice.list = (result && result.items) || [];
      notice.loaded = true;
      notice.loading = false;
      render();
    }).catch(function (error) {
      notice.loading = false;
      notice.error = error.message || '读取通知失败';
      render();
    });
  }

  function filteredNoticeRows() {
    var list = state.notice.list || [];
    var query = (state.notice.query || '').trim().toLowerCase();
    if (!query) return list;
    return list.filter(function (item) {
      return [item.title, item.body]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .indexOf(query) !== -1;
    });
  }

  function newNotice() {
    var notice = state.notice;
    notice.detail = { id: 0, title: '', body: '', isPublished: true };
    notice.snapshot = noticeSnapshotOf(notice.detail);
    notice.view = 'detail';
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function openNoticeDetail(id) {
    var notice = state.notice;
    var found = null;
    (notice.list || []).forEach(function (item) {
      if (String(item.id) === String(id)) found = item;
    });
    if (!found) {
      toast('这条通知已经不在列表里了', true);
      notice.loaded = false;
      render();
      return;
    }
    notice.detail = {
      id: found.id,
      title: found.title,
      body: found.body,
      isPublished: !!found.isPublished
    };
    notice.snapshot = noticeSnapshotOf(notice.detail);
    notice.view = 'detail';
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function leaveNoticeDetail(next) {
    var notice = state.notice;
    if (!notice.detail || noticeSnapshotOf(notice.detail) === notice.snapshot) {
      next();
      return;
    }
    confirmAction(
      '放弃未保存的修改？',
      '这条通知还有没保存的内容，离开后这些修改就没了。',
      '放弃修改',
      next
    );
  }

  function noticeListPage() {
    loadNoticeList(false);
    var notice = state.notice;
    var wrap = h('div');

    var intro = h('div', { class: 'home-intro' });
    intro.appendChild(h('strong', { text: '课堂通知' }));
    intro.appendChild(h('span', {
      text: ' 发布后，App 的课堂流里会出现「通知：标题」，和测验按发布时间排在一起；学生点一下就能看通知全文。'
    }));
    wrap.appendChild(intro);

    var toolbar = h('div', { class: 'toolbar' });
    var search = h('div', { class: 'search' });
    var icon = h('span', { class: 'search-icon', 'aria-hidden': 'true' });
    icon.innerHTML = SEARCH_ICON;
    var input = h('input', {
      id: 'notice-search-input',
      type: 'search',
      placeholder: '搜索通知…',
      autocomplete: 'off',
      'aria-label': '搜索通知'
    });
    input.value = notice.query || '';
    input.oninput = function () { notice.query = input.value; paint(); };
    search.appendChild(icon);
    search.appendChild(input);
    toolbar.appendChild(search);

    var add = h('button', { type: 'button', class: 'btn primary', text: '+ 新建通知' });
    add.onclick = newNotice;
    toolbar.appendChild(add);
    wrap.appendChild(toolbar);

    var meta = h('div', { class: 'list-meta' });
    var listEl = h('div', { class: 'list' });
    wrap.appendChild(meta);
    wrap.appendChild(listEl);

    function paint() {
      clear(listEl);
      if (!notice.loaded && notice.loading) {
        meta.textContent = '';
        listEl.appendChild(h('p', { class: 'loading' }, [
          h('span', { class: 'spinner' }),
          h('span', { text: '正在读取通知…' })
        ]));
        return;
      }
      if (notice.error) {
        meta.textContent = '';
        listEl.appendChild(quizEmptyBox(notice.error, '检查一下网络，再试一次。', function () {
          loadNoticeList(true);
        }));
        return;
      }
      var rows = filteredNoticeRows();
      meta.textContent = rows.length
        ? tr((rows.length === notice.list.length ? '共 ' : '找到 ') + rows.length + ' 条通知')
        : '';
      if (!rows.length) {
        listEl.appendChild(notice.list.length
          ? quizEmptyBox('没有匹配的通知', '换个关键词试试。')
          : quizEmptyBox('还没有通知', '点右上角「新建通知」，发布后会出现在 App 的课堂里。'));
        return;
      }
      rows.forEach(function (item) {
        var node = h('button', { type: 'button', class: 'row' });
        var thumbBox = h('div', { class: 'thumb' });
        thumbBox.appendChild(h('span', { class: 'thumb-mark', text: '通' }));
        node.appendChild(thumbBox);
        var main = h('div', { class: 'row-main' });
        main.appendChild(h('div', { class: 'row-title', text: item.title || '（未命名通知）' }));
        main.appendChild(h('div', {
          class: 'row-sub',
          text: tr(item.isPublished ? '已发布' : '草稿') +
            (item.publishedAt ? ' · ' + dateLabel(item.publishedAt, true) : '')
        }));
        var preview = clip(item.body, 42);
        if (preview) main.appendChild(h('div', { class: 'row-meta', text: preview }));
        node.appendChild(main);
        var side = h('div', { class: 'row-side' });
        side.appendChild(h('span', {
          class: 'badge ' + (item.isPublished ? 'on' : 'off'),
          text: item.isPublished ? '已发布' : '草稿'
        }));
        side.appendChild(h('span', { class: 'row-hint', text: '管理 ›' }));
        node.appendChild(side);
        node.onclick = function () { openNoticeDetail(item.id); };
        listEl.appendChild(node);
      });
    }
    paint();
    return wrap;
  }

  function noticeDetailPage() {
    var notice = state.notice;
    var detail = notice.detail;
    var page = h('div', { class: 'editor-page' });
    var head = h('div', { class: 'editor-head' });
    var back = h('button', { type: 'button', class: 'editor-back', text: '← 返回通知列表' });
    back.onclick = function () {
      leaveNoticeDetail(function () {
        notice.view = 'list';
        notice.detail = null;
        notice.snapshot = '';
        notice.loaded = false;
        render();
      });
    };
    head.appendChild(back);

    var heading = h('div');
    heading.appendChild(h('h2', { text: detail.id ? '编辑通知' : '新建通知' }));
    heading.appendChild(h('div', {
      class: 'editor-sub',
      text: detail.id
        ? '编号 #' + detail.id + ' · 保存后 App 里立刻更新'
        : '填好标题和内容，勾选发布再保存'
    }));
    head.appendChild(heading);
    var dirtyHint = h('div', { class: 'editor-dirty' });
    head.appendChild(dirtyHint);
    page.appendChild(head);

    function refreshDirty() {
      dirtyHint.textContent = noticeSnapshotOf(detail) === notice.snapshot ? '' : tr('有未保存的修改');
    }

    var body = h('div', { class: 'editor-body' });

    var titleField = h('label', { class: 'field' });
    titleField.appendChild(h('span', { class: 'field-label', text: '通知标题' }));
    var titleInput = h('input', { type: 'text', placeholder: '例如：下周三聚会改到线上' });
    titleInput.value = detail.title || '';
    titleInput.oninput = function () {
      detail.title = titleInput.value;
      refreshDirty();
    };
    titleField.appendChild(titleInput);
    body.appendChild(titleField);

    var bodyField = h('label', { class: 'field' });
    bodyField.appendChild(h('span', { class: 'field-label', text: '通知内容' }));
    var textArea = h('textarea', { rows: 12, placeholder: '把要通知的事情写清楚，可以分行。' });
    textArea.value = detail.body || '';
    textArea.oninput = function () {
      detail.body = textArea.value;
      refreshDirty();
    };
    bodyField.appendChild(textArea);
    body.appendChild(bodyField);

    var publishBox = h('input', { type: 'checkbox' });
    publishBox.checked = !!detail.isPublished;
    publishBox.onchange = function () {
      detail.isPublished = publishBox.checked;
      refreshDirty();
    };
    body.appendChild(h('label', { class: 'check-row' }, [
      publishBox,
      h('span', { text: '发布到 App（关掉就是草稿，学生看不到）' })
    ]));
    page.appendChild(body);

    var foot = h('div', { class: 'editor-foot' });
    if (detail.id) {
      var remove = h('button', { type: 'button', class: 'btn danger', text: '删除通知' });
      remove.onclick = function () {
        confirmAction(
          '删除这条通知？',
          '删除后 App 里也会消失，不能恢复。',
          '删除',
          function () {
            remove.disabled = true;
            remove.textContent = tr('删除中…');
            api('/admin/api/notices/' + detail.id, { method: 'DELETE' }).then(function () {
              notice.view = 'list';
              notice.detail = null;
              notice.snapshot = '';
              notice.loaded = false;
              toast('通知已删除');
              render();
            }).catch(function (error) {
              remove.disabled = false;
              remove.textContent = tr('删除通知');
              toast(error.message, true);
            });
          }
        );
      };
      foot.appendChild(remove);
    }
    foot.appendChild(h('span', { class: 'spacer' }));

    var cancel = h('button', { type: 'button', class: 'btn', text: '返回列表' });
    cancel.onclick = back.onclick;
    foot.appendChild(cancel);

    var save = h('button', { type: 'button', class: 'btn primary', text: '保存' });
    save.onclick = function () {
      var payload = noticePayloadOf(detail);
      if (!payload.title) {
        toast('通知标题不能为空', true);
        titleInput.focus();
        return;
      }
      if (!payload.body) {
        toast('通知内容不能为空', true);
        textArea.focus();
        return;
      }
      save.disabled = true;
      save.textContent = tr('保存中…');
      var path = '/admin/api/notices' + (detail.id ? '/' + detail.id : '');
      api(path, {
        method: detail.id ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      }).then(function (result) {
        if (result && result.id) detail.id = result.id;
        notice.snapshot = noticeSnapshotOf(detail);
        notice.loaded = false;
        toast(payload.isPublished ? '已发布，App 课堂里能看到' : '已保存，还是草稿');
        render();
        loadNoticeList(true);
      }).catch(function (error) {
        save.disabled = false;
        save.textContent = tr('保存');
        toast(error.message, true);
      });
    };
    foot.appendChild(save);
    page.appendChild(foot);

    refreshDirty();
    return page;
  }

  // ------------------------------------------------------------------ 测验

  function quizStatusLabel(status) {
    if (status === 'graded') return IS_EN ? 'Graded' : '已批改';
    if (status === 'submitted') return IS_EN ? 'Needs grading' : '待批改';
    if (status === 'locked') return IS_EN ? 'Locked' : '已锁定';
    return IS_EN ? 'Not submitted' : '未提交';
  }

  function quizStatusTone(status) {
    if (status === 'graded') return 'on';
    if (status === 'submitted') return 'info';
    return 'off';
  }

  function quizPayloadOf(detail) {
    return {
      title: (detail.title || '').trim(),
      description: (detail.description || '').trim(),
      isPublished: !!detail.isPublished,
      questions: (detail.questions || []).map(function (question) {
        return {
          id: Number(question.id) || 0,
          kind: question.kind === 'essay' ? 'essay' : 'single',
          prompt: (question.prompt || '').trim(),
          options: question.kind === 'essay' ? [] : (question.options || []),
          answerKey: (question.answerKey || '').trim()
        };
      })
    };
  }

  function quizSnapshotOf(detail) {
    return JSON.stringify(quizPayloadOf(detail));
  }

  function quizSection() {
    if (state.quiz.view === 'paper') return quizPaperPage();
    if (state.quiz.view === 'grade') return quizGradePage();
    if (state.quiz.view === 'detail') return quizDetailPage();
    return quizListPage();
  }

  function loadQuizList(force) {
    var quiz = state.quiz;
    if (quiz.loading) return;
    if (quiz.loaded && !force) return;
    quiz.loading = true;
    quiz.error = '';
    api('/admin/api/quizzes').then(function (result) {
      quiz.list = (result && result.items) || [];
      quiz.loaded = true;
      quiz.loading = false;
      render();
    }).catch(function (error) {
      quiz.loading = false;
      quiz.error = error.message || '读取测验失败';
      render();
    });
  }

  function quizEmptyBox(title, hint, retry) {
    var box = h('div', { class: 'empty' });
    box.appendChild(h('div', { class: 'empty-icon', text: retry ? '!' : '测' }));
    box.appendChild(h('p', { text: title }));
    if (hint) box.appendChild(h('p', { text: hint }));
    if (retry) {
      var button = h('button', { type: 'button', class: 'btn', text: '再试一次' });
      button.onclick = retry;
      box.appendChild(button);
    }
    return box;
  }

  function newQuiz() {
    var quiz = state.quiz;
    if (quiz.creating) return;
    quiz.creating = true;
    api('/admin/api/quizzes', {
      method: 'POST',
      body: JSON.stringify({ title: IS_EN ? 'Untitled quiz' : '未命名测验', description: '', isPublished: false })
    }).then(function (result) {
      quiz.creating = false;
      quiz.loaded = false;
      if (result && result.id) openQuizDetail(result.id);
      toast('测验建好了，接着填题目');
    }).catch(function (error) {
      quiz.creating = false;
      toast(error.message, true);
    });
  }

  function filteredQuizRows() {
    var list = state.quiz.list || [];
    var query = (state.quiz.query || '').trim().toLowerCase();
    if (!query) return list;
    return list.filter(function (item) {
      return [item.title, item.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .indexOf(query) !== -1;
    });
  }

  function quizListPage() {
    loadQuizList(false);
    var quiz = state.quiz;
    var wrap = h('div');

    var intro = h('div', { class: 'home-intro' });
    intro.appendChild(h('strong', { text: '小组测验' }));
    intro.appendChild(h('span', {
      text: ' 发布后，App 小组页的课堂里会出现「新测验：标题」。编辑题目和批改是分开的两个页面；一台手机同一个测验只能交一份；离开测验页面超过 5 秒或截屏会锁定，可以在批改页解除。'
    }));
    wrap.appendChild(intro);

    var toolbar = h('div', { class: 'toolbar' });
    var search = h('div', { class: 'search' });
    var icon = h('span', { class: 'search-icon', 'aria-hidden': 'true' });
    icon.innerHTML = SEARCH_ICON;
    var input = h('input', {
      id: 'search-input',
      type: 'search',
      placeholder: '搜索测验…',
      autocomplete: 'off',
      'aria-label': '搜索测验'
    });
    input.value = quiz.query || '';
    input.oninput = function () { quiz.query = input.value; paint(); };
    search.appendChild(icon);
    search.appendChild(input);
    toolbar.appendChild(search);

    var add = h('button', {
      type: 'button',
      class: 'btn primary',
      text: quiz.creating ? '正在新建…' : '+ 新建测验'
    });
    add.disabled = quiz.creating;
    add.onclick = newQuiz;
    toolbar.appendChild(add);
    wrap.appendChild(toolbar);

    var meta = h('div', { class: 'list-meta' });
    var listEl = h('div', { class: 'list' });
    wrap.appendChild(meta);
    wrap.appendChild(listEl);

    function paint() {
      clear(listEl);
      if (!quiz.loaded && quiz.loading) {
        meta.textContent = '';
        listEl.appendChild(h('p', { class: 'loading' }, [
          h('span', { class: 'spinner' }),
          h('span', { text: '正在读取测验…' })
        ]));
        return;
      }
      if (quiz.error) {
        meta.textContent = '';
        listEl.appendChild(quizEmptyBox(quiz.error, '检查一下网络，再试一次。', function () {
          loadQuizList(true);
        }));
        return;
      }
      var rows = filteredQuizRows();
      meta.textContent = rows.length
        ? tr((rows.length === quiz.list.length ? '共 ' : '找到 ') + rows.length + ' 个测验')
        : '';
      if (!rows.length) {
        listEl.appendChild(quiz.list.length
          ? quizEmptyBox('没有匹配的测验', '换个关键词试试。')
          : quizEmptyBox('还没有测验', '点右上角「新建测验」，发布后会出现在 App 的小组课堂里。'));
        return;
      }
      rows.forEach(function (item) {
        var node = h('button', { type: 'button', class: 'row' });
        var thumbBox = h('div', { class: 'thumb' });
        thumbBox.appendChild(h('span', { class: 'thumb-mark', text: '测' }));
        node.appendChild(thumbBox);
        var main = h('div', { class: 'row-main' });
        main.appendChild(h('div', { class: 'row-title', text: item.title || '（未命名测验）' }));
        var bits = [tr(item.isPublished ? '已发布' : '草稿'), tr((item.questionCount || 0) + ' 题')];
        if (item.submissionCount) bits.push(tr('已交 ' + item.submissionCount + ' 份'));
        if (item.pendingCount) bits.push(tr('待批改 ' + item.pendingCount + ' 份'));
        if (item.lockedCount) bits.push(tr('锁定 ' + item.lockedCount + ' 份'));
        main.appendChild(h('div', { class: 'row-sub', text: bits.join(' · ') }));
        if (item.updatedAt || item.createdAt) {
          main.appendChild(h('div', {
            class: 'row-meta',
            text: tr('最近修改 ' + dateLabel(item.updatedAt || item.createdAt, true))
          }));
        }
        node.appendChild(main);
        var side = h('div', { class: 'row-side' });
        side.appendChild(h('span', {
          class: 'badge ' + (item.isPublished ? 'on' : 'off'),
          text: item.isPublished ? '已发布' : '草稿'
        }));
        side.appendChild(h('span', { class: 'row-hint', text: '管理 ›' }));
        node.appendChild(side);
        node.onclick = function () { openQuizDetail(item.id); };
        listEl.appendChild(node);
      });
    }
    paint();
    return wrap;
  }

  function openQuizDetail(id) {
    var quiz = state.quiz;
    quiz.view = 'detail';
    quiz.detail = null;
    quiz.detailLoading = true;
    quiz.detailError = '';
    quiz.paper = null;
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
    api('/admin/api/quizzes/' + id).then(function (detail) {
      quiz.detail = detail;
      quiz.detailLoading = false;
      quiz.snapshot = quizSnapshotOf(detail);
      render();
    }).catch(function (error) {
      quiz.detailLoading = false;
      quiz.detailError = error.message || '读取测验失败';
      render();
    });
  }

  function refreshQuizDetail(id, nextView) {
    return api('/admin/api/quizzes/' + id).then(function (detail) {
      var quiz = state.quiz;
      quiz.detail = detail;
      quiz.detailLoading = false;
      quiz.snapshot = quizSnapshotOf(detail);
      quiz.view = nextView || 'detail';
      quiz.paper = null;
      quiz.paperError = '';
      quiz.loaded = false;
      render();
      return detail;
    });
  }

  function leaveQuizDetail(next) {
    var quiz = state.quiz;
    if (!quiz.detail || quizSnapshotOf(quiz.detail) === quiz.snapshot) {
      next();
      return;
    }
    confirmAction('放弃未保存的修改？', '这一页还有没保存的内容，离开后这些修改就没了。', '放弃修改', next);
  }

  function quizQuestionCard(detail, question, index, refreshDirty) {
    var card = h('div', { class: 'quiz-question' });
    var head = h('div', { class: 'quiz-q-head' });
    head.appendChild(h('h3', { text: '第 ' + (index + 1) + ' 题' }));
    var tools = h('div', { class: 'quiz-q-tools' });

    var up = h('button', { type: 'button', class: 'btn mini', text: '上移' });
    up.disabled = index === 0;
    up.onclick = function () {
      if (index === 0) return;
      var list = detail.questions;
      var tmp = list[index - 1];
      list[index - 1] = list[index];
      list[index] = tmp;
      render();
    };
    tools.appendChild(up);

    var down = h('button', { type: 'button', class: 'btn mini', text: '下移' });
    down.disabled = index >= detail.questions.length - 1;
    down.onclick = function () {
      if (index >= detail.questions.length - 1) return;
      var list = detail.questions;
      var tmp = list[index + 1];
      list[index + 1] = list[index];
      list[index] = tmp;
      render();
    };
    tools.appendChild(down);

    var del = h('button', { type: 'button', class: 'btn mini danger', text: '删除' });
    del.onclick = function () {
      var remove = function () {
        detail.questions.splice(index, 1);
        render();
      };
      if (question.id) {
        confirmAction(
          '删除这道题？',
          '保存后这道题会从测验里移除，已经收到的对应答案也会一起删掉。',
          '删除',
          remove
        );
      } else {
        remove();
      }
    };
    tools.appendChild(del);
    head.appendChild(tools);
    card.appendChild(head);

    var promptField = h('label', { class: 'field' });
    promptField.appendChild(h('span', { class: 'field-label', text: '题干' }));
    var promptArea = h('textarea', { rows: 2, placeholder: '把题目写在这里' });
    promptArea.value = question.prompt || '';
    promptArea.oninput = function () {
      question.prompt = promptArea.value;
      refreshDirty();
    };
    promptField.appendChild(promptArea);
    card.appendChild(promptField);

    var kindField = h('label', { class: 'field' });
    kindField.appendChild(h('span', { class: 'field-label', text: '题型' }));
    var select = h('select');
    select.appendChild(h('option', { value: 'single', text: '单选（几个选项选一个）' }));
    select.appendChild(h('option', { value: 'essay', text: '简答（自己写一段）' }));
    select.value = question.kind === 'essay' ? 'essay' : 'single';
    kindField.appendChild(select);
    card.appendChild(kindField);

    var optionsField = h('label', { class: 'field' });
    optionsField.appendChild(h('span', { class: 'field-label', text: '选项（一行一个，2–8 个）' }));
    var optionsArea = h('textarea', { rows: 4 });
    optionsArea.value = (question.options || []).join(NEWLINE);
    optionsArea.oninput = function () {
      question.options = optionsArea.value
        .split(NEWLINE)
        .map(function (line) { return line.trim(); })
        .filter(function (line) { return !!line; });
      syncAnswerKey();
      refreshDirty();
    };
    optionsField.appendChild(optionsArea);
    card.appendChild(optionsField);
    optionsField.style.display = question.kind === 'essay' ? 'none' : '';

    var keyField = h('label', { class: 'field' });
    keyField.appendChild(h('span', {
      class: 'field-label',
      text: '正确答案（选填，只有后台能看到，批改时给你当参考）'
    }));
    var keyInput = h('input', { type: 'text', placeholder: '例如：参考答案的要点' });
    keyInput.value = question.answerKey || '';
    keyInput.oninput = function () {
      question.answerKey = keyInput.value;
      refreshDirty();
    };
    keyField.appendChild(keyInput);

    var keySelect = h('select');
    keySelect.onchange = function () {
      question.answerKey = keySelect.value;
      refreshDirty();
    };
    keyField.appendChild(keySelect);
    card.appendChild(keyField);

    function syncAnswerKey() {
      if (question.kind !== 'single') {
        keyInput.value = question.answerKey || '';
        return;
      }
      var options = question.options || [];
      if (question.answerKey && options.indexOf(question.answerKey) === -1) {
        question.answerKey = '';
      }
      clear(keySelect);
      keySelect.appendChild(h('option', { value: '', text: '（不设置）' }));
      options.forEach(function (option) {
        keySelect.appendChild(h('option', { value: option, text: option }));
      });
      keySelect.value = options.indexOf(question.answerKey || '') >= 0 ? question.answerKey : '';
    }

    function paintKeyKind() {
      var essay = question.kind === 'essay';
      keyInput.style.display = essay ? '' : 'none';
      keySelect.style.display = essay ? 'none' : '';
    }

    syncAnswerKey();
    paintKeyKind();

    select.onchange = function () {
      question.kind = select.value === 'essay' ? 'essay' : 'single';
      question.answerKey = '';
      optionsField.style.display = question.kind === 'essay' ? 'none' : '';
      syncAnswerKey();
      paintKeyKind();
      refreshDirty();
    };

    return card;
  }

  function quizSubmissionRow(submission) {
    var node = h('button', { type: 'button', class: 'row' });
    var thumbBox = h('div', { class: 'thumb' });
    thumbBox.appendChild(h('span', {
      class: 'thumb-mark',
      text: (submission.name || '？').slice(0, 1)
    }));
    node.appendChild(thumbBox);

    var main = h('div', { class: 'row-main' });
    main.appendChild(h('div', { class: 'row-title', text: submission.name || '（没写名字）' }));
    var bits = [];
    if (submission.deviceName) bits.push(submission.deviceName);
    bits.push(quizStatusLabel(submission.status));
    if (submission.grade) bits.push(tr('成绩 ' + submission.grade));
    if (submission.status === 'locked' && submission.lockedReason) {
      bits.push(tr('原因：') + submission.lockedReason);
    }
    main.appendChild(h('div', { class: 'row-sub', text: bits.join(' · ') }));
    if (submission.status !== 'draft') {
      main.appendChild(h('div', { class: 'row-meta', text: dateLabel(submission.submittedAt, true) }));
    }
    node.appendChild(main);

    var side = h('div', { class: 'row-side' });
    side.appendChild(h('span', {
      class: 'badge ' + quizStatusTone(submission.status),
      text: quizStatusLabel(submission.status)
    }));
    side.appendChild(h('span', { class: 'row-hint', text: '查看 ›' }));
    node.appendChild(side);
    node.onclick = function () { openQuizPaper(submission.id); };
    return node;
  }

  function quizDetailPage() {
    var quiz = state.quiz;
    var page = h('div', { class: 'editor-page' });
    var head = h('div', { class: 'editor-head' });
    var back = h('button', { type: 'button', class: 'editor-back', text: '← 返回测验列表' });
    back.onclick = function () {
      leaveQuizDetail(function () {
        quiz.view = 'list';
        quiz.detail = null;
        quiz.snapshot = '';
        quiz.paper = null;
        quiz.loaded = false;
        render();
      });
    };
    head.appendChild(back);

    if (!quiz.detail) {
      var headText = h('div');
      headText.appendChild(h('h2', { text: '编辑测验' }));
      headText.appendChild(h('div', {
        class: 'editor-sub',
        text: quiz.detailLoading ? '正在读取…' : (quiz.detailError || '这个测验打不开')
      }));
      head.appendChild(headText);
      page.appendChild(head);
      var emptyBody = h('div', { class: 'editor-body' });
      if (quiz.detailLoading) {
        emptyBody.appendChild(h('p', { class: 'loading' }, [
          h('span', { class: 'spinner' }),
          h('span', { text: '正在读取测验…' })
        ]));
      } else {
        emptyBody.appendChild(quizEmptyBox('测验打不开', '', function () {
          quiz.loaded = false;
          quiz.view = 'list';
          render();
        }));
      }
      page.appendChild(emptyBody);
      return page;
    }

    var detail = quiz.detail;
    var heading = h('div');
    heading.appendChild(h('h2', { text: '编辑测验' }));
    heading.appendChild(h('div', {
      class: 'editor-sub',
      text: '编号 #' + detail.id + ' · 这一页只改题目，批改在另一个页面'
    }));
    head.appendChild(heading);
    var dirtyHint = h('div', { class: 'editor-dirty' });
    head.appendChild(dirtyHint);
    page.appendChild(head);

    function refreshDirty() {
      dirtyHint.textContent = quizSnapshotOf(detail) === quiz.snapshot ? '' : tr('有未保存的修改');
    }

    var body = h('div', { class: 'editor-body' });

    var titleField = h('label', { class: 'field' });
    titleField.appendChild(h('span', { class: 'field-label', text: '测验标题' }));
    var titleInput = h('input', { type: 'text', placeholder: '例如：腓立比书 第二章' });
    titleInput.value = detail.title || '';
    titleInput.oninput = function () {
      detail.title = titleInput.value;
      refreshDirty();
    };
    titleField.appendChild(titleInput);
    body.appendChild(titleField);

    var descField = h('label', { class: 'field' });
    descField.appendChild(h('span', { class: 'field-label', text: '说明（学生开始答题前会看到）' }));
    var descArea = h('textarea', { rows: 4, placeholder: '例如：这周的查经作业，共 5 题，认真读经后再填写。' });
    descArea.value = detail.description || '';
    descArea.oninput = function () {
      detail.description = descArea.value;
      refreshDirty();
    };
    descField.appendChild(descArea);
    body.appendChild(descField);

    var publishBox = h('input', { type: 'checkbox' });
    publishBox.checked = !!detail.isPublished;
    publishBox.onchange = function () {
      detail.isPublished = publishBox.checked;
      refreshDirty();
    };
    body.appendChild(h('label', { class: 'check-row' }, [
      publishBox,
      h('span', { text: '发布到 App（关掉就是草稿，学生看不到）' })
    ]));

    var gradeList = detail.submissions || [];
    var gradePending = gradeList.filter(function (item) { return item.status === 'submitted'; }).length;
    var gradeLocked = gradeList.filter(function (item) { return item.status === 'locked'; }).length;
    var gradeEntry = h('button', { type: 'button', class: 'quiz-grade-entry' });
    var gradeMain = h('div', { class: 'main' });
    gradeMain.appendChild(h('div', { class: 'title', text: '批改作答' }));
    var gradeBits = [tr('共 ' + gradeList.length + ' 份')];
    if (gradePending) gradeBits.push(tr('待批改 ' + gradePending));
    if (gradeLocked) gradeBits.push(tr('锁定 ' + gradeLocked));
    gradeMain.appendChild(h('div', {
      class: 'sub',
      text: gradeList.length ? gradeBits.join(' · ') : '还没有人交卷'
    }));
    gradeEntry.appendChild(gradeMain);
    gradeEntry.appendChild(h('span', { class: 'arrow', text: '›' }));
    gradeEntry.onclick = function () {
      var open = function (fresh) {
        if (fresh) {
          quiz.detail = fresh;
          quiz.snapshot = quizSnapshotOf(fresh);
        }
        quiz.view = 'grade';
        quiz.paper = null;
        quiz.paperError = '';
        quiz.gradeFilter = 'all';
        render();
        window.scrollTo({ top: 0, behavior: 'auto' });
      };
      if (quizSnapshotOf(detail) === quiz.snapshot) {
        open(null);
        return;
      }
      confirmAction(
        '放弃未保存的修改？',
        '题目还有没保存的修改，去批改会丢掉这些修改。',
        '放弃修改',
        function () {
          api('/admin/api/quizzes/' + detail.id).then(function (fresh) {
            open(fresh);
          }).catch(function (error) { toast(error.message, true); });
        }
      );
    };
    body.appendChild(gradeEntry);

    var questionHead = h('div', { class: 'quiz-submissions-head' });
    questionHead.appendChild(h('h3', { text: '题目' }));
    questionHead.appendChild(h('span', {
      class: 'count',
      text: (detail.questions || []).length + ' 题'
    }));
    body.appendChild(questionHead);

    var addQuestion = h('button', { type: 'button', class: 'quiz-add-fab', text: '+ 添加题目' });
    addQuestion.onclick = function () {
      if (!detail.questions) detail.questions = [];
      if (detail.questions.length >= 50) {
        toast('一个测验最多 50 道题', true);
        return;
      }
      detail.questions.push({ id: 0, kind: 'single', prompt: '', options: ['', ''], answerKey: '' });
      render();
    };
    page.appendChild(addQuestion);

    if (!detail.questions || !detail.questions.length) {
      body.appendChild(h('p', {
        class: 'series-ep-empty',
        text: '还没有题目，点「添加题目」开始。单选题至少要有两个选项。'
      }));
    } else {
      detail.questions.forEach(function (question, index) {
        body.appendChild(quizQuestionCard(detail, question, index, refreshDirty));
      });
    }

    page.appendChild(body);

    var foot = h('div', { class: 'editor-foot' });
    var deleteButton = h('button', { type: 'button', class: 'btn danger', text: '删除测验' });
    deleteButton.onclick = function () {
      confirmAction(
        '删除这个测验？',
        '题目和已经收上来的作答都会一起删掉，不能恢复。',
        '删除',
        function () {
          deleteButton.disabled = true;
          deleteButton.textContent = tr('删除中…');
          api('/admin/api/quizzes/' + detail.id, { method: 'DELETE' }).then(function () {
            quiz.loaded = false;
            quiz.view = 'list';
            quiz.detail = null;
            quiz.snapshot = '';
            quiz.paper = null;
            toast('测验已删除');
            render();
          }).catch(function (error) {
            deleteButton.disabled = false;
            deleteButton.textContent = tr('删除测验');
            toast(error.message, true);
          });
        }
      );
    };
    foot.appendChild(deleteButton);
    foot.appendChild(h('span', { class: 'spacer' }));

    var cancel = h('button', { type: 'button', class: 'btn', text: '返回列表' });
    cancel.onclick = back.onclick;
    foot.appendChild(cancel);

    var save = h('button', { type: 'button', class: 'btn primary', text: '保存' });
    save.onclick = function () {
      var payload = quizPayloadOf(detail);
      if (!payload.title) {
        toast('测验标题不能为空', true);
        titleInput.focus();
        return;
      }
      save.disabled = true;
      save.textContent = tr('保存中…');
      api('/admin/api/quizzes/' + detail.id, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }).then(function () {
        toast('已保存' + (payload.isPublished ? '，学生可以看到了' : '，还是草稿'));
        return refreshQuizDetail(detail.id, 'detail');
      }).catch(function (error) {
        save.disabled = false;
        save.textContent = tr('保存');
        toast(error.message, true);
      });
    };
    foot.appendChild(save);
    page.appendChild(foot);

    refreshDirty();
    return page;
  }

  function quizGradePage() {
    var quiz = state.quiz;
    var page = h('div', { class: 'editor-page' });
    var head = h('div', { class: 'editor-head' });
    var back = h('button', { type: 'button', class: 'editor-back', text: '← 返回测验编辑' });
    back.onclick = function () {
      quiz.view = 'detail';
      quiz.paper = null;
      quiz.paperError = '';
      render();
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    head.appendChild(back);

    var detail = quiz.detail;
    if (!detail) {
      var headText = h('div');
      headText.appendChild(h('h2', { text: '批改作答' }));
      headText.appendChild(h('div', { class: 'editor-sub', text: '先打开一个测验再进来。' }));
      head.appendChild(headText);
      page.appendChild(head);
      var emptyBody = h('div', { class: 'editor-body' });
      emptyBody.appendChild(quizEmptyBox('还没有打开测验', '', function () {
        quiz.view = 'list';
        quiz.loaded = false;
        render();
      }));
      page.appendChild(emptyBody);
      return page;
    }

    var list = detail.submissions || [];
    var counts = { all: list.length, submitted: 0, graded: 0, locked: 0, draft: 0 };
    list.forEach(function (item) {
      if (counts[item.status] !== undefined) counts[item.status] += 1;
    });

    var heading = h('div');
    heading.appendChild(h('h2', { text: '批改作答' }));
    var sub = detail.title || '（未命名测验）';
    sub += ' · ' + tr('共 ' + list.length + ' 份');
    if (counts.submitted) sub += ' · ' + tr('待批改 ' + counts.submitted);
    if (counts.locked) sub += ' · ' + tr('锁定 ' + counts.locked);
    heading.appendChild(h('div', { class: 'editor-sub', text: sub }));
    head.appendChild(heading);
    page.appendChild(head);

    var body = h('div', { class: 'editor-body' });
    var filters = h('div', { class: 'quiz-filters' });
    var filterDefs = [
      ['all', '全部'],
      ['submitted', '待批改'],
      ['graded', '已批改'],
      ['locked', '锁定'],
      ['draft', '未提交']
    ];
    filterDefs.forEach(function (def) {
      if (def[0] !== 'all' && !counts[def[0]]) return;
      var chip = h('button', {
        type: 'button',
        class: 'btn mini' + (quiz.gradeFilter === def[0] ? ' primary' : ''),
        text: tr(def[1]) + ' ' + counts[def[0]]
      });
      chip.onclick = function () {
        quiz.gradeFilter = def[0];
        render();
      };
      filters.appendChild(chip);
    });
    body.appendChild(filters);

    var rows = list.filter(function (item) {
      return quiz.gradeFilter === 'all' || item.status === quiz.gradeFilter;
    });
    if (!list.length) {
      body.appendChild(h('p', {
        class: 'series-ep-empty',
        text: '还没有人作答。发布后，学生交卷就会出现在这里。'
      }));
    } else if (!rows.length) {
      body.appendChild(h('p', { class: 'series-ep-empty', text: '这个分类里还没有作答。' }));
    } else {
      var submissionsList = h('div', { class: 'list' });
      rows.forEach(function (submission) {
        submissionsList.appendChild(quizSubmissionRow(submission));
      });
      body.appendChild(submissionsList);
    }
    page.appendChild(body);

    var foot = h('div', { class: 'editor-foot' });
    foot.appendChild(h('span', { class: 'spacer' }));
    var backBottom = h('button', { type: 'button', class: 'btn', text: '返回测验编辑' });
    backBottom.onclick = back.onclick;
    foot.appendChild(backBottom);
    page.appendChild(foot);
    return page;
  }

  function openQuizPaper(submissionId) {
    var quiz = state.quiz;
    quiz.view = 'paper';
    quiz.paper = null;
    quiz.paperLoading = true;
    quiz.paperError = '';
    render();
    window.scrollTo({ top: 0, behavior: 'auto' });
    api('/admin/api/quizzes/' + quiz.detail.id + '/submissions/' + submissionId)
      .then(function (sheet) {
        quiz.paper = sheet;
        quiz.paperLoading = false;
        render();
      }).catch(function (error) {
        quiz.paperLoading = false;
        quiz.paperError = error.message || '读取作答失败';
        render();
      });
  }

  function quizPaperPage() {
    var quiz = state.quiz;
    var page = h('div', { class: 'editor-page' });
    var head = h('div', { class: 'editor-head' });
    var back = h('button', { type: 'button', class: 'editor-back', text: '← 返回批改列表' });
    back.onclick = function () {
      quiz.view = 'grade';
      quiz.paper = null;
      quiz.paperError = '';
      render();
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    head.appendChild(back);

    if (!quiz.paper) {
      var headText = h('div');
      headText.appendChild(h('h2', { text: '批改作答' }));
      headText.appendChild(h('div', {
        class: 'editor-sub',
        text: quiz.paperLoading ? '正在读取…' : (quiz.paperError || '这份作答打不开')
      }));
      head.appendChild(headText);
      page.appendChild(head);
      var emptyBody = h('div', { class: 'editor-body' });
      if (quiz.paperLoading) {
        emptyBody.appendChild(h('p', { class: 'loading' }, [
          h('span', { class: 'spinner' }),
          h('span', { text: '正在读取作答…' })
        ]));
      }
      page.appendChild(emptyBody);
      return page;
    }

    var paper = quiz.paper;
    var heading = h('div');
    heading.appendChild(h('h2', { text: (paper.name || '学生') + ' 的作答' }));
    heading.appendChild(h('div', { class: 'editor-sub', text: paper.quizTitle || '' }));
    head.appendChild(heading);
    page.appendChild(head);

    var body = h('div', { class: 'editor-body' });
    var meta = h('div', { class: 'quiz-paper-meta' });
    var bits = [];
    if (paper.deviceName) bits.push(tr('设备：') + paper.deviceName);
    bits.push(tr('状态：') + quizStatusLabel(paper.status));
    if (paper.status !== 'draft') bits.push(tr('提交：') + dateLabel(paper.submittedAt, true));
    if (paper.status === 'locked' && paper.lockedReason) bits.push(tr('锁定原因：') + paper.lockedReason);
    meta.textContent = bits.join(' · ');
    body.appendChild(meta);

    if (paper.status === 'locked') {
      var warning = h('div', { class: 'access-warning' });
      warning.appendChild(h('strong', { text: '这份作答被锁定了。' }));
      warning.appendChild(h('span', {
        text: ' 学生中途离开了测验页面超过 5 秒，或者尝试截屏。可以在这里解锁：已经写的内容会保留，学生重新打开测验就能接着写。'
      }));
      body.appendChild(warning);
    }

    if (!paper.answers || !paper.answers.length) {
      body.appendChild(h('p', { class: 'series-ep-empty', text: '还没有写到任何题目。' }));
    } else {
      paper.answers.forEach(function (answer, index) {
        var card = h('div', { class: 'quiz-answer' });
        card.appendChild(h('div', {
          class: 'prompt',
          text: '第 ' + (index + 1) + ' 题 · ' + (answer.prompt || '（题目已删除）')
        }));
        var value = (answer.answer || '').trim();
        card.appendChild(h('div', {
          class: 'answer' + (value ? '' : ' blank'),
          text: value || '（没有作答）'
        }));
        var key = (answer.answerKey || '').trim();
        if (key) {
          var keyBox = h('div', { class: 'quiz-answer-key' });
          keyBox.appendChild(h('b', { text: '参考答案：' }));
          keyBox.appendChild(h('span', { text: key }));
          if (answer.kind === 'single' && value) {
            keyBox.appendChild(h('span', {
              class: value === key ? 'same' : 'diff',
              text: value === key ? '作答一致' : '作答不一致'
            }));
          }
          card.appendChild(keyBox);
        }
        body.appendChild(card);
      });
    }

    var footAction = null;
    if (paper.status === 'submitted' || paper.status === 'graded') {
      var gradeField = h('label', { class: 'field' });
      gradeField.appendChild(h('span', { class: 'field-label', text: '成绩（填分数或 A–E 等级都行）' }));
      var gradeInput = h('input', { type: 'text', placeholder: '例如：85 或者 A' });
      gradeInput.value = paper.grade || '';
      gradeField.appendChild(gradeInput);
      body.appendChild(gradeField);

      var commentField = h('label', { class: 'field' });
      commentField.appendChild(h('span', { class: 'field-label', text: '评语（学生能看到，可留空）' }));
      var commentArea = h('textarea', { rows: 3 });
      commentArea.value = paper.comment || '';
      commentField.appendChild(commentArea);
      body.appendChild(commentField);

      var showBox = h('input', { type: 'checkbox' });
      showBox.checked = !!paper.showPaper;
      body.appendChild(h('label', { class: 'check-row' }, [
        showBox,
        h('span', { text: '允许这名学生查看题目、自己的作答和参考答案' })
      ]));
      body.appendChild(h('p', {
        class: 'check-hint',
        text: '勾上以后，学生的成绩和评语下面会多一个「查看题目」按钮；不勾就看不到。每次保存批改都会按这里的勾选来。'
      }));

      var saveGrade = h('button', { type: 'button', class: 'btn primary', text: '保存批改' });
      saveGrade.onclick = function () {
        if (!gradeInput.value.trim()) {
          toast('请填写成绩或等级', true);
          gradeInput.focus();
          return;
        }
        saveGrade.disabled = true;
        saveGrade.textContent = tr('保存中…');
        api('/admin/api/quizzes/' + quiz.detail.id + '/submissions/' + paper.id + '/grade', {
          method: 'POST',
          body: JSON.stringify({
            grade: gradeInput.value,
            comment: commentArea.value,
            showPaper: showBox.checked
          })
        }).then(function () {
          toast(showBox.checked
            ? '批改已保存，学生能看到成绩、题目和参考答案'
            : '批改已保存，学生只能看到成绩和评语');
          return refreshQuizDetail(quiz.detail.id, 'grade');
        }).catch(function (error) {
          saveGrade.disabled = false;
          saveGrade.textContent = tr('保存批改');
          toast(error.message, true);
        });
      };
      footAction = saveGrade;
    } else if (paper.status === 'locked') {
      var unlock = h('button', { type: 'button', class: 'btn primary', text: '解除锁定，允许继续作答' });
      unlock.onclick = function () {
        unlock.disabled = true;
        unlock.textContent = tr('解锁中…');
        api('/admin/api/quizzes/' + quiz.detail.id + '/submissions/' + paper.id + '/unlock', {
          method: 'POST'
        }).then(function () {
          toast('已解除锁定，学生重新打开测验就能接着写');
          return refreshQuizDetail(quiz.detail.id, 'grade');
        }).catch(function (error) {
          unlock.disabled = false;
          unlock.textContent = tr('解除锁定，允许继续作答');
          toast(error.message, true);
        });
      };
      footAction = unlock;
    } else {
      body.appendChild(h('p', {
        class: 'series-ep-empty',
        text: '这份作答还没提交（学生写了一半，或者被锁定了）。'
      }));
    }

    page.appendChild(body);

    var foot = h('div', { class: 'editor-foot' });
    var remove = h('button', { type: 'button', class: 'btn danger', text: '删除这份作答' });
    remove.onclick = function () {
      confirmAction(
        '删除这份作答？',
        '删除后这台手机可以重新做这个测验，已经写的内容不能恢复。',
        '删除',
        function () {
          api('/admin/api/quizzes/' + quiz.detail.id + '/submissions/' + paper.id, {
            method: 'DELETE'
          }).then(function () {
            toast('已删除，这台手机可以重做');
            return refreshQuizDetail(quiz.detail.id, 'grade');
          }).catch(function (error) { toast(error.message, true); });
        }
      );
    };
    foot.appendChild(remove);
    foot.appendChild(h('span', { class: 'spacer' }));
    var backButton = h('button', { type: 'button', class: 'btn', text: '返回批改列表' });
    backButton.onclick = back.onclick;
    foot.appendChild(backButton);
    if (footAction) foot.appendChild(footAction);
    page.appendChild(foot);

    return page;
  }

  document.addEventListener('keydown', function (event) {
    if ((event.metaKey || event.ctrlKey) && String(event.key).toLowerCase() === 'k') {
      var input = document.getElementById('search-input') ||
        document.getElementById('notice-search-input');
      if (input && (state.quiz.view === 'list' || state.notice.view === 'list')) {
        event.preventDefault();
        input.focus();
        input.select();
      }
    }
  });

  render();
})();
</script>
</body>
</html>`;
