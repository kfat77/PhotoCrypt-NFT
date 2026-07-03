import React, { useState, useCallback } from 'react';

function Verify() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [queryByToken, setQueryByToken] = useState(false);

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

  const handleVerify = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    // 模拟验证流程
    await new Promise((r) => setTimeout(r, 2000));

    const isTampered = Math.random() > 0.7; // 70%概率验证通过

    if (isTampered) {
      setResult({
        success: false,
        message: '照片验证失败：签名不匹配，文件可能已被篡改或并非原始设备拍摄。',
        details: {
          watermarkFound: '是',
          signatureValid: '否',
          hashMatch: '否',
          chainRecord: '未找到匹配记录',
        }
      });
    } else {
      setResult({
        success: true,
        message: '照片验证通过！确认为原始设备拍摄，未被篡改。',
        details: {
          watermarkFound: '是',
          signatureValid: '是',
          hashMatch: '是',
          chainRecord: '已找到链上记录',
          tokenId: '0',
          ipfsCID: 'Qm' + Math.random().toString(36).substring(2, 46),
          cameraModel: 'iPhone 15 Pro',
          timestamp: Math.floor(Date.now() / 1000) - 86400,
          similarity: '96.8%',
        }
      });
    }
    setLoading(false);
  };

  const handleQueryByToken = async () => {
    if (!tokenId) return;
    setLoading(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1200));

    setResult({
      success: true,
      message: `Token ID ${tokenId} 的链上记录查询成功：`,
      details: {
        tokenId: tokenId,
        ipfsCID: 'Qm' + Math.random().toString(36).substring(2, 46),
        perceptualHash: 'a1b2c3d4e5f6:' + Math.random().toString(36).substring(2, 18),
        timestamp: Math.floor(Date.now() / 1000) - 86400 * 3,
        deviceSignature: 'MEUCIQDx...' + Math.random().toString(36).substring(2, 30),
        cameraModel: 'Sony A7IV',
        originalOwner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
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
          <div className="badge badge-green" style={{ marginBottom: '20px' }}>
            🔍 验证照片
          </div>
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>
            验证照片的<span className="text-gradient">真实来源</span>
          </h1>
          <p className="body-large" style={{ maxWidth: '560px', margin: '0 auto' }}>
            上传照片提取水印签名，比对链上记录，确认照片是否被篡改
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container-narrow">
          {/* Toggle */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
            <button
              className={`btn ${!queryByToken ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setQueryByToken(false)}
            >
              📸 上传照片验证
            </button>
            <button
              className={`btn ${queryByToken ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setQueryByToken(true)}
            >
              🔢 按 Token ID 查询
            </button>
          </div>

          {!queryByToken ? (
            <>
              <div
                className={`upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('verify-file-input').click()}
              >
                <input
                  id="verify-file-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                />
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.2rem' }}>
                  {file ? file.name : '拖拽照片到此处，或点击上传'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  支持经过 PhotoCrypt 加密的照片
                </p>
              </div>

              {preview && (
                <div className="animate-fade-in-up" style={{ marginTop: '32px' }}>
                  <div className="image-preview" style={{ marginBottom: '24px' }}>
                    <img src={preview} alt="Preview" />
                  </div>

                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleVerify}
                    disabled={loading}
                    style={{ width: '100%' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', marginRight: '10px' }} />
                        正在验证...
                      </>
                    ) : (
                      <>🔍 开始验证照片</>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="glass-card" style={{ padding: '32px' }}>
              <div className="form-group">
                <label>Token ID</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="输入 NFT Token ID（例如: 0, 1, 2...）"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleQueryByToken}
                disabled={loading || !tokenId}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', marginRight: '10px' }} />
                    查询中...
                  </>
                ) : (
                  <>🔢 查询链上记录</>
                )}
              </button>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="animate-fade-in-up" style={{ marginTop: '32px' }}>
              <div className={`result-box ${result.success ? 'success' : 'error'}`} style={{ marginBottom: '24px' }}>
                {result.success ? '✅' : '❌'} {result.message}
              </div>

              {result.success && result.details && (
                <div className="glass-card" style={{ padding: '32px' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '20px', color: 'var(--accent-green)' }}>
                    📋 验证详情
                  </h3>
                  <table className="meta-table">
                    <tbody>
                      {Object.entries(result.details).map(([key, value]) => (
                        <tr key={key}>
                          <th>
                            {key === 'watermarkFound' && '水印提取'}
                            {key === 'signatureValid' && '签名验证'}
                            {key === 'hashMatch' && '哈希比对'}
                            {key === 'chainRecord' && '链上记录'}
                            {key === 'tokenId' && 'Token ID'}
                            {key === 'ipfsCID' && 'IPFS CID'}
                            {key === 'perceptualHash' && '感知哈希'}
                            {key === 'timestamp' && '时间戳'}
                            {key === 'deviceSignature' && '设备签名'}
                            {key === 'cameraModel' && '相机型号'}
                            {key === 'originalOwner' && '原始所有者'}
                            {key === 'similarity' && '相似度'}
                            {key === 'timestamp' && '时间戳'}
                          </th>
                          <td>
                            {key === 'timestamp' ? formatDate(value) : value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Verify;
