import { FileFragment, FragmentOptions } from "./fragment";

export class Checkstyle extends FileFragment {
    constructor() {
        super("checkstyle", "A checkstyle.", "checkstyle");
    }

    async trace(options: FragmentOptions, data: {}): Promise<void> {
        this.copyFiles(options.directory);
    }
}

export class Editorconfig extends FileFragment {
    constructor() {
        super("editorconfig", "An editorconfig.", "editorconfig");
    }

    async trace(options: FragmentOptions, data: {}): Promise<void> {
        this.copyFiles(options.directory);
    }
}

export class JavaGitignore extends FileFragment {
    constructor() {
        super("java_gitignore", "A gitignore for Java.", "java_gitignore");
    }

    async trace(options: FragmentOptions, data: {}): Promise<void> {
        this.copyFiles(options.directory);
    }
}
