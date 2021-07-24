import { concatDir } from "./fileutil";

export const resourcesFolder: string = concatDir(__dirname, "/../resources");

export const templatesFolder: string = concatDir(resourcesFolder, "/templates");

export const fragmentsFolder: string = concatDir(resourcesFolder, "/fragments");
