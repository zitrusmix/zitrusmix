'use strict';

import {strictClone} from './strictClone';
import {assertUseContentProperty} from '../assert/assertUseContentProperty';
import {ElementId} from '../types/ElementId';
import {Content} from '../types/Content';
import {deepFreeze} from '../utils/deepFreeze';

export class ContentElement {
    readonly id: Readonly<ElementId>;
    readonly content: Readonly<Content>;

    constructor(id: ElementId, content: Content = {}) {
        this.id = id;
        this.content = deepFreeze(strictClone(content || {})) as Readonly<Content>;
    }

    update(partialContent: Partial<Content>): ContentElement {
        return new ContentElement(this.id, {...this.content, ...partialContent});
    }

    [key:string]:any;
}

function getPropertyValue(contentElement: ContentElement, propertyName:string):any {
    assertUseContentProperty(contentElement, propertyName);

    return contentElement[propertyName];
}
