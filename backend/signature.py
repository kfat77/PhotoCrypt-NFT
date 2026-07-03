#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
signature.py - Ed25519 数字签名模块
作用：用设备私钥对照片哈希进行签名，确保"谁拍的、什么时候拍的"
"""

import json
import base64
import hashlib
from datetime import datetime
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey, Ed25519PublicKey
)
from cryptography.hazmat.primitives import serialization
from cryptography.exceptions import InvalidSignature


class DeviceSigner:
    """
    设备签名器：模拟相机/手机的安全芯片
    - 生成Ed25519密钥对
    - 对照片内容哈希签名
    - 验证签名真伪
    """

    def __init__(self, private_key_pem: str = None):
        """
        :param private_key_pem: 已有的私钥PEM字符串，None则生成新密钥
        """
        if private_key_pem:
            self.private_key = serialization.load_pem_private_key(
                private_key_pem.encode(), password=None
            )
        else:
            self.private_key = Ed25519PrivateKey.generate()

        self.public_key = self.private_key.public_key()

    # ==================== 密钥管理 ====================

    def get_private_key_pem(self) -> str:
        """导出私钥 PEM（实际设备中不会导出，这里用于测试）"""
        return self.private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ).decode()

    def get_public_key_pem(self) -> str:
        """导出公钥 PEM（可公开，用于验证）"""
        return self.public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode()

    def get_public_key_base64(self) -> str:
        """公钥 base64（上链时更省gas）"""
        raw = self.public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw
        )
        return base64.b64encode(raw).decode()

    # ==================== 签名 ====================

    def _hash_image(self, image_path: str) -> bytes:
        """计算照片的 SHA-256 哈希"""
        sha = hashlib.sha256()
        with open(image_path, 'rb') as f:
            while chunk := f.read(8192):
                sha.update(chunk)
        return sha.digest()

    def sign_photo(self, image_path: str, camera_model: str = "Unknown") -> dict:
        """
        对照片进行完整签名
        :return: 包含签名、公钥、时间戳、元数据的字典
        """
        img_hash = self._hash_image(image_path)
        timestamp = int(datetime.utcnow().timestamp())

        # 签名内容 = 哈希 + 时间戳 + 相机型号（防重放）
        sign_data = json.dumps({
            "hash": img_hash.hex(),
            "timestamp": timestamp,
            "camera": camera_model
        }, sort_keys=True).encode()

        signature = self.private_key.sign(sign_data)

        return {
            "image_hash": img_hash.hex(),
            "timestamp": timestamp,
            "camera_model": camera_model,
            "signature": base64.b64encode(signature).decode(),
            "public_key": self.get_public_key_base64(),
            "sign_data": sign_data.decode()  # 用于验证时比对
        }

    # ==================== 验证 ====================

    @staticmethod
    def verify_photo(image_path: str, signature_data: dict) -> bool:
        """
        验证照片签名是否有效
        :param image_path: 照片文件路径
        :param signature_data: sign_photo() 返回的字典
        :return: True/False
        """
        try:
            # 1. 重新计算哈希，比对是否一致
            current_hash = hashlib.sha256()
            with open(image_path, 'rb') as f:
                while chunk := f.read(8192):
                    current_hash.update(chunk)
            if current_hash.hexdigest() != signature_data["image_hash"]:
                print("[✗] 照片哈希不匹配：文件已被篡改！")
                return False

            # 2. 加载公钥
            pub_raw = base64.b64decode(signature_data["public_key"])
            public_key = Ed25519PublicKey.from_public_bytes(pub_raw)

            # 3. 验证签名
            sign_data = signature_data["sign_data"].encode()
            signature = base64.b64decode(signature_data["signature"])
            public_key.verify(signature, sign_data)

            print("[✓] 签名验证通过：照片确为原始设备拍摄，未被篡改")
            return True

        except InvalidSignature:
            print("[✗] 签名无效：照片或签名被伪造/篡改")
            return False
        except Exception as e:
            print(f"[✗] 验证出错: {e}")
            return False


# ==================== 测试 ====================
if __name__ == '__main__':
    import os
    test_dir = os.path.join(os.path.dirname(__file__), '..', 'test')
    os.makedirs(test_dir, exist_ok=True)

    # 创建测试图
    from PIL import Image
    test_img = os.path.join(test_dir, 'sig_test.png')
    if not os.path.exists(test_img):
        Image.new('RGB', (100, 100), color=(50, 100, 150)).save(test_img)

    print("=== 签名测试 ===")
    signer = DeviceSigner()
    print(f"[+] 公钥: {signer.get_public_key_base64()[:40]}...")

    sig_data = signer.sign_photo(test_img, camera_model="Canon EOS R5")
    print(f"[+] 签名数据: {json.dumps(sig_data, indent=2, ensure_ascii=False)}")

    print("\n=== 验证测试（正常） ===")
    ok = DeviceSigner.verify_photo(test_img, sig_data)
    print(f"[>] 结果: {ok}")

    print("\n=== 验证测试（篡改后） ===")
    # 篡改图片
    tampered = os.path.join(test_dir, 'sig_test_tampered.png')
    img = Image.open(test_img)
    img.putpixel((0, 0), (255, 0, 0))
    img.save(tampered)
    ok2 = DeviceSigner.verify_photo(tampered, sig_data)
    print(f"[>] 结果: {ok2}")
