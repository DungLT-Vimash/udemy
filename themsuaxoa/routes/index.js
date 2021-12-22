var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var chuyenthanhObjectId = require('mongodb').ObjectID;

const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name --> thay đôi lại 
const dbName = 'contact';
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET them du lieu. */
router.get('/them', function(req, res, next) {
  res.render('them', { title: 'Thêm mới dữ liệu' });
});


/* GET them du lieu. */
router.post('/them', function(req, res, next) {
   var duLieu01 = {
    "ten" : req.body.ten ,
    "dienthoai": req.body.dt
  }
  const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Insert some documents
    collection.insert(duLieu01, function(err, result) {
      assert.equal(err, null);
      console.log("Them du lieu thanh cong ");
      callback(result);
    });
  }

    // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    insertDocuments(db, function() {
      client.close();
    });
  });

  res.redirect('/them');
  

  
  });

  /* GET Xem . */
router.get('/xem', function(req, res, next) {
    const findDocuments = function(db, callback) {
      const collection = db.collection('nguoidung');
      collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
      });
    }
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);     
      const db = client.db(dbName);      
        findDocuments(db, function(dulieu) {
          res.render('xem', { title: 'Xem dữ liệu ',data:dulieu });
           client.close();
        });
      
    });
/* Xoa du lieu . */
router.get('/xoa/:idcanxoa', function(req, res, next) {
  var idcanxoa = chuyenthanhObjectId(req.params.idcanxoa); 
  //ham xoa 
  const xoacontact = function(db, callback) {
     const collection = db.collection('nguoidung');
     collection.deleteOne({ _id : idcanxoa }, function(err, result) {
      assert.equal(err, null);
       console.log("Xoa thanh cong ");
      
      callback(result);
      
    });    
  }
  // ket noi mongo
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err); 
      const db = client.db(dbName); 
      xoacontact(db, function() {
            client.close();
            res.redirect('/xem');
          });   
    });

   
});  // end xoa du lieu 



  
});

/* Sửa dữ liệu . */
router.get('/sua/:idcansua', function(req, res, next) {
  var idcansua = chuyenthanhObjectId(req.params.idcansua);
  const findDocuments = function(db, callback) {
     const collection = db.collection('nguoidung');
     collection.find({_id: idcansua}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Tìm thấy !");      
      callback(docs);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);     
    const db = client.db(dbName);      
      findDocuments(db, function(dulieu) {
       res.render('sua', { title: 'Sửa dữ liệu ',data:dulieu });
      console.log(dulieu);
         client.close();
      });
    
  });
   
 }); // end get dư lieu 
 
/* GET home page. */
router.post('/sua/:idcansua', function(req, res, next) {
  var idcansua = chuyenthanhObjectId(req.params.idcansua);
  var duLieu01 = {
    "ten" : req.body.ten ,
    "dienthoai": req.body.dt
  }
  const updateDocument = function(db, callback) {
     const collection = db.collection('nguoidung');
     collection.updateOne({ _id : idcansua }
      , { $set: duLieu01  }, function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      console.log("Updated the document with the field a equal to 2");
      callback(result);
    });  
  }

   // Use connect method to connect to the server
   MongoClient.connect(url, function(err, client) {
    assert.equal(null, err); 
    const db = client.db(dbName); 
    updateDocument(db, function() {
          client.close();
          res.redirect('/xem');
        });   
  });

}); // end post sua 


module.exports = router;
