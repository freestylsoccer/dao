import { time } from 'console';
import { TestEnv, makeSuite } from './helpers/make-suite';

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
        [1209600, 1649009395],
        [21600, 86400]
        )
    ).to.be.revertedWith("UNAUTHORIZED");
  });

  it('deposit to treasury', async () => {
    const { mockDai, users, treasury, deployer } = testEnv;

    // mint and approve dai
    await mockDai.mint(deployer.address, "0x3635C9ADC5DEA00000");
    await mockDai.connect(deployer.signer).approve(treasury.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    const profit = await treasury.tokenValue(mockDai.address, "0xAD78EBC5AC6200000");

    // 0xAD78EBC5AC6200000 == 200 dai
    await treasury.connect(deployer.signer).deposit("0xAD78EBC5AC6200000", mockDai.address, profit);
    // 0x887517180 == 36.63 ohm
    await treasury.mint(deployer.address, "0x174876E800");
    await mockDai.mint(users[0].address, "0x3635C9ADC5DEA00000");
  });

  it('Create market', async () => {
    const { boundDepository, mockDai } = testEnv;

    const quoteToken = mockDai.address;
    const capacity = "0x174876E800"; // 100
    const initialPrice = "0xDB585800"; // 3.68
    const debtBuffer = "0x30D40"; //20
    // Create market
    await boundDepository.create(
      quoteToken,
      [capacity, initialPrice, debtBuffer],
      [false, true],
      [60, 1649869861],
      [14400, 86400]
      );

  });

  it('Bond Depository Deposit', async () => {
    const { boundDepository, users, mockDai, treasury, OHM } = testEnv;

    // console.log("token value: ");
    // console.log(await treasury.tokenValue(mockDai.address, "0xDE0B6B3A7640000"));

    // console.log("market: ");
    // console.log(await boundDepository.markets(0));
    // console.log("base supply: ");
    // console.log(await treasury.baseSupply());
    // console.log("debt ratio: ");
    // console.log(await boundDepository.debtRatio(0));


    // console.log("debt ratio: ");
    // console.log(await boundDepository.debtRatio(0));
    // console.log("terms: ");
    // console.log(await boundDepository.terms(0));
    // console.log("ohm total supply: ");
    // console.log(await OHM.totalSupply());

    // console.log("debt Ratio calculation data");
    // console.log("total debt: ");
    let market = await boundDepository.markets(0);
    // console.log(market[3]);
    // console.log("base supply: ");
    let baseSupply = await treasury.baseSupply();
    // console.log(baseSupply);
    // console.log("debt ratio: ");
    // console.log(await boundDepository.debtRatio(0));
    console.log("/////////////////////////////////////////////////");
    console.log("market price calculation data");
    console.log("current Control Variable ");
    console.log(await boundDepository.currentControlVariable(0));
    console.log("market price: ");
    console.log(await boundDepository.marketPrice(0));
    console.log("/////////////////////////////////////////////////");
    // console.log("market payout calculation data");
    // console.log("market max Payout:");
    // console.log(market[4]);

    await mockDai.connect(users[0].signer).approve(boundDepository.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    await boundDepository.connect(users[0].signer).deposit(0, "0x2B5E3AF16B1880000", "0x4E3B29200", users[0].address, treasury.address);

    // await OHM.burn("0x59682F00");
    console.log("------------------------------------------------------------------------------------------------");

    // console.log("treasury.totalReserves: ");
    // console.log(await treasury.totalReserves());
    // console.log("treasury.totalDebt: ");
    // console.log(await treasury.totalDebt());
    // console.log("treasury.excessReserves: ");
    // console.log(await treasury.excessReserves());

    // console.log("debt Ratio calculation data");
    // console.log("total debt: ");
    market = await boundDepository.markets(0);
    // console.log(market[3]);
    // console.log("base supply: ");
    baseSupply = await treasury.baseSupply();
    // console.log(baseSupply);
    // console.log("debt ratio: ");
    // console.log(await boundDepository.debtRatio(0));
    console.log("/////////////////////////////////////////////////");
    console.log("market price calculation data");
    console.log("current Control Variable ");
    console.log(await boundDepository.currentControlVariable(0));
    console.log("market price: ");
    console.log(await boundDepository.marketPrice(0));
    console.log("/////////////////////////////////////////////////");
    // console.log("market payout calculation data");
    // console.log("market max Payout:");
    // console.log(market[4]);

    // console.log("token value: ");
    // console.log(await treasury.tokenValue(mockDai.address, "0xDE0B6B3A7640000"));

    // console.log("market price: ");
    // console.log(await boundDepository.marketPrice(0));
    // console.log("market: ");
    // console.log(await boundDepository.markets(0));
    // console.log("debt ratio: ");
    // console.log(await boundDepository.debtRatio(0));
    // console.log("terms: ");
    // console.log(await boundDepository.terms(0));
    // console.log("ohm total supply: ");
    // console.log(await OHM.totalSupply());

    // console.log("treasury.excessReserves: ");
    // console.log(await treasury.excessReserves());
  });

  it('Bond Depository Deposit 2', async () => {
    const { boundDepository, users, treasury } = testEnv;
    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");

    await boundDepository.connect(users[0].signer).deposit(0, "0x2B5E3AF16B1880000", "0x4E3B29200", users[0].address, treasury.address);

    console.log("------------------------------------------------------------------------------------------------");

    // console.log("debt Ratio calculation data");
    // console.log("total debt: ");
    let market = await boundDepository.markets(0);
    // console.log(market[3]);
    // console.log("base supply: ");
    let baseSupply = await treasury.baseSupply();
    // console.log(baseSupply);
    // console.log("debt ratio: ");
    // console.log(await boundDepository.debtRatio(0));
    console.log("/////////////////////////////////////////////////");
    console.log("market price calculation data");
    console.log("current Control Variable ");
    console.log(await boundDepository.currentControlVariable(0));
    console.log("market price: ");
    console.log(await boundDepository.marketPrice(0));
    console.log("/////////////////////////////////////////////////");
    // console.log("market payout calculation data");
    // console.log("market max Payout:");
    // console.log(market[4]);
  });

  it('Bond Depository Deposit 3', async () => {
    const { boundDepository, users, treasury } = testEnv;
    console.log("------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
    // await boundDepository.connect(users[0].signer).deposit(0, "0x2B5E3AF16B1880000", "0x4E3B29200", users[0].address, treasury.address);
    await new Promise(resolve => setTimeout(resolve, 180000))
    console.log("------------------------------------------------------------------------------------------------");
    console.log("current Control Variable ");
    console.log(await boundDepository.currentControlVariable(0));
    console.log("market price: ");
    console.log(await boundDepository.marketPrice(0));
  });
});
