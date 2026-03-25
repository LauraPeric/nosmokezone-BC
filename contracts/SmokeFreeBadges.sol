// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmokeFreeBadges is ERC721URIStorage, Ownable {

    uint256 public tokenId;

    mapping(address => mapping(uint => bool)) public hasBadge;

    constructor() ERC721("SmokeFreeBadge", "SFB") {}

    function mintBadge(address user, uint milestone) public {

        require(
            milestone == 1 ||
            milestone == 7 ||
            milestone == 15 ||
            milestone == 30 ||
            milestone == 60,
            "Invalid milestone"
        );

        require(!hasBadge[user][milestone], "Already claimed");

        tokenId++;

        _safeMint(user, tokenId);

        string memory uri = getTokenURI(milestone);
        _setTokenURI(tokenId, uri);

        hasBadge[user][milestone] = true;
    }

    function getTokenURI(uint milestone) internal pure returns (string memory) {

        if (milestone == 1) {
            return "https://raw.githubusercontent.com/LauraPeric/nosmokezone-BC/b8dfb55/metadata/day1.json";
        }
        if (milestone == 7) {
            return "https://raw.githubusercontent.com/LauraPeric/nosmokezone-BC/b8dfb55/metadata/day7.json";
        }
        if (milestone == 15) {
            return "https://raw.githubusercontent.com/LauraPeric/nosmokezone-BC/b8dfb55/metadata/day15.json";
        }
        if (milestone == 30) {
            return "https://raw.githubusercontent.com/LauraPeric/nosmokezone-BC/b8dfb55/metadata/day30.json";
        }
        if (milestone == 60) {
            return "https://raw.githubusercontent.com/LauraPeric/nosmokezone-BC/b8dfb55/metadata/day60.json";
        }

        return "";
    }
}