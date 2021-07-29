export namespace Questions {
    export const projectName = {
        type: "text",
        name: "projectName",
        message: "Project Name",
        validate: (val: string) =>
            val ? true : "Project name cannot be empty.",
    };

    export const projectGroup = {
        type: "text",
        name: "projectGroup",
        message: "Project Group",
        format: (val: string) => val.toLowerCase(),
        validate: (val: string) => {
            // Ensure that it is neither empty nor
            if (!val) {
                return "Project group cannot be empty.";
            } else if (
                !/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/g.test(val)
            ) {
                return "Project group must follow the reverse domain name convention, e.g. 'com.example'";
            }
            return true;
        },
    };

    export const projectVersion = {
        type: "text",
        name: "projectVersion",
        message: "Project Version",
        initial: "0.1.0",
    };

    export const projectDescription = {
        type: "text",
        name: "projectDescription",
        message: "Project Description",
    };

    export const projectAuthor = {
        type: "text",
        name: "projectAuthor",
        message: "Project Author",
    };

    export const projectWebsite: {
        type: string;
        name: string;
        message: string;
        initial: string | ((any: any) => any);
    } = {
        type: "text",
        name: "projectWebsite",
        message: "Project Website",
        initial: "https://github.com/",
    };

    export const license = {
        type: "toggle",
        name: "license",
        message: "License?",
        initial: true,
        active: "yes",
        inactive: "no",
    };
}
