'use strict';

import {ContentLink} from '../ContentLink';

export class AddLinkOperation {
    readonly operation: string;
    readonly contentLink: ContentLink;

    constructor(contentLink: ContentLink) {
        this.operation = this.constructor.name;
        this.contentLink = contentLink;
    }
}
