import {ZitrusmixCollection} from "../ZitrusmixCollection";
import {Zitrusmix} from "../Zitrusmix";

export class PluginContext<TOptions = null> {
    readonly mix: Zitrusmix;
    readonly collection: ZitrusmixCollection;
    readonly options: TOptions | null;

    constructor(mix: Zitrusmix, collection: ZitrusmixCollection, options?: TOptions | null) {
        this.mix = mix;
        this.collection = collection;
        this.options = options || null;
    }
}
