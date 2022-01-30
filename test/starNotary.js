const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

// it('can Create a Star', async() => {
//     let tokenId = 1;
//     let instance = await StarNotary.deployed();
//     await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
//     assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
// });

// it('lets user1 put up their star for sale', async() => {
//     let instance = await StarNotary.deployed();
//     let user1 = accounts[1];
//     let starId = 2;
//     let starPrice = web3.utils.toWei(".01", "ether");
//     await instance.createStar('awesome star', starId, {from: user1});
//     await instance.putUpForSale(starId, starPrice, {from: user1});
//     assert.equal(await instance.starsForSale.call(starId), starPrice);
// });

// it('lets user1 get the funds after the sale', async() => {
//     let instance = await StarNotary.deployed();
//     let user1 = accounts[1];
//     let user2 = accounts[2];
//     let starId = 3;

//     let starPrice = web3.utils.toWei(".01", "ether");
//     let balance = web3.utils.toWei(".05", "ether");

//     await instance.createStar('awesome star', starId, {from: user1});
//     await instance.putUpForSale(starId, starPrice, {from: user1});

//     console.log(await instance.ownerOf(starId))
//     console.log(await instance.starsForSale(starId))

//     let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);

//     await instance.approve(user2, starId, { from: user1 });

//     await instance.buyStar(starId, { from: user2, value: balance });
    
//     let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);

//     let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
//     let value2 = Number(balanceOfUser1AfterTransaction);

//     // assert.equal(value1, value2);
// });

// it('lets user2 buy a star, if it is put up for sale', async() => {
//     let instance = await StarNotary.deployed();
//     let user1 = accounts[1];
//     let user2 = accounts[2];
//     let starId = 4;
//     let starPrice = web3.utils.toWei(".01", "ether");
//     let balance = web3.utils.toWei(".05", "ether");
//     await instance.createStar('awesome star', starId, {from: user1});
//     await instance.putUpForSale(starId, starPrice, {from: user1});
//     let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
//     await instance.approve(user2, starId, { from: user1 });
//     await instance.buyStar(starId, {from: user2, value: balance});
//     assert.equal(await instance.ownerOf.call(starId), user2);
// });

// it('lets user2 buy a star and decreases its balance in ether', async() => {
//     let instance = await StarNotary.deployed();
//     let user1 = accounts[1];
//     let user2 = accounts[2];
//     let starId = 5;
//     let starPrice = web3.utils.toWei(".01", "ether");
//     let balance = web3.utils.toWei(".05", "ether");
//     await instance.createStar('awesome star', starId, {from: user1});
//     await instance.putUpForSale(starId, starPrice, {from: user1});
//     let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
//     const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);

//     await instance.approve(user2, starId, { from: user1, gasPrice:71702539 });

//     await instance.buyStar(starId, {from: user2, value: balance, gasPrice:71702539});

//     const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);

//     let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
//     // assert.equal(value, starPrice);
//   });

it('exchange stars', async() => {
    let instance = await StarNotary.deployed();
    const buyer1 = accounts[0];
    const buyer2 = accounts[1];
    let starId1 = 23;
    let starId2 = 24;

    await instance.createStar('Michael Jordan', starId1, { from: buyer1 });
    await instance.createStar('Lebron James', starId2, { from: buyer2 });
    
    await instance.approve(buyer1, starId2, { from: buyer2 });
    await instance.exchangeStars(starId1, starId2);

    assert.equal(await instance.ownerOf(starId1), buyer2);
    assert.equal(await instance.ownerOf(starId2), buyer1);
});

it('transfer star', async() => {
    let instance = await StarNotary.deployed();
    const buyer1 = accounts[0];
    const buyer2 = accounts[1];
    let starId1 = 25;

    await instance.createStar('Michael Jordan', starId1, { from: buyer1 });
    assert.equal(await instance.ownerOf(starId1), buyer1);
    
    await instance.approve(buyer2, starId1, { from: buyer1 });

    await instance.transferStar(buyer2, starId1);

    assert.notEqual(await instance.ownerOf(starId1), buyer1);
    assert.equal(await instance.ownerOf(starId1), buyer2);
});

it('transfer star', async() => {
    let instance = await StarNotary.deployed();
    const buyer1 = accounts[0];
    const buyer2 = accounts[1];
    let starId = 26;

    await instance.createStar('Test Star Name', starId, { from: buyer1 });
    const starInfo = await instance.lookUptokenIdToStarInfo(starId);
    assert.equal(starInfo, "Test Star Name");
});
