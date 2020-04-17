import {ZitrusmixOptions} from './ZitrusmixOptions';
import {ContentElement} from './ContentElement';

import {ContentElementPredicate} from './types/ContentElementPredicate';
import {ElementURI} from './types/ElementURI';
import {Content} from './types/Content';
import {ZitrusmixPlugin} from './plugin/ZitrusmixPlugin';
import {ZitrusmixCollection} from './ZitrusmixCollection';
import {Link} from './Link';
import {strictClone} from './utils/strictClone';
import {OneOrMany} from "./types/OneOrMany";
import {ensureArray} from "./utils/ensureArray";
import {LinkCollection} from "./LinkCollection";
import {assertElementExists} from "./guards/assert/assertElementExists";
import {LinkStorage} from "./LinkStorage";
import {Relationship} from "./Relationship";

export class Zitrusmix {
    private readonly options: ZitrusmixOptions;
    private readonly elementMap: Map<ElementURI, ContentElement>;
    private readonly linkStorage: LinkStorage;

    constructor(options?: Partial<ZitrusmixOptions>) {
        this.options = Object.assign(new ZitrusmixOptions(), options || {});
        this.elementMap = new Map();
        this.linkStorage = new LinkStorage(this);
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
     * Add a element link to the mix.
     * @param {ElementURI} source
     * @param {OneOrMany<ElementURI>} targets
     * @param {Relationship} [relationship]
     */
    addLink(
        source: ElementURI,
        targets: OneOrMany<ElementURI>,
        relationship?: Relationship): void {
        const link = new Link(source, ensureArray(targets), relationship);
        this.linkStorage.add(link);
    }

    /**
     * Returns all elements.
     * @returns {ZitrusmixCollection}
     */
    all(): ZitrusmixCollection {
        return new ZitrusmixCollection(this, [...this.elementMap.keys()]);
    }

    clear(): void {
        this.elementMap.clear();
        this.linkStorage.clear();
    }

    /**
     * Creates an empty collection.
     * @returns {ZitrusmixCollection}
     */
    createCollection(): ZitrusmixCollection {
        return new ZitrusmixCollection(this, []);
    }

    delete(uri: ElementURI): void {
        this.elementMap.delete(uri);
        this.linkStorage.removeElement(uri);
    }

    filter(predicate: ContentElementPredicate): ZitrusmixCollection {
        return this.all().filter(predicate);
    }

    find(predicate: ContentElementPredicate): ContentElement | undefined {
        return this.all().find(predicate);
    }

    forEach(callback: (element: ContentElement) => void): void {
        this.elementMap.forEach(callback);
    }

    get(uri: ElementURI): ContentElement {
        const element = this.getElementById(uri);
        assertElementExists(element, uri);

        return element;
    }

    getElementById(uri: ElementURI): ContentElement | undefined {
        return this.elementMap.get(uri);
    }

    getIncomingLinks(uri: ElementURI): LinkCollection {
        return this.linkStorage.getIncomingLinks(uri);
    }

    getOutgoingLinks(uri: ElementURI): LinkCollection {
        return this.linkStorage.getOutgoingLinks(uri);
    }

    getLinks(): LinkCollection {
        return this.linkStorage.values()
    }

    has(uri: ElementURI): boolean {
        return this.elementMap.has(uri);
    }

    keys(): IterableIterator<ElementURI>  {
        return this.elementMap.keys();
    }

    map<T>(mapFunc: (element: ContentElement, uri: ElementURI) => T): Array<T> {
        return Array.from(this.elementMap, ([key, value]) => mapFunc(value, key));
    }

    patch(uri: ElementURI, patch: Partial<Content>): ContentElement {
        const element = this.getElementById(uri);
        assertElementExists(element, uri);

        return element.patch(patch);
    }

    toJSON(): object {
        return {
            options: this.options,
            elements: Array.from(this.elementMap.values(), element => element.toJSON()),
            links: this.linkStorage.toJSON()
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
        return this.elementMap.values();
    }

    [Symbol.iterator](): Map<ElementURI, ContentElement> {
        return this.elementMap;
    }

    private setElement(contentElement: ContentElement): void {
        this.elementMap.set(contentElement.uri, contentElement);
    }
}
