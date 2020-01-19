import {Zitrusmix} from "./Zitrusmix";
import {ZitrusmixPlugin} from "./interfaces/ZitrusmixPlugin";
import {ContentElement} from "./core/ContentElement";
import {PluginContext} from "./plugin/PluginContext";
import {ElementURI} from "./types/ElementURI";
import {Link} from "./core/Link";
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

    use<TOptions>(plugin: ZitrusmixPlugin<TOptions>) {
        if (plugin.call) {
            const context = new PluginContext(this.mix, this, plugin.options);
            plugin.call(context)
        }

        if (plugin.update) {
            const updateFunc = plugin.update;
            this.elements.forEach(element => {
                const updatedElement = updateFunc(element, plugin.options);
                this.mix.update(updatedElement.uri, updatedElement.content);
            });
        }

        return ;
    }

    update(updateElementFunc: (element: ContentElement) => ContentElement) {
        this.elements.forEach(element => {
            const updatedElement = updateElementFunc(element);
            this.mix.update(updatedElement.uri, updatedElement.content);
        });
    }

    sort<T>(compare:CompareFunc<ContentElement>) {
        const sortedCollection = new ZitrusmixCollection(this.mix, this.elements);

        sortedCollection.elements.sort((a, b) => {
            return compare(a, b)
        });

        return sortedCollection;
    }

    linkTo(elements: MaybeArray<ContentElement>, relationship: string, attributes?: Map<string, any>) {
        this.elements.forEach(element => {
            const targets = ensureArray(elements).map(element => element.uri);
            this.mix.addLink(element.uri, targets, relationship, attributes);
        });
    }

    filter(predicate: ContentElementPredicate) {
        const elements = this.elements.filter(element => predicate(element.content, element));

        return new ZitrusmixCollection(this.mix, elements);
    }

    filterByLinkTo(targetElement: ContentElement) {
        return new ZitrusmixCollection(this.mix, this.elements);
    }

    find(predicate: ContentElementPredicate) {
        return this.elements.find(element => predicate(element.content, element));
    }
}
