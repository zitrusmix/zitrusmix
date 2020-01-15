import {ZitrusmixOptions} from './ZitrusmixOptions';
import {ContentPool} from './content/ContentPool';
import {ContentElement} from './content/ContentElement';

import {AddContentOperation} from './content/operations/AddContentOperation';
import {UpdateElementOperation} from './content/operations/UpdateElementOperation';
import {ContentElementPredicate} from "./interfaces/ContentElementPredicate";
import {ElementId} from "./types/ElementId";
import {Content} from "./types/Content";
import {ZitrusmixPlugin} from "./interfaces/ZitrusmixPlugin";
import {createId} from "./utils/createId";
import {ZitrusmixCollection} from "./ZitrusmixCollection";

export class Zitrusmix {
    private readonly options : ZitrusmixOptions;
    private readonly contentPool: ContentPool;

    constructor(options?: Partial<ZitrusmixOptions>) {
        this.options = Object.assign(new ZitrusmixOptions(), options || {});
        this.contentPool = this.options.contentPool;
    }

    /**
     * Returns a readonly list of all elements.
     */
    get elements(): Array<ContentElement> {
         return this.contentPool.elements;
    }

    all() {
        return new ZitrusmixCollection(this, this.contentPool.elements);
    }

    use<T>(plugin: ZitrusmixPlugin<T>) {
        return this.all().use(plugin);
    }

    addContent(content: Content) {
        const newElement = new ContentElement(createId(), content);
        return this.contentPool.addContent(new AddContentOperation(newElement));
    }

    update(element: ContentElement) {
        const operation = new UpdateElementOperation(element.id, element.content);
        this.contentPool.updateContent(operation);
    }

    updateContent(contentId: ElementId, content: Content) {
        const element = this.contentPool.getElementById(contentId);

        if (element) {
            const operation = new UpdateElementOperation(contentId, content);
            this.contentPool.updateContent(operation);
        } else {
            throw new Error(`Zitrusmix.updateContent(contentId: "${contentId}", ...): No element with given "contentId" found.`);
        }
    }

    filter(predicate: ContentElementPredicate<ContentElement>) {
        const elements = this.elements.filter(predicate);

        return new ZitrusmixCollection(this, elements);
    }

    // /**
    //  * @param {({match: (expression:string) => boolean}) | string | ((expression:string) => boolean)} expression
    //  */
    // match(expression) {
    //     /**
    //      * @type {{match: (expression:string) => boolean}}
    //      */
    //     let matcher = {match: () => true};
    //
    //     if (typeof expression === 'string') {
    //         const createMatcher = this.options.createMatcher;
    //
    //         if (createMatcher) {
    //             matcher = createMatcher(expression);
    //         } else {
    //             // TODO
    //             // throw error
    //         }
    //     } else if (typeof expression === 'function') {
    //        matcher = {match: expression};
    //     } else {
    //         matcher = expression;
    //     }
    //
    //     const options = new ZitrusmixOptions({
    //         contentPool: this.contentPool,
    //         createMatcher: this.options.createMatcher
    //     });
    //
    //     return new Zitrusmix(options);
    // }

    // /**
    //  * @param {function(ContentElement):string} callback
    //  * @returns {Map<string, !Array<ContentElement>>}
    //  */
    // groupBy(callback) {
    //     /**
    //      * @type {Map<string, !Array<ContentElement>>}
    //      */
    //     const groups = new Map();
    //
    //     this.contentPool.elements.forEach(element => {
    //         const groupId = callback(element);
    //         const group = groups.get(groupId);
    //
    //         if (group) {
    //             group.push(element);
    //         } else {
    //             groups.set(groupId, [element]);
    //         }
    //     });
    //
    //     return groups;
    // }

    forEach(callback: (element: ContentElement) => void) {
        this.contentPool.elements.forEach(callback);
    }

}
