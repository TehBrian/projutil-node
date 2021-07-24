const fs = require("fs-extra");
const chalk = require("chalk");

export abstract class Resource {
    name: string;
    file: string;
    description: string;

    constructor(name: string, file: string, description: string) {
        this.name = name;
        this.file = file;
        this.description = description;
    }

    abstract getFolder(): string;

    copyFiles(destination: string) {
        try {
            fs.copySync(this.getFolder(), destination);
            console.debug(`Copied files from ${this.getFolder()} to ${destination}`);
        } catch (err) {
            console.error(err);
        }
    }

    abstract prompt(options: ResourceOptions): void;
}

export type ResourceOptions = {
    directory: string;
};
