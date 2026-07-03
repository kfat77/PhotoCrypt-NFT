#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
phash.py - 感知哈希 (Perceptual Hash) 模块
作用：计算照片的内容指纹，即使压缩/裁剪/缩放也能识别同一照片
"""

import numpy as np
from PIL import Image
import imagehash


class PerceptualHasher:
    """
    感知哈希引擎：pHash + dHash + aHash 组合
    - pHash (DCT-based): 最抗压缩
    - dHash (梯度差): 最快，抗缩放
    - aHash (均值): 简单有效
    """

    def __init__(self, hash_size: int = 16):
        self.hash_size = hash_size

    def compute(self, image_path: str) -> dict:
        """
        计算照片的三重感知哈希
        :return: {"phash": "...", "dhash": "...", "ahash": "...", "combined": "..."}
        """
        img = Image.open(image_path)
        if img.mode != 'RGB':
            img = img.convert('RGB')

        p = str(imagehash.phash(img, hash_size=self.hash_size))
        d = str(imagehash.dhash(img, hash_size=self.hash_size))
        a = str(imagehash.average_hash(img, hash_size=self.hash_size))

        # combined = 三种哈希的拼接，上链时用这个
        combined = f"{p}:{d}:{a}"

        return {
            "phash": p,       # DCT-based，最抗压缩
            "dhash": d,       # 梯度差，抗缩放
            "ahash": a,       # 均值，简单有效
            "combined": combined
        }

    def similarity(self, hash1: str, hash2: str) -> float:
        """
        计算两个哈希的汉明距离相似度
        :return: 0.0 ~ 1.0，1.0 表示完全相同
        """
        # 解析 combined 格式
        h1 = hash1.split(':')[0]  # 用 pHash 比较
        h2 = hash2.split(':')[0]

        # 转二进制计算汉明距离
        b1 = bin(int(h1, 16))[2:].zfill(64)
        b2 = bin(int(h2, 16))[2:].zfill(64)

        distance = sum(c1 != c2 for c1, c2 in zip(b1, b2))
        max_dist = len(b1)
        similarity = 1.0 - (distance / max_dist)

        return similarity

    def is_same_photo(self, image_path1: str, image_path2: str, threshold: float = 0.85) -> bool:
        """
        判断两张照片是否为同一内容（即使压缩/裁剪过）
        """
        h1 = self.compute(image_path1)["combined"]
        h2 = self.compute(image_path2)["combined"]
        sim = self.similarity(h1, h2)
        print(f"[>] 相似度: {sim:.2%}")
        return sim >= threshold


# ==================== 测试 ====================
if __name__ == '__main__':
    import os
    from PIL import Image

    test_dir = os.path.join(os.path.dirname(__file__), '..', 'test')
    os.makedirs(test_dir, exist_ok=True)

    # 创建原图
    orig = os.path.join(test_dir, 'phash_orig.png')
    if not os.path.exists(orig):
        Image.new('RGB', (400, 300), color=(100, 150, 200)).save(orig)

    hasher = PerceptualHasher(hash_size=16)

    print("=== 原图哈希 ===")
    h1 = hasher.compute(orig)
    print(f"[+] pHash:  {h1['phash']}")
    print(f"[+] dHash:  {h1['dhash']}")
    print(f"[+] aHash:  {h1['ahash']}")
    print(f"[+] combined: {h1['combined']}")

    # 压缩后的图
    compressed = os.path.join(test_dir, 'phash_compressed.jpg')
    Image.open(orig).save(compressed, 'JPEG', quality=50)

    print("\n=== 压缩后哈希 ===")
    h2 = hasher.compute(compressed)
    print(f"[+] pHash:  {h2['phash']}")

    print("\n=== 相似度对比 ===")
    sim = hasher.similarity(h1['combined'], h2['combined'])
    print(f"[>] 原图 vs 压缩图: {sim:.2%}")
    print(f"[>] 是否同一照片: {'YES' if sim >= 0.85 else 'NO'}")
