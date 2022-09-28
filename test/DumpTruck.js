const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { getContractAddress } = require('@ethersproject/address')

const multisigAddress = '0xB0B4bd94D656353a30773Ac883591DDBaBC0c0bA';

const mUmamiAddress = '0x2AdAbD6E8Ce3e82f52d9998a7f64a90d294A92A4';
const umamiAddress = '0x1622bF67e6e5747b81866fE0b85178a93C7F86e3';
const wethAddress = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
const univ3RouterAddress = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';

let myWallet = '0x3c6Cf50343d972Db4373A3e8482C9681eFBdA6F6';
let myWalletTest = '0xfe2a94ecd89745f3C3099067f9738296941DbC9D';

const mUmamiAbi = require('./abis/mumami');
const univ3RouterAbi = require('./abis/uniswap.json');
const erc20Abi = require('./abis/erc20.json');

let dumpTruck, mUmami, impersonatedSigner;

describe("DumpTruck", function() {
    beforeEach(async () => {
        // impersonate umami multisig
        impersonatedSigner = await ethers.getImpersonatedSigner(multisigAddress);
        mUmami = new ethers.Contract(mUmamiAddress, mUmamiAbi, ethers.provider);

        // set staking withdraw to enabled
        await mUmami.connect(impersonatedSigner).setStakingWithdrawEnabled(true);

        let enabled = await mUmami.withdrawEnabled();
        console.log('Withdraw Enabled:', enabled);
    });
    it('dumps the truck', async function () {

        const futureAddress = getContractAddress({
            from: '0xF61928b4f2D6Eb1524317e6C310d73a89FD94ce7',
            nonce: 0
        })
        let wl = await mUmami.isWhitelisted(futureAddress);
        console.log(`${futureAddress} whitelist status: ${wl}`);

        let impersonatedmyWallet = await ethers.getImpersonatedSigner(myWallet);
        let approve_amount = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
        await mUmami.connect(impersonatedmyWallet).approve('0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE', approve_amount);
        const DumpTruck = await hre.ethers.getContractFactory("DumpTruck");

        dumpTruck = await DumpTruck.deploy(0);

        await dumpTruck.deployed();
        // console.log(
        //     `DumpTruck deployed to ${dumpTruck.address}`
        // );

        let minAmount = '0';
        let uniRouter = new ethers.Contract(univ3RouterAddress, univ3RouterAbi, ethers.provider);

        let myWalletBalance = await mUmami.balanceOf(myWallet);
        console.log('myWallet mUmami Balance:', myWalletBalance);

        //let impersonatedmyWallet = await ethers.getImpersonatedSigner(myWallet);
        let impmyWalletTest = await ethers.getImpersonatedSigner(myWalletTest);
        await mUmami.connect(impmyWalletTest).withdraw();
        let umami = new ethers.Contract(umamiAddress, erc20Abi, ethers.provider);
        let umamiBal = await umami.balanceOf(myWalletTest);
        //console.log('myWallettest umami Balance:', umamiBal);


        let isWhitelisted = await mUmami.isWhitelisted(myWalletTest);
        console.log('Is whitelisted:', isWhitelisted);

        // await mUmami.connect(impersonatedmyWallet).approve(dumpTruck.address, '9999999999999999999999999');
        
        // //await dumpTruck.connect(impersonatedmyWallet).dump(minAmount);

        // let weth = new ethers.Contract(wethAddress, erc20Abi, ethers.provider);
        // let myWalletWethBalance = await weth.balanceOf(myWallet);
        // console.log('myWallet Weth Balance:', myWalletWethBalance);
    }); 
})