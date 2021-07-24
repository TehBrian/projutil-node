// TODO: switch to a proper logging framework

export var isDebugMode: boolean = false;

/**
 * Replaces `console.debug` to debug only if `isDebugMode` is true.
 */
export function injectCustomLogging(): void {
    console.debug = (message?: any, ...optionalParams: any[]): void => {
        if (isDebugMode) {
            console.log(message, optionalParams);
        }
    };
}
