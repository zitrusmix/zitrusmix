import {Link} from './Link';
import {Zitrusmix} from '../Zitrusmix';
import {ZitrusmixPlugin} from '../interfaces/ZitrusmixPlugin';
import {ZitrusmixCollection} from '../ZitrusmixCollection';
import {ElementURI} from '../types/ElementURI';
import {JSONString} from "../types/JSONString";

export class LinkCollection {
    readonly links: Set<Link>;
    readonly mix: Zitrusmix;

    constructor(mix: Zitrusmix, links?: Array<Link>) {
        this.links = new Set(links || []);
        this.mix = mix;
    }

    add(link: Link) {
        this.links.add(link)
    }

    delete(link: Link)  {
        this.links.delete(link);
    }

    clear() {
        this.links.clear();
    }

    entries() {
        return this.links.entries();
    }

    forEach(callback: (link: Link) => void) {
        this.links.forEach(callback);
    }

    has(link: Link) {
        this.links.has(link);
    }

    values() {
        return this.links.values();
    }

    map<T>(callback: (link: Link) => T): Array<T> {
        const result : Array<T> = [];

        for(const link of this.links) {
            result.push(callback(link));
        }

        return result;
    }

    use<T>(plugin: ZitrusmixPlugin<T>) {
        return this.getTargetElements().use(plugin);
    }

    getTargetElements() {
        const targetElements = this.getTargets().map(uri => this.mix.get(uri));

        return new ZitrusmixCollection(this.mix, targetElements)
    }

    getTargets(): Array<ElementURI> {
        return this.map(link => link.targets).flat();
    }

    toJSON(): object {
        return [...this.values()];
    }

    [Symbol.iterator](): IterableIterator<Link> {
        return this.links.values();
    }
}
