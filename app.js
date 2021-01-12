const Koa = require('koa');
// const KoaStaticCache = require('koa-static-cache');
const serve = require("koa-static");
const KoaRouter = require('koa-router');
const KoaBody = require("koa-body");


// 引入lib中的具体执行逻辑

const norm = require("./controllers/norm/norm")

// apply
const apply = require("./controllers/apply/apply")

const carousel = require("./controllers/carousel/carousel")

// notice
const notice = require("./controllers/notice/notice")

// organ
const organ = require("./controllers/organ/organ")
const statistics = require('./controllers/statistics/statistics');

// user
const login = require("./controllers/user/login");
const signin = require("./controllers/user/signin")

// admin
const adminLogin = require("./controllers/admin/login")
const createPet = require("./controllers/admin/pet")
const uploadImage = require("./controllers/admin/uploadImage")
const catImage = require("./controllers/admin/catImage");



const app = new Koa();
const router = new KoaRouter();
app.use(
  KoaBody({
    multipart: true
  })
);
// 静态资源
app.use(serve(__dirname + "./static"));
// app.use(KoaStaticCache('./image', {
//     prefix: '/image',
//     gzip: true,
//     dynamic: true
// }))

// 动态资源
// router.post('/dk1', async ctx => {
//     console.log(ctx.request.body);
//     ctx.body = "哈喽，我是1号"
// })

// apply
router.post('/addApply', apply)
router.post('/getApplyList', apply)
router.post('/setApply', apply)
router.post('/delApply', apply)

router.post('/addCarousel', carousel)
router.post('/getCarouselList', carousel)
router.post('/delCarousel', carousel)

// notice
router.post('/addNotice', notice)
router.post('/getNoticeList', notice)
router.post('/setNotice', notice)
router.post('/delNotice', notice)

// norm
router.post('/addNorm', norm)
router.post('/getNormList', norm)
router.post('/setNorm', norm)
router.post('/delNorm', norm)

// organ
router.post('/addOrgan', organ);
router.post('/getOrganList', organ);
router.post('/setOrgan', organ);
router.post('/delOrgan', organ);
router.post('/loginOrgan', organ)
// statistics
router.post('/getStatistics', statistics)
router.post('/getTj', statistics)

// user
router.post('/login', login);
router.post('/signin', signin);
router.post('/getUserList', signin)
router.post('/setUser', signin)
router.post('/delUser', signin)

// admin
router.post('/adminLogin', adminLogin);
// petManage
router.post('/createPet', createPet);
router.post('/getPetList', createPet);
router.post('/getPetListOrder', createPet)
router.post('/setPet', createPet);
router.post('/delPet', createPet);

//上传dog图
router.post('/uploadImage', uploadImage);
// 上传cat图
router.post('/catImage', catImage);

app.use(router.routes());
app.listen(8088);