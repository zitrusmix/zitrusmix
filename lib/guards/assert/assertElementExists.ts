import {ElementURI} from '../../types/ElementURI';
import {ContentElement} from '../../ContentElement';
import {ZitrusmixError} from '../ZitrusmixError';

export function assertElementExists(element: ContentElement | null | undefined, uri: ElementURI): asserts element is ContentElement {
    if (typeof element === 'undefined' || element === null) {
        throw new ZitrusmixError('assert-element-exists', `Expected "ContentElement" does not exist at "${uri}".`);
    }
}
