# 测试图片目录

把你要测试的照片放在这个文件夹里，比如：
- test.jpg
- photo.png
- 任何其他图片

运行主程序时会自动读取：
```bash
python backend/main.py --input test/test.jpg --camera "iPhone 15 Pro"
```

生成的输出文件也会放在这里：
- sealed_photo.png（含水印的照片）
- mint_metadata.json（上链数据）
- nft_metadata.json（NFT元数据）
