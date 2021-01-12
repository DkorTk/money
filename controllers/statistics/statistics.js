const { query } = require("../../lib/db");

module.exports = async ctx => {
  console.log('请求路径: ' + ctx.url);
  switch (ctx.url) {
    case '/getStatistics':
      await getStatistics(ctx)
      break;
    case '/getTj':
      await getTj(ctx)
    default:
      break;
  }
}

async function getTj (ctx) {
  const { tj } = ctx.request.body
  let sql = " select COUNT(*) num from user WHERE date_format(createtime,'%Y-%m-%d') =? "
    + " UNION ALL"
    + " select COUNT(*) num from cat WHERE date_format(createtime,'%Y-%m-%d') =?"
    + " UNION ALL"
    + " select COUNT(*) num from dog WHERE date_format(createtime,'%Y-%m-%d') =?"
    + " UNION ALL"
    + " select COUNT(*) num from apply WHERE date_format(createtime,'%Y-%m-%d') =?"
    + " UNION ALL"
    + " select COUNT(*) num from organ WHERE date_format(createtime,'%Y-%m-%d') =?  "

  try {
    let rest = await query(sql, [tj, tj, tj, tj, tj]);
    ctx.body = {
      date: rest,
      state: 1,
      code: 200,
      msg: "获取统计查询成功！",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "获取统计查询失败！"
    };
  }
}

async function getStatistics (ctx) {

  let sql = " SELECT" +
    " `user`.*," +
    " animal.*," +
    " apply.*, " +
    " organ.* " +
    " FROM " +
    " ( SELECT COUNT( id ) `user` FROM USER ) `user`," +
    " (" +
    " SELECT" +
    "	sum( e.animal ) animal" +
    " FROM" +
    "	( SELECT COUNT( d.id ) animal FROM `dog` d UNION ALL SELECT count( c.id ) animal FROM cat c ) e " +
    " ) animal," +
    " ( SELECT count( f.id ) apply FROM apply f ) apply," +
    " ( SELECT count( i.id ) organ FROM organ i ) organ"

  let sqlCurve = " select 'apply' `name`,count(*) num,date_format(createtime,'%Y-%m-%d') time from apply  where DATE_SUB(CURDATE(), INTERVAL 5 DAY) <= createtime group by date_format(createtime,'%Y-%m-%d')"
    + " UNION"
    + " select 'cat' `name`, count(*) num,date_format(createtime,'%Y-%m-%d') time from cat  where DATE_SUB(CURDATE(), INTERVAL 5 DAY) <= createtime group by date_format(createtime,'%Y-%m-%d')"
    + " UNION"
    + " select 'dog' `name`, count(*) num,date_format(createtime,'%Y-%m-%d') time from cat  where DATE_SUB(CURDATE(), INTERVAL 5 DAY) <= createtime group by date_format(createtime,'%Y-%m-%d')"
    + " UNION"
    + " select 'organ' `name`, count(*) num,date_format(createtime,'%Y-%m-%d') time from cat  where DATE_SUB(CURDATE(), INTERVAL 5 DAY) <= createtime group by date_format(createtime,'%Y-%m-%d')"
    + " UNION"
    + " select 'user' `name`, count(*) num,date_format(createtime,'%Y-%m-%d') time from cat  where DATE_SUB(CURDATE(), INTERVAL 5 DAY) <= createtime group by date_format(createtime,'%Y-%m-%d')"

  let sqlDate = "		select date_format(NOW(),'%Y-%m-%d') date FROM DUAL"
    + " UNION ALL"
    + " select date_format(DATE_SUB(NOW(),INTERVAL 1 DAY),'%Y-%m-%d') date FROM DUAL"
    + " UNION ALL"
    + " select date_format(DATE_SUB(NOW(),INTERVAL 2 DAY),'%Y-%m-%d') date FROM DUAL"
    + " UNION ALL"
    + " select date_format(DATE_SUB(NOW(),INTERVAL 3 DAY),'%Y-%m-%d') date FROM DUAL"
    + " UNION ALL"
    + " select date_format(DATE_SUB(NOW(),INTERVAL 4 DAY),'%Y-%m-%d') date FROM DUAL"
    + " ORDER BY DATE asc"

  try {
    let rest = await query(sql);
    console.log(rest)
    let restCurve = await query(sqlCurve);
    let restDate = await query(sqlDate);

    console.log(restCurve)
    ctx.body = {
      data: { "pie": rest, "curve": restCurve, "date": restDate },
      state: 1,
      code: 200,
      msg: "获取统计查询成功！",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "获取统计查询失败！"
    };
  }
}

