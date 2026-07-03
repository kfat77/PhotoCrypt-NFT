import React, { useState, useRef, useCallback } from 'react';
import { photoCryptVerify } from '../utils/photoCrypt';

function Verify() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const imgRef = useRef(null);

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
    if (!preview) return;
    setLoading(true);
    setResult(null);

    // 创建 Image 元素加载图片
    const img = new Image();
    img.src = preview;
    await new Promise((resolve) => { img.onload = resolve; });

    // 尝试提取 PhotoCrypt 水印
    const verificationData = photoCryptVerify(img);

    if (verificationData) {
      setResult({
        success: true,
        message: '照片验证通过！确认为真实设备拍摄，未被篡改。',
        details: {
          watermarkFound: '是 ✅',
          imageHash: verificationData.imageHash,
          timestamp: verificationData.timestamp,
          deviceModel: verificationData.deviceModel,
          signature: verificationData.signature,
          perceptualHash: verificationData.perceptualHash,
          publicKey: verificationData.publicKey,
        }
      });
    } else {
      // 尝试检查是否是普通图片（没有 PhotoCrypt 水印）
      setResult({
        success: false,
        message: '未能检测到 PhotoCrypt 水印。这张照片可能：\n1. 未经过 PhotoCrypt 加密\n2. 水印已被破坏\n3. 是从其他平台截图/下载的',
        details: {
          watermarkFound: '否 ❌',
          signatureValid: '否 ❌',
          suggestion: '请使用 PhotoCrypt 拍摄或加密的照片进行验证。'
        }
      });
    }
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
            上传经 PhotoCrypt 加密的照片，提取水印签名，确认照片是否被篡改
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container-narrow">
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
              支持经过 PhotoCrypt 加密的照片（PNG 格式）
            </p>
          </div>

          {preview && (
            <div className="animate-fade-in-up" style={{ marginTop: '32px' }}>
              <div className="image-preview" style={{ marginBottom: '24px' }}>
                <img ref={imgRef} src={preview} alt="Preview" style={{ maxWidth: '100%' }} />
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
                  <>🔍 提取水印并验证</>
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
                      <tr>
                        <th>水印提取</th>
                        <td>{result.details.watermarkFound}</td>
                      </tr>
                      <tr>
                        <th>照片哈希</th>
                        <td>{result.details.imageHash}</td>
                      </tr>
                      <tr>
                        <th>时间戳</th>
                        <td>{formatDate(result.details.timestamp)}</td>
                      </tr>
                      <tr>
                        <th>设备型号</th>
                        <td>{result.details.deviceModel}</td>
                      </tr>
                      <tr>
                        <th>设备签名</th>
                        <td>{result.details.signature}</td>
                      </tr>
                      <tr>
                        <th>感知哈希</th>
                        <td>{result.details.perceptualHash}</td>
                      </tr>
                      <tr>
                        <th>公钥</th>
                        <td>{result.details.publicKey}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {!result.success && (
                <div className="glass-card" style={{ padding: '28px', marginTop: '24px' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '16px', color: 'var(--accent-red)' }}>
                    ⚠️ 无法验证的原因
                  </h3>
                  <p className="body-text" style={{ marginBottom: '16px' }}>
                    {result.details?.suggestion}
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <a href="/encrypt" className="btn btn-primary">
                      📷 去拍摄真实照片
                    </a>
                  </div>
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
