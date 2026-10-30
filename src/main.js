/**
 * Multi-column layout using the `[!cols]` callout.
 * Columns are separated by `+++`.
 *
 * r — column ratio (default: equal-width)
 * g — column gap   (default: 1rem)
 *
 * > [!cols]
 * > [!cols] r=2:1, g=2rem
 */

const { Plugin } = require("obsidian");

const GAP = "1rem";

function parse(spec) {
  let ratio = null;
  let gap = GAP;
  spec
    .split(/,\s*/)
    .filter(Boolean)
    .forEach((token) => {
      const [k, v] = token.split("=");
      if (k === "r") ratio = v.split(":");
      if (k === "g") gap = v;
    });
  return { ratio, gap };
}

function split(nodes) {
  const groups = [[]];
  nodes.forEach((n) => {
    n.textContent.trim() === "+++" ? groups.push([]) : groups.at(-1).push(n);
  });
  return groups;
}

module.exports = class ColumnsCallout extends Plugin {
  onload() {
    this.registerMarkdownPostProcessor((el) => {
      el.querySelectorAll('.callout[data-callout="cols"]').forEach((callout) => {
        const { ratio, gap } = parse(callout.querySelector(".callout-title-inner")?.textContent || "");
        const content = callout.querySelector(".callout-content");
        if (!content) return;

        const groups = split([...content.children]);
        const grid = document.createElement("div");
        grid.className = "cols";
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = (ratio || Array(groups.length).fill("1")).map((r) => r + "fr").join(" ");
        grid.style.gap = gap;

        groups.forEach((nodes) => {
          const col = document.createElement("div");
          col.className = "col";
          nodes.forEach((n) => col.appendChild(n));
          grid.appendChild(col);
        });

        callout.replaceWith(grid);
      });
    });
  }
};
