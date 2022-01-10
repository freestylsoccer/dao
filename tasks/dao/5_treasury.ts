import { task } from 'hardhat/config';
import { deployTreasury } from '../../helpers/contracts-deployments';
import {
  getOlympusAuthority,
  getOhm,
  getSohm,
} from '../../helpers/contracts-getters';

task('dao:treasury', 'Deploy treasury for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    console.log('deploying olympus treasury...');

    const olympusAuthority = await getOlympusAuthority();
    const TREASURY_TIMELOCK = "0";
    const ohm = await getOhm();
    const sOhm = await getSohm();

    await deployTreasury([ohm.address, TREASURY_TIMELOCK, olympusAuthority.address], verify);
  });

