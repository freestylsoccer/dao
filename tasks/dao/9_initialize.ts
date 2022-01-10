import { task } from 'hardhat/config';
import { waitForTx } from '../../helpers/misc-utils';
import {
  getOlympusAuthority,
  getOlympusTreasury,
  getOlympusStakingDistributor,
  getOlympusStaking,
  getSohm,
  getGohm,
} from '../../helpers/contracts-getters';
import { ZERO_ADDRESS } from '../../helpers/constants';

task('dao:initialize', 'Initialize contracts.')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');

    const INITIAL_INDEX = "45000000000";
    const INITIAL_REWARD_RATE = "4000";
    const BOUNTY_AMOUNT = "100000000";

    const olympusAuthority = await getOlympusAuthority();
    const olympusTreasury = await getOlympusTreasury();
    const olympusStakingDistributor = await getOlympusStakingDistributor();
    const olympusStaking = await getOlympusStaking();

    const sOhm = await getSohm();
    const gOhm = await getGohm();

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
    await waitForTx(
      await olympusTreasury.enable(8, olympusStakingDistributor.address, ZERO_ADDRESS)
    );
    console.log("Setup -- treasury.enable(8):  distributor enabled to mint ohm on treasury");

    // Step 3: Set distributor on staking
    await waitForTx(
      await olympusStaking.setDistributor(olympusStakingDistributor.address)
    );
    console.log("Setup -- staking.setDistributor:  distributor set on staking");

    // Step 4: Initialize sOHM and set the index
    if ((await sOhm.gOHM()) == ZERO_ADDRESS) {
      await waitForTx(
        await sOhm.setIndex(INITIAL_INDEX)
      ); // TODO
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
  });
