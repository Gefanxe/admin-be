const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const sharp = require('sharp');
const prisma = require("../instances/prisma");

class ToolFunc {
  constructor() {}

  static myMethod() {
    console.log("myMethod");
  }

  static getDatePath() {
    const d = new Date();
    let yearAndMonth = d.getFullYear().toString() + (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    return '/' + yearAndMonth + '/' + day;
  }

  static async avatarUpload(file) {
    let dataPath = this.getDatePath();
    let displayPath = '/public/avatar' + dataPath;

    let savePath = path.join(path.resolve('./'), displayPath);

    // 路徑目錄建立
    await fs.mkdirSync(savePath, { recursive: true });

    let ext = file.filename.replace(/^.+\./, '.').toLowerCase();
    let fileName = nanoid(8) + ext;
    let savePathAndName = savePath + '/' + fileName;
    
    // 調整大小
    // let _resizeWidth = (process.env.PHOTO_RESIZE_WIDTH) ? parseInt(process.env.PHOTO_RESIZE_WIDTH, 10) : 1024;
    let reSize = await sharp(file._buf).resize(180, 180, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0.5 }
    }).toBuffer();

    await fs.writeFileSync(savePathAndName, reSize);

    const result = {
      displayPathAndName: displayPath + '/' + fileName,
      savePathAndName: savePathAndName
    };

    return result;
  }

  static deleteFile(filePath) {
    fs.unlinkSync(filePath);
  }

  static hashPassword(pwd) {
    let _salt = nanoid(8);
    let _hashPwd = this.hashString(pwd, _salt);
    return {
      salt: _salt,
      hashPwd: _hashPwd
    };
  }

  static hashString(str, salt) {
    let hmac = crypto.createHmac('sha256', salt)
    let hashstr = hmac.update(str).digest('hex');
    return hashstr;
  }
}

module.exports = ToolFunc;

/*
個人資料大頭貼照：180 x 180像素
封面照片：820 x 312像素
分享的圖片（發佈到動態時報的任何圖片）：1200 x 628像素
Facebook 限時動態 (Stories)：1080 x 1920像素
*/