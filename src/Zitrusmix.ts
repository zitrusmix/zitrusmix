import {ZitrusmixOptions} from './ZitrusmixOptions';
import {ContentElement} from './ContentElement';

import {ContentElementPredicate} from './interfaces/ContentElementPredicate';
import {ElementURI} from './types/ElementURI';
import {Content} from './types/Content';
import {ZitrusmixPlugin} from './interfaces/ZitrusmixPlugin';
import {ZitrusmixCollection} from './ZitrusmixCollection';
import {Link} from './Link';
import {strictClone} from './utils/strictClone';
import {MaybeArray} from "./types/MaybeArray";
import {ensureArray} from "./utils/ensureArray";
import {LinkCollection} from "./LinkCollection";
import {assertElementExists} from "./assert/assertElementExists";
import {LinkStorage} from "./LinkStorage";

export class Zitrusmix {
    private readonly options : ZitrusmixOptions;
    private readonly elementMap: Map<ElementURI, ContentElement>;
    private readonly linkStorage: LinkStorage;

    constructor(options?: Partial<ZitrusmixOptions>) {
        this.options = Object.assign(new ZitrusmixOptions(), options || {});
        this.elementMap = new Map();
        this.linkStorage = new LinkStorage(this);
    }

    /**
     * Returns a readonly list of all elements.
     */
    get elements(): Array<ContentElement> {
        return [...this.elementMap.values()] as Array<ContentElement>;
    }

    all() {
        return new ZitrusmixCollection(this, this.elements);
    }

    use<T>(plugin: ZitrusmixPlugin<T>) {
        return this.all().use(plugin);
    }

    /**
     * @param uri
     * @param content
     */
    add(uri: ElementURI, content?: Content) {
        const element = new ContentElement(uri, strictClone(content || {}), this);
        this.setElement(element);

        return element;
    }

    addLink(source: ElementURI, targets: MaybeArray<ElementURI>, relationship: string, attributes?: Map<string, any>) {
        const link = new Link(source, ensureArray(targets), relationship, attributes);
        this.linkStorage.add(link);
    }

    getElementById(uri: ElementURI) {
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

    getOutgoingLinks(uri: ElementURI) {
        return this.linkStorage.getOutgoingLinks(uri);
    }

    getIncomingLinks(uri: ElementURI) {
        return this.linkStorage.getIncomingLinks(uri);
    }

    getElementsLinkedTo(uri: ElementURI) {
       return new ZitrusmixCollection(this, []);
    }

    filter(predicate: ContentElementPredicate) {
        return this.all().filter(predicate);
    }

    find(predicate: ContentElementPredicate) {
        return this.all().find(predicate);
    }

    update(uri: ElementURI, content: Content) {
        const element = this.getElementById(uri);
        assertElementExists(element, uri);

        const updatedElement = new ContentElement(uri, strictClone(content), this);
        this.setElement(updatedElement);
    }

    forEach(callback: (element: ContentElement) => void) {
        this.elements.forEach(callback);
    }

    map<T>(mapFunc: (element: ContentElement, uri: ElementURI) => T): Array<T> {
        return Array.from(this.elementMap, ([key, value]) => mapFunc(value, key));
    }

    clear() {
        this.elementMap.clear();
        this.linkStorage.clear();
    }

    delete(uri: ElementURI) {
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



    has(uri: ElementURI) {
        return this.elementMap.has(uri);
    }

    keys() {
        return this.elementMap.keys();
    }

    values() {
        return this.elementMap.values();
    }

    private setElement(contentElement: ContentElement) {
        this.elementMap.set(contentElement.uri, contentElement);
    }

    [Symbol.iterator](): Map<ElementURI, ContentElement> {
        return this.elementMap;
    }

    toJSON(): object {
        return {
            options: this.options,
            elements: this.elements.map(element => element.toJSON()),
            links: this.linkStorage.toJSON()
        };
    }
}
