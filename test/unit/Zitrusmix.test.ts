import {expect} from 'chai';
import 'mocha';
import {PluginContext, Zitrusmix} from '../../lib';
import {ZitrusmixPlugin} from '../../lib/plugin/ZitrusmixPlugin';
import {AssertionError} from 'assert';

function assertIsPluginContext(obj: any): asserts obj is PluginContext {
    if (!obj) {
        throw new AssertionError({message: 'Unexpect null value'});
    }
}

describe('Zitrusmix', function () {
    describe('add()', function () {
        it('adds content', function () {
            // Given
            const mix = new Zitrusmix();

            // When
            mix.add('test/123', {text: 'foo'});

            // Then
            expect(mix.get('test/123')).to.deep.equal({text: 'foo'});
        });

        it('throws an error when uri is not valid', function() {
            // Given
            const mix = new Zitrusmix();

            // When
            // Then
            expect(() => {
                mix.add(':::not_valid:::', {text: 'foo'});
            }).to.throw();
        });
    });

    describe('all()', function() {
        it('returns a ZitrusmixCollection with all elments', function() {
            // Given
            const mix = new Zitrusmix();
            mix.add('/city/vienna');
            mix.add('/city/bolzano');

            // When
            const allElements = mix.all();

            // Then
            const expectedEntries = [
                ['/city/vienna', {}],
                ['/city/bolzano', {}],
            ];
            expect(Array.from(allElements.entries())).to.deep.equal(expectedEntries);
        });
    });

    describe('clear()', function() {
        it('removes all elements', function() {
            // Given
            const mix = new Zitrusmix();
            mix.add('/city/vienna');
            mix.add('/city/bolzano');

            // When
            mix.clear();

            // Then
            expect(Array.from(mix.values())).to.deep.equal([]);
        });

        it('removes all links', function() {
            // Given
            const mix = new Zitrusmix();
            const vienna = mix.add('/city/vienna');
            const bolzano = mix.add('/city/bolzano');
            vienna.linkToElements(bolzano);

            // When
            mix.clear();

            // Then
            expect(Array.from(mix.links.values())).to.deep.equal([]);
        });
    });

    describe('use()', function() {
        it('uses plugin with update callback on element', function() {
            // Given
            const mix = new Zitrusmix();
            mix.add('test/123', {text: 'foo'});

            // When
            const plugin = {
                forEach: (element): void => element.update({text: 'foo2'})
            };
            mix.use(plugin);

            // Then
            expect(mix.get('test/123')).to.deep.equal({text: 'foo2'});
        });

        it('uses plugin with context', async function() {
            // Given
            const mix = new Zitrusmix();
            mix.add('test/123', {text: 'foo'});

            // When
            let pluginContext: any = null;

            const plugin: ZitrusmixPlugin = {
                process: (context: PluginContext): void => {
                    pluginContext = context;
                    pluginContext.mix.get('test/123');
                }
            };
            await mix.use(plugin);

            // Then
            assertIsPluginContext(pluginContext);
            if (pluginContext) {
                expect(pluginContext.mix).be.equal(mix);
            }
        });
    });
});

