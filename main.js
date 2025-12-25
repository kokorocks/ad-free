// used https://caiorss.github.io/bookmarklet-maker/ to make code into a bookmarklet, you can copy and paste this code into the console and that will work too

(function() {
  function cleanNode(node) {
    if (!node) return;

    // Remove <script> tags that look like ads
    if (node.tagName === "SCRIPT") {
      const src = (node.src || "").toLowerCase();
      if (
        src.includes("ads") ||
        src.includes("doubleclick") ||
        src.includes("adservice") ||
        src.includes("googletagservices") ||
        src.includes("tracking") ||
        (node.innerText && /ad|googletag|track/i.test(node.innerText))
      ) {
        node.remove();
        return;
      }
    }

    // Remove iframes
    if (node.tagName === "IFRAME") {
      const src = (node.src || "").toLowerCase();
      if (src.includes("ads") || src.includes("doubleclick") || src.includes("banner") || src.includes("adservice")) {
        node.remove();
        return;
      }
    }

    // Normalize ID and className to strings
    const id = (node.id || "").toString().toLowerCase();
    const className = (node.className || "").toString().toLowerCase();

    // Remove elements with ad/sponsor IDs or classes
    if (id.includes("ads") || id.includes("sponsor") || id.includes("banner") ||  className.match(/ads|sponsor|banner/)) {
      node.remove();
      return;
    }

    // Remove comment nodes
    if (node.nodeType === Node.COMMENT_NODE) {
      node.remove();
      return;
    }

    // Recursively check children
    if (node.childNodes) {
      node.childNodes.forEach(cleanNode);
    }
  }

  // Initial clean
  cleanNode(document.body);

  // Watch for new elements added to DOM
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(cleanNode);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log("🚫 MutationObserver ad cleaner is running asynchronously...");
})();



// ------------------------------------------------------- element remover --------------------------------------------------------------------//
(function () {
    // Toggle variable
    window.__deleterActive = !window.__deleterActive;

    function clearHighlight() {
        if (window.__deleterHighlight) {
            window.__deleterHighlight.style.outline = "";
            window.__deleterHighlight = null;
        }
        if (window.__deleterButton) {
            window.__deleterButton.remove();
            window.__deleterButton = null;
        }
    }

    if (!window.__deleterActive) {
        document.removeEventListener("click", window.__deleterHandler, true);
        clearHighlight();
        alert("Delete mode OFF");
        return;
    }

    alert("Delete mode ON — click an element to select it");

    // Create small floating delete button
    function createDeleteButton(x, y, targetEl) {
        if (window.__deleterButton) window.__deleterButton.remove();

        const btn = document.createElement("button");
        btn.textContent = "Delete?";
        btn.style.position = "fixed";
        btn.style.left = x + "px";
        btn.style.top = y + "px";
        btn.style.zIndex = 999999;
        btn.style.padding = "6px 10px";
        btn.style.fontSize = "14px";
        btn.style.borderRadius = "8px";
        btn.style.border = "1px solid #888";
        btn.style.background = "#fff";
        btn.style.color = "#000";
        btn.style.cursor = "pointer";
        btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";

        document.body.appendChild(btn);
        window.__deleterButton = btn;

        btn.onclick = () => {
            animateRemove(targetEl);
            clearHighlight();
        };
    }

    // Collapse + fade animation
    function animateRemove(el) {
        const rect = el.getBoundingClientRect();
        el.style.height = rect.height + "px";
        el.style.width = rect.width + "px";
        el.style.transition =
            "opacity 0.4s ease, height 0.4s ease, width 0.4s ease, margin 0.4s ease, padding 0.4s ease";
        el.style.overflow = "hidden";

        requestAnimationFrame(() => {
            el.style.opacity = "0";
            el.style.height = "0";
            el.style.width = "0";
            el.style.margin = "0";
            el.style.padding = "0";
        });

        setTimeout(() => el.remove(), 400);
    }

    // Click handler
    window.__deleterHandler = function (e) {
        // Ignore clicks on the delete button itself
        if (e.target === window.__deleterButton) return;

        e.preventDefault();
        e.stopPropagation();

        const target = e.target;

        // ❗ FIXED: If clicking BODY/HTML → deselect ONLY, no delete button
        if (target === document.body || target === document.documentElement) {
            clearHighlight();
            return;
        }

        // Select new element
        clearHighlight();
        target.style.outline = "3px solid red";
        window.__deleterHighlight = target;

        // Show delete button
        createDeleteButton(e.clientX, e.clientY, target);
    };

    document.addEventListener("click", window.__deleterHandler, true);
})();

//--------------------------------------------screenshot bookmarklet------------------------------------------------------//

(function(){
    const apiUrl = 'https://api.microlink.io/?url=' + encodeURIComponent(window.location.href) + '&screenshot=true&meta=false&fullPage=true';
    console.log(apiUrl)
    fetch(apiUrl)
        .then(res => res.json())
        .then(json => {
            if(json.status !== 'success' || !json.data.screenshot) {
                console.error('Microlink screenshot failed', json);
                return;
            }

            const imgUrl = json.data.screenshot.url;

            // Create menu container
            const menu = document.createElement('div');
            menu.style.position = 'fixed';
            menu.style.top = '20px';
            menu.style.right = '20px';
            menu.style.background = 'rgba(0,0,0,0.8)';
            menu.style.color = '#fff';
            menu.style.padding = '10px';
            menu.style.borderRadius = '8px';
            menu.style.zIndex = '9999';
            menu.style.fontFamily = 'sans-serif';
            menu.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            menu.style.display = 'flex';
            menu.style.flexDirection = 'column';
            menu.style.gap = '8px';

            // Button: Show image
            const showBtn = document.createElement('button');
            showBtn.innerText = 'Show Image';
            showBtn.style.padding = '5px';
            showBtn.style.cursor = 'pointer';
            showBtn.onclick = () => {
                const img = document.createElement('img');
                img.src = imgUrl;
                img.style.position = 'fixed';
                img.style.top = '60px';
                img.style.right = '20px';
                img.style.width = '400px';
                img.style.zIndex = '9998';
                img.style.border = '3px solid red';
                document.body.appendChild(img);
            };

            // Button: Download
            const downloadBtn = document.createElement('button');
            downloadBtn.innerText = 'Download';
            downloadBtn.style.padding = '5px';
            downloadBtn.style.cursor = 'pointer';
downloadBtn.onclick = async () => {
    try {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'screenshot.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(blobUrl); // clean up
    } catch (err) {
        console.error('Download failed', err);
    }
};


            // Button: Open in new tab
            const openBtn = document.createElement('button');
            openBtn.innerText = 'Open in New Tab';
            openBtn.style.padding = '5px';
            openBtn.style.cursor = 'pointer';
            openBtn.onclick = () => {
                window.open(imgUrl, '_blank');
            };

            // Button: Close menu
            const closeBtn = document.createElement('button');
            closeBtn.innerText = 'Close Menu';
            closeBtn.style.padding = '5px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = () => menu.remove();

            // Append buttons
            menu.appendChild(showBtn);
            menu.appendChild(downloadBtn);
            menu.appendChild(openBtn);
            menu.appendChild(closeBtn);

            document.body.appendChild(menu);
        });
})();

//-------------------------------------------------------- skipcut youtube ad remover ----------------------------------------------//

(function() {
    if(window.location.hostname==='www.youtube.com' || window.location.hostname==='youtube.com' || window.location.hostname==='youtu.be'){
        url=window.location.href.replace('youtube', 'skipcut')
        location.replace(url)
    }else{
        alert('no')
    }
})()

//--------------------------------------------------------- seperate tab muter ---------------------------------------------------------//

(() => {
  const STATE_KEY = "__TAB_MUTED__";

  const isMuted = window[STATE_KEY] === true;

  const apply = (el, mute) => {
    if (!el.__origVolume) {
      el.__origVolume = el.volume;
    }
    el.muted = mute;
    el.volume = mute ? 0 : el.__origVolume ?? 1;
  };

  // Toggle state
  window[STATE_KEY] = !isMuted;

  // Apply to existing media
  document.querySelectorAll("audio, video").forEach(el =>
    apply(el, window[STATE_KEY])
  );

  // Mutation observer (only active while muted)
  if (window[STATE_KEY]) {
    if (!window.__mediaObserver) {
      window.__mediaObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (node instanceof HTMLMediaElement) {
              apply(node, true);
            }
            if (node.querySelectorAll) {
              node.querySelectorAll("audio, video").forEach(el =>
                apply(el, true)
              );
            }
          }
        }
      });

      window.__mediaObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  } else {
    // Unmuting → disconnect observer
    window.__mediaObserver?.disconnect();
    window.__mediaObserver = null;
  }

  console.log(window[STATE_KEY] ? "🔇 Tab muted" : "🔊 Tab unmuted");
})();

//------------------------------------------quick random-----------------------------------------------------------------////////

(function() {
    // Insert modal HTML into body
    document.body.insertAdjacentHTML('afterbegin', `
    <div id="modal-overlay">
        <dialog id="style" open>
            <style>
            #modal-overlay{
                position: fixed;
                top:0; left:0;
                width:100%; height:100%;
                backdrop-filter: blur(5px);
                background: rgba(0,0,0,0.3);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 99999;
            }
            #style{
                color-scheme: light dark;
                background: light-dark(white, black);
                border-radius: 15px;
                width: 300px;
                padding: 20px;
                text-align: center;
            }
            #x{
                cursor: pointer;
                position: relative;
            }
            #x:hover::after{
                content:"Click to copy";
                position:absolute;
                top:-25px;
                left:50%;
                transform:translateX(-50%);
                background:#000;
                color:#fff;
                padding:3px 6px;
                border-radius:4px;
                font-size:12px;
                white-space:nowrap;
            }
            </style>
            <form method="dialog" id="genForm">
                <label>from: <input id="s" type="number" value="1"></label><hr>
                <label>to: <input id="t" type="number" value="2"></label><br><br>
                <button type="submit">Generate</button><br><br>
                <output id="x" name="x" for="s t" onclick="navigator.clipboard.writeText(this.textContent)">1</output><br>
                <button id='cls'>close</button>
            </form>
        </dialog>
    </div>
    `);

    // Disable background scrolling
    document.body.style.overflow = 'hidden';

    const form = document.getElementById('genForm');
    const output = document.getElementById('x');
    const overlay = document.getElementById('modal-overlay');
    const dialog = document.getElementById('style');
    const cls = document.getElementById('cls');

    // Generate button functionality
    form.addEventListener('submit', e => {
        e.preventDefault();
        const f = Number(document.getElementById('s').value);
        const t = Number(document.getElementById('t').value);
        if(!isNaN(f) && !isNaN(t)){
            output.value = Math.floor(Math.random() * (t - f + 1)) + f;
        }
    });

    // make clicking outside from closing
    overlay.addEventListener('click', e =>overlay.outerHTML='');
    dialog.addEventListener('click', e => e.stopPropagation());
    cls.onclick=function(){overlay.outerHTML=''}
})();
//-------------------------------------------------------------auto darkmode------------------------------------------------//
(function() {
var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/darkreader/darkreader.js';
script.onload = () => DarkReader.enable({ brightness: 100, contrast: 90, sepia: 10 });
document.head.appendChild(script);
})();

//--------------------------------------------------------------- link previewer ---------------------------------------------------------------//

(() => {
  // Check if the preview is already running
  if (window.__microlinkHoverPreview) {
    // Stop it
    const { box, listeners } = window.__microlinkHoverPreview;
    listeners.forEach(({ event, handler }) => document.removeEventListener(event, handler));
    box.remove();
    delete window.__microlinkHoverPreview;
    return;
  }

  // Create preview box
  const box = document.createElement("div");
  box.style.cssText = `
    position: fixed;
    z-index: 999999;
    width: 280px;
    background: #111;
    color: #fff;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0,0,0,.5);
    font-family: system-ui, sans-serif;
    font-size: 13px;
    display: none;
    overflow: hidden;
    pointer-events: none;
  `;
  document.body.appendChild(box);

  let enabled = true;
  let controller;

  async function preview(url) {
    controller?.abort();
    controller = new AbortController();
    try {
      const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`, {
        signal: controller.signal
      });
      const { data } = await res.json();
      box.innerHTML = `
        ${data.image?.url ? `<img src="${data.image.url}" style="width:100%;display:block;height:120px;object-fit:cover;">` : ""}
        <div style="padding:8px">
          <div style="font-weight:600;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${data.title || url}</div>
          <div style="opacity:.8;height:36px;overflow:hidden;text-overflow:ellipsis;">${data.description || "No description available"}</div>
          <div style="margin-top:6px;opacity:.6;font-size:11px;">${new URL(url).hostname}</div>
        </div>
      `;
    } catch {
      box.innerHTML = "<div style='padding:8px'>Preview unavailable</div>";
    }
  }

  function positionBox(x, y) {
    const margin = 15;
    const boxRect = box.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    let left = x + margin;
    let top = y + margin;
    if (left + boxRect.width > winW) left = x - boxRect.width - margin;
    if (top + boxRect.height > winH) top = y - boxRect.height - margin;
    if (left < 0) left = margin;
    if (top < 0) top = margin;
    box.style.left = left + "px";
    box.style.top = top + "px";
  }

  function handleMouseOver(e) {
    if (!enabled) return;
    const a = e.target.closest("a[href]");
    if (!a || !a.href.startsWith("http")) return;
    box.style.display = "block";
    box.innerHTML = "<div style='padding:8px'>Loading preview…</div>";
    preview(a.href);
  }

  function handleMouseMove(e) {
    if (!enabled) return;
    if (box.style.display === "block") positionBox(e.clientX, e.clientY);
  }

  function handleMouseOut(e) {
    if (!enabled) return;
    if (e.target.closest("a")) {
      box.style.display = "none";
      controller?.abort();
    }
  }
  const listeners = [
    { event: "mouseover", handler: handleMouseOver },
    { event: "mousemove", handler: handleMouseMove },
    { event: "mouseout", handler: handleMouseOut },
  ];

  listeners.forEach(({ event, handler }) => document.addEventListener(event, handler));

  window.__microlinkHoverPreview = { box, listeners };
})();

//------------------------------------------------------------------------------------ currency converter ---------------------------------------------------------------------------------//

(() => {
  // Check if already running
  if (window.priceConverterActive) {
    // Remove UI
    const existingUI = document.getElementById("priceConverterUI");
    if (existingUI) existingUI.remove();

    // Remove event listeners
    document.removeEventListener("keydown", window.priceConverterKeyListener);
    window.priceConverterActive = false;
    return;
  }

  window.priceConverterActive = true;

  const API = "https://api.exchangerate-api.com/v4/latest/USD";
  let rates = null;
  const undoStack = [];

  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"];
  const symbols = {
    "$": "USD", "USD": "USD",
    "€": "EUR", "EUR": "EUR",
    "£": "GBP", "GBP": "GBP",
    "¥": "JPY", "JPY": "JPY",
    "C$": "CAD", "CAD": "CAD",
    "A$": "AUD", "AUD": "AUD",
    "CHF": "CHF",
    "CN¥": "CNY", "CNY": "CNY"
  };

  // Create UI
  const ui = document.createElement("div");
  ui.id = "priceConverterUI";
  ui.style = "position:fixed;top:10px;right:10px;background:#fff;padding:10px;border:1px solid #ccc;z-index:9999;font-family:sans-serif;";
  ui.innerHTML = `
    <label>From:
      <select id="fromCurrency">${currencies.map(c => `<option value="${c}">${c}</option>`).join("")}</select>
    </label>
    <label>To:
      <select id="toCurrency">${currencies.map(c => `<option value="${c}">${c}</option>`).join("")}</select>
    </label>
    <button id="convertBtn">Convert Selection</button>
    <button id="undoBtn">Undo</button>
    <small>Alt+C = Convert | Alt+Z = Undo</small>
  `;
  document.body.appendChild(ui);

  const fromSelect = document.getElementById("fromCurrency");
  const toSelect = document.getElementById("toCurrency");
  const convertBtn = document.getElementById("convertBtn");
  const undoBtn = document.getElementById("undoBtn");

  const PRICE_REGEX = /\b(?:\$|USD|€|EUR|£|GBP|¥|JPY|C\$|A\$|CHF|CN¥|CAD|AUD|CNY)?\s*\d{1,3}(?:[.,\s]\d{2,3})*\b/g;

  async function loadRates() {
    if (rates) return rates;
    const res = await fetch(API);
    const data = await res.json();
    rates = data.rates;
    return rates;
  }

  function detectCurrency(symbol) {
    if (!symbol) return fromSelect.value;
    symbol = symbol.trim();
    return symbols[symbol] || fromSelect.value;
  }

  function parseNumber(str) {
    let num = str.replace(/[^\d.,]/g, "");
    if (num.includes(" ")) num = num.replace(" ", ".");
    if (num.includes(",")) num = num.replace(",", ".");
    return parseFloat(num);
  }

  function convertAmount(value, fromRate, toRate) {
    return ((toRate / fromRate) * value).toFixed(2);
  }

  async function convertSelection() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const text = range.toString();
    if (!text) return;

    await loadRates();

    const convertedFragments = [];
    let lastIndex = 0;

    text.replace(PRICE_REGEX, (match, offset) => {
      convertedFragments.push({ text: text.slice(lastIndex, offset), original: null });

      const symbolMatch = match.match(/^\s*(\$|USD|€|EUR|£|GBP|¥|JPY|C\$|A\$|CHF|CN¥|CAD|AUD)/i);
      const fromCurrency = detectCurrency(symbolMatch ? symbolMatch[1] : null);

      const value = parseNumber(match);
      if (!Number.isFinite(value)) {
        convertedFragments.push({ text: match, original: null });
      } else {
        const converted = convertAmount(value, rates[fromCurrency], rates[toSelect.value]);
        convertedFragments.push({ text: `${converted} ${toSelect.value}`, original: match });
      }

      lastIndex = offset + match.length;
    });

    convertedFragments.push({ text: text.slice(lastIndex), original: null });

    // Save for undo
    undoStack.push({ range: range.cloneRange(), originalText: text });

    // Replace selection
    range.deleteContents();
    const frag = document.createDocumentFragment();
    convertedFragments.forEach(f => {
      if (f.original) {
        const span = document.createElement("span");
        span.textContent = f.text;
        span.title = f.original;
        frag.appendChild(span);
      } else {
        frag.appendChild(document.createTextNode(f.text));
      }
    });
    range.insertNode(frag);
    window.getSelection().removeAllRanges();
  }

  function undoConversion() {
    if (undoStack.length === 0) return;
    const last = undoStack.pop();
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(last.range);
    last.range.deleteContents();
    last.range.insertNode(document.createTextNode(last.originalText));
    sel.removeAllRanges();
  }

  // Buttons
  convertBtn.addEventListener("click", convertSelection);
  undoBtn.addEventListener("click", undoConversion);

  // Hotkeys
  window.priceConverterKeyListener = e => {
    if (e.altKey && e.key.toLowerCase() === "c") convertSelection();
    if (e.altKey && e.key.toLowerCase() === "z") undoConversion();
  };
  document.addEventListener("keydown", window.priceConverterKeyListener);

})();

//---------------------------------------------------------------------- edit anything ---------------------------------------------------------//

(() => {
    // Get all elements inside the body
    const allElements = document.body.querySelectorAll('*');

    // Initialize original states if not already
    if (!window.__editableState) {
        window.__editableState = new Map(); // store original contentEditable values
    }

    allElements.forEach(element => {
        const textContent = element.textContent.trim();

        // Skip naturally editable elements
        const tag = element.tagName.toLowerCase();
        const isNaturallyEditable = (
            tag === 'input' ||
            tag === 'textarea' ||
            element.isContentEditable
        );

        if (textContent.length > 0 && element.children.length === 0 && !isNaturallyEditable) {
            // Store original contentEditable if not stored
            if (!window.__editableState.has(element)) {
                window.__editableState.set(element, element.contentEditable || "false");
            }

            // Mark element as processed
            if (!element.hasAttribute("editable")) element.setAttribute("editable", true);

            // Toggle editable
            element.contentEditable = !element.contentEditable || element.contentEditable === "false";
        }
    });
})();

//----------------------------------------------------------- png downloader -------------------------------------------------------------------// 

(() => {
    // If already running, disable
    if (window.__imgConvertToggle) {
        document.removeEventListener("mouseover", window.__imgConvertHover, true);
        document.removeEventListener("mouseout", window.__imgConvertOut, true);
        document.removeEventListener("click", window.__imgConvertSelect, true);
        if (window.__imgConvertButton) document.body.removeChild(window.__imgConvertButton);
        delete window.__imgConvertToggle;
        delete window.__imgConvertHover;
        delete window.__imgConvertOut;
        delete window.__imgConvertSelect;
        delete window.__imgConvertButton;
        alert("Image converter disabled");
        return;
    }

    window.__imgConvertToggle = true;

    let selectedEl = null;

    // Create download button
    const btn = document.createElement("button");
    btn.textContent = "Download";
    btn.style.position = "absolute";
    btn.style.zIndex = 999999;
    btn.style.display = "none";
    btn.style.padding = "5px 10px";
    btn.style.background = "#222";
    btn.style.color = "#fff";
    btn.style.border = "1px solid #000";
    btn.style.cursor = "pointer";
    document.body.appendChild(btn);
    window.__imgConvertButton = btn;

    // Hover: outline
    window.__imgConvertHover = function(e) {
        if (e.target.tagName === "IMG" || e.target.tagName === "CANVAS") {
            e.target.style.outline = "3px solid red";
        }
    };

    window.__imgConvertOut = function(e) {
        if (e.target.tagName === "IMG" || e.target.tagName === "CANVAS") {
            e.target.style.outline = "";
        }
    };

    // Click: select element
    window.__imgConvertSelect = function(e) {
        if (e.target.tagName !== "IMG" && e.target.tagName !== "CANVAS") return;

        selectedEl = e.target;
        const rect = selectedEl.getBoundingClientRect();

        btn.style.top = `${rect.bottom + window.scrollY + 5}px`;
        btn.style.left = `${rect.left + window.scrollX}px`;
        btn.style.display = "block";
    };

    document.addEventListener("mouseover", window.__imgConvertHover, true);
    document.addEventListener("mouseout", window.__imgConvertOut, true);
    document.addEventListener("click", window.__imgConvertSelect, true);

    // Download button click
    btn.addEventListener("click", () => {
        if (!selectedEl) return;

        let canvas;
        if (selectedEl.tagName === "IMG") {
            canvas = document.createElement("canvas");
            canvas.width = selectedEl.width;
            canvas.height = selectedEl.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(selectedEl, 0, 0, selectedEl.width, selectedEl.height);
        } else if (selectedEl.tagName === "CANVAS") {
            canvas = selectedEl;
        }

        canvas.toBlob(blob => {
            if (!blob) {
                alert("Conversion failed");
                return;
            }
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "image.png";
            a.click();
            URL.revokeObjectURL(a.href);
        }, "image/png");

        btn.style.display = "none";
        selectedEl.style.outline = "";
        selectedEl = null;
    });

    alert("Image converter enabled\nHover over an image or canvas, click to select, then click 'Download'");
})();

//===========================================================================toggle fullscreen===============================================================================================//

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    // If the document is not in fullscreen mode, request fullscreen for the whole page
    document.documentElement.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    // Otherwise, exit fullscreen mode
    document.exitFullscreen();
  }
}

toggleFullscreen()
