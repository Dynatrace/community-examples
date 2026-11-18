/*!
 * In-product feedback widget for apps monitored with Dynatrace RUM.
 *
 * Zero dependencies. Sends every submission as a business event of type
 * "feedback-form-submit" through the Dynatrace RUM JavaScript
 * (dynatrace.sendBizEvent). RUM enriches each event with session, device,
 * browser, OS and geo context, so the dashboard and workflows in this folder
 * can link every piece of feedback to its Session Replay.
 *
 * Usage:
 *   Load this file, e.g. with a script tag pointing to feedback-widget.js, then:
 *
 *     DtFeedback.init({ appName: 'My Web Shop', appVersion: '2.14.0' });
 *     // Optional: open it after a journey finishes, tagged with a feature name
 *     DtFeedback.open({ featureName: 'Checkout' });
 *     // Optional: inline thumbs next to something users judge
 *     DtFeedback.thumbs(document.querySelector('#search-results-footer'), { featureName: 'Search' });
 *
 *
 * Licensed under Apache-2.0, like the community-examples repository.
 */
(function (global) {
  'use strict';

  var EVENT_TYPE = 'feedback-form-submit';
  var MIN_LEN = 10;
  var MAX_LEN = 500;
  var SUCCESS_MS = 2000;

  var config = {
    appName: document.title || 'Web app',
    appVersion: undefined,
    showLauncher: true,          // floating "Feedback" button
    launcherLabel: 'Feedback',
    position: 'bottom-right',    // bottom-right | bottom-left
    accentColor: '#5c37eb',
    title: 'Share feedback',
    placeholder: 'Describe your feedback as detailed as possible',
    optionalPlaceholder: 'Tell us more (optional)',
    notice: 'Your feedback will be used for analysis and improvement purposes. We may contact you about it.',
    unavailableText: 'Sending feedback is currently unavailable. An ad blocker or privacy setting may block it.',
    thanksText: 'Thanks for your feedback.',
    thumbsQuestion: 'Was this helpful?',
    extraFields: null            // optional function returning extra, non-personal fields, e.g. () => ({ plan: 'pro' })
  };

  var root = null;
  var stylesInjected = false;

  function rumAvailable() {
    return !!(global.dynatrace && typeof global.dynatrace.sendBizEvent === 'function');
  }

  function toFeedbackType(featureName) {
    return featureName ? String(featureName).trim().toLowerCase().replace(/\s+/g, '-') : 'general';
  }

  function normalizeThumbs(value) {
    return value === 'up' || value === 'down' ? value : undefined;
  }

  /** Sends one feedback event. Returns true on success. Undefined values are omitted, never sent as null. */
  function send(data) {
    if (!rumAvailable()) return false;
    var fields = {
      'event.name': 'Feedback submitted',
      feedbackType: data.feedbackType,
      appName: config.appName,
      pagePath: global.location ? global.location.pathname : undefined // path only, never query strings
    };
    if (config.appVersion) fields.appVersion = config.appVersion;
    if (data.feedback) fields.feedback = data.feedback;
    if (data.thumbs) fields.thumbs = data.thumbs;
    if (typeof config.extraFields === 'function') {
      try {
        var extra = config.extraFields() || {};
        Object.keys(extra).forEach(function (k) { if (extra[k] !== undefined) fields[k] = extra[k]; });
      } catch (e) { /* ignore broken extra fields */ }
    }
    Object.keys(fields).forEach(function (k) { if (fields[k] === undefined) delete fields[k]; });
    try {
      global.dynatrace.sendBizEvent(EVENT_TYPE, fields);
      return true;
    } catch (e) {
      if (global.console) console.error('Failed to send feedback business event', e);
      return false;
    }
  }

  function css() {
    var a = config.accentColor;
    return '' +
      '.dtfb-launcher{position:fixed;bottom:20px;' + (config.position === 'bottom-left' ? 'left' : 'right') + ':20px;z-index:2147483000;' +
      'background:' + a + ';color:#fff;border:0;border-radius:999px;padding:10px 16px;font:600 14px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.2)}' +
      '.dtfb-backdrop{position:fixed;inset:0;background:rgba(20,18,40,.45);z-index:2147483001;display:flex;align-items:center;justify-content:center}' +
      '.dtfb-modal{position:relative;background:#fff;color:#1b1d29;width:min(440px,calc(100vw - 32px));border-radius:12px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.3);font:14px/1.45 system-ui,sans-serif}' +
      '.dtfb-modal h2{font-size:17px;margin:0 0 12px}' +
      '.dtfb-modal textarea{width:100%;box-sizing:border-box;min-height:96px;border:1px solid #cfcae6;border-radius:8px;padding:10px;font:inherit;resize:vertical}' +
      '.dtfb-modal textarea:focus{outline:2px solid ' + a + ';outline-offset:1px}' +
      '.dtfb-err{color:#c62239;font-size:12.5px;min-height:16px;margin-top:4px}' +
      '.dtfb-notice{color:#6a6e80;font-size:12px;margin:8px 0 14px}' +
      '.dtfb-foot{display:flex;justify-content:flex-end;gap:8px}' +
      '.dtfb-btn{border:1px solid #cfcae6;background:#fff;border-radius:8px;padding:8px 14px;font:600 14px system-ui,sans-serif;cursor:pointer;color:#2b2e3d}' +
      '.dtfb-btn.pri{background:' + a + ';border-color:' + a + ';color:#fff}' +
      '.dtfb-btn[disabled]{opacity:.5;cursor:not-allowed}' +
      '.dtfb-thumbs{display:inline-flex;gap:6px;align-items:center}' +
      '.dtfb-thumb{width:34px;height:30px;border:1px solid #cfcae6;background:#fff;border-radius:8px;cursor:pointer;display:inline-grid;place-items:center;color:#4a4e60}' +
      '.dtfb-thumb[aria-pressed="true"]{background:' + a + ';border-color:' + a + ';color:#fff}' +
      '.dtfb-thumb svg{width:16px;height:16px}' +
      '.dtfb-ok{position:absolute;inset:0;background:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px}';
  }

  function injectStyles() {
    if (stylesInjected) return;
    var s = document.createElement('style');
    s.setAttribute('data-dtfb', '');
    s.textContent = css();
    document.head.appendChild(s);
    stylesInjected = true;
  }

  var THUMB_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7"/></svg>';

  function thumbButton(kind, pressed, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'dtfb-thumb';
    b.setAttribute('aria-label', kind === 'up' ? 'Thumbs up' : 'Thumbs down');
    b.setAttribute('aria-pressed', String(!!pressed));
    b.innerHTML = THUMB_SVG;
    if (kind === 'down') b.firstChild.style.transform = 'rotate(180deg)';
    b.addEventListener('click', onClick);
    return b;
  }

  /**
   * Opens the feedback dialog.
   * @param {{featureName?: string, thumbs?: 'up'|'down', onClose?: function}} [opts]
   */
  function open(opts) {
    opts = opts || {};
    injectStyles();
    close();

    var feedbackType = toFeedbackType(opts.featureName);
    var thumbs = normalizeThumbs(opts.thumbs);
    var thumbsMode = thumbs !== undefined;
    var sent = false;
    var lastFocus = document.activeElement;

    var backdrop = document.createElement('div');
    backdrop.className = 'dtfb-backdrop';
    var modal = document.createElement('div');
    modal.className = 'dtfb-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'dtfb-title');
    backdrop.appendChild(modal);

    var h = document.createElement('h2');
    h.id = 'dtfb-title';
    h.textContent = config.title;
    modal.appendChild(h);

    var thumbsWrap;
    if (thumbsMode) {
      thumbsWrap = document.createElement('div');
      thumbsWrap.className = 'dtfb-thumbs';
      thumbsWrap.setAttribute('role', 'group');
      thumbsWrap.setAttribute('aria-label', 'Your rating');
      thumbsWrap.style.marginBottom = '10px';
      var renderThumbs = function () {
        thumbsWrap.innerHTML = '';
        ['up', 'down'].forEach(function (k) {
          thumbsWrap.appendChild(thumbButton(k, thumbs === k, function () { thumbs = k; renderThumbs(); }));
        });
      };
      renderThumbs();
      modal.appendChild(thumbsWrap);
    }

    var ta = document.createElement('textarea');
    ta.maxLength = MAX_LEN;
    ta.placeholder = thumbsMode ? config.optionalPlaceholder : config.placeholder;
    ta.setAttribute('aria-label', 'Feedback');
    // Mask the text in Session Replay: the content is captured once, in the business event.
    ta.setAttribute('data-dtrum-mask', '');
    ta.setAttribute('data-dt-mask', '');
    modal.appendChild(ta);

    var err = document.createElement('div');
    err.className = 'dtfb-err';
    err.setAttribute('aria-live', 'polite');
    modal.appendChild(err);

    var notice = document.createElement('div');
    notice.className = 'dtfb-notice';
    notice.textContent = config.notice;
    modal.appendChild(notice);

    var foot = document.createElement('div');
    foot.className = 'dtfb-foot';
    var cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'dtfb-btn';
    cancel.textContent = 'Cancel';
    var submit = document.createElement('button');
    submit.type = 'button';
    submit.className = 'dtfb-btn pri';
    submit.textContent = 'Submit';
    if (!rumAvailable()) {
      submit.disabled = true;
      submit.title = config.unavailableText;
    }
    foot.appendChild(cancel);
    foot.appendChild(submit);
    modal.appendChild(foot);

    function finish(result) {
      close();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      if (typeof opts.onClose === 'function') opts.onClose(result);
    }

    function onSubmit() {
      if (sent) return;
      var text = ta.value.trim();
      if (!thumbsMode && !text) { err.textContent = 'Feedback is required.'; return; }
      if (!thumbsMode && text.length < MIN_LEN) {
        err.textContent = 'Please provide at least ' + MIN_LEN + ' characters so we can act on your feedback.';
        return;
      }
      if (!send({ feedback: text || undefined, feedbackType: feedbackType, thumbs: thumbs })) {
        err.textContent = 'Your feedback could not be sent. Please try again in a moment.';
        return;
      }
      sent = true;
      var ok = document.createElement('div');
      ok.className = 'dtfb-ok';
      ok.setAttribute('role', 'status');
      ok.textContent = config.thanksText;
      modal.appendChild(ok);
      setTimeout(function () { finish({ submitted: true, thumbs: thumbs }); }, SUCCESS_MS);
    }

    function onCancel() {
      if (sent) return;
      // The thumbs click already is feedback: record it even if the user skips the comment.
      if (thumbsMode && thumbs) { sent = send({ feedbackType: feedbackType, thumbs: thumbs }); }
      finish({ submitted: false, thumbs: thumbs });
    }

    submit.addEventListener('click', onSubmit);
    cancel.addEventListener('click', onCancel);
    ta.addEventListener('input', function () { err.textContent = ''; });
    backdrop.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Tab') { // simple focus trap
        var f = modal.querySelectorAll('button:not([disabled]),textarea');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    });
    backdrop.addEventListener('mousedown', function (e) { if (e.target === backdrop) onCancel(); });

    document.body.appendChild(backdrop);
    root = backdrop;
    ta.focus();
  }

  function close() {
    if (root && root.parentNode) root.parentNode.removeChild(root);
    root = null;
  }

  /**
   * Renders "Was this helpful? 👍 👎" into a container. A click opens the dialog with that thumb preselected.
   * @param {HTMLElement} container
   * @param {{featureName?: string, question?: string}} [opts]
   */
  function thumbs(container, opts) {
    if (!container) return;
    opts = opts || {};
    injectStyles();
    var wrap = document.createElement('span');
    wrap.className = 'dtfb-thumbs';
    var label = document.createElement('span');
    label.textContent = opts.question || config.thumbsQuestion;
    label.style.cssText = 'color:#6a6e80;font:13px system-ui,sans-serif;margin-right:4px';
    wrap.appendChild(label);
    var selected;
    function render() {
      while (wrap.childNodes.length > 1) wrap.removeChild(wrap.lastChild);
      ['up', 'down'].forEach(function (k) {
        wrap.appendChild(thumbButton(k, selected === k, function () {
          selected = k; render();
          open({ featureName: opts.featureName, thumbs: k, onClose: function (r) { selected = r && r.thumbs; render(); } });
        }));
      });
    }
    render();
    container.appendChild(wrap);
  }

  function init(userConfig) {
    Object.keys(userConfig || {}).forEach(function (k) { config[k] = userConfig[k]; });
    var mount = function () {
      injectStyles();
      if (config.showLauncher && !document.querySelector('.dtfb-launcher')) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'dtfb-launcher';
        b.textContent = config.launcherLabel;
        b.addEventListener('click', function () { open(); });
        document.body.appendChild(b);
      }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
  }

  global.DtFeedback = { init: init, open: open, close: close, thumbs: thumbs, send: send, isAvailable: rumAvailable };
})(window);
