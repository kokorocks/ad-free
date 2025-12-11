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

(function() {
    function handleClick(event) {
        event.stopPropagation();
        const el = event.target;

        // Ask for confirmation
        if (!confirm("Do you really want to delete this element?")) {
            return; // If user cancels, do nothing
        }

        // Get current height and width
        const height = el.offsetHeight;
        const width = el.offsetWidth;

        // Set explicit sizes for smooth animation
        el.style.height = height + "px";
        el.style.width = width + "px";
        el.style.transition = "opacity 0.5s ease, height 0.5s ease, width 0.5s ease, margin 0.5s ease, padding 0.5s ease";

        // Trigger fade and collapse
        el.style.opacity = "0";
        el.style.height = "0px";
        el.style.width = "0px";
        el.style.margin = "0";
        el.style.padding = "0";

        // Remove after animation
        setTimeout(() => {
            el.remove();
        }, 500);

        // Stop listening after one deletion
        document.removeEventListener("click", handleClick, true);
    }

    document.addEventListener("click", handleClick, true);
})();

