import {Zitrusmix} from "./Zitrusmix";
import {ZitrusmixPlugin} from "./interfaces/ZitrusmixPlugin";
import {ContentElement} from "./content/ContentElement";
import {PluginContext} from "./plugin/PluginContext";

export class ZitrusmixCollection {
    private readonly mix: Zitrusmix;

    readonly elements: Array<ContentElement>;

    constructor(mix: Zitrusmix, elements?: Array<ContentElement>) {
        this.mix = mix;
        this.elements = elements || [];
    }

    use<TOptions>(plugin: ZitrusmixPlugin<TOptions>) {
        const context = new PluginContext(this.mix, this, plugin.options);
        return plugin.call(context);
    }

    update(updateElementFunc: (element: ContentElement) => ContentElement) {
        this.elements.forEach(element => {
            const updatedElement = updateElementFunc(element);
            this.mix.updateContent(updatedElement.id, updatedElement.content);
        })
    }
}
