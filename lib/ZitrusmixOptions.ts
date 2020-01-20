'use strict';

export class ZitrusmixOptions {
    readonly createMatcher: (() => {match: (expression: string) => boolean}) | null;

    constructor(init: Partial<ZitrusmixOptions> = {} ) {
        /**
         * @type {(() => {match: (expression: string) => boolean}) | null}
         */
        this.createMatcher = init.createMatcher || null;
    }
}
