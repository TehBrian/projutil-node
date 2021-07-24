import { templatesFolder } from "../files";
import { fragments } from "./fragments";
import { Resource, ResourceOptions } from "./resources";

const prompts = require("prompts");
var _ = require("lodash");

export const templates: Map<string, Template> = new Map();

export function registerTemplate(template: Template): void {
    templates.set(template.name, template);
}

export function registerDefaultTemplates(): void {
    registerTemplate(new JavaPaperPlugin());
}

export abstract class Template extends Resource {
    constructor(name: string, file: string, description: string) {
        super(name, file, description);
    }

    abstract prompt(options: TemplateOptions): void;

    getFolder() {
        return templatesFolder + "/" + this.file;
    }
}

export type TemplateOptions = ResourceOptions & {
    overwrite: boolean;
};

export class JavaPaperPlugin extends Template {
    constructor() {
        super(
            "JavaPaperPlugin",
            "java_paper_plugin",
            "A blank Gradle project, using the Kotlin DSL, configured for Paper plugin development."
        );
    }

    prompt(options: TemplateOptions) {
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
            const response = await prompts(questions);

            const projectPackage: string =
                response.projectGroup + "." + response.projectName.toLowerCase();

            this.copyFiles(options.directory);

            this.replaceTokensMap(
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

            if (response.license) {
                fragments.get("MitLicense")?.prompt(options);
            }
        })();
    }
}
