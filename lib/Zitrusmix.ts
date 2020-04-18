import {ZitrusmixOptions} from './ZitrusmixOptions';
import {ContentElement} from './ContentElement';

import {ContentElementPredicate} from './types/ContentElementPredicate';
import {ElementURI} from './types/ElementURI';
import {Content} from './types/Content';
import {ZitrusmixPlugin} from './plugin/ZitrusmixPlugin';
import {ZitrusmixCollection} from './ZitrusmixCollection';
import {strictClone} from './utils/strictClone';
import {LinkCollection} from './LinkCollection';
import {assertElementExists} from './guards/assert/assertElementExists';
import {LinkStore} from './LinkStore';

export class Zitrusmix {
    private readonly options: ZitrusmixOptions;
    private readonly elements: Map<ElementURI, ContentElement>;
    private readonly linkStore: LinkStore;

    constructor(options?: Partial<ZitrusmixOptions>) {
        this.options = Object.assign(new ZitrusmixOptions(), options || {});
        this.elements = new Map();
        this.linkStore = new LinkStore(this);
    }

    get links(): LinkStore {
        return this.linkStore;
    }

    /**
     * Add content to the mix.
     * @param {ElementURI} uri The unique key for the content
     * @param {Content} content Any serializable object.
     */
    add(uri: ElementURI, content?: Content): ContentElement {
        const element = new ContentElement(uri, strictClone(content || {}), this);
        this.setElement(element);

        return element;
    }

    /**
     * Returns all elements.
     * @returns {ZitrusmixCollection}
     */
    all(): ZitrusmixCollection {
        return new ZitrusmixCollection(this, [...this.elements.keys()]);
    }

    clear(): void {
        this.elements.clear();
        this.linkStore.clear();
    }

    /**
     * Creates an empty collection.
     * @returns {ZitrusmixCollection}
     */
    createCollection(): ZitrusmixCollection {
        return new ZitrusmixCollection(this, []);
    }

    delete(uri: ElementURI): void {
        this.elements.delete(uri);
        this.linkStore.removeElement(uri);
    }

    filter(predicate: ContentElementPredicate): ZitrusmixCollection {
        return this.all().filter(predicate);
    }

    find(predicate: ContentElementPredicate): ContentElement | undefined {
        return this.all().find(predicate);
    }

    forEach(callback: (element: ContentElement) => void): void {
        this.elements.forEach(callback);
    }

    get(uri: ElementURI): ContentElement {
        const element = this.getElementById(uri);
        assertElementExists(element, uri);

        return element;
    }

    getElementById(uri: ElementURI): ContentElement | undefined {
        return this.elements.get(uri);
    }

    getIncomingLinks(uri: ElementURI): LinkCollection {
        return this.linkStore.getIncomingLinks(uri);
    }

    getOutgoingLinks(uri: ElementURI): LinkCollection {
        return this.linkStore.getOutgoingLinks(uri);
    }

    getLinks(): LinkCollection {
        return this.linkStore.values()
    }

    has(uri: ElementURI): boolean {
        return this.elements.has(uri);
    }

    keys(): IterableIterator<ElementURI>  {
        return this.elements.keys();
    }

    map<T>(mapFunc: (element: ContentElement, uri: ElementURI) => T): Array<T> {
        return Array.from(this.elements, ([key, value]) => mapFunc(value, key));
    }

    patch(uri: ElementURI, patch: Partial<Content>): ContentElement {
        const element = this.getElementById(uri);
        assertElementExists(element, uri);

        return element.patch(patch);
    }

    toJSON(): object {
        return {
            options: this.options,
            elements: Array.from(this.elements.values(), element => element.toJSON()),
            links: this.linkStore.toJSON()
        };
    }

    update(uri: ElementURI, content: Content): ContentElement {
        const element = this.getElementById(uri);
        assertElementExists(element, uri);

        const updatedElement = new ContentElement(uri, content, this);
        this.setElement(updatedElement);

        return updatedElement;
    }

    updateElement(element: ContentElement): ContentElement {
        const currentElement = this.getElementById(element.uri);
        assertElementExists(currentElement, element.uri);

        this.setElement(element);

        return element;
    }

    /**
     * Use a plugin for all elements of this mix.
     * @param {ZitrusmixPlugin<TZitrusmixPluginOptions>} plugin
     * @returns {Promise}
     */
    use<TZitrusmixPluginOptions>(plugin: ZitrusmixPlugin<TZitrusmixPluginOptions>): Promise<void> | void {
        return this.all().use(plugin);
    }

    values(): IterableIterator<ContentElement> {
        return this.elements.values();
    }

    [Symbol.iterator](): Map<ElementURI, ContentElement> {
        return this.elements;
    }

    private setElement(contentElement: ContentElement): void {
        this.elements.set(contentElement.uri, contentElement);
    }
}
