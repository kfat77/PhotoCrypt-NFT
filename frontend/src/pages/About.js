import React from 'react';

function About() {
  const techStack = [
    { category: '水印引擎', items: ['LSB 隐写术', 'DWT 离散小波变换', 'OpenCV 图像处理', 'Pillow 图像库'] },
    { category: '密码学', items: ['Ed25519 椭圆曲线签名', 'SHA-256 哈希', 'Fernet AES 对称加密', 'PyCryptodome'] },
    { category: '感知哈希', items: ['pHash (DCT-based)', 'dHash (梯度差)', 'aHash (均值)', 'imagehash 库'] },
    { category: '区块链', items: ['Solidity ERC-721', 'OpenZeppelin 合约库', 'Hardhat 开发框架', 'Ethers.js'] },
    { category: '存储', items: ['IPFS 去中心化存储', 'Pinata / Infura 网关', 'CID 内容寻址'] },
    { category: '前端', items: ['React 18', 'React Router', 'Apple 风格设计', 'CSS 毛玻璃效果'] },
  ];

  const comparisons = [
    { feature: '截屏/截图检测', us: '✅ 感知哈希可识别', exif: '❌ 元数据丢失', watermark: '❌ 水印被破坏' },
    { feature: '压缩后存活', us: '✅ 96%+ 相似度', exif: '⚠️ 部分保留', watermark: '❌ 高频损坏' },
    { feature: '篡改检测', us: '✅ 签名验证', exif: '❌ 易伪造', watermark: '❌ 可去除' },
    { feature: '链上存证', us: '✅ NFT 永久记录', exif: '❌ 无', watermark: '❌ 无' },
    { feature: '隐私保护', us: '✅ 数据嵌入像素内', exif: '❌ 公开可见', watermark: '❌ 公开可见' },
  ];

  return (
    <div>
      <section className="hero-gradient" style={{ padding: '140px 0 60px', textAlign: 'center' }}>
        <div className="container">
          <div className="badge badge-purple" style={{ marginBottom: '20px' }}>
            ℹ️ 关于 PhotoCrypt
          </div>
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>
            技术<span className="text-gradient-purple">原理</span>与实现
          </h1>
          <p className="body-large" style={{ maxWidth: '640px', margin: '0 auto' }}>
            PhotoCrypt 结合数字水印、密码学与区块链技术，构建了一套去中心化的照片真实性验证体系
          </p>
        </div>
      </section>

      {/* Why PhotoCrypt */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="heading-lg" style={{ marginBottom: '16px' }}>
              为什么选择 PhotoCrypt？
            </h2>
            <p className="body-large" style={{ maxWidth: '560px', margin: '0 auto' }}>
              传统方法各有缺陷，PhotoCrypt 通过多层组合解决了单一技术的局限
            </p>
          </div>

          <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '16px 20px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>
                      能力对比
                    </th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.9rem' }}>
                      🔐 PhotoCrypt
                    </th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>
                      EXIF 元数据
                    </th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>
                      传统水印
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 500 }}>{row.feature}</td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--accent-green)', fontWeight: 600 }}>
                        {row.us}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        {row.exif}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        {row.watermark}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="heading-lg" style={{ marginBottom: '16px' }}>
              系统架构
            </h2>
            <p className="body-large" style={{ maxWidth: '560px', margin: '0 auto' }}>
              从拍摄到验证，六层独立防线确保照片真实性
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {[
              { title: 'Layer 1: EXIF 元数据提取', desc: '提取拍摄时间、GPS、相机型号等原始信息，作为第一层验证依据。' },
              { title: 'Layer 2: Ed25519 数字签名', desc: '设备私钥对照片哈希签名，生成不可伪造的"拍摄者身份证明"。' },
              { title: 'Layer 3: LSB 隐写水印', desc: '将签名字串嵌入 RGB 像素的最低 2 位，人眼完全不可见。' },
              { title: 'Layer 4: DWT 小波水印', desc: '在 Y 通道的 DWT 低频系数中嵌入签名摘要，抵抗压缩和缩放。' },
              { title: 'Layer 5: 感知哈希 (pHash)', desc: '计算 DCT 频域哈希，作为压缩/裁剪后的内容指纹，用于链上查重。' },
              { title: 'Layer 6: NFT 链上存证', desc: '将 IPFS CID、感知哈希、设备签名铸造为 ERC-721 NFT，永久不可篡改。' },
            ].map((layer, i) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                <div className="chain-link">
                  <div className="step-number" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '4px' }}>
                      {layer.title}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {layer.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="heading-lg" style={{ marginBottom: '16px' }}>
              技术栈
            </h2>
            <p className="body-large" style={{ maxWidth: '560px', margin: '0 auto' }}>
              全栈开源，Python + Solidity + React 技术组合
            </p>
          </div>

          <div className="feature-grid-3">
            {techStack.map((stack, i) => (
              <div key={i} className="glass-card" style={{ padding: '28px' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '16px', color: 'var(--accent-blue)' }}>
                  {stack.category}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {stack.items.map((item, j) => (
                    <li key={j} style={{ padding: '6px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub CTA */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="glass-card-lg" style={{ padding: '60px 40px', maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🌟</div>
            <h2 className="heading-lg" style={{ marginBottom: '16px' }}>
              开源项目，欢迎贡献
            </h2>
            <p className="body-large" style={{ marginBottom: '32px' }}>
              PhotoCrypt-NFT 是 MIT 开源项目，代码完全公开。<br />
              如果你有兴趣改进功能或报告问题，欢迎到 GitHub 提交 Issue 或 PR。
            </p>
            <a
              href="https://github.com/kfat77/PhotoCrypt-NFT"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
            >
              访问 GitHub 仓库 →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
