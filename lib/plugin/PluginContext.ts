import {ZitrusmixCollection} from "../ZitrusmixCollection";
import {Zitrusmix} from "../Zitrusmix";

export class PluginContext<TOptions = null> {
    readonly mix: Zitrusmix;
    readonly collection: ZitrusmixCollection;
    readonly options: TOptions | object;

    constructor(mix: Zitrusmix, collection: ZitrusmixCollection, options?: TOptions) {
        this.mix = mix;
        this.collection = collection;
        this.options = options || {};
    }
}
