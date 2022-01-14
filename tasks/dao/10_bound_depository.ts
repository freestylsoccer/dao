import { task } from 'hardhat/config';
import { deployBoundDepositoryV2 } from '../../helpers/contracts-deployments';
import { waitForTx } from '../../helpers/misc-utils';

import {
  getOhm,
  getGohm,
  getOlympusStaking,
  getOlympusAuthority,
  getOlympusTreasury,
} from '../../helpers/contracts-getters';
import { BigNumberish } from 'ethers';
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';

task('dao:bounddepository', 'Deploy Bound Depository for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    console.log('deploying bound depository...');

    const olympusTreasury = await getOlympusTreasury();
    const ohm = await getOhm();
    const gOhm = await getGohm();
    const olympusStaking = await getOlympusStaking();
    const olympusAuthority = await getOlympusAuthority();


    const boundDepositoryV2 = await deployBoundDepositoryV2(
      [
        olympusAuthority.address,
        ohm.address,
        gOhm.address,
        olympusStaking.address,
        olympusTreasury.address,

      ],
      verify);
  });

