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

const pluginLock = new PluginLock();

export class ZitrusmixCollection implements Iterable<ContentElement> {
    #elementURIs: Array<ElementURI>;
    readonly #mix: Zitrusmix;

    constructor(mix: Zitrusmix, elementURIs?: Array<ElementURI>) {
        this.#mix = mix;
        this.#elementURIs = Array.from(elementURIs || []);
    }

    add(elementURI: ElementURI): void {
        if (!this.#mix.has(elementURI)) {
             throw new ZitrusmixError('collection-add-element-missing-error', `No element with URI "${elementURI}" available. Add element to mix before adding it to a collection.`);
        }

        this.#elementURIs.push(elementURI);
    }

    getElements(): Array<ContentElement> {
        return this.#elementURIs.map(this.#mix.get);
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

    forEach(elementCallbackFunc: (element: ContentElement) => void): void {
        for(const element of this.values()) {
            elementCallbackFunc(element);
        }
    }

    sort<T>(compare: CompareFunc<ContentElement>): ZitrusmixCollection {
        const sortedElements = this.getElements().sort((a, b) => {
            return compare(a, b)
        });

        return new ZitrusmixCollection(this.#mix, sortedElements.map(element => element.uri));
    }

    linkTo(elements: MaybeArray<ContentElement>, relationship: string, attributes?: Map<string, any>): void {
        for(const element of this.values()) {
            const targets = ensureArray(elements).map(element => element.uri);
            this.#mix.addLink(element.uri, targets, relationship, attributes);
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

    keys(): Array<ElementURI> {
        return Array.from(this.#elementURIs);
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
