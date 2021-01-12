const { query } = require("../../lib/db");
const jwt = require("jsonwebtoken");

module.exports = async ctx => {
  console.log('请求路径: ' + ctx.url);
  switch (ctx.url) {
    case '/loginOrgan':
      await loginOrgan(ctx)
      break;
    case '/addOrgan':
      await addOrgan(ctx)
      break;
    case '/getOrganList':
      await getOrganList(ctx)
      break;
    case '/setOrgan':
      await setOrgan(ctx)
      break;
    case '/delOrgan':
      await delOrgan(ctx)
      break;
    default:
      break;
  }
}

async function loginOrgan (ctx) {
  const { email, password } = ctx.request.body;
  // console.log(email, password);
  const sql = `SELECT * FROM organ WHERE account=? AND password=?`;
  let rest = await query(sql, [email, password])
  // const [res] = rest
  // console.log(rest, '管理员登录')

  const userInfo = rest;
  if (userInfo[0].id) {
    const token = jwt.sign({ uId: userInfo.id }, 'ldk', {
      expiresIn: "500"
    });
    ctx.body = {
      state: 1,
      code: 200,
      msg: "登录成功",
      token,
      userInfo: userInfo[0]
    };
  }
  else {
    ctx.body = {
      state: 2,
      code: 400,
      msg: "登录失败，账号或密码错误",
      token
    };
  }
}

async function addOrgan (ctx) {
  const { name, account, password } = ctx.request.body;
  let sql = " insert into organ (`name`, `account`, `password`) values (?, ?, ?) ";
  let param = [name, account, password]
  console.log(ctx.request.body)

  try {
    await query(sql, param);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "机构添加成功",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "机构添加失败"
    };
  }
}

async function getOrganList (ctx) {
  const { state } = ctx.request.body
  let sql = " SELECT id,name,`account`,password FROM organ "
  if (state != -1) {
    sql += " WHERE id=?"
  }
  console.log(state, '机构状态')

  let param = [state]
  try {
    const rest = await query(sql, param);
    console.log(rest, '获取机构列表');
    ctx.body = {
      data: rest,
      state: 1,
      code: 200,
      msg: "获取机构列表成功！",
    }
  } catch (error) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "获取机构列表失败！"
    };
  }
}

async function setOrgan (ctx) {
  const { name, account, password, id } = ctx.request.body;
  let sql = " UPDATE organ SET name=?,account=?,`password`=? WHERE id=?"

  try {
    await query(sql, [name, account, password, id]);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "更新机构信息成功！",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "更新机构信息失败！"
    };
  }
}

async function delOrgan (ctx) {
  const { id } = ctx.request.body;
  let sql = " DELETE FROM organ WHERE id=?"

  try {
    await query(sql, [id]);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "删除机构信息成功！",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "删除机构信息失败！"
    };
  }
}

