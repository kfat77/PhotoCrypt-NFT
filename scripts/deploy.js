const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("账户余额:", ethers.formatEther(balance), "ETH");

  console.log("\n正在编译并部署 PhotoNFT 合约...");
  const PhotoNFT = await ethers.getContractFactory("PhotoNFT");
  const photoNFT = await PhotoNFT.deploy();
  await photoNFT.waitForDeployment();

  const address = await photoNFT.getAddress();
  console.log("\n========================================");
  console.log("PhotoNFT 合约已部署！");
  console.log("合约地址:", address);
  console.log("========================================");
  console.log("\n请复制上面的地址，粘贴到前端界面的 '智能合约配置' 中。");
  console.log("同时在 .env 文件中设置: CONTRACT_ADDRESS=" + address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
