import { task } from 'hardhat/config';
import { deployAuthority } from '../../helpers/contracts-deployments';
import { getEthersSigners } from '../../helpers/contracts-helpers';

task('dao:deploy-authority', 'Deploy authority for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    console.log('deploying authority...');
    const governor = await (await getEthersSigners())[0].getAddress();
    const guardian = await (await getEthersSigners())[0].getAddress();
    const policy = await (await getEthersSigners())[0].getAddress();
    const vault = await (await getEthersSigners())[0].getAddress();

    await deployAuthority([governor, guardian, policy, vault], verify);
  });
