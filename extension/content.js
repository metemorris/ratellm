(() => {
  "use strict";

  // Change this to your deployed ratellm URL (e.g. "https://ratellm.example.com").
  const API_BASE = "http://localhost:3000";

  const RESERVED = new Set([
    "datasets",
    "spaces",
    "collections",
    "models",
    "new",
    "blog",
    "docs",
    "learn",
    "tasks",
    "pricing",
    "posts",
    "papers",
    "settings",
    "organizations",
    "auth",
    "join",
    "login",
    "spaces",
    "api",
  ]);

  const USE_CASES = [
    { key: "chat", label: "Chat / assistant" },
    { key: "code", label: "Code generation" },
    { key: "agents", label: "Agents / tool use" },
    { key: "classification", label: "Classification" },
    { key: "translation", label: "Translation" },
    { key: "summarization", label: "Summarization" },
    { key: "embeddings", label: "Embeddings / retrieval" },
    { key: "image", label: "Image generation" },
    { key: "audio", label: "Speech / audio" },
    { key: "finetune", label: "Fine-tuning base" },
    { key: "other", label: "Other" },
  ];
  const USE_CASE_LABELS = Object.fromEntries(
    USE_CASES.map((u) => [u.key, u.label]),
  );

  function getModelId() {
    const seg = window.location.pathname.split("/").filter(Boolean);
    if (seg.length < 2) return null;
    if (RESERVED.has(seg[0].toLowerCase())) return null;
    return seg[0] + "/" + seg[1];
  }

  const modelId = getModelId();
  if (!modelId) return;

  const CSS = `
    :host { all: initial; }
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .fab {
      position: fixed; right: 20px; bottom: 20px; z-index: 2147483000;
      display: inline-flex; align-items: center; gap: 6px;
      background: #171717; color: #fff; border: none; border-radius: 9999px;
      padding: 10px 16px; font-size: 14px; font-weight: 600; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,.18); transition: background .15s;
    }
    .fab:hover { background: #333; }
    .fab .star { color: #f59e0b; }
    .panel {
      position: fixed; right: 20px; bottom: 72px; z-index: 2147483000;
      width: 360px; max-width: calc(100vw - 32px); max-height: 70vh;
      display: flex; flex-direction: column;
      background: #fff; color: #171717; border: 1px solid #e5e5e5; border-radius: 14px;
      box-shadow: 0 12px 40px rgba(0,0,0,.22); overflow: hidden;
    }
    .header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #eee; }
    .title { font-weight: 600; font-size: 14px; }
    .model { font-size: 12px; color: #777; margin-top: 1px; }
    .close { background: none; border: none; font-size: 20px; line-height: 1; cursor: pointer; color: #888; padding: 0 2px; }
    .body { padding: 16px; overflow-y: auto; }
    .summary { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .avg { font-size: 34px; font-weight: 700; }
    .stars { position: relative; display: inline-block; line-height: 1; }
    .stars .bg { color: #e5e5e5; }
    .stars .fg { position: absolute; left: 0; top: 0; overflow: hidden; white-space: nowrap; color: #f59e0b; }
    .count { font-size: 13px; color: #888; }
    .btn { width: 100%; background: #171717; color: #fff; border: none; border-radius: 9999px; padding: 10px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .btn:hover { background: #333; }
    .btn:disabled { opacity: .5; cursor: default; }
    .form { margin-top: 14px; border-top: 1px solid #eee; padding-top: 14px; }
    .field { margin-bottom: 12px; }
    .label { font-size: 13px; font-weight: 500; margin-bottom: 6px; display: block; }
    .rate { display: inline-flex; gap: 2px; }
    .rate button { background: none; border: none; font-size: 24px; cursor: pointer; color: #ddd; padding: 0 2px; line-height: 1; }
    .rate button.on { color: #f59e0b; }
    textarea, input, select { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 8px 10px; font-size: 14px; font-family: inherit; }
    textarea { resize: vertical; min-height: 72px; }
    .review { padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
    .review:last-child { border-bottom: none; }
    .r-top { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #888; }
    .r-author { font-weight: 600; color: #333; }
    .r-body { font-size: 14px; line-height: 1.45; margin-top: 6px; color: #333; white-space: pre-wrap; }
    .r-badge { display: inline-block; background: #f3f3f3; border-radius: 9999px; padding: 2px 8px; font-size: 11px; color: #555; }
    .msg { font-size: 13px; padding: 10px; border-radius: 8px; margin-bottom: 12px; }
    .msg.ok { background: #171717; color: #fff; }
    .msg.err { background: #fef2f2; color: #b91c1c; }
    .empty { font-size: 13px; color: #888; text-align: center; padding: 16px 0; }
  `;

  const host = document.createElement("div");
  const shadow = host.attachShadow({ mode: "open" });

  shadow.innerHTML = `
    <style>${CSS}</style>
    <button class="fab" id="rl-toggle"><span class="star">★</span> ratellm</button>
    <div class="panel" id="rl-panel" hidden>
      <div class="header">
        <div>
          <div class="title">ratellm reviews</div>
          <div class="model">${modelId}</div>
        </div>
        <button class="close" id="rl-close">×</button>
      </div>
      <div class="body">
        <div id="rl-summary"></div>
        <div id="rl-msg"></div>
        <button class="btn" id="rl-write">★ Write a review</button>
        <div class="form" id="rl-form" hidden>
          <div class="field">
            <span class="label">Overall rating</span>
            <div class="rate" id="rl-rate"></div>
          </div>
          <div class="field">
            <span class="label">Your review</span>
            <textarea id="rl-body" placeholder="What worked well? What didn't?"></textarea>
          </div>
          <div class="field">
            <span class="label">What did you use it for?</span>
            <select id="rl-usecase">
              <option value="">Select…</option>
              ${USE_CASES.map((u) => `<option value="${u.key}">${u.label}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <span class="label">Your name (optional)</span>
            <input id="rl-author" placeholder="Anonymous" />
          </div>
          <button class="btn" id="rl-submit">Post review</button>
        </div>
        <div id="rl-reviews"></div>
      </div>
    </div>
  `;

  document.documentElement.appendChild(host);

  const toggle = shadow.getElementById("rl-toggle");
  const panel = shadow.getElementById("rl-panel");
  const close = shadow.getElementById("rl-close");
  const summaryEl = shadow.getElementById("rl-summary");
  const msgEl = shadow.getElementById("rl-msg");
  const writeBtn = shadow.getElementById("rl-write");
  const formEl = shadow.getElementById("rl-form");
  const rateEl = shadow.getElementById("rl-rate");
  const reviewsEl = shadow.getElementById("rl-reviews");
  const submitBtn = shadow.getElementById("rl-submit");

  let rating = 0;

  function starsHTML(value, size) {
    const pct = Math.max(0, Math.min(100, (value / 5) * 100));
    return `<span class="stars" style="font-size:${size}px"><span class="bg">★★★★★</span><span class="fg" style="width:${pct}%">★★★★★</span></span>`;
  }

  function setMsg(text, kind) {
    msgEl.innerHTML = text ? `<div class="msg ${kind}"></div>` : "";
    if (text) msgEl.firstElementChild.textContent = text;
  }

  function renderRateButtons() {
    rateEl.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = "★";
      b.className = i <= rating ? "on" : "";
      b.addEventListener("click", () => {
        rating = i;
        renderRateButtons();
      });
      rateEl.appendChild(b);
    }
  }

  function renderSummary() {
    if (!summary || summary.count === 0) {
      summaryEl.innerHTML = `<div class="summary"><span class="stars" style="font-size:18px"><span class="bg">★★★★★</span></span><span class="count">No reviews yet</span></div>`;
      return;
    }
    summaryEl.innerHTML = `
      <div class="summary">
        <span class="avg">${summary.average.toFixed(1)}</span>
        <div>${starsHTML(summary.average, 18)}<div class="count">${summary.count} review${summary.count === 1 ? "" : "s"}</div></div>
      </div>`;
  }

  function renderReviews() {
    if (!reviews.length) {
      reviewsEl.innerHTML = `<div class="empty">No reviews yet. Be the first.</div>`;
      return;
    }
    reviewsEl.innerHTML = reviews
      .map((r) => {
        const date = new Date(r.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const badge = USE_CASE_LABELS[r.useCase] || r.useCase;
        return `
          <div class="review">
            <div class="r-top">
              <span class="r-author">${r.author || "Anonymous"}</span>
              <span>${date}</span>
              <span class="r-badge">${badge}</span>
            </div>
            <div style="margin-top:4px">${starsHTML(r.rating, 13)} <span style="font-size:12px;color:#555">${r.rating.toFixed(1)}</span></div>
            ${r.title ? `<div style="font-weight:600;font-size:14px;margin-top:4px">${r.title}</div>` : ""}
            <div class="r-body">${r.body}</div>
          </div>`;
      })
      .join("");
  }

  async function load() {
    try {
      const res = await fetch(
        `${API_BASE}/api/reviews?modelId=${encodeURIComponent(modelId)}`,
      );
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      summary = data.summary;
      reviews = data.reviews;
      renderSummary();
      renderReviews();
      toggle.innerHTML = `<span class="star">★</span> ratellm${
        summary && summary.count > 0 ? ` · ${summary.average.toFixed(1)}` : ""
      }`;
    } catch {
      summary = null;
      reviews = [];
      summaryEl.innerHTML = `<div class="empty">Couldn't reach ratellm. Make sure the server is running.</div>`;
      reviewsEl.innerHTML = "";
    }
  }

  toggle.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) load();
  });
  close.addEventListener("click", () => (panel.hidden = true));

  writeBtn.addEventListener("click", () => {
    formEl.hidden = !formEl.hidden;
    if (!formEl.hidden && !rateEl.childElementCount) renderRateButtons();
  });

  submitBtn.addEventListener("click", async () => {
    const body = shadow.getElementById("rl-body").value.trim();
    const useCase = shadow.getElementById("rl-usecase").value;
    const author = shadow.getElementById("rl-author").value.trim();
    setMsg("", "");

    if (!rating) {
      setMsg("Please choose a star rating.", "err");
      return;
    }
    if (body.length < 10) {
      setMsg("Review is too short. Add a little more detail.", "err");
      return;
    }
    if (!useCase) {
      setMsg("Please choose what you used it for.", "err");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Posting…";
    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId, rating, body, useCase, author }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post");
      setMsg("Thanks — your review is live.", "ok");
      formEl.hidden = true;
      rating = 0;
      shadow.getElementById("rl-body").value = "";
      shadow.getElementById("rl-usecase").value = "";
      shadow.getElementById("rl-author").value = "";
      renderRateButtons();
      await load();
    } catch (e) {
      setMsg(e.message || "Failed to post review.", "err");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Post review";
    }
  });

  renderRateButtons();
  load();
})();
