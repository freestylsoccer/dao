import { TestEnv, makeSuite } from './helpers/make-suite';
import { ZERO_ADDRESS } from '../../helpers/constants';
import { ProtocolErrors } from '../../helpers/types';

const { expect } = require('chai');

makeSuite('Bonds', (testEnv: TestEnv) => {
  it('Create market with no autorization', async () => {
    const { boundDepository, users, mockDai } = testEnv;

    const quoteToken = mockDai.address;
    const capacity = 8260000000000;
    const initialPrice = 256000000000;
    const debtBuffer = 100000;
    // Create market
    await expect(
      boundDepository.connect(users[0].signer).create(
        quoteToken,
        [capacity, initialPrice, debtBuffer],
        [false, true],
        [1209600, 1642284000],
        [21600, 86400]
        )
    ).to.be.revertedWith("UNAUTHORIZED");
  });

  it('Create market', async () => {
    const { boundDepository, autority, mockDai } = testEnv;

    const quoteToken = mockDai.address;
    const capacity = "0xE8D4A51000";
    const initialPrice = "0xBA43B7400";
    const debtBuffer = "0x30D40";
    // Create market
    await boundDepository.create(
      quoteToken,
      [capacity, initialPrice, debtBuffer],
      [false, true],
      [100, 1643577661000],
      [14400, 86400]
      );
  });

  it('Bond Depository Deposit', async () => {
    const { boundDepository, mockDai, users, treasury, OHM, gOHM, autority, deployer } = testEnv;
    // console.log(deployer.address);
    // console.log(treasury.signer);
    // console.log(treasury.address);
    // console.log(await autority.vault());

    // await OHM.connect(treasury.signer).mint(treasury.address, "1000000000");
    // await OHM.mint(deployer.address, "1000000000000");

    // mint and approve dai
    await mockDai.mint(deployer.address, "1000000000000000000000");
    await mockDai.connect(deployer.signer).approve(treasury.address, "1000000000000000000000000000000000000000000000000000000000000000");
    const profit = await treasury.tokenValue(mockDai.address, "1000000000000000000000");
    await treasury.connect(deployer.signer).deposit("1000000000000000000", mockDai.address, profit);

    await mockDai.mint(users[0].address, "1000000000000000000000");
    await mockDai.connect(users[0].signer).approve(treasury.address, "1000000000000000000000000000000000000000000000000000000000000000");
    // await gOHM.connect(users[0].signer).approve(treasury.address, "1000000000000000000000000000000000000000000000000000000000000000");

    console.log(await boundDepository.currentDebt(0));
    console.log("base supply: ");
    console.log(await treasury.baseSupply());
    console.log("total debt: ");
    console.log(await treasury.totalDebt());
    console.log("total reserves: ");
    console.log(await treasury.totalReserves());
    // console.log(await boundDepository.metadata(0));
    console.log("debt ratio: ");
    console.log(await boundDepository.debtRatio(0));
    // console.log(await boundDepository.isLive(0));
    console.log("market price: ");
    console.log(await boundDepository.marketPrice(0));
    // console.log(await treasury.permissions());
    // await OHM.connect(treasury.signer).approve(treasury.address, "1000000000000000000000000000000000000000000000000000000000000000");
    // await gOHM.connect(treasury.signer).approve(treasury.address, "1000000000000000000000000000000000000000000000000000000000000000");
    // await boundDepository.setRewards(10, 50);
    // await boundDepository.whitelist(users[0].address);
    // console.log(await boundDepository.liveMarketsFor(mockDai.address));
    await boundDepository.connect(users[0].signer).deposit(0, "0", "0xCCE416600", users[0].address, users[2].address);
    console.log("base supply after deposit: ");
    console.log(await treasury.baseSupply());
    console.log("market price: ");
    console.log(await boundDepository.marketPrice(0));
    console.log("total reserves: ");
    console.log(await treasury.totalReserves());
    /*
      currentDebt(_id)
      (10 ** metadata[_id].quoteDecimals)
      / treasury.baseSupply(); // total treasury basesupply = 0 :then div/0
    */

  });
});
