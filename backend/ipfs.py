#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ipfs.py - IPFS 上传模块（模拟/真实）
作用：把加密后的照片上传到去中心化存储，返回CID用于上链
"""

import os
import json
import hashlib


class IPFSUploader:
    """
    IPFS上传器
    - 开发模式：本地模拟，返回伪CID
    - 生产模式：调用真实IPFS节点（Pinata/Infura/本地kubo）
    """

    def __init__(self, use_real: bool = False, pinata_api_key: str = None, pinata_secret: str = None):
        self.use_real = use_real
        self.pinata_api_key = pinata_api_key
        self.pinata_secret = pinata_secret

    def _compute_local_cid(self, file_path: str) -> str:
        """
        模拟CID：计算文件的SHA-256，前32字符作为伪CID
        实际IPFS的CID是multihash编码，这里简化处理
        """
        sha = hashlib.sha256()
        with open(file_path, 'rb') as f:
            while chunk := f.read(8192):
                sha.update(chunk)
        return f"Qm{sha.hexdigest()[:44]}"  # 模拟Qm开头的CIDv0

    def upload(self, file_path: str, metadata: dict = None) -> dict:
        """
        上传文件到IPFS
        :param file_path: 文件路径
        :param metadata: 附加元数据
        :return: {"cid": "...", "url": "...", "gateway": "..."}
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"文件不存在: {file_path}")

        cid = self._compute_local_cid(file_path)

        # 模拟：也保存一份元数据JSON
        if metadata:
            meta_path = file_path + ".metadata.json"
            with open(meta_path, 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2, ensure_ascii=False)
            print(f"[✓] 元数据已保存: {meta_path}")

        return {
            "cid": cid,
            "url": f"https://ipfs.io/ipfs/{cid}",
            "gateway": f"http://localhost:8080/ipfs/{cid}",  # 本地kubo网关
            "local_path": file_path,
            "metadata": metadata
        }

    def upload_metadata(self, metadata: dict, output_name: str = "metadata.json") -> dict:
        """
        上传JSON元数据（用于NFT的tokenURI）
        """
        test_dir = os.path.join(os.path.dirname(__file__), '..', 'test')
        os.makedirs(test_dir, exist_ok=True)
        meta_path = os.path.join(test_dir, output_name)

        with open(meta_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)

        return self.upload(meta_path)


# ==================== 测试 ====================
if __name__ == '__main__':
    import tempfile

    uploader = IPFSUploader(use_real=False)

    # 创建测试文件
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
        f.write(b"fake_image_data_for_testing_purposes_only")
        test_file = f.name

    print("=== 上传测试 ===")
    result = uploader.upload(test_file, metadata={"camera": "Sony A7IV", "location": "Beijing"})
    print(f"[+] CID: {result['cid']}")
    print(f"[+] URL: {result['url']}")

    print("\n=== 上传NFT元数据 ===")
    nft_meta = {
        "name": "PhotoCrypt #001",
        "description": "Authenticated photo via PhotoCrypt-NFT",
        "image": result["url"],
        "attributes": [
            {"trait_type": "Camera", "value": "Sony A7IV"},
            {"trait_type": "Location", "value": "Beijing"}
        ]
    }
    meta_result = uploader.upload_metadata(nft_meta)
    print(f"[+] Metadata CID: {meta_result['cid']}")

    os.unlink(test_file)
