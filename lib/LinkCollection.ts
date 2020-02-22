import {Link} from './Link';
import {Zitrusmix} from './Zitrusmix';
import {ZitrusmixPlugin} from './plugin/ZitrusmixPlugin';
import {ZitrusmixCollection} from './ZitrusmixCollection';
import {ElementURI} from './types/ElementURI';

export class LinkCollection implements Iterable<Link>{
    readonly links: Set<Link>;
    readonly mix: Zitrusmix;

    constructor(mix: Zitrusmix, links?: Array<Link>) {
        this.links = new Set(links || []);
        this.mix = mix;
    }

    add(link: Link): void {
        this.links.add(link)
    }

    delete(link: Link): void  {
        this.links.delete(link);
    }

    clear(): void {
        this.links.clear();
    }

    entries(): Iterable<[Link, Link]> {
        return this.links.entries();
    }

    forEach(callback: (link: Link) => void): void {
        this.links.forEach(callback);
    }

    has(link: Link): boolean {
        return this.links.has(link);
    }

    values(): IterableIterator<Link> {
        return this.links.values();
    }

    map<T>(callback: (link: Link) => T): Array<T> {
        const result: Array<T> = [];

        for(const link of this.links) {
            result.push(callback(link));
        }

        return result;
    }

    use<T>(plugin: ZitrusmixPlugin<T>): Promise<void> | void {
        return this.getTargetElements().use(plugin);
    }

    getSourceElements(): ZitrusmixCollection {
        return new ZitrusmixCollection(this.mix,  this.getSources())
    }

    getTargetElements(): ZitrusmixCollection {
        return new ZitrusmixCollection(this.mix, this.getTargets())
    }

    getSources(): Array<ElementURI> {
        return this.map(link => link.source);
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
