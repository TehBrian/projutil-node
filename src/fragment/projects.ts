import { onCancel } from "..";
import { renameFolder, replaceTokensMap } from "../fileutil";
import { Fragment, FragmentOptions, fragments } from "./fragment";

const prompts = require("prompts");

export class JavaPaperPlugin extends Fragment {
    constructor() {
        super(
            "JavaPaperPlugin",
            "java_paper_plugin",
            "A blank Gradle project, using the Kotlin DSL, configured for Paper plugin development."
        );
    }

    prompt(options: FragmentOptions) {
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
            {
                type: (prev: boolean) => (prev ? "select" : null),
                name: "licenseType",
                message: "What license would you like to use?",
                choices: [{ title: "MIT" }],
            },
        ];

        (async () => {
            const response = await prompts(questions, { onCancel });

            const projectPackage: string =
                response.projectGroup +
                "." +
                response.projectName.toLowerCase();

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

            fragments.get("Editorconfig")?.prompt(options);
            fragments.get("Checkstyle")?.prompt(options);

            /*
            fs.renameSync(
                options.directory + "/src/main/java/#PROJECT_PACKAGE#/",
                options.directory +
                    "/src/main/java/" +
                    projectPackage.replaceAll(/\./g, "/")
            );
            fs.renameSync(
                options.directory +
                    "/src/main/java/" +
                    projectPackage +
                    "/#PROJECT_NAME#",
                options.directory +
                    "/src/main/java/" +
                    projectPackage +
                    "/" +
                    response.projectName
            );
            */

            renameFolder(
                options.directory,
                "src/main/java/#PROJECT_PACKAGE#/",
                "src/main/java/" + projectPackage.replaceAll(/\./g, "/")
            );

            //this.moveFile(options.directory, "src/main/java")

            if (response.license) {
                fragments.get("MitLicense")?.prompt(options);
            }
        })();
    }
}
