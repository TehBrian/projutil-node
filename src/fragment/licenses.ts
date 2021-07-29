import { onCancel } from "..";
import { replaceTokensMap } from "../fileutil";
import { FileFragment, Fragment, FragmentOptions, fragments } from "./fragment";

const prompts = require("prompts");

export class License extends Fragment {
    constructor() {
        super("License", "A list of licenses.");
    }

    async prompt(options: FragmentOptions) {
        const questions = [
            {
                type: "select",
                name: "licenseType",
                message: "License Type",
                choices: [{ title: "MIT", value: "MIT" }],
            },
        ];

        const response = await prompts(questions, { onCancel });

        if (response.licenseType === "MIT") {
            await fragments.get("MitLicense")!.prompt(options);
        }
    }
}

export class MitLicense extends FileFragment {
    constructor() {
        super("MitLicense", "The MIT license.", "mit_license");
    }

    async prompt(options: FragmentOptions) {
        const questions = [
            {
                type: "text",
                name: "licenseHolder",
                message: "License Holder",
            },
        ];

        const response = await prompts(questions, { onCancel });

        this.copyFiles(options.directory);

        replaceTokensMap(
            options.directory,
            new Map([
                ["LICENSE_YEAR", new Date().getFullYear().toString()],
                ["LICENSE_HOLDER", response.licenseHolder],
            ])
        );
    }
}
