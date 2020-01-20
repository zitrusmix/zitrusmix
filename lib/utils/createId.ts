import {ElementURI} from "../types/ElementURI";

let lastCreatedId = 0;

const RADIX = 10;

/**
 * Creates an autoincrement identifier.
 */
export function createId(): ElementURI {
    const currentId = lastCreatedId + 1;
    lastCreatedId = currentId;

    return currentId.toString(RADIX);
}
