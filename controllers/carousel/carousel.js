const { query } = require("../../lib/db");

module.exports = async ctx => {
  console.log('请求路径: ' + ctx.url);
  switch (ctx.url) {
    case '/addCarousel':
      await addCarousel(ctx)
      break;
    case '/getCarouselList':
      await getCarouselList(ctx)
      break;
    case '/delCarousel':
      await delCarousel(ctx)
      break;
    default:
      break;
  }
}

async function addCarousel (ctx) {
  const { image } = ctx.request.body;
  let sql = " insert into carousel (image) values (?) ";
  let param = [image]
  // console.log(ctx.request.body)

  try {
    await query(sql, param);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "图片添加成功",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "图片添加失败"
    };
  }
}

async function getCarouselList (ctx) {
  let sql = " SELECT id,image from carousel "
  try {
    const rest = await query(sql);
    // console.log(rest, '获取图片列表');
    ctx.body = {
      data: rest,
      state: 1,
      code: 200,
      msg: "获取图片列表成功！",
    }
  } catch (error) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "获取图片列表失败！"
    };
  }
}

async function delCarousel (ctx) {
  const { id } = ctx.request.body;
  let sql = " DELETE FROM carousel WHERE id=?"

  try {
    await query(sql, [id]);
    ctx.body = {
      state: 1,
      code: 200,
      msg: "删除图片信息成功！",
    };
  }
  catch (e) {
    ctx.body = {
      state: 0,
      code: 400,
      msg: "删除图片信息失败！"
    };
  }
}

