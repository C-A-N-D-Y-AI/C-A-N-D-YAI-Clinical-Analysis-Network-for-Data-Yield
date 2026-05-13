import type { DoclingDocument } from "./types.ts";
import { withTimeout } from "./http.ts";

const extractDoclingDocument = (data: Record<string, unknown>, fileName?: string): DoclingDocument => {
  const documents = data.documents as Array<Record<string, unknown>> | undefined;
  const document =
    (data.document as Record<string, unknown> | undefined) ??
    (documents?.[0]?.document as Record<string, unknown> | undefined) ??
    documents?.[0] ??
    data;

  return {
    source: "docling-serve",
    fileName: (document.filename as string | undefined) ?? fileName,
    status: data.status as string | undefined,
    textContent: document.text_content as string | undefined,
    markdownContent: document.md_content as string | undefined,
    jsonContent: document.json_content,
    raw: data,
  };
};

export const convertPdfWithDocling = async ({
  baseUrl,
  fileBase64,
  fileName,
  timeoutMs,
  forceOcr,
}: {
  baseUrl: string;
  fileBase64: string;
  fileName?: string;
  timeoutMs: number;
  forceOcr: boolean;
}) => {
  const options = {
    from_formats: ["pdf"],
    to_formats: ["json", "text", "md"],
    do_ocr: true,
    force_ocr: forceOcr,
    do_table_structure: true,
    table_mode: "accurate",
    image_export_mode: "placeholder",
  };
  const primaryBody = {
    sources: [{ kind: "file", base64_string: fileBase64, filename: fileName ?? "exam.pdf" }],
    options,
  };
  const legacyBody = {
    file_sources: [{ base64_string: fileBase64, filename: fileName ?? "exam.pdf" }],
    options,
  };
  const url = `${baseUrl.replace(/\/$/, "")}/v1/convert/source`;
  const post = (body: unknown) =>
    withTimeout(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify(body),
      },
      timeoutMs,
    );

  let response = await post(primaryBody);
  if (response.status === 400 || response.status === 422) response = await post(legacyBody);
  if (!response.ok) throw new Error(`Docling Serve returned ${response.status}: ${await response.text()}`);

  const data = (await response.json()) as Record<string, unknown>;
  return extractDoclingDocument(data, fileName);
};
