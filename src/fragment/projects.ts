import { onCancel } from "..";
import {
    concatDir,
    renameFile,
    renameFolder,
    replaceTokensMap,
} from "../fileutil";
import { FileFragment, FragmentOptions, fragments } from "./fragment";

const prompts = require("prompts");

export class JavaPaperPlugin extends FileFragment {
    constructor() {
        super(
            "JavaPaperPlugin",
            "A blank Gradle project, using the Kotlin DSL, configured for Paper plugin development.",
            "java_paper_plugin"
        );
    }

    async prompt(options: FragmentOptions) {
        const questions = [
            {
                type: "text",
                name: "projectName",
                message: "What's the project name?",
            },
            {
                type: "text",
                name: "projectGroup",
                message: "What's the project group?",
                format: (val: string) => val.toLowerCase(),
            },
            {
                type: "text",
                name: "projectVersion",
                message: "What's the project version?",
                initial: "0.1.0",
            },
            {
                type: "text",
                name: "projectDescription",
                message: "What's the project description?",
            },
            {
                type: "text",
                name: "projectAuthor",
                message: "Who's the project author?",
            },
            {
                type: "text",
                name: "projectWebsite",
                message: "What's the project website?",
                initial: "https://github.com/",
            },
            {
                type: "toggle",
                name: "license",
                message: "Do you want to add a license?",
                initial: true,
                active: "yes",
                inactive: "no",
            },
        ];

        const response = await prompts(questions, { onCancel });

        const projectPackage: string =
            response.projectGroup + "." + response.projectName.toLowerCase();

        this.copyFiles(options.directory);

        replaceTokensMap(
            options.directory,
            new Map([
                ["PROJECT_NAME", response.projectName],
                ["PROJECT_GROUP", response.projectGroup],
                ["PROJECT_VERSION", response.projectVersion],
                ["PROJECT_DESCRIPTION", response.projectDescription],
                ["PROJECT_AUTHOR", response.projectAuthor],
                ["PROJECT_WEBSITE", response.projectWebsite],
                ["PROJECT_PACKAGE", projectPackage],
            ])
        );

        renameFile(
            concatDir(options.directory, "src/main/java/#PROJECT_PACKAGE#"),
            "#PROJECT_NAME#.java",
            response.projectName + ".java"
        );

        renameFolder(
            options.directory,
            "src/main/java/#PROJECT_PACKAGE#/",
            "src/main/java/" + projectPackage.replaceAll(/\./g, "/")
        );

        await fragments.get("Editorconfig")?.prompt(options);
        await fragments.get("Checkstyle")?.prompt(options);

        if (response.license) {
            await fragments.get("License")?.prompt(options);
        }

        //this.moveFile(options.directory, "src/main/java")
    }
}
