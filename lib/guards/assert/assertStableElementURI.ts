import {ElementURI} from "../../types/ElementURI";
import {ZitrusmixError} from "../ZitrusmixError";

export function assertStableElementURI(elementUri: ElementURI, contentUri: ElementURI | string | undefined): void|never {
    if (contentUri) {
        if (contentUri !== elementUri) {
            throw new ZitrusmixError('assert-stable-element-uri', 'The URI of a <ContentElement> can not be changed.');
        }
    }
}
