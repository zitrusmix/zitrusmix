import {ElementURI} from '../../types/ElementURI';
import {URL} from 'url';
import {ZitrusmixError} from "../ZitrusmixError";

export function assertElementURI(uri: ElementURI): asserts uri is ElementURI {
    try {
        new URL('http:' + uri);
    } catch (error) {
        throw new ZitrusmixError('assert-element-exists', `Expected "ContentElement" does not exist at "${uri}".`);
    }
}
