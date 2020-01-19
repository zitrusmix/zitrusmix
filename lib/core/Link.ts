'use strict';

import {ElementURI} from '../types/ElementURI';

export class Link {
    readonly source: ElementURI;
    readonly targets: Array<ElementURI>;
    readonly attributes: Map<string, any>;
    readonly relationship: string;

    constructor(source: ElementURI, targets: Array<ElementURI>, relationship: string, attributes?: Map<string, any>) {
        this.source = source;
        this.targets = targets;
        this.attributes = attributes || new Map();
        this.relationship = relationship;
    }

    [Symbol.toPrimitive]() {
        this.toString();
    }

    [Symbol.toStringTag]() {
        return this.constructor.name;
    }

    toString() {
        return `${this.source} -> [${this.targets.join(', ')}]`;
    }
}
