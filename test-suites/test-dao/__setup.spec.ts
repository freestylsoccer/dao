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
  deployMockDai,
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
  const sOhm = await deploySohm();

  // delopy gOHM
  const gOhm = await deployGohm([master, sOhm.address], false);

  // delopy gOHM
  const OHM = await deployOhm([olympusAuthority.address], false);

  // deploy Treasury
  const TREASURY_TIMELOCK = "0";
  const olympusTreasury = await deployTreasury([OHM.address, TREASURY_TIMELOCK, olympusAuthority.address], false);

  // deploy Bounding Calculator
  const boundingCalculator = await deployBoundingCalculator([OHM.address], false);

  // deploy olympus staking
  const EPOCH_LENGTH_IN_BLOCKS = "100000";
  const FIRST_EPOCH_NUMBER = "767";
  const FIRST_EPOCH_TIME = "1639430907";
  const olympusStaking = await deployStaking(
    [
      OHM.address,
      sOhm.address,
      gOhm.address,
      EPOCH_LENGTH_IN_BLOCKS,
      FIRST_EPOCH_NUMBER,
      FIRST_EPOCH_TIME,
      olympusAuthority.address
    ], false);

    // deploy staking distributor
  const olympusStakingDistributor = await deployStakingDistributor(
    [
      olympusTreasury.address,
      OHM.address,
      olympusStaking.address,
      olympusAuthority.address
    ], false);

  // deploy bound depository
  const boundDepository = await deployBoundDepositoryV2(
    [
      olympusAuthority.address,
      OHM.address,
      gOhm.address,
      olympusStaking.address,
      olympusTreasury.address,

    ],
    false);

  const mockDai = await deployMockDai(["0"], false)
  // initial configuration
  const INITIAL_INDEX = "1000000000";
  const INITIAL_REWARD_RATE = "4000";
  const BOUNTY_AMOUNT = "100000000";


  // Step 0: Set mint rights from migrator to staking
  await waitForTx(
    await gOhm.migrate(olympusStaking.address, sOhm.address)
  );
  console.log("Setup -- gOhm.migrate: set mint rights to staking");

  // Step 1: Set treasury as vault on authority
  await waitForTx(
    await olympusAuthority.pushVault(olympusTreasury.address, true)
  );
  console.log("Setup -- authorityContract.pushVault: set vault on authority");

  // Step 2: Set distributor as minter on treasury
  // Allows distributor to mint ohm.
  // await waitForTx(
  //   await olympusTreasury.queueTimelock(2, mockDai.address, mockDai.address)
  // );
  
  // toggle reward manager
  await waitForTx(
    await olympusTreasury.enable(8, olympusStakingDistributor.address, ZERO_ADDRESS)
  );

  await waitForTx(
    await olympusTreasury.enable(8, boundDepository.address, ZERO_ADDRESS)
  );
  
  // toggle DAI as reserve token
  await waitForTx(
    await olympusTreasury.enable(2, mockDai.address, ZERO_ADDRESS)
  );
  
  // toggle deployer reserve depositor
  await waitForTx(
    await olympusTreasury.enable(0, master, ZERO_ADDRESS)
  );
  
  // set sOHM
  await waitForTx(
    await olympusTreasury.enable(9, sOhm.address, ZERO_ADDRESS)
  );
  
  // toggle liquidity depositor
  await waitForTx(
    await olympusTreasury.enable(4, master, ZERO_ADDRESS)
  );
  
  /*
  await waitForTx(
    await olympusTreasury.execute("0")
  );
  await waitForTx(
    await olympusTreasury.execute("1")
  );
  await waitForTx(
    await olympusTreasury.execute("2")
  );
  await waitForTx(
    await olympusTreasury.execute("3")
  );
  await waitForTx(
    await olympusTreasury.execute("4")
  );
  */
  // await waitForTx(
  //   await olympusTreasury.enable(1, boundDepository.address, ZERO_ADDRESS)
  // );
  console.log("Setup -- treasury.enable(8):  distributor enabled to mint ohm on treasury");

  // Step 3: Set distributor on staking
  await waitForTx(
    await olympusStaking.setDistributor(olympusStakingDistributor.address)
  );
  console.log("Setup -- staking.setDistributor:  distributor set on staking");

  // Step 4: Initialize sOHM and set the index
  if ((await sOhm.gOHM()) == ZERO_ADDRESS) {
    // Set index to 1
    await waitForTx(
      await sOhm.setIndex(INITIAL_INDEX)
    );
    await waitForTx(
      await sOhm.setgOHM(gOhm.address)
    );
    await waitForTx(
      await sOhm.initialize(olympusStaking.address, olympusTreasury.address)
    );
  }
  console.log("Setup -- sohm initialized (index, gohm)");

  // Step 5: Set up distributor with bounty and recipient
  await waitForTx(
    await olympusStakingDistributor.setBounty(BOUNTY_AMOUNT)
  );
  await waitForTx(
    await olympusStakingDistributor.addRecipient(olympusStaking.address, INITIAL_REWARD_RATE)
  );
  console.log("Setup -- distributor.setBounty && distributor.addRecipient");
  console.timeEnd('setup');
};

before(async () => {
  await rawBRE.run('set-DRE');
  const [deployer, secondaryWallet] = await getEthersSigners();

  console.log('-> Deploying test environment...');
  await buildTestEnv(deployer, secondaryWallet);

  await initializeMakeSuite();
  console.log('\n***************');
  console.log('Setup and snapshot finished');
  console.log('***************\n');
});
