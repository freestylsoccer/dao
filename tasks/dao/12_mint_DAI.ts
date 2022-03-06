import { task } from 'hardhat/config';
import { getMockDai } from '../../helpers/contracts-getters';

task('dao:mint-dai', 'Mint DAI.')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');

    const mockDai = await getMockDai();

    await mockDai.mint("0x2e55589e69Adf04f89eA0E86EFB8734FC29d6e46", "0xD3C21BCECCEDA1000000");
  });
