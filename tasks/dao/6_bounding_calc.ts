import { task } from 'hardhat/config';
import { deployBoundingCalculator } from '../../helpers/contracts-deployments';
import {
  getOhm,
} from '../../helpers/contracts-getters';

task('dao:boundingcalc', 'Deploy Olympus Bonding Calculator for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    console.log('deploying olympus bonding calculator...');

    const ohm = await getOhm();

    await deployBoundingCalculator([ohm.address], verify);
  });

