import fs from "fs";
import path from "path";

export interface ProjectData {
  menu: string[];
  subFolders: Record<string, string[]>;
}

export function getProjectData(): ProjectData {
  const projectDir = path.join(process.cwd(), "project");
  const result: ProjectData = {
    menu: [],
    subFolders: {},
  };

  try {
    if (fs.existsSync(projectDir)) {
      const folders = fs
        .readdirSync(projectDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      result.menu = folders;

      for (const folder of folders) {
        const subDir = path.join(projectDir, folder);
        if (fs.existsSync(subDir)) {
          const subFolders = fs
            .readdirSync(subDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
          result.subFolders[folder] = subFolders;
        }
      }
    }
  } catch (error) {
    console.error("Error reading project data:", error);
  }

  return result;
}