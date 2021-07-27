import { onCancel } from "..";
import {
    concatDir,
    moveFile,
    packageToDirectory,
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

        const packageAsDirectory: string = packageToDirectory(projectPackage);

        const mainClassName: string = response.projectName + ".java";

        this.copyFiles(options.directory);

        replaceTokensMap(
            options.directory,
            new Map([
                ["ROOT_PROJECT_NAME", response.projectName.toLowerCase()],
                ["PROJECT_NAME", response.projectName],
                ["PROJECT_GROUP", response.projectGroup],
                ["PROJECT_VERSION", response.projectVersion],
                ["PROJECT_DESCRIPTION", response.projectDescription],
                ["PROJECT_AUTHOR", response.projectAuthor],
                ["PROJECT_WEBSITE", response.projectWebsite],
                ["PROJECT_PACKAGE", projectPackage],
            ])
        );

        renameFolder(
            concatDir(options.directory, "src/main/java"),
            "#PROJECT_PACKAGE#/",
            packageAsDirectory
        );

        moveFile(
            concatDir(options.directory, "src/main/java", packageAsDirectory),
            "#PROJECT_NAME#.java",
            mainClassName
        );

        await fragments.get("Editorconfig")?.prompt(options);
        await fragments.get("Checkstyle")?.prompt(options);
        await fragments.get("JavaGitignore")?.prompt(options);

        if (response.license) {
            await fragments.get("License")?.prompt(options);
        }
    }
}

export class JavaPaperLibrary extends FileFragment {
    constructor() {
        super(
            "JavaPaperLibrary",
            "A blank Gradle project, using the Kotlin DSL, configured to be a multi-module library.",
            "java_paper_library"
        );
    }

    async prompt(options: FragmentOptions) {
        const questions = [
            {
                type: "text",
                name: "projectName",
                message: "Project Name",
            },
            {
                type: "text",
                name: "projectGroup",
                message: "Project Group",
                format: (val: string) => val.toLowerCase(),
            },
            {
                type: "text",
                name: "projectVersion",
                message: "Project Version",
                initial: "0.1.0",
            },
            {
                type: "text",
                name: "projectDescription",
                message: "Project Description",
            },
            {
                type: "text",
                name: "projectAuthor",
                message: "Project Author",
            },
            {
                type: "text",
                name: "projectGitRepo",
                message: "Project Git Repo (e.g. GitHub)",
                initial: "https://github.com/",
            },
            {
                type: "text",
                name: "projectWebsite",
                message: "Project Website",
                initial: (prev: string) => prev,
            },
            {
                type: "text",
                name: "developerName",
                message: "Developer Name",
                initial: (prev: string, values: any): string =>
                    values.projectAuthor,
            },
            {
                type: "text",
                name: "developerUrl",
                message: "Developer Url",
                initial: "https://",
            },
            {
                type: "text",
                name: "developerEmail",
                message: "Developer Email",
            },
            {
                type: "toggle",
                name: "license",
                message: "License?",
                initial: true,
                active: "yes",
                inactive: "no",
            },
        ];

        const response = await prompts(questions, { onCancel });

        this.copyFiles(options.directory);

        const rootProjectName: string = response.projectName.toLowerCase();
        const projectPackage: string =
            response.projectGroup + "." + rootProjectName;

        replaceTokensMap(
            options.directory,
            new Map([
                ["ROOT_PROJECT_NAME", rootProjectName],
                ["PROJECT_NAME", response.projectName],
                ["PROJECT_GROUP", response.projectGroup],
                ["PROJECT_VERSION", response.projectVersion],
                ["PROJECT_DESCRIPTION", response.projectDescription],
                ["PROJECT_AUTHOR", response.projectAuthor],
                ["PROJECT_WEBSITE", response.projectWebsite],
                ["PROJECT_GIT_REPO", response.projectGitRepo],
                ["PROJECT_PACKAGE", projectPackage],
                ["DEVELOPER_NAME", response.developerName],
                ["DEVELOPER_URL", response.developerUrl],
                ["DEVELOPER_EMAIL", response.developerEmail],
            ])
        );

        const packageAsDirectory: string = packageToDirectory(projectPackage);

        renameFolder(
            concatDir(options.directory, "core/src/main/java"),
            "#PROJECT_PACKAGE#",
            packageAsDirectory
        );

        renameFolder(
            concatDir(options.directory, "paper/src/main/java"),
            "#PROJECT_PACKAGE#",
            packageAsDirectory
        );

        moveFile(
            concatDir(options.directory, "buildSrc/src/main/kotlin"),
            "#ROOT_PROJECT_NAME#.java-conventions.gradle.kts",
            rootProjectName + ".java-conventions.gradle.kts"
        );

        await fragments.get("Editorconfig")?.prompt(options);
        await fragments.get("Checkstyle")?.prompt(options);
        await fragments.get("JavaGitignore")?.prompt(options);

        if (response.license) {
            await fragments.get("License")?.prompt(options);
        }
    }
}
