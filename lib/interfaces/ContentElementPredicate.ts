import {ContentElement} from '../core/ContentElement';
import {Content} from "../types/Content";

export interface ContentElementPredicate {
    (content: Content, element: ContentElement): boolean
}
