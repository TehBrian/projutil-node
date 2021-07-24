import { fragmentsFolder } from "../files";
import { concatDir, replaceTokensMap } from "../fileutil";
import { Resource, ResourceOptions } from "./resources";

const prompts = require("prompts");

export const fragments: Map<string, Fragment> = new Map();

export function registerFragment(fragment: Fragment): void {
    fragments.set(fragment.name, fragment);
}

export function registerDefaultFragments(): void {
    registerFragment(new MitLicense());
    registerFragment(new Checkstyle());
    registerFragment(new Editorconfig());
}

export abstract class Fragment extends Resource {
    constructor(name: string, file: string, description: string) {
        super(name, file, description);
    }

    abstract prompt(options: ResourceOptions): void;

    getFolder() {
        return concatDir(fragmentsFolder, this.file);
    }
}

export class MitLicense extends Fragment {
    constructor() {
        super("MitLicense", "mit_license", "The MIT license.");
    }

    prompt(options: ResourceOptions) {
        const questions = [
            {
                type: "text",
                name: "licenseHolder",
                message: "What should the name on the license be?",
            },
        ];

        (async () => {
            const response = await prompts(questions);

            this.copyFiles(options.directory);

            replaceTokensMap(
                options.directory,
                new Map([
                    ["LICENSE_YEAR", new Date().getFullYear().toString()],
                    ["LICENSE_HOLDER", response.licenseHolder],
                ])
            );
        })();
    }
}

export class Checkstyle extends Fragment {
    constructor() {
        super("Checkstyle", "checkstyle", "A nice checkstyle.");
    }

    prompt(options: ResourceOptions) {
        (async () => {
            this.copyFiles(options.directory);
        })();
    }
}

export class Editorconfig extends Fragment {
    constructor() {
        super("Editorconfig", "editorconfig", "A nice editorconfig.");
    }

    prompt(options: ResourceOptions) {
        (async () => {
            this.copyFiles(options.directory);
        })();
    }
}
