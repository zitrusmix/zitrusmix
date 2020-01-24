import {ElementURI} from "../types/ElementURI";
import {URL} from "url";

export function assertElementURI(uri: ElementURI): asserts uri is ElementURI {
    try {
        new URL('http:' + uri);
    } catch (error) {
        throw new Error(`Element requires a valid URI. URI shall not contain any schema like "http:".`);
    }
}
