#!/usr/bin/env node

import { injectCustomLogging as injectCustomLogging } from "./logging";
import { fragments, registerDefaultFragments } from "./resource/fragments";
import { templates, registerDefaultTemplates } from "./resource/templates";

const chalk = require("chalk");
const program = require("commander");

registerDefaultTemplates();
registerDefaultFragments();

injectCustomLogging();

process.on("SIGINT", function () {
    console.log(
        chalk.red("Looks like our time is getting cut short, my friend.")
    );

    process.exit();
});

process.on("exit", function () {
    console.debug(chalk.magenta("Until next time! <3"));
});

program.version("1.0.0");

program
    .command("generate <template>")
    .description("generate project from a template")
    .option("-o, --overwrite", "overwrite (will delete!) all old files")
    .option(
        "-d, --directory <dir>",
        "specify project directory (defaults to current)"
    )
    .action(function (template: string, options: any) {
        const overwrite: boolean = options.overwrite;
        const directory: string =
            options.directory === undefined ? process.cwd() : options.directory;

        const theTemplate = templates.get(template);
        if (theTemplate === undefined) {
            console.error(chalk.red("That template doesn't exist."));
            printAvailableTemplates();
            return;
        }

        theTemplate.prompt({ overwrite, directory });
    });

program
    .command("update <fragment>")
    .description("updates fragments in a project")
    .option(
        "-d, --directory <dir>",
        "specify project directory (defaults to current)"
    )
    .action(function (fragment: string, options: any) {
        const directory: string = options.directory;

        console.log(
            chalk.magenta(
                "The implementation of this program is left as an exercise to the reader."
            )
        );
    });

program
    .command("templates")
    .description("lists the available templates")
    .action(function () {
        printAvailableTemplates();
    });

program
    .command("fragments")
    .description("lists the available fragments")
    .action(function () {
        printAvailableFragments();
    });

function printAvailableTemplates() {
    console.log("The available templates are:");
    for (const template of templates.values()) {
        console.log(
            chalk.blue(template.name) +
                " - " +
                chalk.green(template.description)
        );
    }
}

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
