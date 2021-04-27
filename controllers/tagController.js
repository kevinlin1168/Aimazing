const e = require('express');
var express = require('express');
var md5 = require('md5');
var db = require('../db');
var router = express.Router();
var middleware = require('./middleware');

router.use(middleware.tokenVerifyMiddleware);
router.post('/addTag', async (req, res) => {
    try {
        let tagName = req.body.tagName;
        result =await db.execute(`SELECT name FROM tags WHERE name = '${tagName}'`);
        if (result.length > 0) {
            res.json({
                "status": "error",
                "msg": "duplicate tag name"
            })
        } else {
            await db.execute(`INSERT INTO tags (name) VALUES ('${tagName}')`)
            res.json({
                "status": "success",
                "msg": "Add tag success"
            })
        }
    } catch (error) {
        res.json({
            "status": "error",
            "msg": error
        })
    }
})

router.get('/getTags', async (req, res) => {
    try {
        result =await db.execute(`SELECT name FROM tags`);
        res.json({
            "status": "success",
            "msg": "Get tag success",
            "body": result
        })
    } catch (error) {
        res.json({
            "status": "error",
            "msg": error
        })
    }
})

router.put('/updateTag', async (req, res) => {
    try {
        let originTagName = req.body.originTagName;
        let newTagName = req.body.newTagName;
        result =await db.execute(`SELECT name FROM tags WHERE name = '${originTagName}'`);
        if (result.length == 0) {
            res.json({
                "status": "error",
                "msg": "Can not find tag name"
            })
        } else {
            result =await db.execute(`SELECT name FROM tags WHERE name = '${newTagName}'`);
            if (result.length > 0) {
                res.json({
                    "status": "error",
                    "msg": "duplicate tag name"
                })
            } else {
                result =await db.execute(`UPDATE tags SET name = '${newTagName}' WHERE name = '${originTagName}'`);
                res.json({
                    "status": "success",
                    "msg": "Update tag success"
                })
            }
        }
    } catch (error) {
        res.json({
            "status": "error",
            "msg": error
        })
    }
})

router.delete('/deleteTag', async (req, res) => {
    try {
        let tagName = req.body.tagName;
        result =await db.execute(`SELECT name FROM tags WHERE name = '${tagName}'`);
        if (result.length == 0) {
            res.json({
                "status": "error",
                "msg": "Can not find tag name"
            })
        } else {
            result =await db.execute(`DELETE FROM tags WHERE name = '${tagName}'`);
            res.json({
                "status": "success",
                "msg": "Delete tag success"
            })
        }
    } catch (error) {
        res.json({
            "status": "error",
            "msg": error
        })
    }
})
module.exports = router;