'use strict';

import {strictClone} from './utils/strictClone';
import {ElementURI} from './types/ElementURI';
import {Content} from './types/Content';
import {deepFreeze} from './utils/deepFreeze';
import {OneOrMany} from './types/OneOrMany';
import {assertElementURI} from './guards/assert/assertElementURI';
import {assertStableElementURI} from './guards/assert/assertStableElementURI';
import {Zitrusmix} from './Zitrusmix';
import {ensureArray} from './utils/ensureArray';
import {LinkCollection} from "./LinkCollection";
import {Relationship} from "./Relationship";
import {Link} from "./Link";

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

    linkTo(targets: OneOrMany<ElementURI>, relationship?: Relationship): ContentElement {
        const targetURIs = ensureArray(targets);

        const link = new Link(this.uri, targetURIs, relationship);
        this.#mix.links.add(link);

        return this;
    }

    linkToElements(targets: OneOrMany<ContentElement>, relationship?: Relationship): ContentElement {
        const targetElements = ensureArray(targets);

        const link = new Link(this.uri, targetElements.map(element => element.uri), relationship);
        this.#mix.links.add(link);

        return this;
    }

    getOutgoingLinks(): LinkCollection {
        return this.#mix.links.getOutgoingLinks(this.uri);
    }

    getIncomingLinks(): LinkCollection  {
        return this.#mix.links.getIncomingLinks(this.uri);
    }

    toJSON(): object {
        return {
            uri: this.uri,
            ...this
        };
    }

    clone(newUri?: ElementURI): ContentElement {
        const {uri, ...content} = this;
        return new ContentElement(newUri || uri, content, this.#mix);
    }

    private deleteAllContentProperties(): void {
        Object.keys(this).forEach(key => delete this[key]);
    }
 }
