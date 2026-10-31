import { Plugin } from "obsidian";

function parseOptions(spec: string): { ratios: string[] | null; gap: string | null } {
  let ratios: string[] | null = null;
  let gap: string | null = null;

  for (const option of spec.split(/,\s*/).filter(Boolean)) {
    const [key, value] = option.split("=");
    if (key === "r") ratios = value.split(":");
    if (key === "g") gap = value;
  }

  return { ratios, gap };
}

function splitColumns(nodes: Element[]): Element[][] {
  const columns: Element[][] = [[]];
  nodes.forEach((node) =>
    node.textContent.trim() === "+++" ? columns.push([]) : columns[columns.length - 1].push(node),
  );
  return columns;
}

export default class ColumnsCallout extends Plugin {
  onload(): void {
    this.registerMarkdownPostProcessor((element) => {
      element.querySelectorAll('.callout[data-callout="cols"]').forEach((callout) => {
        const title = callout.querySelector(".callout-title-inner")?.textContent ?? "";
        const { ratios, gap } = parseOptions(title);
        const content = callout.querySelector(".callout-content");
        if (!content) return;

        const columns = splitColumns(Array.from(content.children));
        const grid = createDiv();
        grid.className = "columns-callout-grid";
        grid.style.setProperty(
          "--columns-callout-template",
          (ratios ?? Array(columns.length).fill("1")).map((r) => `${r}fr`).join(" "),
        );
        if (gap !== null) grid.style.setProperty("--columns-callout-gap", gap);

        columns.forEach((nodes) => {
          const col = createDiv();
          col.className = "columns-callout-col";
          col.append(...nodes);
          grid.appendChild(col);
        });

        callout.replaceWith(grid);
      });
    });
  }
}
