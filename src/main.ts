import { Plugin } from "obsidian";

const DEFAULT_GAP = "1rem";

function parseOptions(spec: string): { ratio: string[] | null; gap: string } {
  let ratio: string[] | null = null;
  let gap = DEFAULT_GAP;

  spec.split(/,\s*/).filter(Boolean).forEach((token) => {
    const [key, value] = token.split("=");
    if (key === "r") ratio = value.split(":");
    if (key === "g") gap = value;
  });

  return { ratio, gap };
}

function splitColumns(nodes: Element[]): Element[][] {
  const groups: Element[][] = [[]];

  nodes.forEach((node) => {
    if (node.textContent?.trim() === "+++") groups.push([]);
    else groups[groups.length - 1].push(node);
  });

  return groups;
}

export default class ColumnsCallout extends Plugin {
  onload(): void {
    this.registerMarkdownPostProcessor((element) => {
      element.querySelectorAll('.callout[data-callout="cols"]').forEach((callout) => {
        const title = callout.querySelector(".callout-title-inner")?.textContent ?? "";
        const { ratio, gap } = parseOptions(title);
        const content = callout.querySelector(".callout-content");
        if (!content) return;

        const groups = splitColumns(Array.from(content.children));
        const grid = document.createElement("div");
        grid.className = "cols";
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = (ratio ?? Array(groups.length).fill("1"))
          .map((value) => `${value}fr`)
          .join(" ");
        grid.style.gap = gap;

        groups.forEach((nodes) => {
          const column = document.createElement("div");
          column.className = "col";
          nodes.forEach((node) => column.appendChild(node));
          grid.appendChild(column);
        });

        callout.replaceWith(grid);
      });
    });
  }
}
