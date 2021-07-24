const replace = require("replace-in-file");
const fs = require("fs-extra");
const chalk = require("chalk");
const util = require('util');

export abstract class Resource {
    name: string;
    file: string;
    description: string;

    constructor(name: string, file: string, description: string) {
        this.name = name;
        this.file = file;
        this.description = description;
    }

    replaceTokens(directory: string, from: string, to: string) {
        try {
            replace.sync({
                files: directory + "/**/*",
                from: new RegExp("@" + from + "@", "g"),
                to: to,
            });
        } catch (error) {
            console.error("Error occurred:", error);
        }
    }

    replaceTokensMap(directory: string, replacements: Map<string, string>) {
        for (const [from, to] of replacements) {
            this.replaceTokens(directory, from, to);
        }
        console.debug(
            chalk.green("Successfully replaced tokens: " + util.inspect(replacements, {showHidden: false, depth: null}) + "!")
        );
    }

    abstract getFolder(): string;

    copyFiles(destination: string) {
        try {
            fs.copySync(this.getFolder(), destination);
            console.debug(chalk.green("Successfully generated files!"));
        } catch (err) {
            console.error(err);
        }
    }

    abstract prompt(options: ResourceOptions): void;
}

export type ResourceOptions = {
    directory: string;
};
