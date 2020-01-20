import {expect} from 'chai';
import 'mocha';
import {Link} from "../lib/Link";
import {LinkCollection} from "../lib/LinkCollection";
import {Zitrusmix} from "../lib/Zitrusmix";

describe('LinkCollection()', function () {
    describe('add()', () => {
        it('adds a linl', () => {
            // Given
            const mix = new Zitrusmix();
            const collection = new LinkCollection(mix);

            // When
            const link = new Link('#1', ['#2']);
            collection.add(link);

            // Then
            expect(collection.has(link)).to.equal(true);
        });
    });
});

