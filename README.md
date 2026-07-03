# PhotoCrypt-NFT 🔐

<p align="center">
  <a href="#" style="font-size: 4rem;">🔐</a>
</p>

<p align="center">
  <strong>去中心化照片真实性验证系统</strong><br>
  <em>基于数字水印 · 隐写术 · 区块链 NFT</em>
</p>

<p align="center">
  <a href="https://kfat77.github.io/PhotoCrypt-NFT">🌐 在线演示</a> ·
  <a href="#-快速开始">⚡ 快速开始</a> ·
  <a href="#-技术架构">🏗️ 架构</a> ·
  <a href="#-部署到-github-pages">🚀 部署</a>
</p>

---

## 概述

PhotoCrypt-NFT 是一套**去中心化照片真实性验证系统**。它结合数字水印、隐写术与区块链技术，为每张照片生成不可篡改的数字身份证明。

**核心能力**：
- 📸 拍照 → 🔏 设备签名 → 🎨 双重水印 → 🎯 感知哈希 → ⛓️ NFT 上链
- ✅ 即使照片被压缩、裁剪、截图，仍可通过感知哈希验证来源
- ✅ 水印不可见嵌入像素，肉眼无法察觉
- ✅ 链上 NFT 永久记录，不可篡改

---

## 🌐 在线演示

**点击直接访问**：👉 [https://kfat77.github.io/PhotoCrypt-NFT](https://kfat77.github.io/PhotoCrypt-NFT)

> ⚠️ 在线演示为**纯前端展示**，加密/验证的核心功能需运行本地 Python 后端。

---

## 技术架构

```
拍摄照片
    │
    ▼
[EXIF 提取] 元数据 + 时间戳
    │
    ▼
[Ed25519 签名] 设备私钥对照片哈希签名
    │
    ▼
[LSB + DWT 双重水印] 将签名嵌入像素
    │
    ▼
[感知哈希 pHash] 计算压缩鲁棒哈希
    │
    ▼
[IPFS] 上传加密照片
    │
    ▼
[智能合约] 铸造 NFT，记录 CID + pHash + 签名
    │
    ▼
验证端：提取水印 → 比对链上 → 返回真/假
```

---

## ⚡ 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/kfat77/PhotoCrypt-NFT.git
cd PhotoCrypt-NFT
```

### 2. 安装依赖

**Python 依赖**（水印 + 签名 + 哈希引擎）：
```bash
pip install -r requirements.txt
```

**Node.js 依赖**（Hardhat + 智能合约）：
```bash
npm install
```

**前端依赖**：
```bash
cd frontend && npm install && cd ..
```

### 3. 启动本地区块链

```bash
npx hardhat node
```

> 这个窗口不要关，保持运行。

### 4. 编译并部署合约

```bash
# 新开一个终端窗口
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

复制输出的合约地址，后续会用到。

### 5. 加密照片

```bash
# 将照片加密并嵌入水印
python backend/main.py --input your_photo.jpg --camera "iPhone 15 Pro" --output test
```

输出文件：
- `test/sealed_photo.png` — 含水印的照片
- `test/mint_metadata.json` — 上链数据
- `test/nft_metadata.json` — NFT 元数据

### 6. 铸造 NFT

```bash
npx hardhat run scripts/mint.js --network localhost
```

### 7. 启动前端

```bash
cd frontend
npm start
```

浏览器自动打开 `http://localhost:3000`，输入 Token ID 即可验证。

---

## 核心功能

### 加密照片（嵌入水印）
```bash
python backend/main.py --input photo.jpg --output sealed.jpg --camera "iPhone 15 Pro"
```

### 验证照片（提取水印比对）
```bash
python backend/verify.py --input sealed.jpg
```

### 铸造 NFT
```bash
npx hardhat run scripts/mint.js --network localhost
```

### 网页验证
打开前端界面，上传照片或输入 Token ID，一键查询链上记录。

---

## 文件说明

| 文件 | 作用 | 技术 |
|------|------|------|
| `backend/watermark.py` | LSB + DWT 双重水印嵌入/提取 | Python, OpenCV, PyWavelets |
| `backend/signature.py` | Ed25519 数字签名生成/验证 | Python, cryptography |
| `backend/phash.py` | 感知哈希（压缩鲁棒） | Python, imagehash |
| `backend/ipfs.py` | IPFS 上传（模拟/真实） | Python, requests |
| `backend/main.py` | 主程序：加密流程 | Python |
| `backend/verify.py` | 验证脚本：提取水印 + 签名 | Python |
| `contracts/PhotoNFT.sol` | ERC-721 NFT 智能合约 | Solidity, OpenZeppelin |
| `scripts/deploy.js` | 合约部署脚本 | Hardhat, Ethers.js |
| `scripts/mint.js` | NFT 铸造脚本 | Hardhat, Ethers.js |
| `frontend/src/` | React 前端（苹果风格） | React, React Router, CSS |

---

## 🚀 部署到 GitHub Pages

让你的项目有一个在线展示页面，任何人点开就能看：

### 1. 修改 package.json 中的 homepage

```json
"homepage": "https://<你的GitHub用户名>.github.io/PhotoCrypt-NFT"
```

### 2. 安装 gh-pages

```bash
cd frontend
npm install gh-pages --save-dev
```

### 3. 添加部署脚本

`package.json` 中已包含：
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

### 4. 部署

```bash
npm run deploy
```

等待完成后，访问 `https://<你的用户名>.github.io/PhotoCrypt-NFT` 即可。

---

## 技术亮点

| 维度 | 技术方案 | 优势 |
|------|----------|------|
| **水印** | LSB + DWT 双重 | 不可见 + 压缩鲁棒 |
| **签名** | Ed25519 椭圆曲线 | 快速、安全、短签名 |
| **哈希** | pHash + dHash + aHash | 压缩/裁剪后仍可识别 |
| **存证** | ERC-721 NFT | 链上永久记录，不可篡改 |
| **存储** | IPFS | 去中心化，内容寻址 |
| **前端** | React + 苹果风格 | 毛玻璃、动画、响应式 |

---

## 对比传统方案

| 能力 | PhotoCrypt | EXIF 元数据 | 传统水印 |
|------|-----------|------------|----------|
| 截屏/截图检测 | ✅ 感知哈希可识别 | ❌ 元数据丢失 | ❌ 水印被破坏 |
| 压缩后存活 | ✅ 96%+ 相似度 | ⚠️ 部分保留 | ❌ 高频损坏 |
| 篡改检测 | ✅ 签名验证 | ❌ 易伪造 | ❌ 可去除 |
| 链上存证 | ✅ NFT 永久记录 | ❌ 无 | ❌ 无 |
| 隐私保护 | ✅ 数据嵌入像素内 | ❌ 公开可见 | ❌ 公开可见 |

---

## 简历话术

> **PhotoCrypt-NFT**：基于数字水印、隐写术和区块链的去中心化照片真实性验证系统。采用 **LSB + DWT 双重水印**将设备 Ed25519 签名不可见地嵌入照片像素，结合**感知哈希（pHash）**实现压缩/裁剪后的鲁棒验证，通过 **Hardhat + Solidity** 在以太坊上铸造 NFT 记录照片来源，并开发 **React 前端**实现一键链上验证。解决了传统水印易被截屏/压缩破坏、EXIF 元数据易被篡改的问题，适用于新闻摄影、司法取证、数字版权保护等场景。

**技术栈**：Python (cryptography, Pillow, PyWavelets, imagehash), Solidity (OpenZeppelin ERC-721), Hardhat, React, IPFS

---

## 开源协议

[MIT License](LICENSE)

---

> ⚠️ **注意**：本项目为**技术演示**，默认使用 Hardhat 本地网络测试。如需上真实链（Polygon Mumbai 等），需要配置 RPC 节点和钱包私钥（参考 `.env.example`）。
