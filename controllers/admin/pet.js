const {
    query
} = require("../../lib/db");
const { uid } = require("uid")

module.exports = ctx => {
    return new Promise((resolve, reject) => {

        console.log('请求路径: ' + ctx.url);
        switch (ctx.url) {
            case '/createPet':
                addPet(ctx).then(() => { resolve() })
                break;
            case '/getPetList':
                getPetList(ctx).then(() => { resolve() })
                break;
            case '/getPetListOrder':
                getPetListOrder(ctx).then(() => { resolve() })
                break;
            case '/setPet':
                setPet(ctx).then(() => { resolve() })
                break;
            case '/delPet':
                delPet(ctx).then(() => { resolve() })
                break;
            default:
                break;
        }
    })
}

function addPet (ctx) {
    return new Promise((resolve, reject) => {
        const {
            name,
            species,
            animal,
            sex,
            age,
            weight,
            vaccine,
            exParasite,
            sterilization,
            organization,
            image
        } = ctx.request.body.data;
        ctx.body = {
            state: 1,
            code: 200,
            msg: "新建成功"
        }
        const state = 0;

        console.log(name,
            species,
            animal,
            sex,
            age,
            weight,
            vaccine,
            exParasite,
            sterilization,
            organization);
        if (animal == "cat") {
            console.log("我是cat");
            query("insert into `cat` (`name`,`species`,`sex`,`age`,`weight`,`vaccine`,`exParasite`,`sterilization`,`organization`, `state`,image) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
                [name, species, sex, age, weight, vaccine, exParasite, sterilization, organization, state, image]).then(rest => {
                    resolve()
                });;

        } else {
            let id = uid();
            console.log("我是dog");
            query("insert into `dog` (id, `name`,`species`,`sex`,`age`,`weight`,`vaccine`,`exParasite`,`sterilization`,`organization`, `state`,image) values (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
                [id, name, species, sex, age, weight, vaccine, exParasite, sterilization, organization, state, image]).then(rest => {
                    resolve()
                });
        }
    })
}

function getPetList (ctx) {
    return new Promise((resolve, reject) => {
        const { animal, organ } = ctx.request.body;

        // console.log(ctx.request.body, '请求参数')

        if (animal == "cat") {
            // console.log("获取宠物猫列表");
            let sql = " SELECT 'cat' as animal,c.id,c.name,c.species,c.sex,c.age,c.weight,c.vaccine,c.exParasite,c.sterilization,c.organization, c.state,o.name as organname,c.image,c.createtime FROM cat c "
                + " LEFT JOIN"
                + " `organ` o"
                + " ON c.organization = o.id"
            let param = [organ]
            if (organ != '-1') {
                sql += " WHERE c.organization=? "
            }
            query(sql, param).then(rest => {
                // console.log(rest)
                ctx.body = {
                    data: rest,
                    state: 1,
                    code: 200,
                    msg: "获取宠物猫列表成功！"
                }
                resolve()
            });

        } else if (animal == "dog") {
            // console.log("获取宠物狗列表");
            let sql = " SELECT 'dog' as animal,d.id,d.name,d.species,d.sex,d.age,d.weight,d.vaccine,d.exParasite,d.sterilization,d.organization, d.state,o.name as organname,d.image,d.createtime FROM dog d "
                + " LEFT JOIN"
                + " `organ` o"
                + " ON d.organization = o.id"
            let param = [organ]
            if (organ != '-1') {
                sql += " WHERE d.organization=? "
            }

            query(sql, param).then(rest => {
                ctx.body = {
                    data: rest,
                    state: 1,
                    code: 200,
                    msg: "获取宠物狗列表成功！"
                }
                resolve()
            });
        }
        else if (animal == '-1') {
            // console.log("获取全部列表");
            let sqlCat = " SELECT 'cat' as animal,c.id,c.name,c.species,c.sex,c.age,c.weight,c.vaccine,c.exParasite,c.sterilization,c.organization, c.state,o.name as organname,c.image,c.createtime FROM cat c "
                + " LEFT JOIN"
                + " `organ` o"
                + " ON c.organization = o.id"
            let sqlDog = " SELECT 'dog' as animal,d.id,d.name,d.species,d.sex,d.age,d.weight,d.vaccine,d.exParasite,d.sterilization,d.organization, d.state,o.name as organname,d.image,d.createtime FROM dog d "
                + " LEFT JOIN"
                + " `organ` o"
                + " ON d.organization = o.id"
            if (organ != '-1') {
                sqlCat += ' WHERE c.organization=? '
                sqlDog += ' WHERE d.organization=? '
            }
            let param = [organ, organ]

            // console.log(sqlCat + " UNION ALL " + sqlDog, 'sqlStr')

            query(sqlCat + " UNION ALL " + sqlDog, param).then(rest => {
                ctx.body = {
                    data: rest,
                    state: 1,
                    code: 200,
                    msg: "获取宠物列表成功！"
                }
                resolve()
            });
        }
    }).catch(error => {
        ctx.body = {
            state: 1,
            code: 400,
            msg: "获取宠物列表失败！"
        }
    })
}

function getPetListOrder (ctx) {
    return new Promise((resolve, reject) => {
        const { animal, organ, state, order } = ctx.request.body;

        console.log(ctx.request.body, '请求参数')

        if (animal == "cat") {
            // console.log("获取宠物猫列表");
            let sql = " SELECT 'cat' as animal,c.id,c.name,c.species,c.sex,c.age,c.weight,c.vaccine,c.exParasite,c.sterilization,c.organization, c.state,o.name as organname,c.image,c.createtime FROM cat c "
                + " LEFT JOIN"
                + " `organ` o"
                + " ON c.organization = o.id WHERE"
            let param = [parseInt(state), organ, order]

            sql += " c.state=? "
            if (organ != '-1') {
                sql += " AND c.organization=? "
            }
            if (order == '1')
                sql += " order by c.createtime desc"
            else
                sql += " order by c.createtime"

            query(sql, param).then(rest => {
                // console.log(rest)
                ctx.body = {
                    data: rest,
                    state: 1,
                    code: 200,
                    msg: "获取宠物猫列表成功！"
                }
                resolve()
            });

        } else if (animal == "dog") {
            // console.log("获取宠物狗列表");
            let sql = " SELECT 'dog' as animal,d.id,d.name,d.species,d.sex,d.age,d.weight,d.vaccine,d.exParasite,d.sterilization,d.organization, d.state,o.name as organname,d.image,d.createtime FROM dog d "
                + " LEFT JOIN"
                + " `organ` o"
                + " ON d.organization = o.id WHERE"
            let param = [parseInt(state), organ, order]
            sql += "  d.state=? "
            if (organ != '-1') {
                sql += " AND d.organization=? "
            }
            if (order == '1')
                sql += " order by d.createtime desc"
            else
                sql += " order by d.createtime"

            console.log(sql)
            query(sql, param).then(rest => {
                ctx.body = {
                    data: rest,
                    state: 1,
                    code: 200,
                    msg: "获取宠物狗列表成功！"
                }
                resolve()
            });
        }
        else if (animal == '-1') {
            // console.log("获取全部列表");
            let sqlCat = " SELECT 'cat' as animal,c.id,c.name,c.species,c.sex,c.age,c.weight,c.vaccine,c.exParasite,c.sterilization,c.organization, c.state,o.name as organname,c.image,c.createtime FROM cat c "
                + " LEFT JOIN"
                + " `organ` o"
                + " ON c.organization = o.id"
            let sqlDog = " SELECT 'dog' as animal,d.id,d.name,d.species,d.sex,d.age,d.weight,d.vaccine,d.exParasite,d.sterilization,d.organization, d.state,o.name as organname,d.image,d.createtime FROM dog d "
                + " LEFT JOIN"
                + " `organ` o"
                + " ON d.organization = o.id"
            if (organ != '-1') {
                sqlCat += ' WHERE c.organization=? '
                sqlDog += ' WHERE d.organization=? '
            }
            let param = [organ, organ]

            // console.log(sqlCat + " UNION ALL " + sqlDog, 'sqlStr')

            query(sqlCat + " UNION ALL " + sqlDog, param).then(rest => {
                ctx.body = {
                    data: rest,
                    state: 1,
                    code: 200,
                    msg: "获取宠物列表成功！"
                }
                resolve()
            });
        }
    }).catch(error => {
        ctx.body = {
            state: 1,
            code: 400,
            msg: "获取宠物列表失败！"
        }
    })
}

function setPet (ctx) {
    return new Promise((resolve, reject) => {
        const { animal } = ctx.request.body;
        const { name, species, sex, age, weight, vaccine, exParasite, sterilization, organization, state, image, id } = ctx.request.body;
        if (animal == "cat") {
            // console.log("更新宠物猫");
            query(" UPDATE cat c SET c.name=?,c.species=?,c.sex=?,c.age=?,c.weight=?,c.vaccine=?,c.exParasite=?,c.sterilization=?,c.organization=?, c.state=?,c.image=? WHERE c.id=? ", [name, species, sex, age, weight, vaccine, exParasite, sterilization, organization, state, image, id]).then(rest => {
                // console.log(rest)
                ctx.body = {
                    state: 1,
                    code: 200,
                    msg: "更新宠物猫信息成功！"
                }
                resolve()
            });
        }
        else {
            // console.log("更新宠物狗");
            query(" UPDATE dog d SET d.name=?,d.species=?,d.sex=?,d.age=?,d.weight=?,d.vaccine=?,d.exParasite=?,d.sterilization=?,d.organization=?, d.state=?,d.image=? WHERE d.id=? ", [name, species, sex, age, weight, vaccine, exParasite, sterilization, organization, state, image, id]).then(rest => {
                // console.log(rest)
                ctx.body = {
                    state: 1,
                    code: 200,
                    msg: "更新宠物狗信息成功！"
                }
                resolve()
            });
        }
    }).catch(error => {
        ctx.body = {
            state: 1,
            code: 400,
            msg: "宠物信息更新失败！"
        }
    })
}

function delPet (ctx) {
    return new Promise((resolve, reject) => {
        const { animal, id } = ctx.request.body;

        if (animal == "cat") {
            console.log("删除宠物猫");
            query(" DELETE FROM cat WHERE id=? ", [id]).then(rest => {
                // console.log(rest)
                ctx.body = {
                    state: 1,
                    code: 200,
                    msg: "删除宠物猫信息成功！"
                }
                resolve()
            });
        }
        else {
            console.log("删除宠物狗", id);
            query(" DELETE FROM dog WHERE id=? ", [id]).then(rest => {
                // console.log(rest)
                ctx.body = {
                    state: 1,
                    code: 200,
                    msg: "删除宠物狗信息成功！"
                }
                resolve()
            });
        }
    }).catch(error => {
        ctx.body = {
            state: 1,
            code: 400,
            msg: "宠物信息删除失败！"
        }
    })
}
