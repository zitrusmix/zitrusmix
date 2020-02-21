export function callAndCatch(callback): Error | null {
    let catchedError = null;

    try {
        callback()
    } catch (error) {
        catchedError = error;
    }

    return catchedError;
}
