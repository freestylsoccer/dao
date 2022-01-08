import { task } from 'hardhat/config';
import { deploySohm } from '../../helpers/contracts-deployments';

task('dao:sohm', 'Deploy sOHM for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    console.log('deploying sOHM...');

    await deploySohm(verify);
  });
