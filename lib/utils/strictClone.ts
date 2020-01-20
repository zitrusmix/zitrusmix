'use strict';

import {strictStringify} from './strictStringify';


export function strictClone<T extends object>(obj: T): T {
    return JSON.parse(strictStringify(obj));
}
