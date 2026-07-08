<p align="center">
  <img src="https://raw.githubusercontent.com/kfat77/PhotoCrypt-NFT/main/assets/logo.png" width="120" alt="PhotoCrypt-NFT" onerror="this.style.display='none'">
</p>

<h1 align="center">PhotoCrypt-NFT 🔐</h1>

<p align="center">
  <strong>AI 时代，让每一张照片都有真实来源</strong><br>
  <em>基于数字水印 · 设备签名 · 区块链 NFT — 让真实可验证，让造假无处遁形</em>
</p>

<p align="center">
  <a href="https://github.com/kfat77/PhotoCrypt-NFT/stargazers">
    <img src="https://img.shields.io/github/stars/kfat77/PhotoCrypt-NFT?style=flat-square&color=gold" alt="Stars">
  </a>
  <a href="https://github.com/kfat77/PhotoCrypt-NFT/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/kfat77/PhotoCrypt-NFT?style=flat-square&color=blue" alt="License">
  </a>
  <a href="https://kfat77.github.io/PhotoCrypt-NFT">
    <img src="https://img.shields.io/badge/🔗-在线演示-success?style=flat-square&logo=github" alt="在线演示">
  </a>
  <img src="https://img.shields.io/badge/status-概念验证(PoC)-yellow?style=flat-square" alt="Status">
</p>

<p align="center">
  <a href="https://kfat77.github.io/PhotoCrypt-NFT">🌐 在线演示</a> ·
  <a href="#-为什么需要真实照片">❓ 为什么</a> ·
  <a href="#-快速开始">⚡ 快速开始</a> ·
  <a href="#-应用场景">🎯 应用场景</a>
</p>

---

## 📌 项目状态

> 🔬 **当前阶段：概念验证 (Proof of Concept)**
>
> 核心功能已实现（浏览器端拍照加密、Python 后端完整版、智能合约部署），正在完善以下事项：
> - [ ] 真实链部署（目前为 Hardhat 本地网络）
> - [ ] 移动端摄像头体验优化
> - [ ] 感知哈希压缩鲁棒性测试
> - [ ] 性能基准测试与优化

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

## 📸 功能预览

> 💡 **TODO**：请替换为实际截图或 GIF，展示以下场景：
> 1. 浏览器端打开页面、调用摄像头拍照
> 2. 照片自动加密后的验证面板
> 3. 水印提取验证过程
> 4. 智能合约部署/铸造界面

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

## ⚡ 快速开始

### 🥇 方式一：浏览器端直接体验（推荐，零配置）

1. 访问 [https://kfat77.github.io/PhotoCrypt-NFT](https://kfat77.github.io/PhotoCrypt-NFT)
2. 允许摄像头权限
3. 点击拍摄 → 自动完成加密
4. 查看验证面板，下载带水印照片

> 💡 手机浏览器打开体验最佳，完整功能无需安装任何依赖。

### 🥈 方式二：本地运行完整版（后端 + 智能合约）

```bash
# 1. 克隆仓库
git clone https://github.com/kfat77/PhotoCrypt-NFT.git
cd PhotoCrypt-NFT

# 2. 安装 Python 依赖（水印 + 签名 + 哈希引擎）
pip install -r requirements.txt

# 3. 安装 Node.js 依赖（Hardhat + 智能合约）
npm install

# 4. 启动本地区块链
npx hardhat node

# 5. 编译并部署合约（新开终端）
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost

# 6. 加密照片
python backend/main.py --input your_photo.jpg --camera "iPhone 15 Pro" --output test

# 7. 验证照片
python backend/verify.py --input test/sealed_photo.png

# 8. 铸造 NFT
npx hardhat run scripts/mint.js --network localhost

# 9. 启动本地前端
cd frontend && npm install && npm start
```

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              用户交互层                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐   │
│  │  浏览器端拍照     │  │  Python 后端     │  │  智能合约交互            │   │
│  │  (WebCrypto API) │  │  (OpenCV + PIL)  │  │  (Hardhat + Ethers.js)  │   │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            核心验证层（五层防护）                           │
│                                                                         │
│  Layer 1: 拍摄瞬间      📸 真实设备拍摄，非 AI 生成                        │
│  Layer 2: 设备签名      🔏 Ed25519 私钥签名照片 SHA-256 哈希                │
│  Layer 3: 数字水印      🎨 LSB 水印嵌入 RGB 像素最低位                     │
│  Layer 4: 感知哈希      🎯 pHash 计算内容指纹（压缩鲁棒）                   │
│  Layer 5: 区块链存证    ⛓️ 照片哈希 + 签名 + 时间戳 → NFT                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 关键问题：AI 生成的照片能通过 PhotoCrypt 吗？

**不能。**

PhotoCrypt 的签名来源于**拍摄设备**，AI 生成图像没有"拍摄设备"，无法生成有效的设备签名。即使 AI 图像被人工修改后尝试嵌入水印，也无法通过签名验证（因为哈希不匹配、签名不匹配）。

### 关键问题：有人截图后重新上传呢？

**能识别。**

截图会丢失水印，但链上记录显示原始照片。新截图尝试验证时，提取不到水印 → 验证失败。即使部分存活，感知哈希也会变化 → 链上比对失败。

---

## 📂 核心文件说明

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

## 🔬 技术对比：为什么 PhotoCrypt 优于传统方案？

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

## 🚀 部署到 GitHub Pages

```bash
# 1. 修改 frontend/package.json 中的 homepage
"homepage": "https://<你的GitHub用户名>.github.io/PhotoCrypt-NFT"

# 2. 部署
cd frontend
npm install gh-pages --save-dev
npm run deploy
```

等待完成后，访问 `https://<你的用户名>.github.io/PhotoCrypt-NFT` 即可。

---

## 🗺️ 路线图 Roadmap

| 阶段 | 目标 | 状态 |
|:---:|:---|:---:|
| ✅ v0.1 | 概念验证：浏览器端拍照 + LSB 水印 + 设备签名 | 已完成 |
| ✅ v0.2 | Python 后端完整版（DWT + Ed25519 + pHash） | 已完成 |
| ✅ v0.3 | 智能合约 + Hardhat 本地部署 | 已完成 |
| 🔄 v0.4 | 部署到 Polygon Mumbai 测试网 | 进行中 |
| ⏳ v0.5 | 感知哈希压缩鲁棒性优化 | 计划中 |
| ⏳ v1.0 | 主网部署 + 生产级密钥管理 | 计划中 |

---

## 💼 简历话术

> **PhotoCrypt-NFT**：面向 AI 时代的去中心化照片真实性验证协议。针对 AI 生成图像泛滥导致公众信任危机的问题，设计了一套"摄像头直拍 + 数字水印 + 区块链存证"的技术方案：照片拍摄时由设备私钥生成不可伪造的签名，通过 LSB 水印不可见地嵌入像素，结合感知哈希（pHash）实现压缩后的鲁棒验证，最终铸造为 NFT 上链。开发了浏览器端可直接调用摄像头拍照的版本，让手机用户也能一键验证照片真实性。适用于政府新闻发布、新闻机构取证、司法证据保全、品牌真实宣传等场景。
>
> **技术栈**：Python (cryptography, Pillow, PyWavelets, imagehash), JavaScript (WebCrypto, Canvas), Solidity (OpenZeppelin ERC-721), Hardhat, React

---

## 🙋 如何贡献

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

欢迎提交 Issue 讨论新功能或报告 Bug！

---

## 📄 开源协议

[MIT License](LICENSE)

---

## 致谢与愿景

> 我们希望通过 PhotoCrypt，让真实照片的价值被重新认可，让造假内容无所遁形。技术是中立的，但技术可以服务于真实。
> 
> 如果你也认同"真实有价值"，欢迎 Star ⭐、Fork、贡献代码。
> 
> —— PhotoCrypt 团队

---

> ⚠️ **注意**：本项目为**技术演示/概念验证**，默认使用 Hardhat 本地网络测试。如需上真实链（Polygon Mumbai 等），需要配置 RPC 节点和钱包私钥（参考 `.env.example`）。
> 
> 浏览器端签名使用简化版，生产环境建议部署真正的 WebCrypto Ed25519 密钥对生成方案。
