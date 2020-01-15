'use strict';

import {ElementId} from '../types/ElementId';

export class ContentLink {
    readonly from: ElementId;
    readonly to: ElementId;
    readonly attributes: Map<string, any>;

    constructor(from: ElementId, to: ElementId, attributes?: Map<string, any>) {
        this.from = from;
        this.to = to;
        this.attributes = attributes || new Map();
    }

    [key:string]:any;
}
