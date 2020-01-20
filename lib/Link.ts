'use strict';

import {ElementURI} from './types/ElementURI';

export class Link {
    readonly source: ElementURI;
    readonly targets: Array<ElementURI>;
    readonly attributes: Map<string, any>;
    readonly relationship: string;

    constructor(source: ElementURI, targets: Array<ElementURI>, relationship: string, attributes?: Map<string, any>) {
        this.source = source;
        this.targets = targets;
        this.relationship = relationship;
        this.attributes = attributes || new Map();
    }

    [Symbol.toPrimitive](): string {
        return this.toString();
    }

    [Symbol.toStringTag](): string {
        return this.constructor.name;
    }

    toString(): string {
        return `${this.source} -> [${this.targets.join(', ')}]`;
    }
}
