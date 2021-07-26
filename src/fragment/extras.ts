import { Fragment, FragmentOptions } from "./fragment";

export class Checkstyle extends Fragment {
    constructor() {
        super("Checkstyle", "checkstyle", "A nice checkstyle.");
    }

    prompt(options: FragmentOptions) {
        (async () => {
            this.copyFiles(options.directory);
        })();
    }
}

export class Editorconfig extends Fragment {
    constructor() {
        super("Editorconfig", "editorconfig", "A nice editorconfig.");
    }

    prompt(options: FragmentOptions) {
        (async () => {
            this.copyFiles(options.directory);
        })();
    }
}
