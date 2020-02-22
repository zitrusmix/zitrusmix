import {ZitrusmixOptions} from './ZitrusmixOptions';
import {ContentElement} from './ContentElement';

import {ContentElementPredicate} from './types/ContentElementPredicate';
import {ElementURI} from './types/ElementURI';
import {Content} from './types/Content';
import {ZitrusmixPlugin} from './plugin/ZitrusmixPlugin';
import {ZitrusmixCollection} from './ZitrusmixCollection';
import {Link} from './Link';
import {strictClone} from './utils/strictClone';
import {MaybeArray} from "./types/MaybeArray";
import {ensureArray} from "./utils/ensureArray";
import {LinkCollection} from "./LinkCollection";
import {assertElementExists} from "./guards/assert/assertElementExists";
import {LinkStorage} from "./LinkStorage";

export class Zitrusmix {
    private readonly options: ZitrusmixOptions;
    private readonly elementMap: Map<ElementURI, ContentElement>;
    private readonly linkStorage: LinkStorage;

    constructor(options?: Partial<ZitrusmixOptions>) {
        this.options = Object.assign(new ZitrusmixOptions(), options || {});
        this.elementMap = new Map();
        this.linkStorage = new LinkStorage(this);

    }

    all(): ZitrusmixCollection {
        return new ZitrusmixCollection(this, [...this.elementMap.keys()]);
    }

    use<T>(plugin: ZitrusmixPlugin<T>): Promise<void> | void {
        return this.all().use(plugin);
    }

    /**
     * @param uri
     * @param content
     */
    add(uri: ElementURI, content?: Content): ContentElement {
        const element = new ContentElement(uri, strictClone(content || {}), this);
        this.setElement(element);

        return element;
    }

    addLink(
        source: ElementURI,
        targets: MaybeArray<ElementURI>,
        relationship: string,
        attributes?: Map<string, any>): void {
        const link = new Link(source, ensureArray(targets), relationship, attributes);
        this.linkStorage.add(link);
    }

    getElementById(uri: ElementURI): ContentElement | undefined {
        return this.elementMap.get(uri);
    }

    get(uri: ElementURI): ContentElement {
        const element = this.getElementById(uri);
        assertElementExists(element, uri);

        return element;
    }

    getLinks(): LinkCollection {
        return this.linkStorage.values()
    }

    getOutgoingLinks(uri: ElementURI): LinkCollection {
        return this.linkStorage.getOutgoingLinks(uri);
    }

    getIncomingLinks(uri: ElementURI): LinkCollection {
        return this.linkStorage.getIncomingLinks(uri);
    }

    filter(predicate: ContentElementPredicate): ZitrusmixCollection {
        return this.all().filter(predicate);
    }

    find(predicate: ContentElementPredicate): ContentElement | undefined {
        return this.all().find(predicate);
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

    forEach(callback: (element: ContentElement) => void): void {
        this.elementMap.forEach(callback);
    }

    map<T>(mapFunc: (element: ContentElement, uri: ElementURI) => T): Array<T> {
        return Array.from(this.elementMap, ([key, value]) => mapFunc(value, key));
    }

    clear(): void {
        this.elementMap.clear();
        this.linkStorage.clear();
    }

    delete(uri: ElementURI): void {
        this.elementMap.delete(uri);
        this.linkStorage.removeElement(uri);
    }

    // /**
    //  * @param {({match: (expression:string) => boolean}) | string | ((expression:string) => boolean)} expression
    //  */
    // match(expression) {
    //     /**
    //      * @type {{match: (expression:string) => boolean}}
    //      */
    //     let matcher = {match: () => true};
    //
    //     if (typeof expression === 'string') {
    //         const createMatcher = this.options.createMatcher;
    //
    //         if (createMatcher) {
    //             matcher = createMatcher(expression);
    //         } else {
    //             // TODO
    //             // throw error
    //         }
    //     } else if (typeof expression === 'function') {
    //        matcher = {match: expression};
    //     } else {
    //         matcher = expression;
    //     }
    //
    //     const options = new ZitrusmixOptions({
    //         contentPool: this.contentPool,
    //         createMatcher: this.options.createMatcher
    //     });
    //
    //     return new Zitrusmix(options);
    // }

    // /**
    //  * @param {function(ContentElement):string} callback
    //  * @returns {Map<string, !Array<ContentElement>>}
    //  */
    // groupBy(callback) {
    //     /**
    //      * @type {Map<string, !Array<ContentElement>>}
    //      */
    //     const groups = new Map();
    //
    //     this.contentPool.elements.forEach(element => {
    //         const groupId = callback(element);
    //         const group = groups.get(groupId);
    //
    //         if (group) {
    //             group.push(element);
    //         } else {
    //             groups.set(groupId, [element]);
    //         }
    //     });
    //
    //     return groups;
    // }


    has(uri: ElementURI): boolean {
        return this.elementMap.has(uri);
    }

    keys(): Iterable<ElementURI>  {
        return this.elementMap.keys();
    }

    values(): Iterable<ContentElement> {
        return this.elementMap.values();
    }

    private setElement(contentElement: ContentElement): void {
        this.elementMap.set(contentElement.uri, contentElement);
    }

    [Symbol.iterator](): Map<ElementURI, ContentElement> {
        return this.elementMap;
    }

    toJSON(): object {
        return {
            options: this.options,
            elements: Array.from(this.elementMap.values(), element => element.toJSON()),
            links: this.linkStorage.toJSON()
        };
    }
}
