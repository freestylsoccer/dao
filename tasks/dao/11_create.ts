import { time } from 'console';
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
    // const LARGE_APPROVAL = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

    // const mockDai = await getMockDai();
    // const [ deployer, secondaryWallet ] = await getEthersSigners();
    const boundDepository = await getOlympusBondDepositoryV2();
    // const olympusTreasury = await getOlympusTreasury();
    // close market
    // await boundDepository.close(0)
    /*
    const quoteToken = await (await getMockDai()).address;
    const capacity = "0x174876E800"; // 100
    const initialPrice = "0x9FBD8E00"; // 2.68
    const debtBuffer = "0x30D40"; //20
    // Create market
    await boundDepository.create(
      quoteToken,
      [capacity, initialPrice, debtBuffer],
      [false, true],
      [100, 1651356717],
      [14400, 180]
    );

    console.log("Setup -- bondDepository.create: create bond DAI");
    */
    /*
    const quoteToken2 = "0x883930EE7247B8a5e940C0990B524C9ed9f7d3BA";
    const capacity2 = "0x174876E800";
    const initialPrice2 = "0xAA782300";
    const debtBuffer = "0x30D40"; //20

    // Create market
    await boundDepository.create(
      quoteToken2,
      [capacity2, initialPrice2, debtBuffer],
      [false, true],
      [60, 1649608871],
      [14400, 3600]
      );

    console.log("Setup -- bondDepository.create: create bond USDC");
    */
    // const initialMint = "0x3635C9ADC5DEA00000";
    // await mockDai.mint(deployer, initialMint);
    // console.log(await mockDai.balanceOf(deployer));
    // await mockDai.approve(boundDepository.address, LARGE_APPROVAL);
    // console.log("Setup -- mockDai.approve: approved bond depository");
    // await boundDepository.deposit(0, "0x194D0A87362250000", "0x773594000", deployer, olympusTreasury.address);
    // console.log("Setup -- bondDepository.deposit: deposited to bond");
    console.log(new Date())
    console.log("totalDebt(5)")
    const market = await boundDepository.markets(7)
    console.log(market[3])
    console.log("currentDebt(7)")
    console.log(await boundDepository.currentDebt(7))
    console.log("debtDecay(7)")
    console.log(await boundDepository.debtDecay(7))
    console.log("marketPrice(7)")
    console.log(await boundDepository.marketPrice(7))

    const metadata = await boundDepository.metadata(7)
    console.log("metadata lastDecay(7)")
    console.log(metadata[1])
    console.log("metadata _length(7)")
    console.log(metadata[2])
    console.log(metadata)
  });
