// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NoSmokeNFT is ERC721, Ownable {

    uint256 public tokenCounter;
    mapping(address => uint256) public streaks;

    constructor() ERC721("NoSmokeBadge", "NSB") {
        tokenCounter = 0;
    }

    function markDay(address user) public onlyOwner {
        streaks[user] += 1;

        if (streaks[user] == 7 || streaks[user] == 14 || streaks[user] == 21) {
            _safeMint(user, tokenCounter);
            tokenCounter++;
        }
    }

    function relapse(address user) public onlyOwner {
        streaks[user] = 0;
    }
}