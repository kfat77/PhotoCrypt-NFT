#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verify.py - 独立验证脚本
用法：python verify.py --input sealed_photo.png
"""

from main import verify_sealed_photo
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='验证PhotoCrypt密封照片')
    parser.add_argument('--input', '-i', help='密封照片路径', required=True)
    args = parser.parse_args()
    verify_sealed_photo(args.input)
