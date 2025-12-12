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
