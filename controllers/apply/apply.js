const { query } = require("../../lib/db");

module.exports = async ctx => {
  console.log('请求路径: ' + ctx.url);
  switch (ctx.url) {
    case '/addApply':
      await addApply(ctx)
      break;
    case '/getApplyList':
      await getApplyList(ctx)
      break;
    case '/setApply':
      await setApply(ctx)
      break;
    case '/delApply':
      await delApply(ctx)
      break;
    default:
      break;
  }
}

async function addApply (ctx) {
  const { id, user, applytime, state, ycjy, zfqk, hyzk, job, grjj } = ctx.request.body.id;
  let sql = " insert into Apply (id,user,applytime,state, ycjy, zfqk, hyzk, job, grjj) values (?, ?, ?, ?,?, ?, ?, ?,?) ";
  let param = [id, user, applytime, state, ycjy, zfqk, hyzk, job, grjj]
  console.log(ctx.request.body.id)

  try {
    await query(sql, param);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "申请领养添加成功",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "申请领养添加失败"
    };
  }
}

async function getApplyList (ctx) {
  const { organization, state } = ctx.request.body;
  console.log(ctx.request.body)

  // let sql = " SELECT a.id, a.user, a.applytime, a.state FROM Apply a "
  //   + " left JOIN "
  //   + " (SELECT * from cat "
  //   + " UNION ALL "
  //   + " SELECT * FROM dog) b "
  //   + " ON a.id=b.id WHERE b.organization=? "

  let sql = " SELECT b.`name` as animalname,b.id as animalid,c.nickname,a.id, a.user, a.applytime, a.state, a.ycjy, a.zfqk, a.hyzk, a.job, a.grjj  FROM Apply a "
    + " left JOIN "
    + " (SELECT * from cat"
    + " UNION ALL "
    + " SELECT * FROM dog) b"
    + " ON a.id=b.id"
    + " LEFT JOIN"
    + " `user` c"
    + " ON a.`user`=c.id "

  let param = []

  if (state != '-1') {
    sql += " WHERE a.state=? "
    param.push(state)
  }
  if (organization != '-1') {
    if (state != '-1') {
      sql+= ' AND '
    }
    else{
      sql+=' WHERE '
    }
    sql += " b.organization=?"
    param.push(organization)
  }

  try {
    console.log(sql,'获取申请领养列表sql')
    const rest = await query(sql, param);
    console.log(rest, '获取申请领养列表');
    ctx.body = {
      data: rest,
      state: 1,
      code: 200,
      msg: "获取申请领养列表成功！",
    }
  } catch (error) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "获取申请领养列表失败！"
    };
  }
}

async function setApply (ctx) {
  const { user, applytime, state, id } = ctx.request.body;
  let sql = " UPDATE Apply SET user=?,applytime=?,`state`=? WHERE id=?"
  // let sqlGetInfo = " select c.* from cat c where c.id=? UNION ALL SELECT d.* from dog d where d.id=?"
  let sqlSetState = " update dog SET state=? WHERE id=? "
  let sqlSetState2 = " update cat SET state=? WHERE id=? "

  try {
    await query(sql, [user, applytime, state, id.toString()]);
    // let info = await query(sqlGetInfo, [id.toString(), id.toString()])
    await query(sqlSetState, [state, id.toString()])
    await query(sqlSetState2, [state, id])

    ctx.body = {
      state: 1,
      code: 200,
      msg: "更新申请领养信息成功！",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "更新申请领养信息失败！"
    };
  }
}

async function delApply (ctx) {
  const { id } = ctx.request.body;
  let sql = " DELETE FROM Apply WHERE id=?"

  try {
    await query(sql, [id]);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "删除申请领养信息成功！",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "删除申请领养信息失败！"
    };
  }
}

