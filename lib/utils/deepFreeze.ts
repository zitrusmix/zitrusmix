'use strict';

type StringIndex<T> = {
    [key: string]: T
}

/**
 * Based on MDN (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
 */
export function deepFreeze(obj: StringIndex<any>) {
    // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(obj);

    //const keys = Object.keys(obj) as Array<keyof T>;

    // Freeze properties before freezing self
    propNames.forEach(propName => {
        const value = obj[propName];

        if (value && typeof value === 'object') {
            obj[propName] = deepFreeze(value);
        }
    });

    return Object.freeze(obj);
}
