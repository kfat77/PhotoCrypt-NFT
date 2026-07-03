import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          PhotoCrypt-NFT — 基于数字水印与区块链的去中心化照片真实性验证
        </p>
        <div className="footer-links">
          <a href="https://github.com/your-username/PhotoCrypt-NFT" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://github.com/your-username/PhotoCrypt-NFT/issues" target="_blank" rel="noopener noreferrer">
            反馈问题
          </a>
          <a href="https://github.com/your-username/PhotoCrypt-NFT#readme" target="_blank" rel="noopener noreferrer">
            文档
          </a>
        </div>
        <p className="footer-legal">
          MIT License · 2024 PhotoCrypt-NFT
        </p>
      </div>
    </footer>
  );
}

export default Footer;
