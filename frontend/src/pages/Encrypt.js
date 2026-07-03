import React, { useState, useRef, useCallback, useEffect } from 'react';
import { photoCryptEncrypt, photoCryptVerify, canvasToBlob } from '../utils/photoCrypt';

function Encrypt() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('camera'); // 'camera' | 'upload' | 'preview' | 'result'
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [watermarkedImage, setWatermarkedImage] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [caption, setCaption] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // 启动摄像头
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('摄像头错误:', err);
      setCameraError(
        err.name === 'NotAllowedError' 
          ? '需要摄像头权限。请在浏览器设置中允许访问摄像头。'
          : err.name === 'NotFoundError'
          ? '未找到摄像头设备。'
          : `摄像头错误: ${err.message}`
      );
    }
  }, []);

  // 停止摄像头
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // 组件挂载时启动摄像头
  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode, startCamera, stopCamera]);

  // 拍照
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 转为 Data URL
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
    setMode('preview');
    stopCamera();
  };

  // 执行 PhotoCrypt 加密
  const handleEncrypt = async () => {
    if (!capturedImage) return;
    setLoading(true);

    try {
      // 创建 Image 元素
      const img = new Image();
      img.src = capturedImage;
      await new Promise((resolve) => { img.onload = resolve; });

      // Canvas 转 Blob
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const originalBlob = await canvasToBlob(canvas, 'image/png');

      // 获取设备型号
      const deviceModel = navigator.userAgent.match(/\(([^)]+)\)/)?.[1] || 'Web Browser';

      // 执行 PhotoCrypt 加密
      const result = await photoCryptEncrypt(img, originalBlob, deviceModel);

      setWatermarkedImage(result.watermarkedDataUrl);
      setVerificationData(result.verificationData);
      setMode('result');
    } catch (err) {
      alert('加密失败: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 下载带水印的照片
  const downloadWatermarked = () => {
    if (!watermarkedImage) return;
    const link = document.createElement('a');
    link.href = watermarkedImage;
    link.download = `veripic-${Date.now()}.png`;
    link.click();
  };

  // 上传文件处理
  const handleFileUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件 (JPEG/PNG)');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result);
      setMode('preview');
    };
    reader.readAsDataURL(file);
  };

  // 重置
  const handleReset = () => {
    setCapturedImage(null);
    setWatermarkedImage(null);
    setVerificationData(null);
    setCaption('');
    setCameraError(null);
    setMode('camera');
  };

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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const formatDate = (ts) => {
    return new Date(ts * 1000).toLocaleString('zh-CN');
  };

  return (
    <div>
      {/* 隐藏的 canvas 用于拍照 */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Page Header */}
      <section className="hero-gradient" style={{ padding: '140px 0 60px', textAlign: 'center' }}>
        <div className="container">
          <div className="badge badge-blue" style={{ marginBottom: '20px' }}>
            📸 拍照加密
          </div>
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>
            打开摄像头<span className="text-gradient">真实拍摄</span>
          </h1>
          <p className="body-large" style={{ maxWidth: '560px', margin: '0 auto' }}>
            使用手机摄像头直接拍摄，照片自动嵌入数字水印和设备签名，
            确保每一张都是真实拍摄的原始照片
          </p>
        </div>
      </section>

      {/* 模式切换 */}
      <section className="section-sm">
        <div className="container-narrow">
          {mode === 'camera' && (
            <>
              {/* 模式选择按钮 */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
                <button className="btn btn-primary" onClick={() => setMode('camera')}>
                  📷 摄像头拍摄
                </button>
                <button className="btn btn-secondary" onClick={() => setMode('upload')}>
                  📤 上传照片
                </button>
              </div>

              {/* 摄像头预览 */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '600px',
                  margin: '0 auto',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  aspectRatio: '4/3',
                }}
              >
                {cameraError ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '40px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📷❌</div>
                    <p style={{ color: 'var(--accent-red)', marginBottom: '16px' }}>
                      {cameraError}
                    </p>
                    <button className="btn btn-primary" onClick={startCamera}>
                      重试
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* 顶部信息 */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      right: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div className="badge badge-green" style={{ backdropFilter: 'blur(10px)' }}>
                        🔴 实时预览
                      </div>
                      <div className="badge badge-blue" style={{ backdropFilter: 'blur(10px)' }}>
                        🔒 PhotoCrypt 保护中
                      </div>
                    </div>

                    {/* 底部拍摄按钮 */}
                    <div style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <button
                        onClick={takePhoto}
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '50%',
                          border: '4px solid rgba(255,255,255,0.8)',
                          background: 'rgba(255,255,255,0.3)',
                          backdropFilter: 'blur(10px)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.5)';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(255,255,255,0.3)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: 'white',
                        }} />
                      </button>
                      <span style={{ color: 'white', fontSize: '14px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                        点击拍摄
                      </span>
                    </div>
                  </>
                )}
              </div>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20px', fontSize: '0.9rem' }}>
                💡 提示：需要 HTTPS 环境才能调用摄像头。iOS 用户请使用 Safari。
              </p>
            </>
          )}

          {mode === 'upload' && (
            <>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
                <button className="btn btn-secondary" onClick={() => setMode('camera')}>
                  📷 摄像头拍摄
                </button>
                <button className="btn btn-primary" onClick={() => setMode('upload')}>
                  📤 上传照片
                </button>
              </div>

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
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                />
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📤</div>
                <h3 style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.2rem' }}>
                  拖拽照片到此处，或点击上传
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  支持 JPEG、PNG 格式
                </p>
              </div>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20px', fontSize: '0.9rem' }}>
                ⚠️ 上传的照片不会被自动验证为"真实拍摄"。建议使用摄像头拍摄以获得完整验证。
              </p>
            </>
          )}

          {mode === 'preview' && capturedImage && (
            <div className="animate-fade-in-up">
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div className="badge badge-green">📸 拍摄成功</div>
              </div>

              <div className="image-preview" style={{ marginBottom: '24px' }}>
                <img src={capturedImage} alt="Captured" style={{ maxWidth: '100%' }} />
              </div>

              <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
                <div className="form-group">
                  <label>照片描述（可选）</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="写点什么..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleEncrypt}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', marginRight: '10px' }} />
                        正在加密...
                      </>
                    ) : (
                      <>🔐 执行 PhotoCrypt 加密</>
                    )}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    ❌ 重拍
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === 'result' && verificationData && (
            <div className="animate-fade-in-up">
              <div className="result-box success" style={{ marginBottom: '24px' }}>
                ✅ PhotoCrypt 加密完成！照片已嵌入数字水印和设备签名。
              </div>

              {/* 水印照片预览 */}
              {watermarkedImage && (
                <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                  <h3 style={{ fontWeight: 600, marginBottom: '16px', fontSize: '1.1rem' }}>
                    📸 加密后的照片（含水印）
                  </h3>
                  <div className="image-preview" style={{ marginBottom: '16px' }}>
                    <img src={watermarkedImage} alt="Watermarked" style={{ maxWidth: '100%' }} />
                  </div>
                  <button className="btn btn-primary" onClick={downloadWatermarked}>
                    ⬇️ 下载带水印照片
                  </button>
                </div>
              )}

              {/* 验证信息面板 */}
              <div className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🔐</span>
                  <h3 style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--accent-blue)' }}>
                    PhotoCrypt 验证信息
                  </h3>
                </div>

                <table className="meta-table">
                  <tbody>
                    <tr>
                      <th>照片哈希 (SHA-256)</th>
                      <td>{verificationData.imageHash}</td>
                    </tr>
                    <tr>
                      <th>时间戳</th>
                      <td>{formatDate(verificationData.timestamp)}</td>
                    </tr>
                    <tr>
                      <th>设备型号</th>
                      <td>{verificationData.deviceModel}</td>
                    </tr>
                    <tr>
                      <th>设备签名</th>
                      <td>{verificationData.signature}</td>
                    </tr>
                    <tr>
                      <th>感知哈希 (pHash)</th>
                      <td>{verificationData.perceptualHash}</td>
                    </tr>
                    <tr>
                      <th>公钥</th>
                      <td>{verificationData.publicKey}</td>
                    </tr>
                    <tr>
                      <th>版本</th>
                      <td>{verificationData.version}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 上链提示 */}
              <div className="glass-card" style={{ padding: '28px', marginBottom: '24px', background: 'rgba(255,149,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.5rem' }}>⛓️</span>
                  <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>下一步：铸造 NFT</h3>
                </div>
                <p className="body-text" style={{ marginBottom: '20px' }}>
                  数据已准备就绪。下载带水印的照片后，在本地运行以下命令将照片铸造为 NFT：
                </p>
                <div className="code-block">
                  <code>
                    # 1. 保存下载的 veripic-xxx.png 到 test 文件夹<br />
                    # 2. 运行 Python 加密脚本<br />
                    cd backend<br />
                    python main.py --input ../test/veripic-xxx.png<br />
                    <br />
                    # 3. 铸造 NFT<br />
                    cd ..<br />
                    npx hardhat run scripts/mint.js --network localhost
                  </code>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={handleReset}>
                  📷 再拍一张
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Encrypt;
