import { task } from 'hardhat/config';
import { deployStaking } from '../../helpers/contracts-deployments';
import {
  getOhm,
  getSohm,
  getGohm,
  getOlympusAuthority,
} from '../../helpers/contracts-getters';

task('dao:staking', 'Deploy Olympus Staking for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    console.log('deploying olympus staking...');

    const ohm = await getOhm();
    const sOhm = await getSohm();
    const gOhm = await getGohm();
    const olympusAuthority = await getOlympusAuthority();

    const EPOCH_LENGTH_IN_BLOCKS = "1000";
    const FIRST_EPOCH_NUMBER = "767";
    const FIRST_EPOCH_TIME = "1639430907";

    await deployStaking(
      [
        ohm.address,
        sOhm.address,
        gOhm.address,
        EPOCH_LENGTH_IN_BLOCKS,
        FIRST_EPOCH_NUMBER,
        FIRST_EPOCH_TIME,
        olympusAuthority.address
      ],
      verify);
  });

