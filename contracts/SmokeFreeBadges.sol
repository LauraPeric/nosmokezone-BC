// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmokeFreeBadges is ERC721URIStorage, Ownable {

    uint256 public tokenId;

    mapping(address => mapping(uint => bool)) public hasBadge;

    address public noSmokeContract;

    constructor() ERC721("SmokeFreeBadge", "SFB") {}

    function setNoSmokeContract(address _addr) public onlyOwner {
        noSmokeContract = _addr;
    }
    
    function mintBadge(address user, uint milestone) public {

        require(msg.sender == noSmokeContract, "Not allowed");

        require(
            milestone == 1 ||
            milestone == 7 ||
            milestone == 15 ||
            milestone == 30 ||
            milestone == 60,
            "Invalid milestone"
        );

//        require(!hasBadge[user][milestone], "Already claimed");

        tokenId++;

        _safeMint(user, tokenId);

        string memory uri = getTokenURI(milestone);
        _setTokenURI(tokenId, uri);

        //hasBadge[user][milestone] = true;
    }

    function getTokenURI(uint milestone) internal pure returns (string memory) {

    if (milestone == 1) {
        return "ipfs://bafybeif5ujkllemacyptavexdu6lx2wfscxnlkokcwvbpb6bepn25wtp4q/day1.json";
    }
    if (milestone == 7) {
        return "ipfs://bafybeif5ujkllemacyptavexdu6lx2wfscxnlkokcwvbpb6bepn25wtp4q/day7.json";
    }
    if (milestone == 15) {
        return "ipfs://bafybeif5ujkllemacyptavexdu6lx2wfscxnlkokcwvbpb6bepn25wtp4q/day15.json";
    }
    if (milestone == 30) {
        return "ipfs://bafybeif5ujkllemacyptavexdu6lx2wfscxnlkokcwvbpb6bepn25wtp4q/day30.json";
    }
    if (milestone == 60) {
        return "ipfs://bafybeif5ujkllemacyptavexdu6lx2wfscxnlkokcwvbpb6bepn25wtp4q/day60.json";
    }

    return "";
}
}