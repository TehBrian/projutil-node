#!/usr/bin/env node

import { injectCustomLogging as injectCustomLogging } from "./logging";
import { fragments, registerFragment } from "./fragment/fragment";
import { Checkstyle, Editorconfig, MitLicense } from "./fragment/licenses";
import { JavaPaperPlugin } from "./fragment/projects";

const chalk = require("chalk");
const program = require("commander");

export function registerDefaultFragments(): void {
    registerFragment(new MitLicense());
    registerFragment(new Checkstyle());
    registerFragment(new Editorconfig());
    registerFragment(new JavaPaperPlugin());
}

registerDefaultFragments();
injectCustomLogging();

export const onCancel = () => {
    console.log(
        chalk.red("Looks like our time is getting cut short, my friend.")
    );

    process.exit(0);
};

process.on("SIGINT", onCancel);

process.on("exit", function () {
    console.debug(chalk.magenta("Until next time! <3"));
});

program.version("1.0.0");

program
    .command("trace <fragment>")
    .description("copy files from a fragment and replace/rename as needed")
    .option("-o, --overwrite", "overwrite (will delete!) all old files")
    .option(
        "-d, --directory <dir>",
        "specify project directory (defaults to current)"
    )
    .action(function (fragment: string, options: any) {
        const overwrite: boolean = options.overwrite;
        const directory: string =
            options.directory === undefined ? process.cwd() : options.directory;

        const theFragment = fragments.get(fragment);
        if (theFragment === undefined) {
            console.error(chalk.red("That fragment doesn't exist."));
            printAvailableFragments();
            return;
        }

        theFragment.prompt({ overwrite, directory });
    });

program
    .command("fragments")
    .description("list the available fragments")
    .action(function () {
        printAvailableFragments();
    });

function printAvailableFragments() {
    console.log("The available fragments are:");
    for (const fragment of fragments.values()) {
        console.log(
            chalk.blue(fragment.name) +
                " - " +
                chalk.green(fragment.description)
        );
    }
}

program.parse(process.argv);
