// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NoSmokeNFT is ERC721 {
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

        _mint(user, tokenId);

        milestones[tokenId] = MilestoneNFT({
            milestone: milestone,
            timestamp: block.timestamp
        });

        userTokens[user].push(tokenId);
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