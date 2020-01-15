import {ContentElement} from '../content/ContentElement';

export function assertUseContentProperty(contentElement: ContentElement, propertyName: string) {
    if (!(propertyName in contentElement)) {
        throw new Error(`Property "${propertyName}" does not exist on "ContentElement". Use "element.content.${propertyName}" to access the data?`);
    }
}
