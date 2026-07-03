// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PhotoNFT
 * @dev 每张照片铸造一个NFT，链上记录：IPFS哈希、感知哈希、拍摄时间戳、设备签名
 */
contract PhotoNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    struct PhotoMetadata {
        string ipfsCID;          // IPFS内容地址
        string perceptualHash;   // 感知哈希 (pHash)
        uint256 timestamp;       // 拍摄时间戳
        string deviceSignature;  // 设备Ed25519签名
        string cameraModel;      // 相机型号
        address originalOwner;   // 原始拍摄者
    }

    // tokenId => 元数据
    mapping(uint256 => PhotoMetadata) public photoRecords;
    // perceptualHash => tokenId (用于快速查重/验证)
    mapping(string => uint256) public hashToToken;

    event PhotoMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string ipfsCID,
        string perceptualHash,
        uint256 timestamp
    );

    event PhotoVerified(
        uint256 indexed tokenId,
        string verificationResult,
        uint256 verifyTime
    );

    constructor() ERC721("PhotoCrypt Authentic", "PHCR") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    /**
     * @dev 铸造照片NFT
     * @param _ipfsCID IPFS上的加密照片CID
     * @param _perceptualHash 感知哈希值 (hex string)
     * @param _deviceSignature 设备私钥签名
     * @param _cameraModel 相机型号
     * @param _uri NFT元数据URI (JSON metadata on IPFS)
     */
    function mintPhotoNFT(
        string memory _ipfsCID,
        string memory _perceptualHash,
        string memory _deviceSignature,
        string memory _cameraModel,
        string memory _uri
    ) public returns (uint256) {
        require(bytes(_ipfsCID).length > 0, "IPFS CID required");
        require(bytes(_perceptualHash).length > 0, "Perceptual hash required");
        require(hashToToken[_perceptualHash] == 0, "Photo already minted");

        uint256 newTokenId = tokenCounter;
        tokenCounter++;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _uri);

        photoRecords[newTokenId] = PhotoMetadata({
            ipfsCID: _ipfsCID,
            perceptualHash: _perceptualHash,
            timestamp: block.timestamp,
            deviceSignature: _deviceSignature,
            cameraModel: _cameraModel,
            originalOwner: msg.sender
        });

        hashToToken[_perceptualHash] = newTokenId;

        emit PhotoMinted(
            newTokenId,
            msg.sender,
            _ipfsCID,
            _perceptualHash,
            block.timestamp
        );

        return newTokenId;
    }

    /**
     * @dev 验证照片：通过tokenId查询链上记录
     */
    function verifyPhoto(uint256 _tokenId) public view returns (
        string memory ipfsCID,
        string memory perceptualHash,
        uint256 timestamp,
        string memory deviceSignature,
        string memory cameraModel,
        address originalOwner
    ) {
        require(_exists(_tokenId), "Token does not exist");
        PhotoMetadata memory meta = photoRecords[_tokenId];
        return (
            meta.ipfsCID,
            meta.perceptualHash,
            meta.timestamp,
            meta.deviceSignature,
            meta.cameraModel,
            meta.originalOwner
        );
    }

    /**
     * @dev 通过感知哈希查找tokenId
     */
    function findTokenByHash(string memory _perceptualHash) public view returns (uint256) {
        return hashToToken[_perceptualHash];
    }

    /**
     * @dev 检查某张照片是否已上链
     */
    function isPhotoMinted(string memory _perceptualHash) public view returns (bool) {
        return hashToToken[_perceptualHash] != 0;
    }

    /**
     * @dev 批量查询用户拥有的所有照片NFT
     */
    function getPhotosByOwner(address _owner) public view returns (uint256[] memory) {
        uint256 total = tokenCounter;
        uint256[] memory temp = new uint256[](total);
        uint256 count = 0;
        for (uint256 i = 0; i < total; i++) {
            if (ownerOf(i) == _owner) {
                temp[count] = i;
                count++;
            }
        }
        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = temp[j];
        }
        return result;
    }

    /**
     * @dev 覆盖_transfer函数，保持所有权记录不变
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
