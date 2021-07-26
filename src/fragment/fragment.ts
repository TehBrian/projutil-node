import { fragmentsFolder } from "../files";
import { concatDir } from "../fileutil";

const fs = require("fs-extra");

export const fragments: Map<string, Fragment> = new Map();

export function registerFragment(fragment: Fragment): void {
    fragments.set(fragment.name, fragment);
}

export abstract class Fragment {
    name: string;
    file: string;
    description: string;

    constructor(name: string, file: string, description: string) {
        this.name = name;
        this.file = file;
        this.description = description;
    }

    getFolder() {
        return concatDir(fragmentsFolder, this.file);
    }

    copyFiles(destination: string) {
        try {
            fs.copySync(this.getFolder(), destination);
            console.debug(
                `Copied files from ${this.getFolder()} to ${destination}`
            );
        } catch (err) {
            console.error(err);
        }
    }

    abstract prompt(options: FragmentOptions): void;
}

export type FragmentOptions = {
    directory: string;
    overwrite: boolean;
};
