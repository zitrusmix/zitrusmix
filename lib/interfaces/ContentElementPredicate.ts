import {ContentElement} from '../ContentElement';
import {Content} from "../types/Content";

export interface ContentElementPredicate {
    (content: Content, element: ContentElement): boolean
}
