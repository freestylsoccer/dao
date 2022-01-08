import { task } from 'hardhat/config';
import { deployOhm } from '../../helpers/contracts-deployments';
import {
  getOlympusAuthority,
} from '../../helpers/contracts-getters';

task('dao:ohm', 'Deploy OHM for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    console.log('deploying OHM...');
    const olympusAuthority = await getOlympusAuthority();

    await deployOhm([olympusAuthority.address], verify);
  });
