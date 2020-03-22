import {expect} from 'chai';
import 'mocha';
import {ContentElement, Zitrusmix, Link, Relationship} from '../../lib';
import {ZitrusmixError} from '../../lib/guards/ZitrusmixError';

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

        it('throws an error when content uses a different URI', function() {
            // Given
            const mix = new Zitrusmix();

            try {
                // When
                new ContentElement('VIE', {uri: 'BZO'}, mix);
            } catch(error) {
                // Then
                const expectedError = new ZitrusmixError('stable-element-uri-error', 'The URI of a <ContentElement> can not be changed.');
                expect(error.message).to.deep.equal(expectedError.message);
            }
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

    describe('linkTo()', function() {
        it('creates a link to another element', function() {
            // Given
            const mix = new Zitrusmix();
            const vienna = new ContentElement('VIE', {name: 'Vienna'}, mix);
            const bolzano = new ContentElement('BZO', {name: 'Bolzano'}, mix);

            // When
            const connectedWithTrain = new Relationship('train');
            vienna.linkTo(bolzano.uri, connectedWithTrain);

            // Then
            const expectedLink = new Link(vienna.uri, [bolzano.uri], connectedWithTrain);
            expect([...mix.getOutgoingLinks(vienna.uri)][0]).to.deep.equal(expectedLink);
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

    describe('clone()', function() {
        it('returns a new instance', function() {
            // Given
            const mix = new Zitrusmix();
            const element = new ContentElement('uri', {name: 'Vienna'}, mix);

            // When
            const clone = element.clone();

            // Then
            expect(clone).not.to.be.equal(element);
            expect(clone.uri).to.be.equal('uri');
        });

        it('returns a new instance with a different URI', function() {
            // Given
            const mix = new Zitrusmix();
            const element = new ContentElement('uri', {name: 'Vienna'}, mix);

            // When
            const clone = element.clone('new-uri');

            // Then
            expect(clone).not.to.be.equal(element);
            expect(clone.uri).to.be.equal('new-uri');
        });
    });
});
