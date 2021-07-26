const replace = require("replace-in-file");
const fs = require("fs-extra");
const chalk = require("chalk");
const util = require("util");

export function concatDir(
    dir1: string | string[],
    dir2: string | string[]
): string {
    const preserveRootSlash: boolean =
        typeof dir1 === "string" && dir1.charAt(0) === "/";

    const splitDir1 = typeof dir1 === "string" ? dir1.split("/") : dir1;
    const splitDir2 = typeof dir2 === "string" ? dir2.split("/") : dir2;

    const concatenatedDirs: string = splitDir1
        .filter((e) => e)
        .concat(splitDir2.filter((e) => e))
        .join("/");

    if (preserveRootSlash) {
        return "/" + concatenatedDirs;
    } else {
        return concatenatedDirs;
    }
}

// TODO: clean this up
export function renameFolder(root: string, from: string, to: string) {
    const splitFrom: string[] = from.split("/").filter((e) => e);
    const splitTo: string[] = to.split("/").filter((e) => e);

    const fromDirectoryCount: number = splitFrom.length;
    const toYknow: string[] = [...splitTo];
    toYknow.splice(0, fromDirectoryCount - 1); // get rid of dirs matching from length

    const plainRenameTo: string[] = [...splitFrom];
    plainRenameTo.splice(-1, 1); /*remove last item*/
    const actualPlainRenameTo = concatDir(plainRenameTo, toYknow[0]);
    const directoriesToCreate = [...splitTo];
    directoriesToCreate.splice(0, fromDirectoryCount);

    fs.renameSync(concatDir(root, from), concatDir(root, actualPlainRenameTo));

    fs.mkdirSync(
        concatDir(root, concatDir(actualPlainRenameTo, directoriesToCreate)),
        { recursive: true }
    );
}

export function renameFile(directory: string, from: string, to: string) {
    fs.renameSync(concatDir(directory, from), concatDir(directory, to));
}

/**
 * Searches all files in a directory for instances of a token and
 * replaces it with a string.
 * @param directory the directory to search
 * @param from the token (format: `@TOKEN@`)
 * @param to what to replace the token with
 */
export function replaceTokens(directory: string, from: string, to: string) {
    try {
        replace.sync({
            files: directory + "/**/*",
            from: new RegExp("@" + from + "@", "g"),
            to: to,
        });
        console.debug(`Successfully replaced token ${from} to ${to}.`);
    } catch (error) {
        console.error(
            "An error occurred when trying to replace a token:",
            error
        );
    }
}

/**
 * Executes replaceTokens on a map.
 * @see replaceTokens
 * @param directory the directory to search
 * @param replacements a map, where the key is the token and the value is what to replace it with
 */
export function replaceTokensMap(
    directory: string,
    replacements: Map<string, string>
) {
    for (const [from, to] of replacements) {
        replaceTokens(directory, from, to);
    }
    console.debug(
        `Successfully replaced tokens: ${util.inspect(replacements, {
            showHidden: false,
            depth: null,
        })}!`
    );
}
