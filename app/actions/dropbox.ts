"use server";

import { Dropbox } from "dropbox";

const accessToken = process.env.DROPBOX_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("DROPBOX_ACCESS_TOKEN is missing in environment variables");
}

const dbx = new Dropbox({
  accessToken,
  fetch,
});

export async function uploadToDropbox(file: File, path: string) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const response = await dbx.filesUpload({
      path,
      contents: buffer,
      mode: { ".tag": "overwrite" },
    });

    return {
      success: true,
      path: response.result.path_display,
    };
  } catch (error) {
    console.error("Dropbox upload error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function getDropboxFiles(folder: string = "") {
  try {
    const response = await dbx.filesListFolder({
      path: folder || "",
    });

    const files = response.result.entries.map((entry: any) => ({
      name: entry.name,
      path: entry.path_display,
      type: entry[".tag"],
      size: entry[".tag"] === "file" ? entry.size : null,
      modified: entry[".tag"] === "file" ? entry.server_modified : null,
    }));

    return {
      success: true,
      files,
    };
  } catch (error) {
    console.error("Dropbox list error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list files",
    };
  }
}

export async function downloadFromDropbox(path: string) {
  try {
    const response = await dbx.filesDownload({ path });

    const blob = (response.result as any).fileBlob;

    return {
      success: true,
      blob,
      name: response.result.name,
    };
  } catch (error) {
    console.error("Dropbox download error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Download failed",
    };
  }
}