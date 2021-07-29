import { onCancel } from "..";
import {
    concatDir,
    moveFile,
    packageToDirectory,
    renameFolder,
    replaceTokensMap,
} from "../fileutil";
import { FileFragment, FragmentOptions, fragments } from "./fragment";
import { Questions } from "./questions";

const prompts = require("prompts");

export class JavaPaperPlugin extends FileFragment {
    constructor() {
        super(
            "JavaPaperPlugin",
            "A Gradle Kotlin DSL project configured for Paper plugin development.",
            "java_paper_plugin"
        );
    }

    async prompt(options: FragmentOptions) {
        const questions = [
            Questions.projectName,
            Questions.projectGroup,
            Questions.projectVersion,
            Questions.projectDescription,
            Questions.projectAuthor,
            Questions.projectWebsite,
            Questions.license,
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
                ["PROJECT_PACKAGE", projectPackage],
            ])
        );

        const packageAsDirectory: string = packageToDirectory(projectPackage);
        const mainClassName: string = response.projectName + ".java";

        renameFolder(
            concatDir(options.directory, "src/main/java"),
            "#PROJECT_PACKAGE#",
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
            "A Gradle Kotlin DSL project configured to be a multi-module library.",
            "java_paper_library"
        );
    }

    async prompt(options: FragmentOptions) {
        const questions = [
            Questions.projectName,
            Questions.projectGroup,
            Questions.projectVersion,
            Questions.projectDescription,
            Questions.projectAuthor,
            {
                type: "text",
                name: "projectGitRepo",
                message: "Project Git Repo (e.g. GitHub)",
                initial: "https://github.com/",
            },
            {
                ...Questions.projectWebsite,
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
            Questions.license,
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
