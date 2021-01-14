// contracts/MyNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
// import "hardhat/console.sol";

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// contract MyNFT is ERC721 {
//     constructor() ERC721("MyNFT", "MNFT") {}
// }

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ExampleToken is ERC20 {
    constructor() ERC20("ExampleToken", "EGT") {
        _mint(msg.sender, 10000 * (10**uint256(decimals())));
    }
}
