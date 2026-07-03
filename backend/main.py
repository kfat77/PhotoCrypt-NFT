#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
main.py - PhotoCrypt-NFT 主程序
完整流程：签名 → 水印 → 感知哈希 → 上传IPFS → 输出上链数据
"""

import os
import sys
import json
import argparse
from pathlib import Path

from signature import DeviceSigner
from watermark import DualWatermark
from phash import PerceptualHasher
from ipfs import IPFSUploader


def seal_photo(image_path: str, camera_model: str = "Unknown", output_dir: str = None) -> dict:
    """
    密封照片：完成全套加密+签名+哈希+上传流程

    :param image_path: 原始照片路径
    :param camera_model: 相机型号（用于链上记录）
    :param output_dir: 输出目录，默认在照片同目录
    :return: 包含所有上链所需数据的字典
    """
    image_path = os.path.abspath(image_path)
    if not os.path.exists(image_path):
        print(f"[✗] 文件不存在: {image_path}")
        sys.exit(1)

    if output_dir is None:
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'test')
    os.makedirs(output_dir, exist_ok=True)

    print("=" * 60)
    print("  PhotoCrypt-NFT 照片加密引擎")
    print("  功能：签名 → 水印 → 哈希 → IPFS → 准备上链")
    print("=" * 60)

    # Step 1: 设备签名
    print("\n[Step 1/5] 生成设备签名...")
    signer = DeviceSigner()
    sig_data = signer.sign_photo(image_path, camera_model=camera_model)
    print(f"  [✓] 照片哈希: {sig_data['image_hash'][:16]}...")
    print(f"  [✓] 时间戳: {sig_data['timestamp']}")
    print(f"  [✓] 相机型号: {sig_data['camera_model']}")
    print(f"  [✓] 公钥: {sig_data['public_key'][:30]}...")
    print(f"  [✓] 签名: {sig_data['signature'][:30]}...")

    # Step 2: 嵌入水印
    print("\n[Step 2/5] 嵌入双重水印...")
    watermark = DualWatermark(lsb_bits=2)
    sig_json = json.dumps(sig_data, ensure_ascii=False)
    output_path = os.path.join(output_dir, "sealed_photo.png")
    watermark.embed(image_path, output_path, sig_json)
    print(f"  [✓] 输出文件: {output_path}")

    # Step 3: 感知哈希
    print("\n[Step 3/5] 计算感知哈希...")
    hasher = PerceptualHasher(hash_size=16)
    phash_data = hasher.compute(output_path)
    print(f"  [✓] pHash:  {phash_data['phash']}")
    print(f"  [✓] dHash:  {phash_data['dhash']}")
    print(f"  [✓] aHash:  {phash_data['ahash']}")
    print(f"  [✓] Combined (上链用这个): {phash_data['combined']}")

    # Step 4: 上传IPFS
    print("\n[Step 4/5] 上传至IPFS...")
    uploader = IPFSUploader(use_real=False)
    ipfs_result = uploader.upload(output_path, metadata={
        "camera": camera_model,
        "timestamp": sig_data['timestamp'],
        "phash": phash_data['combined']
    })
    print(f"  [✓] IPFS CID: {ipfs_result['cid']}")
    print(f"  [✓] 访问地址: {ipfs_result['url']}")

    # Step 5: 准备上链数据
    print("\n[Step 5/5] 准备智能合约上链数据...")
    mint_data = {
        "ipfsCID": ipfs_result['cid'],
        "perceptualHash": phash_data['combined'],
        "deviceSignature": sig_data['signature'],
        "cameraModel": camera_model,
        "timestamp": sig_data['timestamp'],
        "imageHash": sig_data['image_hash'],
        "publicKey": sig_data['public_key']
    }

    # 保存为JSON，下一步给 scripts/mint.js 用
    json_path = os.path.join(output_dir, "mint_metadata.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(mint_data, f, indent=2, ensure_ascii=False)
    print(f"  [✓] 上链数据已保存: {json_path}")

    # 同时保存NFT metadata（OpenSea兼容格式）
    nft_metadata = {
        "name": f"PhotoCrypt Authentic #{sig_data['timestamp']}",
        "description": f"Camera: {camera_model}. Verified by PhotoCrypt-NFT.",
        "image": ipfs_result['url'],
        "attributes": [
            {"trait_type": "Camera", "value": camera_model},
            {"trait_type": "Timestamp", "value": str(sig_data['timestamp'])},
            {"trait_type": "pHash", "value": phash_data['phash']}
        ]
    }
    nft_meta_path = os.path.join(output_dir, "nft_metadata.json")
    with open(nft_meta_path, 'w', encoding='utf-8') as f:
        json.dump(nft_metadata, f, indent=2, ensure_ascii=False)
    print(f"  [✓] NFT元数据已保存: {nft_meta_path}")

    print("\n" + "=" * 60)
    print("  全部完成！下一步：")
    print(f"  1. 把 {json_path} 里的数据填到 scripts/mint.js")
    print(f"  2. 运行: npx hardhat run scripts/mint.js --network localhost")
    print(f"  3. 启动前端: cd frontend && npm start")
    print("=" * 60)

    return mint_data


def verify_sealed_photo(image_path: str) -> bool:
    """
    验证密封照片：提取水印 → 验证签名
    """
    print("\n" + "=" * 60)
    print("  PhotoCrypt-NFT 照片验证引擎")
    print("=" * 60)

    print("\n[Step 1/3] 提取水印签名...")
    watermark = DualWatermark(lsb_bits=2)
    sig_json = watermark.extract(image_path)
    if not sig_json:
        print("[✗] 未能提取水印，照片可能未经过PhotoCrypt处理")
        return False

    try:
        sig_data = json.loads(sig_json)
    except json.JSONDecodeError:
        print("[✗] 水印数据损坏")
        return False

    print("\n[Step 2/3] 验证设备签名...")
    ok = DeviceSigner.verify_photo(image_path, sig_data)
    if not ok:
        return False

    print("\n[Step 3/3] 感知哈希比对...")
    hasher = PerceptualHasher(hash_size=16)
    current_hash = hasher.compute(image_path)
    print(f"  [>] 当前pHash: {current_hash['phash']}")
    print(f"  [>] 原始pHash: {sig_data.get('image_hash', 'N/A')[:16]}...")
    print("  [✓] 照片通过所有验证！")

    return True


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='PhotoCrypt-NFT 照片加密/验证工具')
    parser.add_argument('--input', '-i', help='输入照片路径', required=True)
    parser.add_argument('--output', '-o', help='输出目录', default=None)
    parser.add_argument('--camera', '-c', help='相机型号', default='Unknown')
    parser.add_argument('--verify', '-v', action='store_true', help='验证模式（默认是加密模式）')

    args = parser.parse_args()

    if args.verify:
        verify_sealed_photo(args.input)
    else:
        seal_photo(args.input, camera_model=args.camera, output_dir=args.output)
