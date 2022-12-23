const express = require("express");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { User, Cart, Goods } = require("./models");
const authMiddleware = require("./middlewares/auth-middleware");

const app = express();
const router = express.Router();

app.use(express.static("assets"));
app.use(express.json());
//회원가입
router.post("/users", async (req, res) => {
  const { nickname, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
    });
    return;
  }

  const existUsers = await User.findAll({
    where: {
      [Op.or]: [{ nickname }, { email }],
    },
  });
  if (existUsers.length) {
    res.status(400).send({
      errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
    });
    return;
  }

  await User.create({ email, nickname, password });

  res.status(201).send({ message: "회원 가입에 성공하였습니다." });
});

//로그인
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, password } });

  if (!user) {
    res.status(400).send({
      errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
    });
    return;
  }

  const token = jwt.sign({ userId: user.userId }, "customized-secret-key");
  res.send({
    token,
  });
});

router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user,
  });
});



app.use("/api", express.urlencoded({ extended: false }), router);

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});