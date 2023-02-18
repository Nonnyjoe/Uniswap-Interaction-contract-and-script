import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { providers } from "ethers";

async function main() {
  //uniswap router address
  const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  //dai token address
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  //uni token address
  const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  //dai holder
  const DAIHolder = "0x748dE14197922c4Ae258c7939C7739f3ff1db573";

  const paths = [DAI, "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", UNI];
  const path2 = ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", DAI];
  const path3 = [DAI, UNI];
  let time = 1676685874;

  const amountToSwap = await ethers.utils.parseEther("100");
  const amountToSwap2 = await ethers.utils.parseEther("1");
 // console.log(amountToSwap);

  const amountToReceive = await ethers.utils.parseEther("100");
  //console.log(amountToSwap);

  const Uniswap = await ethers.getContractAt("IUniswap", ROUTER);

  const helpers = require("@nomicfoundation/hardhat-network-helpers");
  await helpers.impersonateAccount(DAIHolder);
  const impersonatedSigner = await ethers.getSigner(DAIHolder);

  const DaiContract = await ethers.getContractAt("IToken", DAI);

  const UniContract = await ethers.getContractAt("IToken", UNI);

  const holderBalance = await DaiContract.balanceOf(DAIHolder);
  //console.log(`Dai balance before ${holderBalance}`);

  await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountToSwap);

  const uniBalance = await UniContract.balanceOf(DAIHolder);
  //console.log(`uniBalance ${uniBalance}`);

  await Uniswap.connect(impersonatedSigner).swapExactTokensForTokens(
    amountToSwap,
    0,
    paths,
    DAIHolder,
    time
  );

  const uniBalanceAfter = await UniContract.balanceOf(DAIHolder);
  console.log(`uniBalanceAfter ${uniBalanceAfter}`);

  const holderBalanceAfter = await DaiContract.balanceOf(DAIHolder);
  console.log(`Dai balance After ${holderBalanceAfter}`);

  const sent = ethers.utils.parseEther("17");

  const ETHbalanceBefore = await ethers.provider.getBalance(DAIHolder);
  console.log(`ETHBalance before ${ETHbalanceBefore}`);

  await Uniswap.connect(impersonatedSigner).swapETHForExactTokens(
    amountToReceive,
    path2,
    DAIHolder,
    time,
    {
      value: sent,
    }
  );

  const diff = Number(ETHbalanceBefore) - Number(sent);

  console.log(`sent ${sent}`);
  console.log(`difference ${diff}`);

  const ETHbalanceAfter = await ethers.provider.getBalance(DAIHolder);
  console.log(`ETHBalance after ${ETHbalanceAfter}`);

  const holderBalanceAfterETH = await DaiContract.balanceOf(DAIHolder);
  console.log(`Dai balance After ETH${holderBalanceAfterETH}`);

  ////////////////////////////////////////
  //classwork
  ///////////////////////////////////////
const swapDaiForETH = await Uniswap.connect(impersonatedSigner).swapExactETHForTokens(
  500, path2, DAIHolder, time,  {
    value: sent,
  }
)

const swapTokensForExactTokens = await Uniswap.connect(impersonatedSigner).swapTokensForExactTokens(
  14000000000, 1, path3, DAIHolder, time
)

const holderBalanceAfterETH2 = await DaiContract.balanceOf(DAIHolder);
console.log(`Dai balance After ETH${holderBalanceAfterETH2}`);

await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountToSwap);
await UniContract.connect(impersonatedSigner).approve(ROUTER, amountToSwap);
const addLiquidity = Uniswap.connect(impersonatedSigner).addLiquidity(DAI, UNI, 50000, 10000, 1400, 200, DAIHolder,time);

const holderBalanceAfterETH3 = await DaiContract.balanceOf(DAIHolder);
console.log(`Dai balance After LIQUIDITY ${holderBalanceAfterETH3}`);

const uniBalanceAfter1 = await UniContract.balanceOf(DAIHolder);
console.log(`uniBalanceAfter LIQUIDITY ${uniBalanceAfter1}`);

const addEthLiquidity = await UniContract.addLiquidityETH(DAI, 17000, 1700, amountToSwap2, DAIHolder, time,  
  {
  value: sent,
} );

const removeLiquidity = await UniContract.removeLiquidity(DAI,UNI, 5000, 1400, 200, DAIHolder, time );
const uniBalanceAfter2 = await UniContract.balanceOf(DAIHolder);
console.log(`uniBalanceAfter LIQUIDITY ${uniBalanceAfter2}`);

}

// 150,000 000 000 000 000 000 000

//150 014 568 346 647 994 343 514

// 150 000 000 000 000 000 000 249

// 15,110,085 000 000 000 000 000 000
//15,110 185 000 000 000 000 000 000

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});