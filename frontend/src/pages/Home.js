import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const features = [
    {
      icon: '🔒',
      color: 'blue',
      title: '双重水印加密',
      desc: 'LSB + DWT 双重水印将设备签名不可见地嵌入照片像素，人眼无法察觉，但系统可追溯来源。',
    },
    {
      icon: '🏷️',
      color: 'purple',
      title: 'Ed25519 数字签名',
      desc: '每张照片由设备私钥生成不可伪造的签名，确保"谁拍的、什么时候拍的"可信可验。',
    },
    {
      icon: '🎯',
      color: 'green',
      title: '感知哈希比对',
      desc: 'pHash + dHash + aHash 三重感知哈希，即使照片被压缩、裁剪或截图，仍可识别同一内容。',
    },
    {
      icon: '⛓️',
      color: 'orange',
      title: 'NFT 链上存证',
      desc: '照片哈希、签名、IPFS CID 全部铸造为 ERC-721 NFT，永久不可篡改，随时可查。',
    },
  ];

  const steps = [
    {
      num: '01',
      title: '打开摄像头拍摄',
      desc: '使用手机摄像头直接拍摄，无需上传，真实拍摄即刻记录。',
    },
    {
      num: '02',
      title: '设备签名',
      desc: '系统自动对照片哈希签名，生成不可伪造的认证信息。',
    },
    {
      num: '03',
      title: '嵌入水印',
      desc: 'LSB 水印将签名隐藏嵌入像素，肉眼不可见，但可提取验证。',
    },
    {
      num: '04',
      title: '计算哈希',
      desc: '计算感知哈希（pHash），作为压缩/裁剪后的内容指纹。',
    },
    {
      num: '05',
      title: '下载加密照片',
      desc: '下载带水印的 PNG 照片，随时可以验证其真实性。',
    },
    {
      num: '06',
      title: '铸造 NFT（可选）',
      desc: '将照片数据铸造为 NFT，永久记录上链，供任何人验证。',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient" style={{ padding: '160px 0 120px', textAlign: 'center' }}>
        <div className="container">
          <div className="animate-fade-in-up">
            <div className="badge badge-blue" style={{ marginBottom: '32px' }}>
              📸 用手机摄像头拍摄真实照片
            </div>
            <h1 className="heading-hero" style={{ marginBottom: '24px' }}>
              打开摄像头<br />
              <span className="text-gradient">拍摄真实照片</span>
            </h1>
            <p className="body-large" style={{ maxWidth: '640px', margin: '0 auto 48px' }}>
              用手机摄像头直接拍摄，照片自动嵌入数字水印和设备签名。
              每一张照片都是真实拍摄的原始记录，不可伪造、不可篡改。
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/encrypt" className="btn btn-primary btn-lg">
                📷 打开摄像头拍摄
              </Link>
              <Link to="/verify" className="btn btn-secondary btn-lg">
                🔍 验证照片真伪
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div
            className="animate-fade-in-up"
            style={{ marginTop: '80px', animationDelay: '0.3s' }}
          >
            <div
              className="glass-card-lg"
              style={{
                padding: '48px',
                maxWidth: '900px',
                margin: '0 auto',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '80px',
                  background: 'linear-gradient(135deg, rgba(41,151,255,0.3), rgba(175,82,222,0.2))',
                  filter: 'blur(60px)',
                  borderRadius: '50%',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', flex: '1 1 200px' }}>
                  <div className="icon-box blue" style={{ margin: '0 auto 16px' }}>📸</div>
                  <p style={{ fontWeight: 600, marginBottom: '4px' }}>摄像头拍摄</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>手机/电脑摄像头</p>
                </div>
                <div style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>→</div>
                <div style={{ textAlign: 'center', flex: '1 1 200px' }}>
                  <div className="icon-box purple" style={{ margin: '0 auto 16px' }}>🔏</div>
                  <p style={{ fontWeight: 600, marginBottom: '4px' }}>签名 + 水印</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SHA-256 + LSB</p>
                </div>
                <div style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>→</div>
                <div style={{ textAlign: 'center', flex: '1 1 200px' }}>
                  <div className="icon-box green" style={{ margin: '0 auto 16px' }}>🎨</div>
                  <p style={{ fontWeight: 600, marginBottom: '4px' }}>感知哈希</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>pHash 内容指纹</p>
                </div>
                <div style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>→</div>
                <div style={{ textAlign: 'center', flex: '1 1 200px' }}>
                  <div className="icon-box orange" style={{ margin: '0 auto 16px' }}>✅</div>
                  <p style={{ fontWeight: 600, marginBottom: '4px' }}>真实性验证</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>随时可验证</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="badge badge-purple" style={{ marginBottom: '20px' }}>
              ✨ 核心能力
            </div>
            <h2 className="heading-xl" style={{ marginBottom: '16px' }}>
              四层防护，<span className="text-gradient-purple">万无一失</span>
            </h2>
            <p className="body-large" style={{ maxWidth: '560px', margin: '0 auto' }}>
              从像素到链上，每一层都提供独立的验证手段，确保照片真实性
            </p>
          </div>

          <div className="feature-grid">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card-lg"
                style={{ padding: '40px' }}
              >
                <div className={`icon-box ${f.color}`}>{f.icon}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '12px' }}>
                  {f.title}
                </h3>
                <p className="body-text" style={{ fontSize: '0.95rem' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="badge badge-green" style={{ marginBottom: '20px' }}>
              🔄 工作流程
            </div>
            <h2 className="heading-xl" style={{ marginBottom: '16px' }}>
              六步完成 <span className="text-gradient-blue">全链路验证</span>
            </h2>
            <p className="body-large" style={{ maxWidth: '560px', margin: '0 auto' }}>
              从打开摄像头到下载加密照片，整个过程在浏览器中完成
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {steps.map((step, i) => (
              <div key={i}>
                <div
                  className="glass-card"
                  style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>
                      {step.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="step-connector" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)', padding: '100px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div
            className="glass-card-lg"
            style={{
              padding: '80px 40px',
              maxWidth: '800px',
              margin: '0 auto',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(ellipse, rgba(41,151,255,0.15), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <h2 className="heading-lg" style={{ marginBottom: '20px', position: 'relative' }}>
              准备好拍摄真实照片了吗？
            </h2>
            <p className="body-large" style={{ marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px', position: 'relative' }}>
              立即打开手机摄像头，体验 PhotoCrypt 的真实性保护
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link to="/encrypt" className="btn btn-primary btn-lg">
                📷 打开摄像头拍摄 →
              </Link>
              <Link to="/verify" className="btn btn-secondary btn-lg">
                🔍 验证照片
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
