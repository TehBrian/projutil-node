import { fragmentsFolder } from "../files";
import { concatDir } from "../fileutil";

const fs = require("fs-extra");

export const fragments: Map<string, Fragment> = new Map();

export function registerFragment(fragment: Fragment): void {
    fragments.set(fragment.name, fragment);
}

export abstract class Fragment {
    name: string;
    description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    abstract prompt(options: FragmentOptions): void;
}

export abstract class FileFragment extends Fragment {
    file: string;

    constructor(name: string, description: string, file: string) {
        super(name, description);
        this.file = file;
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
}

export type FragmentOptions = {
    directory: string;
};
