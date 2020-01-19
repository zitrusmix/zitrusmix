import {ElementURI} from "./types/ElementURI";
import {Link} from "./Link";
import {LinkCollection} from "./LinkCollection";
import {Zitrusmix} from "./Zitrusmix";

export class LinkStorage {
    private readonly sourceMap: Map<ElementURI, LinkCollection>;
    private readonly targetMap: Map<ElementURI, LinkCollection>;
    private readonly mix: Zitrusmix;

    constructor(mix: Zitrusmix) {
        this.mix = mix;
        this.sourceMap = new Map();
        this.targetMap = new Map();
    }

    add(link: Link) {
        const sourceLinkCollection = this.sourceMap.get(link.source) || new LinkCollection(this.mix);
        sourceLinkCollection.add(link);
        this.sourceMap.set(link.source, sourceLinkCollection);

        link.targets.forEach(target => {
            const targetLinkCollection = this.targetMap.get(target) || new LinkCollection(this.mix);
            targetLinkCollection.add(link);
            this.targetMap.set(link.source, sourceLinkCollection);
        });
    }

    getOutgoingLinks(uri: ElementURI): LinkCollection {
        return this.sourceMap.get(uri) || new LinkCollection(this.mix);
    }

    getIncomingLinks(uri: ElementURI) {
        return this.targetMap.get(uri) || new LinkCollection(this.mix);
    }

    delete(link: Link) {
        const sourceLinkCollection = this.sourceMap.get(link.source) || new LinkCollection(this.mix);
        sourceLinkCollection.delete(link);

        link.targets.forEach(target => {
            const targetLinkCollection = this.targetMap.get(target) || new LinkCollection(this.mix);
            targetLinkCollection.delete(link);
        });
    }

    removeElement(uri: ElementURI) {
        this.removeOutgoingLinks(uri);
        this.removeIncomingLinks(uri);
    }

    removeIncomingLinks(uri: ElementURI) {
        const linkCollection = this.targetMap.get(uri) || new LinkCollection(this.mix);
        this.targetMap.delete(uri);

        linkCollection.forEach(link => {
            const sourceLinkCollection = this.sourceMap.get(link.source) || new LinkCollection(this.mix);

            const updatedLink = new Link(link.source, link.targets.filter(target => target === uri), link.relationship, link.attributes);
            sourceLinkCollection.delete(link);
            sourceLinkCollection.add(updatedLink);
        });
    }

    removeOutgoingLinks(uri: ElementURI) {
        const sourceLinkCollection = this.sourceMap.get(uri) || new LinkCollection(this.mix);

        sourceLinkCollection.forEach(link => {
            for(const target of sourceLinkCollection.getTargets()) {
                const targetLinkCollection = this.targetMap.get(target) || new LinkCollection(this.mix);
                targetLinkCollection.delete(link);
            }
        });
    }

    values(): LinkCollection {
        const allLinks: Array<Link> = [];

        for(const linkCollection of this.sourceMap.values()) {
            for(const link of linkCollection.values()) {
                allLinks.push(link);
            }
        }

        return new LinkCollection(this.mix, allLinks);
    }

    clear() {
        this.sourceMap.clear();
        this.targetMap.clear();
    }

    toJSON(): object {
        return this.values().toJSON();
    }
}
