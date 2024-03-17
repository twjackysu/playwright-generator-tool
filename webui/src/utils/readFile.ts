import fs from "fs";

export function readFileIntoString(filePath: string): string {
  try {
    // Read the file synchronously (blocking operation)
    const fileContent: string = fs.readFileSync(filePath, "utf-8");
    return fileContent;
  } catch (error) {
    console.error(`Error reading file: ${(error as Error).message}`);
    return ""; // Return an empty string if there's an error
  }
}
