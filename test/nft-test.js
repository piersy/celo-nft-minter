const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const hre = require("hardhat");

let MyNFT;

describe("MyNFT", function () {
  this.timeout(50000);

  let myNFT;
  let owner;
  let acc1;
  let acc2;

  console.log("provider url", hre.network.config.url);
  var provider = new ethers.providers.JsonRpcProvider(hre.network.config.url);

  this.beforeEach(async function () {
    // alfajores_pr provider
    // This is executed before each test
    // Deploying the smart contract
    [owner, acc1, acc2] = await ethers.getSigners();

    let dd = await ethers.getSigner(acc1.address);
    MyNFT = await ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy();
    let dtx = await myNFT.deployTransaction.wait();
    console.log("deployed in", dtx.blockNumber);
  });

  // it("Should set the right owner", async function () {
  //   expect(await myNFT.owner()).to.equal(owner.address);
  // });

  // it("Should mint one NFT", async function () {
  //   expect(await myNFT.balanceOf(acc1.address)).to.equal(0);

  //   const tokenURI = "https://example.com/1";
  //   let est = await myNFT
  //     .connect(owner)
  //     .estimateGas.safeMint(acc1.address, tokenURI);
  //   console.log("gas est mint", est);

  //   const tx = await myNFT.connect(owner).safeMint(acc1.address, tokenURI);
  //   console.log(tx);
  //   await tx.wait();

  //   expect(await myNFT.balanceOf(acc1.address)).to.equal(1);
  // });

  it("Should set the correct tokenURI", async function () {
    const tokenURI_1 = "https://example.com/1";
    const tokenURI_2 = "https://example.com/2";

    console.time("setup");

    let data = MyNFT.interface.encodeFunctionData("safeMint", [
      acc1.address,
      tokenURI_1,
    ]);

    let args = {
      from: owner.address,
      to: myNFT.address,
      data: data,
    };

    console.timeEnd("setup");

    // console.time("get block number");
    // let bn = await provider.send("eth_blockNumber");
    // console.timeEnd("get block number");
    // console.log("bn", parseInt(bn.slice(2), 16));

    await new Promise((p) => {
      setTimeout(p, 1000);
    });

    for (let i = 0; i < 4; i++) {
      let res = await provider.send("debug_traceCall", [
        args,
        "pending",
        { timeout: "1000s" },
      ]);
      console.log("pending trace gas tokenURI_1", res.gas);
      res = await provider.send("debug_traceCall", [
        args,
        "latest",
        { timeout: "1000s" },
      ]);
      console.log("latest trace gas tokenURI_1", res.gas);
      res = await provider.send("eth_estimateGas", [args, "pending"]);
      console.log("pending gas est tokenURI_1", Number(res));
      res = await provider.send("eth_estimateGas", [args, "latest"]);
      console.log("latest gas est tokenURI_1", Number(res));

      // let est = await myNFT
      //   .connect(owner)
      //   .estimateGas.safeMint(acc1.address, tokenURI_1);
      // console.log("gas est tokenURI_1", est);

      // let bn = await provider.send("eth_blockNumber");
      // console.log("bn", parseInt(bn.slice(2), 16));

      // fs.writeFile("trace" + i, JSON.stringify(res), (err) => {});
    }

    const tx1 = await myNFT.connect(owner).safeMint(acc1.address, tokenURI_1);
    console.log(tx1);
    await tx1.wait();

    est = await myNFT
      .connect(owner)
      .estimateGas.safeMint(acc2.address, tokenURI_2);
    console.log("gas est tokenURI_2", est);

    const tx2 = await myNFT.connect(owner).safeMint(acc2.address, tokenURI_2);
    console.log(tx2);
    await tx2.wait();

    expect(await myNFT.tokenURI(0)).to.equal(tokenURI_1);
    expect(await myNFT.tokenURI(1)).to.equal(tokenURI_2);
  });
});
