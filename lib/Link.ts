'use strict';

import {ElementURI} from './types/ElementURI';
import {Relationship} from "./Relationship";

export class Link {
    readonly source: ElementURI;
    readonly targets: Array<ElementURI>;
    readonly relationship: Relationship;

    constructor(source: ElementURI, targets: Array<ElementURI>, relationship?: Relationship) {
        this.source = source;
        this.targets = targets;
        this.relationship = relationship || Relationship.Link;
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
