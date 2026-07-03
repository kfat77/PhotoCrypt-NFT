import React, { useState, useCallback } from 'react';

function Encrypt() {
  const [file, setFile] = useState(null);
  const [camera, setCamera] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件 (JPEG/PNG)');
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleEncrypt = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    // 模拟加密流程（实际需调用后端Python）
    await new Promise((r) => setTimeout(r, 2500));

    setResult({
      success: true,
      data: {
        imageHash: 'sha256:' + Math.random().toString(36).substring(2, 18),
        timestamp: Math.floor(Date.now() / 1000),
        deviceSignature: 'MEUCIQDx...' + Math.random().toString(36).substring(2, 30),
        publicKey: 'MCowBQYDK2VwAyEAG9...' + Math.random().toString(36).substring(2, 20),
        pHash: 'a1b2c3d4e5f6:' + Math.random().toString(36).substring(2, 18),
        ipfsCID: 'Qm' + Math.random().toString(36).substring(2, 46),
        watermark: 'LSB + DWT 双重水印已嵌入',
      }
    });
    setLoading(false);
  };

  const formatDate = (ts) => {
    return new Date(ts * 1000).toLocaleString('zh-CN');
  };

  return (
    <div>
      {/* Page Header */}
      <section className="hero-gradient" style={{ padding: '140px 0 60px', textAlign: 'center' }}>
        <div className="container">
          <div className="badge badge-blue" style={{ marginBottom: '20px' }}>
            🔏 加密照片
          </div>
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>
            为照片铸造<span className="text-gradient">数字身份</span>
          </h1>
          <p className="body-large" style={{ maxWidth: '560px', margin: '0 auto' }}>
            上传照片，系统自动完成签名、水印嵌入、感知哈希计算，并准备上链数据
          </p>
        </div>
      </section>

      {/* Upload Section */}
      <section className="section-sm">
        <div className="container-narrow">
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
            />
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📤</div>
            <h3 style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.2rem' }}>
              {file ? file.name : '拖拽照片到此处，或点击上传'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              支持 JPEG、PNG 格式
            </p>
          </div>

          {/* Preview */}
          {preview && (
            <div className="animate-fade-in-up" style={{ marginTop: '32px' }}>
              <div className="image-preview" style={{ marginBottom: '24px' }}>
                <img src={preview} alt="Preview" />
              </div>

              <div className="glass-card" style={{ padding: '28px' }}>
                <div className="form-group">
                  <label>相机型号（可选）</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="例如: iPhone 15 Pro, Canon EOS R5"
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleEncrypt}
                  disabled={loading}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', marginRight: '10px' }} />
                      正在加密...
                    </>
                  ) : (
                    <>🔒 开始加密 & 生成上链数据</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="animate-fade-in-up" style={{ marginTop: '32px' }}>
              <div className="result-box success" style={{ marginBottom: '24px' }}>
                ✅ 照片加密完成！以下是生成的上链数据：
              </div>

              <div className="glass-card" style={{ padding: '32px' }}>
                <table className="meta-table">
                  <tbody>
                    <tr>
                      <th>照片哈希</th>
                      <td>{result.data.imageHash}</td>
                    </tr>
                    <tr>
                      <th>时间戳</th>
                      <td>{formatDate(result.data.timestamp)}</td>
                    </tr>
                    <tr>
                      <th>设备签名</th>
                      <td>{result.data.deviceSignature}</td>
                    </tr>
                    <tr>
                      <th>公钥</th>
                      <td>{result.data.publicKey}</td>
                    </tr>
                    <tr>
                      <th>感知哈希</th>
                      <td>{result.data.pHash}</td>
                    </tr>
                    <tr>
                      <th>IPFS CID</th>
                      <td>{result.data.ipfsCID}</td>
                    </tr>
                    <tr>
                      <th>水印状态</th>
                      <td>{result.data.watermark}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="glass-card" style={{ padding: '28px', marginTop: '24px', background: 'rgba(255,149,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.5rem' }}>💡</span>
                  <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>下一步：铸造 NFT</h3>
                </div>
                <p className="body-text" style={{ marginBottom: '20px' }}>
                  数据已准备就绪。在本地运行以下命令将照片铸造为 NFT：
                </p>
                <div className="code-block">
                  <code>
                    cd backend<br />
                    python main.py --input your_photo.jpg --camera "{camera || 'iPhone 15 Pro'}"<br />
                    <br />
                    cd ..<br />
                    npx hardhat run scripts/mint.js --network localhost
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Encrypt;
