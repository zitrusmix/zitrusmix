'use strict';

import {JSONString} from '../types/JSONString';

export function strictStringify<T extends object>(obj: T): JSONString {
    let json: string;

    try {
        json = JSON.stringify(obj);
    } catch (error) {
        throw new Error('The content must be serializeable into JSON.');
    }

    return json
}
