import {ContentElement} from '../content/ContentElement';

export interface ContentElementPredicate<T> {
    (value: ContentElement): boolean
}
