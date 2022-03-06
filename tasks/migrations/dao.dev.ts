import { task } from 'hardhat/config';
import { checkVerification } from '../../helpers/etherscan-verification';
import { ConfigNames } from '../../helpers/configuration';
import { printContracts } from '../../helpers/misc-utils';

task('dao:dev', 'Deploy DAO development enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {

    await localBRE.run('set-DRE');

    // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
    if (verify) {
      checkVerification();
    }

    console.log('Migration started\n');

    // console.log('1. Deploy Olympus Authority');
    // await localBRE.run('dao:deploy-authority', { verify });

    // console.log('2. Deploy sOHM');
    // await localBRE.run('dao:sohm', { verify });

    // console.log('3. Deploy gOHM');
    // await localBRE.run('dao:gohm', { verify });

    // console.log('4. Deploy OHM');
    // await localBRE.run('dao:ohm', { verify });

    // console.log('5. Deploy Olympus Treasury');
    // await localBRE.run('dao:treasury', { verify: true });

    // console.log('6. Deploy Olympus Bounding Calculator');
    // await localBRE.run('dao:boundingcalc', { verify });

    // console.log('7. Deploy Olympus Staking');
    // await localBRE.run('dao:staking', { verify });

    // console.log('8. Deploy Olympus Staking Distributor');
    // await localBRE.run('dao:stakingdistrib', { verify });

    // console.log('10. Deploy Bound Depository');
    // await localBRE.run('dao:bounddepository', { verify: true });

    // console.log('9. Initialize Contracts');
    // await localBRE.run('dao:initialize', { verify });

    console.log('11. Create Bond');
    await localBRE.run('dao:create', { verify });

    // console.log('12. Mint DAI');
    // await localBRE.run('dao:mint-dai', { verify });

    printContracts();
  });
