const { query } = require("../../lib/db");
const { uid } = require("uid")
module.exports = async ctx => {
    console.log('请求路径: ' + ctx.url);
    switch (ctx.url) {
        case '/signin':
            await addUser(ctx)
            break;
        case '/getUserList':
            await getUserList(ctx)
            break;
        case '/setUser':
            await setUser(ctx)
            break;
        case '/delUser':
            await delUser(ctx)
            break;
        default:
            break;
    }
}

async function addUser (ctx) {
    const {
        email,
        password,
        nickname
    } = ctx.request.body;
    //插入注册数据
    let id = uid();
    // const sql = "insert into `user` (`id`,`username`, `password`, `nickname`) values (?,?, ?, ?)";
    await query("insert into `user` (`id`,`email`, `password`, `nickname`) values (?, ?, ?, ?)", [id, email, password, nickname]);

    const [row] = await query(`SELECT * FROM user WHERE id=?`, id);
    console.log(row);
    const userInfo = row;
    if (userInfo) {
        //注册成功
        //   const token = jsonwebtoken.sign({ uId: userInfo.id }, SECRET, {
        //     expiresIn: "2h"
        //   });
        ctx.body = {
            state: 1,
            code: 200,
            msg: "注册成功",
            // data: {
            //   token
            // }
        };
    } else {
        //登录失败
        ctx.body = {
            state: 0,
            code: 400,
            msg: "注册失败"
        };
    }

}

async function getUserList (ctx) {
    // const { nickname } = ctx.request.body;
    let sql = "SELECT id,email,`password`,nickname FROM `user`"
    try {
        let rest = await query(sql);
        console.log(rest, '获取用户列表');
        ctx.body = {
            data: rest,
            state: 1,
            code: 200,
            msg: "获取用户列表成功！",
        };
    } catch (e) {
        ctx.body = {
            state: 0,
            code: 400,
            msg: "获取用户列表失败！"
        };
    }
}

async function setUser (ctx) {
    const { email, password, nickname, id } = ctx.request.body;
    let sql = "UPDATE `user` SET email=?,`password`=?,nickname=? WHERE id=?"

    try {
        await query(sql, [email, password, nickname, id]);
        ctx.body = {
            state: 1,
            code: 200,
            msg: "更新用户信息成功！",
        };
    }
    catch (e) {
        ctx.body = {
            state: 0,
            code: 400,
            msg: "更新用户信息失败！"
        };
    }
}

async function delUser (ctx) {
    const { id } = ctx.request.body;
    let sql = "DELETE FROM `user` WHERE id=?"

    try {
        await query(sql, [id]);
        ctx.body = {
            state: 1,
            code: 200,
            msg: "删除用户信息成功！",
        };
    }
    catch (e) {
        ctx.body = {
            state: 0,
            code: 400,
            msg: "删除用户信息失败！"
        };
    }
}

