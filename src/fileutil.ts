const replace = require("replace-in-file");
const fs = require("fs-extra");
const util = require("util");
const path = require("path");

export function concatDir(...dir: (string | string[])[]): string {
    var allDirs: string[] = [];

    for (const item of dir) {
        // make every argument an array
        const arrayDir: string[] =
            typeof item === "string" ? dirStringToArray(item) : item;
        allDirs = allDirs.concat(arrayDir);
    }

    return dirArrayToString(allDirs);
}

export function dirStringToArray(dir: string): string[] {
    const dirAsArray: string[] = dir.split(path.sep).filter((e) => e);

    // preserve root slash
    if (dir.charAt(0) === path.sep) {
        dirAsArray.unshift(path.sep); // adds "/" (or "\" on windows) as an element to start of array
    }

    return dirAsArray;
}

export function dirArrayToString(dir: string[]): string {
    const dirAsString = dir.filter((e) => e).join(path.sep);

    // remove double root slash due to .join
    if (dir[0] === path.sep) {
        return dirAsString.substring(1);
    }

    return dirAsString;
}

export function renameFolder(root: string, from: string, to: string) {
    const rootedFrom: string = concatDir(root, from);
    const rootedTo: string = concatDir(root, to);

    const toExceptLast = dirStringToArray(rootedTo);
    toExceptLast.splice(-1, 1); // remove last item

    fs.mkdirSync(dirArrayToString(toExceptLast), { recursive: true });
    fs.renameSync(rootedFrom, rootedTo);
}

export function moveFile(root: string, from: string, to: string) {
    fs.renameSync(concatDir(root, from), concatDir(root, to));
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

export const packageToDirectory = (s: string) => s.replaceAll(/\./g, path.sep);
export const directoryToPackage = (s: string) => s.replaceAll(new RegExp(path.sep, "g"), ".");
