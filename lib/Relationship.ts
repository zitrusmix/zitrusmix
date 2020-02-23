'use strict';

export declare type RelationshipType = string;

export class Relationship {
    readonly type: RelationshipType;
    readonly attributes: Map<string, any>;

    constructor(type: RelationshipType, attributes?: Map<string, any>) {
        this.type = type;

        this.attributes = attributes || new Map();
    }

    static get Link(): Relationship {
        return new Relationship('link');
    }
}
