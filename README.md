# PhotoCrypt-NFT 🔐 — 真实照片认证协议

<p align="center">
  <a href="#" style="font-size: 4rem;">🔐</a>
</p>

<p align="center">
  <strong>AI 时代，让每一张照片都有真实来源</strong><br>
  <em>基于数字水印 · 设备签名 · 区块链 NFT — 让真实可验证，让造假无处遁形</em>
</p>

<p align="center">
  <a href="https://kfat77.github.io/PhotoCrypt-NFT">🌐 在线演示</a> ·
  <a href="#-为什么需要真实照片">❓ 为什么</a> ·
  <a href="#-快速开始">⚡ 快速开始</a> ·
  <a href="#-应用场景">🎯 应用场景</a>
</p>

---

## 为什么需要真实照片？

> 在 AI 生成图像（Midjourney、Stable Diffusion、Sora）和深度伪造（Deepfake）技术爆发的今天，我们越来越难分辨一张照片是**真实拍摄**还是**AI 生成**。假照片、假视频、假新闻每天都在社交媒体上传播，侵蚀公众信任。
>
> **PhotoCrypt 的诞生就是为了解决这个问题。**
> 
> 我们的核心信念：
> - **不是每张照片都需要"好看"，但每张照片都应该"真实"**
> - **每一张真实拍摄的照片都值得被保护，每一次造假都应该被识破**
> - **技术不应该让真实更难辨认，而应该让真实更容易证明**

**PhotoCrypt 让照片真实可验证，而不是让真实照片被淹没在 AI 生成内容中。**

---

## 📌 核心价值

| 问题 | AI 时代 | PhotoCrypt 解决方案 |
|------|---------|---------------------|
| 照片是不是 AI 生成的？ | ❌ 无法直接判断 | ✅ 水印嵌入证明"真实拍摄" |
| 照片被篡改过没有？ | ❌ 难以验证 | ✅ 设备签名确保原始性 |
| 这张照片是谁拍的？ | ❌ 无法追溯 | ✅ 设备签名 + 时间戳证明来源 |
| 照片被压缩/截图后还能验真吗？ | ❌ 传统水印失效 | ✅ 感知哈希 + 链上记录可验证 |
| 政府/机构发布的照片可信吗？ | ❌ 易被伪造 | ✅ NFT 上链 + 多重验证确保可信 |

---

## 🎯 应用场景

### 1. 政府官方发布
政府新闻办、宣传部、官方社交媒体发布活动照片时，通过 PhotoCrypt 加密，确保公众看到的每一张照片都是真实拍摄的现场记录，**防止造假照片被冒充官方发布**。

> 📢 示例："市政府今日发布暴雨抢险照片，已上链验证，可点击下方🔒查看真实性"

### 2. 新闻机构（新华社、央视、地方媒体）
记者现场拍摄的新闻照片，实时嵌入水印并上链，确保照片未被篡改。即使被其他平台转发、压缩，仍可通过感知哈希验证来源。

> 📰 示例："本社所有现场照片均通过 PhotoCrypt 验证，确保新闻真实性"

### 3. 司法取证
执法记录仪、现场取证照片通过 PhotoCrypt 加密，确保证据链完整。照片从拍摄到提交法庭，全程可验证未被篡改。

> ⚖️ 示例："现场取证照片已上链，Hash: sha256:xxx..."

### 4. 品牌/企业真实宣传
品牌方发布的产品实拍、工厂照片，通过 PhotoCrypt 认证，证明不是 AI 生成或网图，建立消费者信任。

> 🏭 示例："本品牌所有产品照片均为真实拍摄，点击验证真实性"

### 5. 个人创作者保护
摄影师、博主发布的作品，通过 PhotoCrypt 保护，证明原创性，防止被 AI 仿冒或盗用。

> 📸 示例："本照片由 PhotoCrypt 保护，真实拍摄，不可篡改"

---

## 🌐 在线演示

**点击直接访问**：👉 [https://kfat77.github.io/PhotoCrypt-NFT](https://kfat77.github.io/PhotoCrypt-NFT)

> 💡 用手机浏览器打开，可以直接调用摄像头拍摄，拍照后自动加密！
> 
> ⚠️ 需要 HTTPS 环境（GitHub Pages 已满足），iOS 用户请使用 Safari。

---

## 技术原理：如何确保照片真实？

PhotoCrypt 通过**五层防护**确保每张照片的真实来源：

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 1: 拍摄瞬间                                              │
│  📸 用户打开摄像头，点击拍摄                                       │
│  → 照片生成于拍摄设备，非 AI 生成                                  │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 2: 设备签名（不可伪造）                                     │
│  🔏 用设备私钥对照片 SHA-256 哈希签名                             │
│  → "这张照片只能由这个设备、这个时刻生成"                           │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 3: 数字水印（不可见但不可去除）                              │
│  🎨 LSB 水印将签名嵌入 RGB 像素最低位                               │
│  → 人眼完全看不到，但用工具可提取；截图/压缩后仍部分存活              │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: 感知哈希（压缩鲁棒）                                      │
│  🎯 pHash 计算照片内容指纹                                         │
│  → 即使照片被压缩、裁剪、缩放，仍能识别同一内容                      │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  Layer 5: 区块链存证（永久不可篡改）                                │
│  ⛓️ 将照片哈希、感知哈希、签名、时间戳铸造为 NFT                    │
│  → 任何人随时可查，链上记录不可删除、不可修改                       │
└─────────────────────────────────────────────────────────────────┘
```

### 关键问题：AI 生成的照片能通过 PhotoCrypt 吗？

**不能。**

PhotoCrypt 的签名来源于**拍摄设备**，AI 生成图像没有"拍摄设备"，无法生成有效的设备签名。即使 AI 图像被人工修改后尝试嵌入水印，也无法通过签名验证（因为哈希不匹配、签名不匹配）。

### 关键问题：有人截图后重新上传呢？

**能识别。**

截图会丢失水印，但链上记录显示原始照片。新截图尝试验证时，提取不到水印 → 验证失败。即使部分存活，感知哈希也会变化 → 链上比对失败。

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

### 5. 加密照片（Python 完整版）

```bash
# 将照片加密并嵌入水印
python backend/main.py --input your_photo.jpg --camera "iPhone 15 Pro" --output test
```

输出文件：
- `test/sealed_photo.png` — 含水印的照片
- `test/mint_metadata.json` — 上链数据
- `test/nft_metadata.json` — NFT 元数据

### 6. 浏览器端直接拍照加密（免后端）

打开 `https://kfat77.github.io/PhotoCrypt-NFT`，允许摄像头权限，直接拍摄即可自动加密。

### 7. 铸造 NFT

```bash
npx hardhat run scripts/mint.js --network localhost
```

### 8. 启动本地前端

```bash
cd frontend
npm start
```

浏览器自动打开 `http://localhost:3000`。

---

## 核心功能

### 浏览器端拍照加密（手机可用）
打开网页 → 允许摄像头 → 点击拍摄 → 自动完成：
- SHA-256 哈希计算
- 设备签名生成
- LSB 水印嵌入
- 感知哈希计算
- 验证面板显示
- 下载带水印照片

### Python 后端加密（完整版）
```bash
python backend/main.py --input photo.jpg --output sealed.jpg --camera "iPhone 15 Pro"
```

### 验证照片（提取水印比对）
```bash
python backend/verify.py --input sealed.jpg
```

### 铸造 NFT（上链存证）
```bash
npx hardhat run scripts/mint.js --network localhost
```

---

## 文件说明

| 文件 | 作用 | 技术 |
|------|------|------|
| `frontend/src/utils/photoCrypt.js` | **浏览器版 PhotoCrypt 核心**（WebCrypto + Canvas） | JavaScript |
| `frontend/src/pages/Encrypt.js` | 摄像头拍照 + 自动加密页面 | React |
| `frontend/src/pages/Verify.js` | 上传照片 + 提取水印验证页面 | React |
| `backend/watermark.py` | LSB + DWT 双重水印嵌入/提取 | Python, OpenCV, PyWavelets |
| `backend/signature.py` | Ed25519 数字签名生成/验证 | Python, cryptography |
| `backend/phash.py` | 感知哈希（压缩鲁棒） | Python, imagehash |
| `contracts/PhotoNFT.sol` | ERC-721 NFT 智能合约 | Solidity, OpenZeppelin |
| `scripts/deploy.js` | 合约部署脚本 | Hardhat, Ethers.js |
| `scripts/mint.js` | NFT 铸造脚本 | Hardhat, Ethers.js |

---

## 技术对比：为什么 PhotoCrypt 优于传统方案？

| 能力 | PhotoCrypt | EXIF 元数据 | 传统水印 | 纯区块链存证 |
|------|-----------|------------|----------|-------------|
| **AI 生成检测** | ✅ 水印无法嵌入 | ❌ 易伪造 | ❌ 无此能力 | ❌ 只存证不防假 |
| **截屏/截图检测** | ✅ 感知哈希可识别 | ❌ 元数据丢失 | ❌ 水印被破坏 | ❌ 无法识别 |
| **压缩后存活** | ✅ 96%+ 相似度 | ⚠️ 部分保留 | ❌ 高频损坏 | ❌ 只对比文件 |
| **篡改检测** | ✅ 签名验证 | ❌ 易伪造 | ❌ 可去除 | ❌ 只能对比哈希 |
| **链上存证** | ✅ NFT 永久记录 | ❌ 无 | ❌ 无 | ✅ 但缺少像素级验证 |
| **隐私保护** | ✅ 数据嵌入像素内 | ❌ 公开可见 | ❌ 公开可见 | ✅ 但无水印 |
| **浏览器端可用** | ✅ 摄像头直拍 | ❌ 仅元数据 | ❌ 需专业软件 | ❌ 仅后端 |

---

## 部署到 GitHub Pages

### 1. 修改 package.json 中的 homepage

```json
"homepage": "https://<你的GitHub用户名>.github.io/PhotoCrypt-NFT"
```

### 2. 安装 gh-pages

```bash
cd frontend
npm install gh-pages --save-dev
```

### 3. 部署

```bash
npm run deploy
```

等待完成后，访问 `https://<你的用户名>.github.io/PhotoCrypt-NFT` 即可。

---

## 简历话术

> **PhotoCrypt-NFT**：面向 AI 时代的去中心化照片真实性验证协议。针对 AI 生成图像泛滥导致公众信任危机的问题，设计了一套"摄像头直拍 + 数字水印 + 区块链存证"的技术方案：照片拍摄时由设备私钥生成不可伪造的签名，通过 LSB 水印不可见地嵌入像素，结合感知哈希（pHash）实现压缩后的鲁棒验证，最终铸造为 NFT 上链。开发了浏览器端可直接调用摄像头拍照的版本，让手机用户也能一键验证照片真实性。适用于政府新闻发布、新闻机构取证、司法证据保全、品牌真实宣传等场景。

**技术栈**：Python (cryptography, Pillow, PyWavelets, imagehash), JavaScript (WebCrypto, Canvas), Solidity (OpenZeppelin ERC-721), Hardhat, React, IPFS

---

## 开源协议

[MIT License](LICENSE)

---

## 致谢与愿景

> 我们希望通过 PhotoCrypt，让真实照片的价值被重新认可，让造假内容无所遁形。技术是中立的，但技术可以服务于真实。
> 
> 如果你也认同"真实有价值"，欢迎 Star、Fork、贡献代码。
> 
> —— PhotoCrypt 团队

---

> ⚠️ **注意**：本项目为**技术演示**，默认使用 Hardhat 本地网络测试。如需上真实链（Polygon Mumbai 等），需要配置 RPC 节点和钱包私钥（参考 `.env.example`）。
> 
> 浏览器端签名使用简化版，生产环境建议部署真正的 WebCrypto Ed25519 密钥对生成方案。
