import { FileFragment, FragmentOptions } from "./fragment";

export class Checkstyle extends FileFragment {
    constructor() {
        super("Checkstyle", "A nice checkstyle.", "checkstyle");
    }

    prompt(options: FragmentOptions) {
        this.copyFiles(options.directory);
    }
}

export class Editorconfig extends FileFragment {
    constructor() {
        super("Editorconfig", "A nice editorconfig.", "editorconfig");
    }

    prompt(options: FragmentOptions) {
        this.copyFiles(options.directory);
    }
}
