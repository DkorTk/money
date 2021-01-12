const { query } = require("../../lib/db");
const qs = require("qs");
const jwt = require("jsonwebtoken");
module.exports = async ctx => {

  const { email, password } = ctx.request.body
  const sql = `SELECT * FROM admin WHERE email=? AND password=?`;
  try {
    let [rest] = await query(sql, [email, password]);
    console.log(rest, '用户信息')
    // token
    const token = jwt.sign({ uId: rest.id }, 'ldk', {
      expiresIn: "500"
    });
    ctx.body = {
      state: 1,
      code: 200,
      msg: "登录失败，账号或密码错误",
      token,
      info: rest
    };
  }
  catch (e) {
    //登录失败
    ctx.body = {
      state: 0,
      code: 400,
      msg: "登录失败，账号或密码错误"
    };
  }
}