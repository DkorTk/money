const fs = require("fs");
const { maxHeaderSize } = require("http");
const path = require("path");
const { query } = require("../../lib/db");
module.exports = async ctx => {
  // 保存图片到本地
  const { img } = ctx.request.files;
  // console.log(ctx.request.files);
  const uploadPath = generateUploadPath(img.name);
  saveImgToUpload(img, uploadPath);
  const sql = `select max(id) from cat`
  const [row] = await query(sql);
  let catID = row['max(id)'];
  await query(`update cat set image=? where id=?`, [uploadPath, catID])
  // console.log('执行到插入cat图片');
  // // 保存到db
  // const [rows] = await insertToDB({
  //   imgUrl: generateToDbUploadPath(uploadPath),
  //   name: img.name,
  //   uId: ctx.state.user.uId
  //   // uId: 2,
  // });

  // if (rows.affectedRows === 1) {
  //   ctx.body = "上传成功";
  // } else {
  //   ctx.body = "上传失败";
  // }
};

function generateUploadPath (name) {
  return "/upload/" + createImgName(name);
}

function createImgName (name) {
  return Date.now() + "_" + name;
}

function saveImgToUpload (img, uploadPath) {
  const readStream = fs.createReadStream(img.path);
  const savePath = path.join(__dirname, "../../static", uploadPath);
  const writeStream = fs.createWriteStream(savePath);
  readStream.pipe(writeStream);
}
