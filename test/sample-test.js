const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT market", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()
    // remember this is in MATIC not ETH
    const auctionPrice = ethers.utils.parseUnits('100', 'ether')

    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    // first address is "_" becouse it is actually seller. By default first address is use to create saller for contracts
    const [_, buyerAddress] = await ethers.getSigners()

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: listingPrice})


    const items  = await market.fetchMarketItems();

    console.log('items: ', items)

  });
});
