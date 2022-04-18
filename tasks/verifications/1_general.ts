import { task } from 'hardhat/config';
import {
  ConfigNames,
} from '../../helpers/configuration';
import { getEthersSigners } from '../../helpers/contracts-helpers';
import {
  getGohm,
  getOhm,
  getOlympusAuthority,
  getOlympusBondDepositoryV2,
  getOlympusStaking,
  getOlympusStakingDistributor,
  getOlympusTreasury,
  getSohm,
} from '../../helpers/contracts-getters';
import { verifyContract } from '../../helpers/contracts-helpers';
import { eContractid } from '../../helpers/types';

task('verify:general', 'Verify contracts at Etherscan')
  .addFlag('all', 'Verify all contracts at Etherscan')
  .addParam('pool', `Pool name to retrieve configuration, supported: ${Object.values(ConfigNames)}`)
  .setAction(async ({ all, pool }, localDRE) => {
    await localDRE.run('set-DRE');

    const TREASURY_TIMELOCK = "0";
    const EPOCH_LENGTH_IN_BLOCKS = "43200";
    const FIRST_EPOCH_NUMBER = "1";
    const FIRST_EPOCH_TIME = "1649785207";

    const deployer = await (await getEthersSigners())[0].getAddress();
    const olympusAuthority = await getOlympusAuthority();

    const sOhm = await getSohm();
    const gOhm = await getGohm();
    const ohm = await getOhm();
    const treasury = await getOlympusTreasury();
    const staking = await getOlympusStaking();
    const bondDepository = await getOlympusBondDepositoryV2();
    const stakingdistrib = await getOlympusStakingDistributor()
/*
    // Olympus Authority
    console.log('\n- Verifying  Olympus Authority...\n');
    await verifyContract(
      eContractid.OlympusAuthority,
      olympusAuthority,
      [deployer, deployer, deployer, deployer]
    );

    // sOHM
    console.log('\n- Verifying  sOHM...\n');
    await verifyContract(
      eContractid.SOlympus,
      sOhm,
      []
    );


    // gOHM
    console.log('\n- Verifying  gOHM...\n');
    await verifyContract(
      eContractid.GOHM,
      gOhm,
      [deployer, sOhm.address]
    );

    // OHM
    console.log('\n- Verifying  OHM...\n');
    await verifyContract(
      eContractid.OlympusERC20Token,
      ohm,
      [olympusAuthority.address]
    );

    // treasury
    console.log('\n- Verifying  Olympus Treasury...\n');
    await verifyContract(
      eContractid.OlympusTreasury,
      treasury,
      [ohm.address, TREASURY_TIMELOCK, olympusAuthority.address]
    );
*/
    // staking
    console.log('\n- Verifying  Olympus Staking...\n');
    await verifyContract(
      eContractid.OlympusStaking,
      staking,
      [
        ohm.address,
        sOhm.address,
        gOhm.address,
        EPOCH_LENGTH_IN_BLOCKS,
        FIRST_EPOCH_NUMBER,
        FIRST_EPOCH_TIME,
        olympusAuthority.address
      ]
    );
/*
    // staking distributor
    console.log('\n- Verifying  Staking Distributor...\n');
    await verifyContract(
      eContractid.Distributor,
      stakingdistrib,
      [
        treasury.address,
        ohm.address,
        staking.address,
        olympusAuthority.address
      ]
    );

    // bond depository
    console.log('\n- Verifying  Bond Depository...\n');
    await verifyContract(
      eContractid.BoundDepositoryV2,
      bondDepository,
      [
        olympusAuthority.address,
        ohm.address,
        gOhm.address,
        staking.address,
        treasury.address
      ]
    );
*/
    console.log('Finished verifications.');
  });
