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
        (node.innerText && node.innerText.match(/ad|googletag|track/i))
      ) {
        node.remove();
        return;
      }
    }

    // Remove iframes
    if (node.tagName === "IFRAME") {
      const src = (node.src || "").toLowerCase();
      if (src.includes("ads") || src.includes("doubleclick") || src.includes("adservice")) {
        node.remove();
        return;
      }
    }

    // Remove elements with ad/sponsor IDs or classes
    if (
      (node.id && node.id.toLowerCase().includes("ad")) ||
      (node.className && node.className.toLowerCase().match(/ad|sponsor/))
    ) {
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
