// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IBadge {
    function mintBadge(address user, uint milestone) external;
}

contract NoSmokeNFT is ERC721 {

    struct UserData {
        uint256 streak;
        uint256 lastUpdate;
    }

    mapping(address => UserData) public users;
    mapping(address => mapping(uint256 => bool)) public mintedMilestones;

    uint256[] public milestoneSteps = [1, 7, 15, 30, 60];

    address public badgeContract;

    constructor(address _badgeContract) ERC721("NoSmokeNFT", "NSNFT") {
        badgeContract = _badgeContract;
    }
    // zadnje dodano, ali nigdej na ne ispisuje
 function getStreak(address user) external view returns (uint256) {
    return users[user].streak;
}
    function markSmokeFree() external {
        UserData storage user = users[msg.sender];
        // dodati za stvarnu upotrebu
        /* if (block.timestamp > user.lastUpdate + 2 days) {
            user.streak = 0;
        } 
        */

        user.streak += 1;
        user.lastUpdate = block.timestamp;

        for (uint i = 0; i < milestoneSteps.length; i++) {
            uint milestone = milestoneSteps[i];

            if (
                user.streak == milestone &&
                !mintedMilestones[msg.sender][milestone]
            ) {
                IBadge(badgeContract).mintBadge(msg.sender, milestone);

                mintedMilestones[msg.sender][milestone] = true;
            }
        }
    }
}