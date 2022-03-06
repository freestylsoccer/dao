import { task } from 'hardhat/config';
import {
  getMockDai,
  getOlympusBondDepositoryV2,
  getOlympusTreasury
} from '../../helpers/contracts-getters';
import { getEthersSigners } from '../../helpers/contracts-helpers';

task('dao:create', 'Create bound.')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, localBRE) => {
    await localBRE.run('set-DRE');
    const LARGE_APPROVAL = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    const mockDai = await getMockDai();
    const deployer = await (await getEthersSigners())[0].getAddress();
    const boundDepository = await getOlympusBondDepositoryV2();
    const olympusTreasury = await getOlympusTreasury();
    /*
    const quoteToken = await (await getMockDai()).address;
    const capacity = "0xE8990A4600";
    const initialPrice = "0xBA43B7400";
    const debtBuffer = "0x30D40";
    // Create market
    await boundDepository.create(
      quoteToken,
      [capacity, initialPrice, debtBuffer],
      [false, true],
      [100, 1649070672],
      [14400, 86400]
      );

    console.log("Setup -- bondDepository.create: create bond");
    */
    // const initialMint = "0x3635C9ADC5DEA00000";
    // await mockDai.mint(deployer, initialMint);
    console.log(await mockDai.balanceOf(deployer));
    // await mockDai.approve(boundDepository.address, LARGE_APPROVAL);
    // console.log("Setup -- mockDai.approve: approved bond depository");
    await boundDepository.deposit(0, "0x0de0b6b3a7640000", "0xCCE416600", deployer, olympusTreasury.address);
    console.log("Setup -- bondDepository.deposit: deposited to bond");
  });
