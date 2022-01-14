import { task } from 'hardhat/config';
import { deployGohm } from '../../helpers/contracts-deployments';
import {
  getSohm,
} from '../../helpers/contracts-getters';

import { getEthersSigners } from '../../helpers/contracts-helpers';

task('dao:gohm', 'Deploy gOHM for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    console.log('deploying gOHM...');
    const migrator = await (await getEthersSigners())[0].getAddress();
    const sOHM = await getSohm();

    await deployGohm([migrator, sOHM.address], verify);
  });
