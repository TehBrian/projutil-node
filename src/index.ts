#!/usr/bin/env node

import { injectCustomLogging as injectCustomLogging } from "./logging";
import { Fragment, fragments, registerFragment } from "./fragment/fragment";
import { License, MitLicense } from "./fragment/licenses";
import { JavaPaperPlugin } from "./fragment/projects";
import { Checkstyle, Editorconfig } from "./fragment/extras";

const chalk = require("chalk");
const program = require("commander");

export function registerDefaultFragments(): void {
    registerFragment(new JavaPaperPlugin());
    registerFragment(new License());
    registerFragment(new MitLicense());
    registerFragment(new Checkstyle());
    registerFragment(new Editorconfig());
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
    .command("trace <fragment...>")
    .description(
        "copy files from one or more fragments and replace/rename as needed"
    )
    .option(
        "-d, --directory <dir>",
        "specify project directory (defaults to current)"
    )
    .action(async function (fragment: string[], options: any): Promise<void> {
        const directory: string =
            options.directory === undefined ? process.cwd() : options.directory;

        // verify that all fragments are there
        var fragmentsToRegister: Fragment[] = [];
        for (const item of fragment) {
            const fragmentObject = fragments.get(item);
            if (fragmentObject === undefined) {
                console.error(chalk.red(`The fragment ${item} doesn't exist.`));
                printAvailableFragments();
                return;
            }
            fragmentsToRegister.push(fragmentObject);
        }

        // prompt each fragment in order
        for (const fragmentObject of fragmentsToRegister) {
            await fragmentObject.prompt({ directory });
            console.log(chalk.green(`Traced fragment ${fragmentObject.name}!`));
        }

        console.log(chalk.blue("All done :)"));
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
