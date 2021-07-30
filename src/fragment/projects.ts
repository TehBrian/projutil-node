import { onCancel } from "..";
import {
    concatDir,
    moveFile,
    packageToDirectory,
    renameFolder,
    replaceTokensMap,
} from "../fileutil";
import { FileFragment, FragmentOptions, registeredFragments } from "./fragment";
import { Questions } from "./questions";

const prompts = require("prompts");

export class JavaPaperPlugin extends FileFragment {
    constructor() {
        super(
            "java_paper_plugin",
            "A Gradle Kotlin DSL project configured for Paper plugin development.",
            "java_paper_plugin"
        );
    }

    async prompt(options: FragmentOptions): Promise<{
        projectName: string;
        projectGroup: string;
        projectVersion: string;
        projectDescription: string;
        projectAuthor: string;
        projectWebsite: string;
        license: boolean;
    }> {
        const questions = [
            Questions.projectName,
            Questions.projectGroup,
            Questions.projectVersion,
            Questions.projectDescription,
            Questions.projectAuthor,
            Questions.projectWebsite,
            Questions.license,
        ];

        return await prompts(questions, { onCancel });
    }

    async trace(
        options: FragmentOptions,
        data: {
            projectName: string;
            projectGroup: string;
            projectVersion: string;
            projectDescription: string;
            projectAuthor: string;
            projectWebsite: string;
            license: boolean;
        }
    ): Promise<void> {
        this.copyFiles(options.directory);

        const rootProjectName: string = data.projectName.toLowerCase();
        const projectPackage: string =
            data.projectGroup + "." + rootProjectName;

        replaceTokensMap(
            options.directory,
            new Map([
                ["ROOT_PROJECT_NAME", rootProjectName],
                ["PROJECT_NAME", data.projectName],
                ["PROJECT_GROUP", data.projectGroup],
                ["PROJECT_VERSION", data.projectVersion],
                ["PROJECT_DESCRIPTION", data.projectDescription],
                ["PROJECT_AUTHOR", data.projectAuthor],
                ["PROJECT_WEBSITE", data.projectWebsite],
                ["PROJECT_PACKAGE", projectPackage],
            ])
        );

        const packageAsDirectory: string = packageToDirectory(projectPackage);
        const mainClassName: string = data.projectName + ".java";

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

        await registeredFragments.get("Editorconfig")?.traceWithPrompt(options);
        await registeredFragments.get("Checkstyle")?.traceWithPrompt(options);
        await registeredFragments
            .get("JavaGitignore")
            ?.traceWithPrompt(options);

        if (data.license) {
            await registeredFragments.get("License")?.traceWithPrompt(options);
        }
    }
}

export class JavaPaperLibrary extends FileFragment {
    constructor() {
        super(
            "java_paper_library",
            "A Gradle Kotlin DSL project configured to be a multi-module library.",
            "java_paper_library"
        );
    }

    async prompt(options: FragmentOptions): Promise<{
        projectName: string;
        projectGroup: string;
        projectVersion: string;
        projectDescription: string;
        projectAuthor: string;
        projectGitRepo: string;
        projectWebsite: string;
        developerName: string;
        developerUrl: string;
        developerEmail: string;
        license: boolean;
    }> {
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

        return await prompts(questions, { onCancel });
    }

    async trace(
        options: FragmentOptions,
        data: {
            projectName: string;
            projectGroup: string;
            projectVersion: string;
            projectDescription: string;
            projectAuthor: string;
            projectWebsite: string;
            projectGitRepo: string;
            developerName: string;
            developerUrl: string;
            developerEmail: string;
            license: boolean;
        }
    ): Promise<void> {
        this.copyFiles(options.directory);

        const rootProjectName: string = data.projectName.toLowerCase();
        const projectPackage: string =
            data.projectGroup + "." + rootProjectName;

        replaceTokensMap(
            options.directory,
            new Map([
                ["ROOT_PROJECT_NAME", rootProjectName],
                ["PROJECT_NAME", data.projectName],
                ["PROJECT_GROUP", data.projectGroup],
                ["PROJECT_VERSION", data.projectVersion],
                ["PROJECT_DESCRIPTION", data.projectDescription],
                ["PROJECT_AUTHOR", data.projectAuthor],
                ["PROJECT_WEBSITE", data.projectWebsite],
                ["PROJECT_GIT_REPO", data.projectGitRepo],
                ["PROJECT_PACKAGE", projectPackage],
                ["DEVELOPER_NAME", data.developerName],
                ["DEVELOPER_URL", data.developerUrl],
                ["DEVELOPER_EMAIL", data.developerEmail],
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

        await registeredFragments.get("Editorconfig")?.traceWithPrompt(options);
        await registeredFragments.get("Checkstyle")?.traceWithPrompt(options);
        await registeredFragments
            .get("JavaGitignore")
            ?.traceWithPrompt(options);

        if (data.license) {
            await registeredFragments.get("License")?.traceWithPrompt(options);
        }
    }
}
