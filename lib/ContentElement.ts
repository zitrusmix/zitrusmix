'use strict';

import {strictClone} from './utils/strictClone';
import {ElementURI} from './types/ElementURI';
import {Content} from './types/Content';
import {deepFreeze} from './utils/deepFreeze';
import {MaybeArray} from './types/MaybeArray';
import {assertElementURI} from './guards/assert/assertElementURI';
import {assertStableElementURI} from './guards/assert/assertStableElementURI';
import {Zitrusmix} from './Zitrusmix';
import {ensureArray} from './utils/ensureArray';
import {LinkCollection} from "./LinkCollection";

export class ContentElement {
    #uri: ElementURI;
    #mix: Zitrusmix;
    [key: string]: any;

    constructor(uri: ElementURI, content: Content = {}, mix: Zitrusmix) {
        assertElementURI(uri);

        this.#uri = uri;
        this.#mix = mix;

        const cleanContent = deepFreeze(strictClone(content || {}));

        Object.assign(this, cleanContent);
    }

    get uri(): ElementURI {
        return this.#uri;
    }

    set uri(value: ElementURI) {
        assertStableElementURI(this.#uri, value);
    }

    patch(patch: Partial<Content>): ContentElement {
        const patchedElement = this.#mix.update(this.#uri, {...this, ...patch});

        Object.assign(this, patchedElement);

        return this;
    }

    update(content: Content): ContentElement {
        const updatedElement = this.#mix.update(this.#uri, content);

        this.deleteAllContentProperties();
        Object.assign(this, updatedElement);

        return this;
    }

    linkTo(targets: MaybeArray<ElementURI>, relationship: string): ContentElement {
        const targetURIs = ensureArray(targets);
        this.#mix.addLink(this.uri, targetURIs, relationship);

        return this;
    }

    linkToElements(targets: MaybeArray<ContentElement>, relationship: string): ContentElement {
        const targetElements = ensureArray(targets);
        this.#mix.addLink(this.uri, targetElements.map(element => element.uri), relationship);

        return this;
    }

    getOutgoingLinks(): LinkCollection {
        return this.#mix.getOutgoingLinks(this.uri);
    }

    getIncomingLinks(): LinkCollection  {
        return this.#mix.getIncomingLinks(this.uri);
    }

    toJSON(): object {
        return {
            uri: this.uri,
            ...this
        };
    }

    clone(): ContentElement {
        return new ContentElement(this.uri, this, this.#mix);
    }

    private deleteAllContentProperties(): void {
        Object.keys(this).forEach(key => delete this[key]);
    }
 }
