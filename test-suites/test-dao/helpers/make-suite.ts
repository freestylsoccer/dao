import { evmRevert, evmSnapshot, DRE } from '../../../helpers/misc-utils';
import { Signer } from 'ethers';
import {
  getOlympusAuthority,
  getSohm,
  getGohm,
  getOhm,
  getOlympusTreasury,
  getOlympusStaking,
  getOlympusStakingDistributor,
  getOlympusBondingCalculator,
  getOlympusBondDepositoryV2,
} from '../../../helpers/contracts-getters';
import { eEthereumNetwork, eNetwork, tEthereumAddress } from '../../../helpers/types';
import { OlympusStaking } from '../../../types/OlympusStaking';

import chai from 'chai';
// @ts-ignore
import bignumberChai from 'chai-bignumber';
import { almostEqual } from './almost-equal';
import { getEthersSigners } from '../../../helpers/contracts-helpers';
import { solidity } from 'ethereum-waffle';
import { Distributor, GOHM, SOlympus, OlympusAuthority, OlympusBondDepositoryV2, OlympusBondingCalculator, OlympusERC20Token, OlympusTreasury } from '../../../types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { usingTenderly } from '../../../helpers/tenderly-utils';

chai.use(bignumberChai());
chai.use(almostEqual());
chai.use(solidity);

export interface SignerWithAddress {
  signer: Signer;
  address: tEthereumAddress;
}
export interface TestEnv {
  autority: OlympusAuthority;
  sOHM: SOlympus;
  gOHM: GOHM;
  OHM: OlympusERC20Token;
  treasury: OlympusTreasury;
  staking: OlympusStaking;
  stakingDistributor: Distributor;
  boundingCalculator: OlympusBondingCalculator;
  boundDepository: OlympusBondDepositoryV2;

  deployer: SignerWithAddress;
  users: SignerWithAddress[];
}

let buidlerevmSnapshotId: string = '0x1';
const setBuidlerevmSnapshotId = (id: string) => {
  buidlerevmSnapshotId = id;
};

const testEnv: TestEnv = {
  autority: {} as OlympusAuthority,
  sOHM: {} as SOlympus,
  gOHM: {} as GOHM,
  OHM: {} as OlympusERC20Token,
  treasury: {} as OlympusTreasury,
  staking: {} as OlympusStaking,
  stakingDistributor: {} as Distributor,
  boundingCalculator: {} as OlympusBondingCalculator,
  boundDepository: {} as OlympusBondDepositoryV2,

  deployer: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
} as TestEnv;

export async function initializeMakeSuite() {
  const [_deployer, ...restSigners] = await getEthersSigners();
  const deployer: SignerWithAddress = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };

  for (const signer of restSigners) {
    testEnv.users.push({
      signer,
      address: await signer.getAddress(),
    });
  }
  testEnv.deployer = deployer;

  testEnv.autority =  await getOlympusAuthority();
  testEnv.sOHM = await getSohm();
  testEnv.gOHM = await getGohm();
  testEnv.OHM = await getOhm();
  testEnv.treasury = await getOlympusTreasury();
  testEnv.staking = await getOlympusStaking();
  testEnv.stakingDistributor = await getOlympusStakingDistributor();
  testEnv.boundingCalculator = await getOlympusBondingCalculator();
  testEnv.boundDepository = await getOlympusBondDepositoryV2();
}

const setSnapshot = async () => {
  const hre = DRE as HardhatRuntimeEnvironment;
  if (usingTenderly()) {
    setBuidlerevmSnapshotId((await hre.tenderlyNetwork.getHead()) || '0x1');
    return;
  }
  setBuidlerevmSnapshotId(await evmSnapshot());
};

const revertHead = async () => {
  const hre = DRE as HardhatRuntimeEnvironment;
  if (usingTenderly()) {
    await hre.tenderlyNetwork.setHead(buidlerevmSnapshotId);
    return;
  }
  await evmRevert(buidlerevmSnapshotId);
};

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    before(async () => {
      await setSnapshot();
    });
    tests(testEnv);
    after(async () => {
      await revertHead();
    });
  });
}
