var express = require('express');
var crypto = require('crypto');
var md5 = require('md5');
console.log(md5(md5('asas')+'UQAYA'));
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* Get user and project data. 

        server side pagination logic


        use input : 
        {
            orderBy = 'fieldname here'; // 
            sortBy = 'ASC or DESC'
            page = 1;
            limit = 2;
        }
*/
router.get('/get/data', function(req, res, next) {
    try {
        var limit = 2;
        var page = req.param('page');
        var skip = page * limit - page;
        var orderBy = req.param('orderBy');
        var sortBy = req.param('sortBy');
        // var qArray = [];
        var query = '';

        if (orderBy) {
            // qArray = [orderBy, sortBy];
            query = 'select p.project_title, u.username from ilance_projects p INNER JOIN ilance_users u ON u.user_id = p.user_id order by '+orderBy+' '+sortBy+' limit ' + limit + ' offset ' + skip;
        } else {
            // qArray = [];
            query = 'select p.project_title, u.username from ilance_projects p INNER JOIN ilance_users u ON u.user_id = p.user_id limit ' + limit + ' offset ' + skip;
        }

        console.log("limit :" + limit + "\n page : " + page + "\n skip : " + skip + "\n orderBy :" + orderBy + " \n sortBy : " + sortBy);

        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {

                // conn.query('select name, password, contact, email from user where ID = ?', userID, function(err, rows, fields) {
                // conn.query('select name, password, contact, email from user limit ? offset ? order by ? ?',[limit, skip, orderBy, sortBy], function(err, rows, fields) {
                // conn.query('select name, password, contact, email from user limit '+limit+' offset '+skip, function(err, rows, fields) {
                conn.query(query, function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        // return next(err);
                    }
                    // var resEmp = [];
                    // for (var empIndex in rows) {
                    //     var empObj = rows[empIndex];
                    //     resEmp.push(empObj);
                    // }
                    if (rows || fields) {
                        res.json(rows);
                    } else {
                        res.json({ "data": "not found" });
                    }
                    // console.log(rows);
                    // console.log(fields);

                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

module.exports = router;
