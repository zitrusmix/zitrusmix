'use strict';

import {ContentElement} from "../ContentElement";

export class AddContentOperation {
    readonly operation: string;
    readonly element: ContentElement;

    constructor(element: ContentElement) {
        this.operation = this.constructor.name;
        this.element = element;
    }
}
