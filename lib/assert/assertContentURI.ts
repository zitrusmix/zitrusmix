import {ElementURI} from "../types/ElementURI";

export function assertContentURI(elementUri: ElementURI, contentUri: ElementURI | string | undefined): void|never {
    if (contentUri) {
        if (contentUri !== elementUri) {
            throw new Error('Content URI must be undefined, null or equal to element URI.');
        }
    }
}
