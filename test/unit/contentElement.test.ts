import {expect} from 'chai';
import 'mocha';
import {ContentElement, Zitrusmix} from '../../lib';
import {Link} from "../../lib/Link";

describe('ContentElement', function () {
    describe('constructor()', function () {
        it('creates a content element', function () {
            // Given
            const mix = new Zitrusmix();

            // When
            const element = new ContentElement('VIE', {name: 'Vienna'}, mix);

            // Then
            expect(element.name).to.equal('Vienna');
        });

        it('throws an error when content contains a different URI', function() {
            // Given
            const mix = new Zitrusmix();

            // When
            const when = (): ContentElement => new ContentElement('VIE', {uri: 'BZO'}, mix);

            // Then
            expect(when).to.throw('Content URI must be undefined, null or equal to element URI.');
        });
    });

    describe('patch()', function() {
        it('patches the content element', function() {
            // Given
            const mix = new Zitrusmix();
            const element = new ContentElement('VIE', {name: 'Vienna'}, mix);

            // When
            element.patch({country: 'Austria'});

            // Then
            const expectedElement = {
                name: 'Vienna',
                country: 'Austria'
            };
            expect(mix.get('VIE')).to.deep.equal(expectedElement);
        });

        it('patches the current element instance', function() {
            // Given
            const mix = new Zitrusmix();
            const element = new ContentElement('VIE', {name: 'Vienna'}, mix);

            // When
            element.patch({country: 'Austria'});

            // Then
            const expectedElement = {
                name: 'Vienna',
                country: 'Austria'
            };
            expect(element).to.deep.equal(expectedElement);
        });

        it('returns the patched content element', function() {
            // Given
            const mix = new Zitrusmix();
            const element = new ContentElement('VIE', {name: 'Vienna'}, mix);

            // When
            const patchedElement = element.patch({country: 'Austria'});

            // Then
            const expectedElement = {
                name: 'Vienna',
                country: 'Austria'
            };
            expect(patchedElement).to.deep.equal(expectedElement);
        });

        it('uses a shallow patch strategy', function() {
            // Given
            const mix = new Zitrusmix();
            const element = new ContentElement('VIE', {name: {en: 'Vienna'}}, mix);

            // When
            element.patch({name: {de: 'Wien'}});

            // Then
            const expectedElement = {
                name: {
                    de: 'Wien'
                },
            };
            expect(element).to.deep.equal(expectedElement);
        });
    });

    describe('update()', function() {
        it('updates the content element', function() {
            // Given
            const mix = new Zitrusmix();
            const element = new ContentElement('VIE', {name: 'Vienna'}, mix);

            // When
            element.update({country: 'Austria'});

            // Then
            const expectedElement = {
                country: 'Austria'
            };
            expect(mix.get('VIE')).to.deep.equal(expectedElement);
        });

        it('updates the current element instance', function() {
            // Given
            const mix = new Zitrusmix();
            const element = new ContentElement('VIE', {name: 'Vienna'}, mix);

            // When
            element.update({country: 'Austria'});

            // Then
            const expectedElement = {
                country: 'Austria'
            };
            expect(element).to.deep.equal(expectedElement);
        });

        it('returns the updated content element', function() {
            // Given
            const mix = new Zitrusmix();
            const element = new ContentElement('VIE', {name: 'Vienna'}, mix);

            // When
            const updatedElement = element.update({country: 'Austria'});

            // Then
            const expectedElement = {
                country: 'Austria'
            };
            expect(updatedElement).to.deep.equal(expectedElement);
        });
    });

    describe('addLinkTo()', function() {
        it('creates a link to another element', function() {
            // Given
            const mix = new Zitrusmix();
            const vienna = new ContentElement('VIE', {name: 'Vienna'}, mix);
            const bolzano = new ContentElement('BZO', {name: 'Bolzano'}, mix);

            // When
            vienna.addLinkTo(bolzano.uri, 'train');

            // Then
            const expectedLink = new Link(vienna.uri, [bolzano.uri], 'train');
            expect(mix.getOutgoingLinks(vienna.uri).values().next().value).to.deep.equal(expectedLink);
        });
    });

    describe('toJSON()', function () {
        it('returns a serializeable object', function () {
            // Given
            const mix = new Zitrusmix();
            const element = new ContentElement('uri', {name: 'Vienna'}, mix);

            // When
            const serializeable = element.toJSON();

            // Then
            const expectedObject = {
                uri: 'uri',
                name: 'Vienna'
            };
            expect(serializeable).to.deep.equal(expectedObject);
        });
    });
});
