import {expect} from 'chai';
import 'mocha';
import {Zitrusmix} from '../../lib';
import {ZitrusmixError} from "../../lib/guards/ZitrusmixError";
import {callAndCatch} from "../utils/callAndCatch";

const asnycPlugin = {
    call: (): Promise<any> => Promise.resolve()
};

describe('ZitrusmixCollection()', function () {
    describe('use()', () => {
        it('throws an error when using a plugin before the previous plugin promise was resolved', () => {
            // Given
            const mix = new Zitrusmix();

            // When
            const error = callAndCatch(() => {
                mix.use(asnycPlugin);
                mix.use(asnycPlugin);
            });

            // Then
            const expectedError = new ZitrusmixError('plugin-lock-error', 'Only one plugin can run at the same time. Please await until a plugin is resolved before using another plugin.');
            expect(error && error.message).to.equal(expectedError.message);
        });
    });
});
