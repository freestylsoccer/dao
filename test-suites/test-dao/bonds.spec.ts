import { TestEnv, makeSuite } from './helpers/make-suite';
import { ZERO_ADDRESS } from '../../helpers/constants';
import { ProtocolErrors } from '../../helpers/types';

const { expect } = require('chai');

makeSuite('Bonds', (testEnv: TestEnv) => {
  it('Checks the bond depository functions', async () => {
    const { boundDepository, autority } = testEnv;

    const autorityAddress = await boundDepository.authority();

    expect(autorityAddress.toString()).to.be.equal(
      autority.address,
      ' Invalid authority address'
    );
  });
});
