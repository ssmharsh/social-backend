const router = require("express").Router();
const posts = require("../controllers/controller");
const {validateToken} = require("../controllers/auth")

router.post("/authenticate", async (req, res) => {
  const out = await posts.authenticate(req, res);
  res.status(out.statusCode).json(out);
});

router.post("/follow/:id",validateToken, async (req, res) => {
  const out = await posts.follow(req, res);
  res.status(out.statusCode).json(out);
});

router.post("/unfollow/:id",validateToken, async (req, res) => {
  const out = await posts.unfollow(req, res);
  res.status(out.statusCode).json(out);
});

router.get("/user",validateToken, async (req, res) => {
  const out = await posts.profile(req,res);
  res.status(out.statusCode).json(out);
});


router.post("/posts",validateToken, async (req, res) => {
  const out = await posts.create(req, res);
  res.status(out.statusCode).json(out);
});


router.delete("/posts",validateToken, async (req, res) => {
  const out = await posts.delete(req, res);
  res.status(out.statusCode).json(out);
});

router.post("/like",validateToken, async (req, res) => {
  const out = await posts.like(req, res);
  res.status(out.statusCode).json(out);
});

router.post("/unlike",validateToken, async (req, res) => {
  const out = await posts.unlike(req, res);
  res.status(out.statusCode).json(out);
});

router.post("/comment",validateToken, async (req, res) => {
  const out = await posts.comment(req, res);
  res.status(out.statusCode).json(out);
});

router.get("/posts",validateToken, async (req, res) => {
  const out = await posts.display(req, res);
  res.status(out.statusCode).json(out);
});

router.get("/all_posts",validateToken, async (req, res) => {
  const out = await posts.displayAll(req, res);
  res.status(out.statusCode).json(out);
});



module.exports = router;