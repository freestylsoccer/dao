import { task } from 'hardhat/config';
import { deployGohm } from '../../helpers/contracts-deployments';
import {
  getSohm,
} from '../../helpers/contracts-getters';

import { ZERO_ADDRESS } from '../../helpers/constants';

task('dao:gohm', 'Deploy gOHM for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    console.log('deploying gOHM...');
    const migrator = ZERO_ADDRESS;
    const sOHM = await getSohm();

    await deployGohm([migrator, sOHM.address], verify);
  });
