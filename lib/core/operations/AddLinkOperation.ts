'use strict';

import {ElementURI} from "../../types/ElementURI";

export class AddLinkOperation {
    readonly source: ElementURI;
    readonly targets: Array<ElementURI>;
    readonly attributes: Map<string, any>;

    constructor(source: ElementURI, targets: Array<ElementURI>, attributes?: Map<string, any>) {
        this.source = source;
        this.targets = targets;
        this.attributes = attributes || new Map();
    }
}
