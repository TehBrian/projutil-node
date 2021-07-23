#!/usr/bin/env node

const chalk = require("chalk");
const fs = require("fs").promises;

const program = require("commander");

program.version("1.0.0");

program
    .command("generate <template>")
    .description("generate project from a template")
    .option("-o, --overwrite", "overwrite (will delete!) all old files")
    .option("-d, --directory <dir>", "specify project directory (defaults to current)")
    .action(function (template: string, options: any) {
        const overwrite: boolean = options.overwrite;
        const directory: string = options.directory;

        console.log(chalk.magenta("The implementation of this program is left as an exercise to the reader."))
    });

program
    .command("update <fragment>")
    .description("updates fragments in a project")
    .option("-d, --directory <dir>", "specify project directory (defaults to current)")
    .action(function (fragment: string, options: any) {
        const directory: string = options.directory;

        console.log(chalk.magenta("The implementation of this program is left as an exercise to the reader."))
    });

program.parse(process.argv);
