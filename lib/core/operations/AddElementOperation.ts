'use strict';

import {ElementURI} from "../../types/ElementURI";
import {Content} from "../../types/Content";

export class AddElementOperation {
    readonly operation: string;
    readonly content: Content;
    readonly uri: ElementURI;

    constructor(uri:ElementURI, content: Content) {
        this.operation = this.constructor.name;
        this.uri = uri;
        this.content = content;
    }
}
