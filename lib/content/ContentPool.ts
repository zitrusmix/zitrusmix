'use strict';

import {ContentElement} from './ContentElement';
import {deepFreeze} from '../utils/deepFreeze';
import {createId} from '../utils/createId';
import {ContentPropertyName} from '../ContentPropertyName';

import {strictClone} from './strictClone';
import {AddContentOperation} from './operations/AddContentOperation';
import {UpdateElementOperation} from './operations/UpdateElementOperation';
import {ElementId} from '../types/ElementId';

export class ContentPool {
    private readonly elementMap: Map<ElementId, ContentElement>;

    constructor() {
        this.elementMap = new Map();
    }

    addContent(addContentOperation: AddContentOperation): ContentElement {
        this.setElement(addContentOperation.element);

        return addContentOperation.element;
    }

    updateContent(updateContentOperation: UpdateElementOperation) {
        const updatedElement = new ContentElement(
            updateContentOperation.elementId,
            strictClone(updateContentOperation.content)
        );

        this.setElement(updatedElement);
    }

    getElementById(contentId: ElementId) : ContentElement | null {
        return this.elementMap.get(contentId) || null;
    }

    get elements():Array<ContentElement> {
        return [...this.elementMap.values()] as Array<ContentElement>;
    }

    private setElement(contentElement: ContentElement) {
        // deepFreeze(contentElement);
        this.elementMap.set(contentElement.id, contentElement);
    }

    [Symbol.iterator](): Map<ElementId, ContentElement> {
        return this.elementMap;
    }
}
