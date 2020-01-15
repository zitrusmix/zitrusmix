'use strict';

import {ElementId} from '../../types/ElementId';
import {Content} from '../../types/Content';

export class UpdateElementOperation {
    readonly operation: string;
    readonly elementId: ElementId;
    readonly content: Content;

    constructor(elementId: ElementId, content: Content) {
        this.operation = this.constructor.name;
        this.elementId = elementId;
        this.content = content || {};
    }
}
