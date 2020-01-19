import {ContentElement} from '../ContentElement';
import {ElementURI} from "../types/ElementURI";
import {URL} from "url";

export function assertElementURI(uri: ElementURI) {
        try {
            new URL('uri:' + uri);
        } catch (error) {
            throw new Error(`Element requires a valid URI. URI shall not contain any schema like "http:".`);
        }
}
