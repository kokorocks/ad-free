// used https://caiorss.github.io/bookmarklet-maker/ to make code into a bookmarklet, you can copy and paste this code into the console and that will work too

(function() {
  // Remove <script> tags that look like ads
  document.querySelectorAll("script").forEach(s => {
    const src = (s.src || "").toLowerCase();
    if (
      src.includes("ads") ||
      src.includes("doubleclick") ||
      src.includes("adservice") ||
      src.includes("googletagservices") ||
      src.includes("tracking") ||
      s.innerText.match(/ad|googletag|track/i)
    ) {
      s.remove();
    }
  });

  // Remove iframes (often used for ads)
  document.querySelectorAll("iframe").forEach(f => {
    const src = (f.src || "").toLowerCase();
    if (src.includes("ads") || src.includes("doubleclick") || src.includes("adservice")) {
      f.remove();
    }
  });

  // Remove elements with common ad-related IDs or classes
  document.querySelectorAll("[id*='ad'], [class*='ad'], [class*='sponsor'], [id*='sponsor']").forEach(el => {
    el.remove();
  });

  // Remove comment nodes (<!-- like this -->)
  function removeComments(node) {
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      let child = node.childNodes[i];
      if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
      } else {
        removeComments(child);
      }
    }
  }
  removeComments(document);

  console.log("🚫 Ads, iframes, and comments removed!");
})();
