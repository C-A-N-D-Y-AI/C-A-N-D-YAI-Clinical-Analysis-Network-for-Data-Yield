export type ParsedPdfPage = {
  pageNumber: number;
  text: string;
};

export type ParsedLabResult = {
  label: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  pageNumber: number;
  sourceLine: string;
};

export type ParsedPdfDocument = {
  fileName: string;
  pageCount: number;
  pages: ParsedPdfPage[];
  labResults: ParsedLabResult[];
  fullText: string;
};

type TextItem = {
  str?: string;
  transform?: number[];
};

const normalizeLine = (line: string) => line.replace(/\s+/g, " ").trim();

const resultLinePattern =
  /^(.{2,80}?)\s+([-+]?\d+(?:[.,]\d+)?)\s*([a-zA-Z%/µμ][a-zA-Z0-9%/µμ.^-]*)?(?:\s+(?:ref(?:erencia)?\.?|rango|normal|valor(?:es)?\s+normal(?:es)?|range)?\s*:?\s*([<>]?\s*[-+]?\d+(?:[.,]\d+)?\s*(?:[-–—a]\s*[<>]?\s*[-+]?\d+(?:[.,]\d+)?)?.*))?$/i;

const parseLabResults = (pages: ParsedPdfPage[]) =>
  pages.flatMap((page) => {
    const results: ParsedLabResult[] = [];

    page.text
      .split("\n")
      .map(normalizeLine)
      .filter((line) => line.length >= 5)
      .forEach((line) => {
        const match = line.match(resultLinePattern);
        if (!match) return;

        const [, rawLabel, rawValue, rawUnit, rawReferenceRange] = match;
        const label = rawLabel.replace(/[:.]+$/, "").trim();

        if (!label || /^\d/.test(label)) return;

        results.push({
          label,
          value: rawValue.replace(",", "."),
          unit: rawUnit,
          referenceRange: rawReferenceRange?.trim(),
          pageNumber: page.pageNumber,
          sourceLine: line,
        });
      });

    return results;
  });

export async function parsePdfToJson(file: File): Promise<ParsedPdfDocument> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages: ParsedPdfPage[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const lines = new Map<number, string[]>();

    for (const item of textContent.items as TextItem[]) {
      const text = normalizeLine(item.str ?? "");
      if (!text) continue;

      const y = Math.round(item.transform?.[5] ?? 0);
      lines.set(y, [...(lines.get(y) ?? []), text]);
    }

    const text = [...lines.entries()]
      .sort(([a], [b]) => b - a)
      .map(([, parts]) => normalizeLine(parts.join(" ")))
      .join("\n")
      .trim();

    pages.push({ pageNumber, text });
  }

  return {
    fileName: file.name,
    pageCount: pdf.numPages,
    pages,
    labResults: parseLabResults(pages),
    fullText: pages.map((page) => `Page ${page.pageNumber}\n${page.text}`).join("\n\n"),
  };
}
