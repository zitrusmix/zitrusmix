'use strict';

import {ElementURI} from '../../types/ElementURI';
import {Content} from '../../types/Content';

export class UpdateElementOperation {
    readonly operation: string;
    readonly uri: ElementURI;
    readonly content: Content;

    constructor(uri: ElementURI, content: Content) {
        this.operation = this.constructor.name;
        this.uri = uri;
        this.content = content || {};
    }
}
