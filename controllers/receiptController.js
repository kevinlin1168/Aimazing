var express = require('express');
var db = require('../db');
var router = express.Router();
var middleware = require('./middleware');

router.use(middleware.tokenVerifyMiddleware);

async function storeParser(storeName, tel, gstReg) {
    storeName = storeName.replace('\'', '\'\'');
    tel = tel.split(':')[1];
    gstReg = gstReg.split(':')[1];
    try{
        result =await db.execute(`SELECT * FROM stores WHERE gst_reg = '${gstReg}'`);
        if(result.length == 0) {
            db.execute(`INSERT INTO stores (name, tel, gst_reg) VALUES ('${storeName}', '${tel}', '${gstReg}')`)
        }
        return {
            'storeName': storeName,
            'tel': tel,
            'gstReg': gstReg
        }
    } catch (error) {
        throw error;
    }
}

function dateParser(dateString) {
    let date = dateString.split(':')[1];
    date = date.split('.');
    let year = date[2];
    let month = date[1];
    let day = date[0];
    return year.concat('-', month, '-', day);
}

function timeParser(timeString) {
    let time = timeString.split(':');
    let hour = time[1];
    let minute = time[2];
    let second = time[3];
    return hour.concat(':',minute,':',second);
}

function datetimeParser(data) {
    let date = dateParser(data[0]);
    let time = timeParser(data[2]);
    return date.concat(' ', time)
}

async function receiptParser(lines) {
    let storeObj = await storeParser(lines[0], lines[1], lines[2]);
    let receiptID = lines[5].split(':')[1].replace(/(^[\s]*)|([\s]*$)/g, "");
    let total = lines[lines.length - 5].split(':')[1].replace(/(^[\s]*)|([\s]*$)/g, "");
    let datetime = datetimeParser(lines[4].split(" "));
    let receipt = {
        'store': storeObj,
        'receiptID': receiptID,
        'total': total,
        'datetime': datetime
    };
    return receipt;
}

router.post('/uploadReceipt', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.json({
                "status": "error",
                "msg": "No files were uploaded."
            })
        } else {
            let b = Buffer.from(req.files.file.data);
            let s = b.toString('utf-8');
            let lines = s.split('\r\n');
            receiptObj = await receiptParser(lines);
            let tagName = req.body.tagName;
            if(tagName) {
                let result = await db.execute(`SELECT id FROM tags WHERE name = '${tagName}'`);
                if(result == 0) {
                    res.json({
                        "status": "error",
                        "msg": "Can not find tag."
                    })
                } else {
                    db.execute(`INSERT INTO receipts (receipt_id, date, total, store_id, tag_id) VALUES ('${receiptObj.receiptID}', to_timestamp('${receiptObj.datetime}', 'YYYY-MM-DD HH24:MI:SS'), '${receiptObj.total}', (SELECT id FROM stores WHERE gst_reg = '${receiptObj.store.gstReg}'), '${result[0].id}')`);
                }
            } else {
                db.execute(`INSERT INTO receipts (receipt_id, date, total, store_id, tag_id) VALUES ('${receiptObj.receiptID}', to_timestamp('${receiptObj.datetime}', 'YYYY-MM-DD HH24:MI:SS'), '${receiptObj.total}', (SELECT id FROM stores WHERE gst_reg = '${receiptObj.store.gstReg}'), null)`);
            }
            res.json({
                "status": "success",
                "msg": "Upload Receipt success"
            })
        }
    } catch (error) {
        res.json({
            "status": "error",
            "msg": error
        })
    }
})

router.get('/getReceipt', async(req, res) => {
    try {
        result =await db.execute(`SELECT receipts.receipt_id, receipts.date, receipts.total, stores.name AS storeName, stores.tel, stores.gst_reg, tags.name AS tagName FROM receipts INNER JOIN stores ON receipts.store_id = stores.id LEFT JOIN tags ON receipts.tag_id = tags.id`);
        res.json({
            "status": "success",
            "msg": "Get receipts success",
            "body": result
        })
    } catch (error) {
        res.json({
            "status": "error",
            "msg": error
        })
    }
})

router.get('/getReceiptByTag', async(req, res) => {
    try {
        let tagName = req.body.tagName;
        let result = await db.execute(`SELECT id FROM tags WHERE name = '${tagName}'`);
        if(result == 0) {
            res.json({
                "status": "error",
                "msg": "Can not find tag."
            })
        } else {
            result =await db.execute(`SELECT receipts.receipt_id, receipts.date, receipts.total, stores.name AS storeName, stores.tel, stores.gst_reg, tags.name AS tagName FROM receipts INNER JOIN stores ON receipts.store_id = stores.id LEFT JOIN tags ON receipts.tag_id = tags.id WHERE receipts.tag_id = '${result[0].id}'`);
            res.json({
                "status": "success",
                "msg": "Get receipts success",
                "body": result
            })
        }
    } catch (error) {
        res.json({
            "status": "error",
            "msg": error
        })
    }
})

router.put('/updateReceipteTag', async(req, res) => {
    try {
        let tagName = req.body.tagName;
        let receiptID = req.body.receiptID;
        let tagResult = await db.execute(`SELECT id FROM tags WHERE name = '${tagName}'`);
        if(tagResult == 0) {
            res.json({
                "status": "error",
                "msg": "Can not find tag."
            })
        } else {
            let receiptResult = await db.execute(`SELECT receipt_id FROM receipts WHERE receipt_id = '${receiptID}'`);
            if(receiptResult == 0) {
                res.json({
                    "status": "error",
                    "msg": "Can not find receipt."
                })
            } else {
                await db.execute(`UPDATE receipts SET tag_id = '${tagResult[0].id}' WHERE receipt_id = '${receiptID}'`);
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

module.exports = router;
