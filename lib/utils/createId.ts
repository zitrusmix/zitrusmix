import {ElementId} from "../types/ElementId";

let lastCreatedId: number = 0;

const RADIX:number = 10;

/**
 * Creates an autoincrement identifier.
 */
export function createId(): ElementId {
    const currentId = lastCreatedId + 1;
    lastCreatedId = currentId;

    return currentId.toString(RADIX);
}
