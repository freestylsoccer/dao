import rawBRE from 'hardhat';
import {
  getEthersSigners,
} from '../../helpers/contracts-helpers';
import {
  deployAuthority,
  deploySohm,
  deployGohm,
  deployOhm,
  deployTreasury,
  deployBoundingCalculator,
  deployStaking,
  deployStakingDistributor,
  deployBoundDepositoryV2,
} from '../../helpers/contracts-deployments';
import { Signer } from 'ethers';
import { initializeMakeSuite } from './helpers/make-suite';
import { DRE, waitForTx } from '../../helpers/misc-utils';
import { ZERO_ADDRESS } from '../../helpers/constants';


const buildTestEnv = async (deployer: Signer, secondaryWallet: Signer) => {
  console.time('setup');

  const master = await deployer.getAddress();

  // olympus authority
  const olympusAuthority = await deployAuthority([master, master, master, master], false);

  // delopy sOHM
  const sOHM = await deploySohm();

  // delopy gOHM
  const gOHM = await deployGohm([master, sOHM.address], false);

  // delopy gOHM
  const OHM = await deployOhm([olympusAuthority.address], false);

  // deploy Treasury
  const TREASURY_TIMELOCK = "0";
  const treasury = await deployTreasury([olympusAuthority.address, TREASURY_TIMELOCK, OHM.address], false);

  // deploy Bounding Calculator
  const boundingCalculator = await deployBoundingCalculator([OHM.address], false);

  // deploy olympus staking
  const EPOCH_LENGTH_IN_BLOCKS = "1000";
  const FIRST_EPOCH_NUMBER = "767";
  const FIRST_EPOCH_TIME = "1639430907";
  const olympusStaking = await deployStaking(
    [
      OHM.address,
      sOHM.address,
      gOHM.address,
      EPOCH_LENGTH_IN_BLOCKS,
      FIRST_EPOCH_NUMBER,
      FIRST_EPOCH_TIME,
      olympusAuthority.address
    ], false);

    // deploy staking distributor
  const stakingDistributor = await deployStakingDistributor(
    [
      treasury.address,
      OHM.address,
      olympusStaking.address,
      olympusAuthority.address
    ], false);

  // deploy bound depository
  const boundDepository = await deployBoundDepositoryV2(
    [
      olympusAuthority.address,
      OHM.address,
      gOHM.address,
      olympusStaking.address,
      treasury.address,

    ],
    false);

  // initial configuration
  const INITIAL_INDEX = "45000000000";
  const INITIAL_REWARD_RATE = "4000";
  const BOUNTY_AMOUNT = "100000000";

  // Step 0: Set mint rights from migrator to staking
  await waitForTx(
    await gOHM.migrate(olympusStaking.address, sOHM.address)
  );
  console.log("Setup -- gOhm.migrate: set mint rights to staking");

  // Step 1: Set treasury as vault on authority
  await waitForTx(
    await olympusAuthority.pushVault(treasury.address, true)
  );
  console.log("Setup -- authorityContract.pushVault: set vault on authority");

  // Step 2: Set distributor as minter on treasury
  // Allows distributor to mint ohm.
  await waitForTx(
    await treasury.enable(8, stakingDistributor.address, boundingCalculator.address)
  );
  console.log("Setup -- treasury.enable(8):  distributor enabled to mint ohm on treasury");

  // Step 3: Set distributor on staking
  await waitForTx(
    await olympusStaking.setDistributor(stakingDistributor.address)
  );
  console.log("Setup -- staking.setDistributor:  distributor set on staking");

  // Step 4: Initialize sOHM and set the index
  if ((await sOHM.gOHM()) == ZERO_ADDRESS) {
    await waitForTx(
      await sOHM.setIndex(INITIAL_INDEX)
    ); // TODO
    await waitForTx(
      await sOHM.setgOHM(gOHM.address)
    );
    await waitForTx(
      await sOHM.initialize(olympusStaking.address, treasury.address)
    );
  }
  console.log("Setup -- sohm initialized (index, gohm)");

  // Step 5: Set up distributor with bounty and recipient
  await waitForTx(
    await stakingDistributor.setBounty(BOUNTY_AMOUNT)
  );
  await waitForTx(
    await stakingDistributor.addRecipient(olympusStaking.address, INITIAL_REWARD_RATE)
  );
  console.log("Setup -- distributor.setBounty && distributor.addRecipient");
  console.timeEnd('setup');
};

before(async () => {
  await rawBRE.run('set-DRE');
  const [deployer, secondaryWallet] = await getEthersSigners();

  console.log('-> Deploying test environment...');
  await buildTestEnv(deployer, secondaryWallet);

  // await initializeMakeSuite();
  console.log('\n***************');
  console.log('Setup and snapshot finished');
  console.log('***************\n');
});
