import { FileFragment, FragmentOptions } from "./fragment";

export class Checkstyle extends FileFragment {
    constructor() {
        super("Checkstyle", "A checkstyle.", "checkstyle");
    }

    async prompt(options: FragmentOptions) {
        this.copyFiles(options.directory);
    }
}

export class Editorconfig extends FileFragment {
    constructor() {
        super("Editorconfig", "An editorconfig.", "editorconfig");
    }

    async prompt(options: FragmentOptions) {
        this.copyFiles(options.directory);
    }
}

export class JavaGitignore extends FileFragment {
    constructor() {
        super("JavaGitignore", "A gitignore for Java.", "java_gitignore");
    }

    async prompt(options: FragmentOptions) {
        this.copyFiles(options.directory);
    }
}
