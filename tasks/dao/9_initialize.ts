import { task } from 'hardhat/config';
import { waitForTx } from '../../helpers/misc-utils';
import {
  getOlympusAuthority,
  getOlympusTreasury,
  getOlympusStakingDistributor,
  getOlympusStaking,
  getSohm,
  getGohm,
  getOhm,
  getMockDai,
  getOlympusBondDepositoryV2,
} from '../../helpers/contracts-getters';
import { getEthersSigners } from '../../helpers/contracts-helpers';
import { ZERO_ADDRESS } from '../../helpers/constants';
// import { deployMockDai } from '../../helpers/contracts-deployments';

task('dao:initialize', 'Initialize contracts.')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');

    const deployer = await (await getEthersSigners())[0].getAddress();

    const LARGE_APPROVAL = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    const initialMint = "0x3635C9ADC5DEA00000";
    // profit 900000000000 = 900e9
    const profit = "0xD18C2E2800";

      // initial configuration
    const INITIAL_INDEX = "1000000000";
    const INITIAL_REWARD_RATE = "4000";
    const BOUNTY_AMOUNT = "100000000";

    const olympusAuthority = await getOlympusAuthority();
    const olympusTreasury = await getOlympusTreasury();
    const olympusStakingDistributor = await getOlympusStakingDistributor();
    const olympusStaking = await getOlympusStaking();

    const sOhm = await getSohm();
    const gOhm = await getGohm();
    const boundDepository = await getOlympusBondDepositoryV2();

    // const mockDai = await deployMockDai(["0"], false);
    const mockDai = await getMockDai();

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
      await olympusTreasury.enable(0, deployer, ZERO_ADDRESS)
    );
    
    // set sOHM
    await waitForTx(
      await olympusTreasury.enable(9, sOhm.address, ZERO_ADDRESS)
    );
    
    // toggle liquidity depositor
    await waitForTx(
      await olympusTreasury.enable(4, deployer, ZERO_ADDRESS)
    );

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

    await mockDai.mint(deployer, initialMint);
    await mockDai.mint("0xFaA8856A6ffD8083CD7135B7534FE9E7f9DeE9f5", initialMint);
    console.log("Setup -- mockDai.mint: mint 10000 DAI");

    await mockDai.approve(olympusTreasury.address, LARGE_APPROVAL);
    await mockDai.approve(boundDepository.address, LARGE_APPROVAL);
    console.log("Setup -- mockDai.approve: approve treasury to espend our DAI");

    await olympusTreasury.deposit(initialMint, mockDai.address, profit);
    console.log("Setup -- treasury.deposit: deposited to treasury");
  });
