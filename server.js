const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:true}));

app.get('/api/customers', (req, res) => {
    res.send([
                {
                "id": 1,
                "image":"https://placeimg.com/64/64/1",
                "name": "홍길동",
                "birthday": "961222",
                "gender": "남자",
                "jab": "대학생"
                },
                {
                "id": 2,
                "image":"https://placeimg.com/64/64/2",
                "name": "김철수",
                "birthday": "941112",
                "gender": "남자",
                "jab": "대학생"
                },
                {
                "id": 3,
                "image":"https://placeimg.com/64/64/3",
                "name": "이영희",
                "birthday": "900402",
                "gender": "여자",
                "jab": "회사원"
                }
            ]);
});
app.listen(port, () => console.log(`Listening on port ${port}`));