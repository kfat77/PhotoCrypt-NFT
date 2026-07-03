const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // 从 mint_metadata.json 读取上链数据
  const metadataPath = path.join(__dirname, "..", "test", "mint_metadata.json");
  
  if (!fs.existsSync(metadataPath)) {
    console.error("[✗] 找不到 mint_metadata.json");
    console.error("   请先运行: python backend/main.py --input <照片> --camera <型号>");
    process.exit(1);
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  console.log("[>] 读取到上链数据:");
  console.log(JSON.stringify(metadata, null, 2));

  // 从 .env 或环境变量读取合约地址
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 默认Hardhat #0
  
  const [signer] = await ethers.getSigners();
  console.log("\n[>] 使用账户:", signer.address);

  // 连接合约
  const PhotoNFT = await ethers.getContractFactory("PhotoNFT");
  const photoNFT = PhotoNFT.attach(contractAddress);

  // 读取 NFT metadata URI
  const nftMetaPath = path.join(__dirname, "..", "test", "nft_metadata.json");
  let tokenURI = "ipfs://QmPlaceholder"; // 默认
  if (fs.existsSync(nftMetaPath)) {
    const nftMeta = JSON.parse(fs.readFileSync(nftMetaPath, "utf8"));
    tokenURI = nftMeta.image || tokenURI;
  }

  console.log("\n[>] 开始铸造 NFT...");
  console.log("    IPFS CID:", metadata.ipfsCID);
  console.log("    pHash:", metadata.perceptualHash.substring(0, 30) + "...");
  console.log("    Camera:", metadata.cameraModel);

  const tx = await photoNFT.mintPhotoNFT(
    metadata.ipfsCID,
    metadata.perceptualHash,
    metadata.deviceSignature,
    metadata.cameraModel,
    tokenURI
  );

  const receipt = await tx.wait();
  
  // 从事件日志解析 tokenId
  const event = receipt.logs.find(
    log => {
      try {
        const parsed = photoNFT.interface.parseLog(log);
        return parsed && parsed.name === "PhotoMinted";
      } catch (e) {
        return false;
      }
    }
  );

  let tokenId = "?";
  if (event) {
    const parsed = photoNFT.interface.parseLog(event);
    tokenId = parsed.args.tokenId.toString();
  }

  console.log("\n========================================");
  console.log("NFT 铸造成功！");
  console.log("Token ID:", tokenId);
  console.log("交易哈希:", receipt.hash);
  console.log("合约地址:", contractAddress);
  console.log("========================================");
  console.log("\n现在可以在前端输入 Token ID 查询验证了！");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
