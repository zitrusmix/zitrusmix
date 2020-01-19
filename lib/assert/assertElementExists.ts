import {ElementURI} from "../types/ElementURI";
import {ContentElement} from "../core/ContentElement";

export function assertElementExists(element: ContentElement | null | undefined, uri: ElementURI): asserts element is ContentElement {
    if (typeof element === undefined) {
        throw new Error(`Invalid element for URI "${uri}"`);
    }
}
