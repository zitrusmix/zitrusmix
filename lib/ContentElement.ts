'use strict';

import {strictClone} from './utils/strictClone';
import {ElementURI} from './types/ElementURI';
import {Content} from './types/Content';
import {deepFreeze} from './utils/deepFreeze';
import {MaybeArray} from './types/MaybeArray';
import {assertElementURI} from './assert/assertElementURI';
import {Zitrusmix} from './Zitrusmix';
import {ensureArray} from './utils/ensureArray';
import {LinkCollection} from "./LinkCollection";

export class ContentElement {
    readonly uri: Readonly<ElementURI>;
    readonly content: Readonly<Content>;
    readonly mix: Zitrusmix;

    constructor(uri: ElementURI, content: Content = {}, mix: Zitrusmix) {
        assertElementURI(uri);

        this.uri = uri;
        this.content = deepFreeze(strictClone(content || {})) as Readonly<Content>;
        this.mix = mix;
    }

    updatePartialContent(partialContent: Partial<Content>): ContentElement {
        return new ContentElement(this.uri, {...this.content, ...partialContent}, this.mix);
    }

    updateContent(content: Content): ContentElement {
        return new ContentElement(this.uri, content, this.mix);
    }

    addLinkTo(targets: MaybeArray<ElementURI>, relationship: string): void {
        const targetURIs = ensureArray(targets);
        this.mix.addLink(this.uri, targetURIs, relationship);
    }

    addLinkToElements(targets: MaybeArray<ContentElement>, relationship: string): void {
        const targetElements = ensureArray(targets);
        this.mix.addLink(this.uri, targetElements.map(element => element.uri), relationship);
    }

    getOutgoingLinks(): LinkCollection {
        return this.mix.getOutgoingLinks(this.uri);
    }

    getIncomingLinks(): LinkCollection  {
        return this.mix.getIncomingLinks(this.uri);
    }

    toJSON(): object {
        return {
            uri: this.uri,
            content: this.content
        };
    }
 }
