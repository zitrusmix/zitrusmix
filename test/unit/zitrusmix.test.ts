import {expect} from 'chai';
import 'mocha';
import {PluginContext, Zitrusmix} from '../../lib';
import {ZitrusmixPlugin} from '../../lib/interfaces/ZitrusmixPlugin';
import {AssertionError} from 'assert';

function assertIsPluginContext(obj: any): asserts obj is PluginContext {
    if (!obj) {
        throw new AssertionError({message: 'Unexpect null value'});
    }
}

describe('Zitrusmix()', function () {
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

    describe('use()', function() {
        it('uses plugin with update callback on element', function() {
            // Given
            const mix = new Zitrusmix();
            mix.add('test/123', {text: 'foo'});

            // When
            const plugin = {
                update: element => element.update({text: 'foo2'})
            } as ZitrusmixPlugin;
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
                call: (context: PluginContext): void => {
                    pluginContext = context;
                    pluginContext.mix.get('test');
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

