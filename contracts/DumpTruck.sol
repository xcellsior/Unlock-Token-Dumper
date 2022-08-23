// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface Umami {
    function transfer(address recipient, uint amount) external;
    function balanceOf(address guy) external view returns (uint256 balance);
    function allowance(address spender) external view returns (uint256);
    function approve(address spender, uint tokens) external returns (bool success);
}

interface mUmami {
    function approve(address spender, uint tokens) external returns (bool success);
    function withdraw() external;
    function transfer(address recipient, uint amount) external;
    function transferFrom(address sender, address recipient, uint amount) external returns (bool success);
    function balanceOf(address guy) external view returns (uint256 balance);
    function allowance(address spender) external view returns (uint256);
}

interface UniswapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(
        ExactInputSingleParams memory params
    ) external returns (uint256 amountOut);

}

contract DumpTruck is Ownable {

    mUmami immutable public _mUmami = mUmami(0x2AdAbD6E8Ce3e82f52d9998a7f64a90d294A92A4);
    Umami immutable public _Umami = Umami(0x1622bF67e6e5747b81866fE0b85178a93C7F86e3);
    UniswapRouter immutable public _UniswapRouter = UniswapRouter(0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45);
    IERC20 immutable public weth = IERC20(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1);

    function dump(uint256 minAmount) public {
        uint256 userBalance = _mUmami.balanceOf(msg.sender);
        require(_mUmami.transferFrom(msg.sender, address(this), userBalance), 'transfer failed');
        console.log('balance', _mUmami.balanceOf(address(this)));
        _mUmami.withdraw();

        uint256 umamiBalance = _Umami.balanceOf(address(this));

        if (_Umami.allowance(address(_UniswapRouter)) < umamiBalance) {
            _Umami.approve(address(_UniswapRouter), 99999999999999999999999);
        }

        UniswapRouter.ExactInputSingleParams memory params = UniswapRouter.ExactInputSingleParams({
            tokenIn: address(_Umami),
            tokenOut: address(weth),
            fee: 10000,
            recipient: address(this),
            deadline: 100000000000,
            amountIn: umamiBalance,
            amountOutMinimum: minAmount,
            sqrtPriceLimitX96: 0
        });
        _UniswapRouter.exactInputSingle(params);

        uint256 wethBalance = weth.balanceOf(address(this));

        weth.transfer(msg.sender, wethBalance);
    }

    function recoverERC20(address tokenAddress, uint256 tokenAmount) public virtual onlyOwner {
        IERC20(tokenAddress).transfer(owner(), tokenAmount);
    }
}
