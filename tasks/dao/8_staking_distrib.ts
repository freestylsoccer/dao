import { task } from 'hardhat/config';
import { deployStakingDistributor } from '../../helpers/contracts-deployments';
import {
  getOhm,
  getOlympusStaking,
  getOlympusAuthority,
  getOlympusTreasury,
} from '../../helpers/contracts-getters';

task('dao:stakingdistrib', 'Deploy Olympus Staking Distributor for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    console.log('deploying olympus staking distributor...');

    const olympusTreasury = await getOlympusTreasury();
    const ohm = await getOhm();
    const olympusStaking = await getOlympusStaking();
    const olympusAuthority = await getOlympusAuthority();


    await deployStakingDistributor(
      [
        olympusTreasury.address,
        ohm.address,
        olympusStaking.address,
        olympusAuthority.address
      ],
      verify);
  });

