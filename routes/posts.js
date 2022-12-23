const express = require('express');
const router = express.Router();

// 1. 전체 게시글 목록 조회 API
//     - 제목, 작성자명, 작성 날짜를 조회하기
//     - 작성 날짜 기준으로 내림차순 정렬하기
  // router.get("/posts", (req, res) => {
  //   res.status(200).json({posts})
  // });
  router.get("/lists", async (req, res) => {

    const lists = await Lists.find();

    res.json({

        lists,
    });

});


// 2. 게시글 작성 API
//     - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
router.post("/lists", async (req, res) => {
	const { title, name, data, password } = req.body;

  const lists = await Lists.find({ title });


  var now = dayjs();
  var time = now.format();

  time = time.slice(0,16).split('T').join(' ')
  

  if (lists.length) {
    return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
  }

  const createdLists = await Lists.create({ title, name, data, password, time });

  res.json({ lists: createdLists });
  


});
// 3. 게시글 조회 API
//     - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기 
//     (검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
router.get("/lists/:title", (req, res)=>{

  const {title} = req.params;


  res.json({


      detail: lists.filter((item)=>{

          return item.title === title;

      })[0],

  });

});



router.get("/lists/:name", (req, res)=>{

  const {name} = req.params;


  res.json({


      detail: lists.filter((item)=>{

          return item.name === name;

      })[0],

  });

});


router.get("/lists/:data", (req, res)=>{

  const {data} = req.params;


  res.json({


      detail: lists.filter((item)=>{

          return item.data === data;

      })[0],

  });

});

// 4. 게시글 수정 API
//     - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기

router.put("/lists/:title", async (req, res) => {
  const {title} = req.params;
  const {data} = req.body;
  const {password} = req.body;


  // 없을 때

  const [existsLists] = await Lists.find({title});
  
  // console.log(existsLists.length); // 셀수가 없다.
  if (!existsLists){
      return res.status(400).json({ success: false, errorMessage: "해당 게시물이 없습니다."});
  }
  
  // 있을 때

  if (Number(password) !== Number(existsLists.password)){

      return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀립니다."});

      
      
  }
  
  await Lists.updateOne({title}, {$set: {data}});


  res.json({ success: true});
});
// 5. 게시글 삭제 API
//     - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기


router.delete("/lists/:title", async (req, res) => {

  const { title } = req.params;
  const {data} = req.body;
  const { password } = req.body;

  const existsLists = await Lists.find({title});
  if (existsLists.length){

      if (Number(password) === Number(existsLists.password)){
          

          await Lists.deleteOne({ title });
      }else{

          return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀립니다."});
      }
  }


  res.json({ success: true});
});
module.exports = router;