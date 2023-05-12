import * as path from "path";
import * as fs from "fs";

export default function getFileContentFromPath(filePath: string) {
  // throw error if file extension is not ".md"
  if (path.extname(filePath) !== ".md") {
    throw new Error(`Invalid file type: ${filePath}`);
  }

  // import file content
  const fileContent = fs.readFileSync(
    path.join(__dirname, path.join("./../../src", filePath)),
    {
      encoding: "utf-8",
    }
  );

  return fileContent;
}
