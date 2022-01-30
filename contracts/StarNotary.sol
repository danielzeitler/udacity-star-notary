// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StarNotary is ERC721URIStorage, Ownable {

  // Implement Task 1 Add a name and symbol properties
  string constant starName = "Star Notary";
  string constant starSymbol = "STAR";
  
  struct Star {
    string name;
  }


  mapping(uint256 => Star) public tokenIdToStarInfo;
  mapping(uint256 => uint256) public starsForSale;

  constructor() ERC721(starName, starSymbol) {
  }

  function createStar(string memory _name, uint256 _tokenId) public {
    Star memory newStar = Star(_name);
    tokenIdToStarInfo[_tokenId] = newStar;
    _safeMint(msg.sender, _tokenId);
  }

  function safeMint(address to, uint256 tokenId) public onlyOwner {
    _safeMint(to, tokenId);
  }

  function putUpForSale(uint256 _tokenId, uint256 _price) public {
    require(ownerOf(_tokenId) == msg.sender, "sender must be the owner");
    starsForSale[_tokenId] = _price;
  }

  function _make_payable(address account_)  internal pure returns(address payable) { 
    return payable(account_);
  }

  function transfer(uint256 value) public payable {
      payable(msg.sender).transfer(value);
  }

    function buyStar(uint256 _tokenId) public payable {
      require(starsForSale[_tokenId] > 0, "The star should be up for sale"); 
      
      uint256 starCost = starsForSale[_tokenId];
      address ownerAddress = ownerOf(_tokenId);
      
      require(msg.value >= starCost, "Your ETH balance must be >= the price of star");
      
      safeTransferFrom(ownerAddress, msg.sender, _tokenId);
      
      address  payable payableOwnerAddress = _make_payable(ownerAddress);
      address payable payableMsgSender = _make_payable(msg.sender);

      payableOwnerAddress.transfer(starCost);
      
      if(msg.value > starCost) {
        payableMsgSender.transfer(msg.value - starCost);
      }
  }

    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (string memory) {
        return tokenIdToStarInfo[_tokenId].name;
    }

    // Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        require(ownerOf(_tokenId1) == msg.sender || ownerOf(_tokenId2) == msg.sender, "one has to be the owner");

        address owner1 = ownerOf(_tokenId1);
        address owner2 = ownerOf(_tokenId2);

        safeTransferFrom(owner1, owner2, _tokenId1);
        safeTransferFrom(owner2, owner1, _tokenId2);
    }

    function transferStar(address _to1, uint256 _tokenId) public {
        require(msg.sender == ownerOf(_tokenId));
        safeTransferFrom(ownerOf(_tokenId), _to1, _tokenId);
    }
}