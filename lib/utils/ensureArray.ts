import {MaybeArray} from "../types/MaybeArray";

export function ensureArray<T>(maybeArray: MaybeArray<T>): Array<T> {
    return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}
