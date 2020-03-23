import {Zitrusmix} from "./Zitrusmix";
import {ZitrusmixPlugin} from "./plugin/ZitrusmixPlugin";
import {ContentElement} from "./ContentElement";
import {PluginContext} from "./plugin/PluginContext";
import {CompareFunc} from "./types/CompareFunc";
import {MaybeArray} from "./types/MaybeArray";
import {ensureArray} from "./utils/ensureArray";
import {ContentElementPredicate} from "./types/ContentElementPredicate";
import {PluginLock} from "./guards/locks/PluginLock";
import {ElementURI} from "./types/ElementURI";
import {ZitrusmixError} from "./guards/ZitrusmixError";
import {Relationship} from "./Relationship";

const pluginLock = new PluginLock();

export class ZitrusmixCollection implements Iterable<ContentElement> {
    #elementURIs: Set<ElementURI>;
    readonly #mix: Zitrusmix;

    constructor(mix: Zitrusmix, elementURIs?: Array<ElementURI>) {
        this.#mix = mix;
        this.#elementURIs = new Set(elementURIs || []);
    }

    get size(): number {
        return this.#elementURIs.size;
    }

    add(elementURI: ElementURI): void {
        if (!this.#mix.has(elementURI)) {
             throw new ZitrusmixError('collection-add-element-missing-error', `No element with URI "${elementURI}" available. Add element to mix before adding it to a collection.`);
        }

        this.#elementURIs.add(elementURI);
    }

    clear(): void {
        this.#elementURIs.clear();
    }

    delete(elementURI: ElementURI): void {
        this.#elementURIs.delete(elementURI);
    }

    *entries(): IterableIterator<[ElementURI, ContentElement]> {
        for(const element of this.values()) {
            yield [element.uri, element];
        }
    }

    filter(predicate: ContentElementPredicate): ZitrusmixCollection {
        const elementUris: Array<ElementURI> = [];

        for(const element of this.values()) {
            if (predicate(element)) {
                elementUris.push(element.uri);
            }
        }

        return new ZitrusmixCollection(this.#mix, elementUris);
    }

    filterByLinkTo(targetElement: ContentElement): ZitrusmixCollection {
        return targetElement.getIncomingLinks().getSourceElements();
    }

    find(predicate: ContentElementPredicate): ContentElement | undefined {
        let contentElement;

        for(const element of this.values()) {
            if (predicate(element)) {
                contentElement = element;
                break;
            }
        }

        return contentElement;
    }

    forEach(elementCallbackFunc: (value: ContentElement, key: ElementURI, collection: ZitrusmixCollection) => void): void {
        for(const element of this.values()) {
            elementCallbackFunc(element, element.uri, this);
        }
    }

    has(elementURI: ElementURI): boolean {
        return this.#elementURIs.has(elementURI);
    }

    linkTo(elements: MaybeArray<ContentElement>, relationship?: Relationship): void {
        for(const element of this.values()) {
            const targets = ensureArray(elements).map(element => element.uri);
            this.#mix.addLink(element.uri, targets, relationship);
        }
    }

    use<TOptions>(plugin: ZitrusmixPlugin<TOptions>): Promise<void> | void {
        pluginLock.lock();

        let returnPromise;

        if (plugin.process) {
            const context = new PluginContext(this.#mix, this, plugin.options);
            returnPromise = plugin.process(context);
        }

        if (plugin.forEach) {
            for(const element of this.values()) {
                plugin.forEach(element, plugin.options || {});
            }
        }

        pluginLock.unlock(returnPromise);

        return returnPromise || Promise.resolve();
    }

    sort<T>(compare: CompareFunc<ContentElement>): ZitrusmixCollection {
        const sortedElements = Array.from(this.values()).sort((a, b) => {
            return compare(a, b)
        });

        return new ZitrusmixCollection(this.#mix, sortedElements.map(element => element.uri));
    }

    keys(): IterableIterator<ElementURI> {
        return this.#elementURIs.keys();
    }

    *values(): IterableIterator<ContentElement> {
        for(const uri of this.#elementURIs) {
            yield this.#mix.get(uri);
        }
    }

    [Symbol.iterator](): IterableIterator<ContentElement> {
        return this.values();
    }
}
