import {Zitrusmix} from "./Zitrusmix";
import {ZitrusmixPlugin} from "./interfaces/ZitrusmixPlugin";
import {ContentElement} from "./ContentElement";
import {PluginContext} from "./plugin/PluginContext";
import {CompareFunc} from "./types/CompareFunc";
import {MaybeArray} from "./types/MaybeArray";
import {ensureArray} from "./utils/ensureArray";
import {ContentElementPredicate} from "./interfaces/ContentElementPredicate";

export class ZitrusmixCollection {
    private readonly mix: Zitrusmix;

    readonly elements: Array<ContentElement>;

    constructor(mix: Zitrusmix, elements?: Array<ContentElement>) {
        this.mix = mix;
        this.elements = [...(elements || [])];
    }

    use<TOptions>(plugin: ZitrusmixPlugin<TOptions>): Promise<any> | void {
        let returnPromise;

        if (plugin.call) {
            const context = new PluginContext(this.mix, this, plugin.options);
            returnPromise = plugin.call(context);
        }

        if (plugin.update) {
            const updateFunc = plugin.update;
            this.elements.forEach(element => {
                const updatedElement = updateFunc(element, plugin.options);
                this.mix.update(updatedElement.uri, updatedElement.content);
            });
        }

        return returnPromise || Promise.resolve();
    }

    update(updateElementFunc: (element: ContentElement) => ContentElement): void {
        this.elements.forEach(element => {
            const updatedElement = updateElementFunc(element);
            this.mix.update(updatedElement.uri, updatedElement.content);
        });
    }

    sort<T>(compare: CompareFunc<ContentElement>): ZitrusmixCollection {
        const sortedCollection = new ZitrusmixCollection(this.mix, this.elements);

        sortedCollection.elements.sort((a, b) => {
            return compare(a, b)
        });

        return sortedCollection;
    }

    linkTo(elements: MaybeArray<ContentElement>, relationship: string, attributes?: Map<string, any>): void {
        this.elements.forEach(element => {
            const targets = ensureArray(elements).map(element => element.uri);
            this.mix.addLink(element.uri, targets, relationship, attributes);
        });
    }

    filter(predicate: ContentElementPredicate): ZitrusmixCollection {
        const elements = this.elements.filter(element => predicate(element.content, element));

        return new ZitrusmixCollection(this.mix, elements);
    }

    filterByLinkTo(targetElement: ContentElement): ZitrusmixCollection {
        return targetElement.getIncomingLinks().getSourceElements();
    }

    find(predicate: ContentElementPredicate): ContentElement | undefined {
        return this.elements.find(element => predicate(element.content, element));
    }
}
