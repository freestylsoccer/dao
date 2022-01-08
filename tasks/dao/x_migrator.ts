import { task } from 'hardhat/config';
import { deployAuthority, deployMigrator } from '../../helpers/contracts-deployments';
import {
  getOlympusAuthority,
} from '../../helpers/contracts-getters';

import { ZERO_ADDRESS } from '../../helpers/constants';
import { getEthersSigners } from '../../helpers/contracts-helpers';

task('dao:deploy-migrator', 'Deploy migrator for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    console.log('deploying olympus migrator...');

    const oldOHM = ZERO_ADDRESS;
    const oldsOHM = ZERO_ADDRESS;
    const oldStaking = ZERO_ADDRESS;
    const oldwsOHM = ZERO_ADDRESS;
    const sushiRouter = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
    const uniRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const oldTreasury = await (await getEthersSigners())[0].getAddress();

    const olympusAuthority = await getOlympusAuthority();

    await deployMigrator(
      [
        oldOHM,
        oldsOHM,
        oldTreasury,
        oldStaking,
        oldwsOHM,
        sushiRouter,
        uniRouter,
        "0",
        olympusAuthority.address
      ], verify);
  });
