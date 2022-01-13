#!/usr/bin/env node

import { injectCustomLogging as injectCustomLogging } from "./logging";
import {
    Fragment,
    registeredFragments,
    registerFragment,
} from "./fragment/fragment";
import { Licenses, MitLicense } from "./fragment/licenses";
import {
    JavaPaperLibrary,
    JavaPaperPlugin,
} from "./fragment/projects";
import { Checkstyle, Editorconfig, JavaGitignore } from "./fragment/extras";
import chalk from "chalk";
import { Command } from "commander";

export function registerDefaultFragments(): void {
    registerFragment(new JavaPaperPlugin());
    registerFragment(new JavaPaperLibrary());
    registerFragment(new Licenses());
    registerFragment(new MitLicense());
    registerFragment(new JavaGitignore());
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

const program = new Command();
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
        var fragmentsToTrace: Fragment[] = [];
        for (const item of fragment) {
            const lowercaseItem = item.toLowerCase();
            const fragmentObject = registeredFragments.get(lowercaseItem);
            if (fragmentObject === undefined) {
                console.error(
                    chalk.red(`The fragment ${lowercaseItem} doesn't exist.`)
                );
                printAvailableFragments();
                return;
            }
            fragmentsToTrace.push(fragmentObject);
        }

        // prompt each fragment in order
        for (const fragmentObject of fragmentsToTrace) {
            await fragmentObject.traceWithPrompt({ directory });
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
    for (const fragment of registeredFragments.values()) {
        console.log(
            chalk.blue(fragment.name) +
                " - " +
                chalk.green(fragment.description)
        );
    }
}

program.parse(process.argv);
