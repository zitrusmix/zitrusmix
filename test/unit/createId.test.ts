import {createId} from '../../lib/utils/createId';
import {expect} from 'chai';
import 'mocha';

describe('createId()', function() {
    it('returns 1', () => {
        // When
        const id = createId();

        // Then
        expect(id).to.equal('1');
    });

    it('returns different ID', () => {
        // Given
        const previousId = createId();

        // When
        const id = createId();

        // Then
        expect(id).not.to.equal(previousId);
    });
});

