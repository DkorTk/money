const { query } = require("../../lib/db");

module.exports = async ctx => {
  console.log('请求路径: ' + ctx.url);
  switch (ctx.url) {
    case '/addNorm':
      await addNorm(ctx)
      break;
    case '/getNormList':
      await getNormList(ctx)
      break;
    case '/setNorm':
      await setNorm(ctx)
      break;
    case '/delNorm':
      await delNorm(ctx)
      break;
    default:
      break;
  }
}

async function addNorm (ctx) {
  const { title, content, noticedate, user } = ctx.request.body;
  let sql = " insert into norm (title,content,noticedate,user) values (?, ?, ?, ?) ";
  let param = [title, content, noticedate, user]
  console.log(ctx.request.body)

  try {
    await query(sql, param);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "准则添加成功",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "准则添加失败"
    };
  }
}

async function getNormList (ctx) {
  let sql = " SELECT id,date_format(noticedate,'%Y/%m/%d') date,title,content,noticedate,user FROM Norm ORDER BY noticedate desc "
  try {
    const rest = await query(sql);
    console.log(rest, '获取准则列表');
    ctx.body = {
      data: rest,
      state: 1,
      code: 200,
      msg: "获取准则列表成功！",
    }
  } catch (error) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "获取准则列表失败！"
    };
  }
}

async function setNorm (ctx) {
  const { title, content, noticedate, user, id } = ctx.request.body;
  let sql = " UPDATE norm SET title=?,content=?,`noticedate`=?,user=? WHERE id=?"

  try {
    await query(sql, [title, content, noticedate, user, id]);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "更新准则信息成功！",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "更新准则信息失败！"
    };
  }
}

async function delNorm (ctx) {
  const { id } = ctx.request.body;
  let sql = " DELETE FROM norm WHERE id=?"

  try {
    await query(sql, [id]);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "删除准则信息成功！",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "删除准则信息失败！"
    };
  }
}



