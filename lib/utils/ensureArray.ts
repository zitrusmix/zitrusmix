import {OneOrMany} from "../types/OneOrMany";

export function ensureArray<T>(maybeArray: OneOrMany<T>): Array<T> {
    return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}
