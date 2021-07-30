import { fragmentsFolder } from "../files";
import { concatDir } from "../fileutil";
const fs = require("fs-extra");

/**
 * A global pool of fragments that projutil uses internally.
 * This allows external programs to add custom fragments and have
 * them be dynamically registered at runtime.
 */
export const registeredFragments: Map<string, Fragment> = new Map();

/**
 * Registers a fragment to the global pool of fragments.
 * @see registerFragment
 * @param fragment the fragment to register
 */
export function registerFragment(fragment: Fragment): void {
    registeredFragments.set(fragment.name, fragment);
}

/**
 * Represents a template or a file generator of sorts.
 */
export abstract class Fragment {
    name: string;
    description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    /**
     * Prompts the user for the data required to use this fragment's trace method.
     * Returns a promise containing the received data.
     *
     * This method should be overriden.
     * @see trace
     * @param options the fragment options
     */
    async prompt(options: FragmentOptions): Promise<{}> {
        return {};
    }

    /**
     * Copies and replaces files as needed to "generate" this fragment.
     * @param options the fragment options
     * @param data the data to use
     */
    abstract trace(options: FragmentOptions, data: {}): Promise<void>;

    /**
     * Calls this fragment's trace method using the data provided by this
     * fragment's prompt method.
     * @param options the fragment options
     */
    async traceWithPrompt(options: FragmentOptions): Promise<void> {
        const data = await this.prompt(options);
        await this.trace(options, data);
    }
}

/**
 * A fragment that generates files sourced from within the file system.
 */
export abstract class FileFragment extends Fragment {
    file: string;

    constructor(name: string, description: string, file: string) {
        super(name, description);
        this.file = file;
    }

    /**
     * Gets the folder path containing the fragment's source files.
     * @returns the folder
     */
    getFolder(): string {
        return concatDir(fragmentsFolder, this.file);
    }

    /**
     * Copies the fragment's source files to the destination.
     * @see copyFiles
     * @param destination the destination
     */
    copyFiles(destination: string): void {
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
