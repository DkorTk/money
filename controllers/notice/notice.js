const { query } = require("../../lib/db");

module.exports = async ctx => {
  console.log('请求路径: ' + ctx.url);
  switch (ctx.url) {
    case '/addNotice':
      await addNotice(ctx)
      break;
    case '/getNoticeList':
      await getNoticeList(ctx)
      break;
    case '/setNotice':
      await setNotice(ctx)
      break;
    case '/delNotice':
      await delNotice(ctx)
      break;
    default:
      break;
  }
}

async function addNotice (ctx) {
  const { title, content, noticedate, user } = ctx.request.body;
  let sql = " insert into Notice (title,content,noticedate,user) values (?, ?, ?, ?) ";
  let param = [title, content, noticedate, user]
  console.log(ctx.request.body)

  try {
    await query(sql, param);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "公告添加成功",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "公告添加失败"
    };
  }
}

async function getNoticeList (ctx) {
  let sql = " SELECT id,date_format(noticedate,'%Y/%m/%d') date,title,content,noticedate,user FROM Notice ORDER BY noticedate desc "
  try {
    const rest = await query(sql);
    console.log(rest, '获取公告列表');
    ctx.body = {
      data: rest,
      state: 1,
      code: 200,
      msg: "获取公告列表成功！",
    }
  } catch (error) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "获取公告列表失败！"
    };
  }
}

async function setNotice (ctx) {
  const { title, content, noticedate, user, id } = ctx.request.body;
  let sql = " UPDATE Notice SET title=?,content=?,`noticedate`=?,user=? WHERE id=?"

  try {
    await query(sql, [title, content, noticedate, user, id]);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "更新公告信息成功！",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "更新公告信息失败！"
    };
  }
}

async function delNotice (ctx) {
  const { id } = ctx.request.body;
  let sql = " DELETE FROM Notice WHERE id=?"

  try {
    await query(sql, [id]);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "删除公告信息成功！",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "删除公告信息失败！"
    };
  }
}



