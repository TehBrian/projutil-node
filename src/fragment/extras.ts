import { FileFragment, FragmentOptions } from "./fragment";

export class Checkstyle extends FileFragment {
    constructor() {
        super("Checkstyle", "A checkstyle.", "checkstyle");
    }

    async trace(options: FragmentOptions, data: {}): Promise<void> {
        this.copyFiles(options.directory);
    }
}

export class Editorconfig extends FileFragment {
    constructor() {
        super("Editorconfig", "An editorconfig.", "editorconfig");
    }

    async trace(options: FragmentOptions, data: {}): Promise<void> {
        this.copyFiles(options.directory);
    }
}

export class JavaGitignore extends FileFragment {
    constructor() {
        super("JavaGitignore", "A gitignore for Java.", "java_gitignore");
    }

    async trace(options: FragmentOptions, data: {}): Promise<void> {
        this.copyFiles(options.directory);
    }
}
