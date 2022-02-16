const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");

let MyNFT;

describe("MyNFT", function () {
  this.timeout(50000);

  let myNFT;
  let owner;
  let acc1;
  let acc2;

  this.beforeEach(async function () {
    // This is executed before each test
    // Deploying the smart contract
    [owner, acc1, acc2] = await ethers.getSigners();

    MyNFT = await ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy();
    await myNFT.deployTransaction.wait();
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

    // alfajores_pr provider
    var provider = new ethers.providers.JsonRpcProvider(
      "http://127.0.0.1:8500"
    );

    // local_test provider
    // var provider = new ethers.providers.JsonRpcProvider(
    //   "http://127.0.0.1:8081"
    // );

    console.timeEnd("setup");
    let est = await myNFT
      .connect(owner)
      .estimateGas.safeMint(acc1.address, tokenURI_1);
    console.log("gas est tokenURI_1", est);
    let res = await provider.send("debug_traceCall", [
      args,
      "pending",
      { timeout: "1000s" },
    ]);
    console.log("trace gas est tokenURI_1", res.gas);
    fs.writeFile("trace1", JSON.stringify(res), (err) => {});

    // for (let i = 0; i < 10; i++) {
    await new Promise((p) => {
      setTimeout(p, 2000);
    });
    est = await myNFT
      .connect(owner)
      .estimateGas.safeMint(acc1.address, tokenURI_1);
    console.log("gas est tokenURI_1", est);
    let other = await provider.send("debug_traceCall", [
      args,
      "pending",
      { timeout: "1000s" },
    ]);
    console.log("trace gas est tokenURI_1", other.gas);
    if (other.gas != res.gas) {
      fs.writeFile("trace2", JSON.stringify(other), (err) => {});
    }
    // }

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
