// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NoSmokeNFT is ERC721URIStorage {

    struct UserData {
        uint256 streak;
        uint256 lastUpdate;
    }

    struct MilestoneNFT {
        uint256 milestone;
        uint256 timestamp;
    }

    mapping(address => UserData) public users;
    mapping(uint256 => MilestoneNFT) public milestones;
    mapping(address => uint256[]) public userTokens;

    //tracking mintanih milestona
    mapping(address => mapping(uint256 => bool)) public mintedMilestones;

    uint256[] public milestoneSteps = [1, 7, 15, 30, 60];

    constructor() ERC721("NoSmokeNFT", "NSNFT") {}

    function markSmokeFree() external {
        UserData storage user = users[msg.sender];

        // reset streak ako user preskoči 2 dana
        if (block.timestamp > user.lastUpdate + 2 days) {
            user.streak = 0;
        }

        user.streak += 1;
        user.lastUpdate = block.timestamp;

        // provjera milestona
        for (uint i = 0; i < milestoneSteps.length; i++) {
            uint milestone = milestoneSteps[i];

            if (
                user.streak == milestone &&
                !mintedMilestones[msg.sender][milestone]
            ) {
                _mintMilestone(msg.sender, milestone);

                // markiraj da je mintano
                mintedMilestones[msg.sender][milestone] = true;
            }
        }
    }

    function _mintMilestone(address user, uint milestone) internal {
        uint tokenId = uint(
            keccak256(abi.encodePacked(user, milestone, block.timestamp))
        );

        _safeMint(user, tokenId);

        // ✅ DODANO → metadata (slike)
        _setTokenURI(tokenId, getTokenURI(milestone));

        milestones[tokenId] = MilestoneNFT({
            milestone: milestone,
            timestamp: block.timestamp
        });

        userTokens[user].push(tokenId);
    }

    // ✅ DODANO → iz SmokeFreeBadges
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

    function getUserData(address user) external view returns (uint, uint) {
        return (users[user].streak, users[user].lastUpdate);
    }

    function getUserTokens(address user) external view returns (uint[] memory) {
        return userTokens[user];
    }

    function getMilestone(uint tokenId) external view returns (uint) {
        return milestones[tokenId].milestone;
    }
}