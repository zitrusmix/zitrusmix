import {expect} from 'chai';
import 'mocha';
import {ContentElement, Zitrusmix} from '../../lib';
import {ZitrusmixError} from "../../lib/guards/ZitrusmixError";
import {callAndCatch} from "../utils/callAndCatch";

const asnycPlugin = {
    process: (): Promise<any> => Promise.resolve()
};

describe('ZitrusmixCollection', function () {
    describe('add()', () => {
        it('adds a element URI to the collection', () => {
            // Given
            const mix = new Zitrusmix();
            mix.add('VIE', {name: 'Vienna'});
            const collection = mix.createCollection();

            // When
            collection.add('VIE');

            // Then
            expect([...collection.keys()]).to.deep.equal(['VIE']);
        });

        it('throws an error if element URI does not exist', () => {
            // Given
            const mix = new Zitrusmix();
            const collection = mix.all();

            // When
            const error = callAndCatch(() => collection.add('/city/vie'));

            // Then
            const expectedError = new ZitrusmixError('assert-element-exists', `Expected "ContentElement" does not exist at "/city/vie".`);
            expect(error && error.message).to.deep.equal(expectedError.message);
        });
    });

    describe('clear()', () => {
        it('removes all URIs', () => {
            // Given
            const mix = new Zitrusmix();
            mix.add('VIE', {name: 'Vienna'});
            const collection = mix.all();

            // When
            collection.clear();

            // Then
            expect([...collection.keys()]).to.deep.equal([]);
        });
    });

    describe('use()', () => {
        it('throws an error when using a plugin before the previous plugin promise was resolved', () => {
            // Given
            const mix = new Zitrusmix();
            const collection = mix.all();

            // When
            const error = callAndCatch(() => {
                collection.use(asnycPlugin);
                collection.use(asnycPlugin);
            });

            // Then
            const expectedError = new ZitrusmixError('plugin-lock-error', 'Only one plugin can run at the same time. Please await until a plugin is resolved before using another plugin.');
            expect(error && error.message).to.equal(expectedError.message);
        });
    });

    describe('values()', () => {
        it('is iterable', () => {
            // Given
            const mix = new Zitrusmix();
            const city = {name: 'Vienna'};
            mix.add('VIE', city);
            const collection = mix.all();

            // When
            const allElements: Array<ContentElement> = [];
            for(const element of collection.values()) {
                allElements.push(element);
            }

            // Then
            expect(allElements).to.deep.equal([city]);
        });
    });

    describe('[Symbol.iterator]', () => {
        it('is iterable', () => {
            // Given
            const mix = new Zitrusmix();
            const city = {name: 'Vienna'};
            mix.add('VIE', city);
            const collection = mix.all();

            // When
            const allElements: Array<ContentElement> = [];
            for(const element of collection) {
                allElements.push(element);
            }

            // Then
            expect(allElements).to.deep.equal([city]);
        });
    });

    describe('sort()', () => {
        it('returns a sorted collection', () => {
            // Given
            const mix = new Zitrusmix();
            mix.add('VIE', {name: 'Vienna'});
            mix.add('BZO', {name: 'Bolzano'});

            // When
            const sortFn = (a: ContentElement, b: ContentElement): number => a.name.localeCompare(b.name);
            const sortedCollection = mix.all().sort(sortFn);

            // Then
            const expectedValues = [
                {name: 'Bolzano'},
                {name: 'Vienna'}
            ];
            expect([...sortedCollection.values()]).to.deep.equal(expectedValues);
        });
    });
});
