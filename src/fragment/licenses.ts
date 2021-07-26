import { onCancel } from "..";
import { replaceTokensMap } from "../fileutil";
import { Fragment, FragmentOptions } from "./fragment";

const prompts = require("prompts");

export class MitLicense extends Fragment {
    constructor() {
        super("MitLicense", "mit_license", "The MIT license.");
    }

    prompt(options: FragmentOptions) {
        const questions = [
            {
                type: "text",
                name: "licenseHolder",
                message: "What should the name on the license be?",
            },
        ];

        (async () => {
            const response = await prompts(questions, { onCancel });

            this.copyFiles(options.directory);

            replaceTokensMap(
                options.directory,
                new Map([
                    ["LICENSE_YEAR", new Date().getFullYear().toString()],
                    ["LICENSE_HOLDER", response.licenseHolder],
                ])
            );
        })();
    }
}
