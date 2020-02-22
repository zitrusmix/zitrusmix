import {ContentElement} from '../ContentElement';

export interface ContentElementPredicate {
    (element: ContentElement): boolean;
}
