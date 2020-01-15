'use strict';

import {ContentPool} from './content/ContentPool.js';
import {ContentElement} from './content/ContentElement.js';

export class ZitrusmixOptions {
    readonly createMatcher: (() => {match: (expression:string) => boolean}) | null;
    readonly contentPool: ContentPool;

    constructor(init: Partial<ZitrusmixOptions> = {}) {
        /**
         * @type {(() => {match: (expression: string) => boolean}) | null}
         */
        this.createMatcher = init.createMatcher || null;

        /**
         * @type {ContentPool}
         */
        this.contentPool = init.contentPool || new ContentPool();
    }
}
