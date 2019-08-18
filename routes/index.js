var express = require('express');
var router = express.Router();
var purchase = require('../schema/purchase');
var supplier = require('../schema/supplier');
var today_inc = require('../schema/today_inc');
var pay = require('../schema/pay');
var moment = require('moment');
var AdminsModel = require('../schema/admin');
/* GET home page. */
router.get('/index', function(req, res, next) {
var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  AdminsModel.findById(req.session.userid,function(err,db_user_array){
  purchase.find(function(err,purchase){
    supplier.find(function(err,supplier){
      today_inc.find(function(err,today_inc){
        if(err){
          console.log("Error In  Fetch Data " + err)
        }
        else{
          
         
          res.render('index',{ user_array: db_user_array, purchase : purchase,supplier:supplier,today_inc:today_inc});
        
        }
      });  
    });
  });
  }); 
});
router.get('/supplier_add', function(req, res, next) {
  var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  
  AdminsModel.findById(req.session.userid,function(err,db_user_array){

    console.log(req.session.userid);
    if(err){
      console.log("Error is Single Recode Fetch "+err);
    }
    else{
      console.log(db_user_array);
      res.render('supplier_add',{user_array: db_user_array});
    }
  
  });
  
});
router.post('/Supplier_add', function (req, res, next) {
  console.log(req.body);

  //Create an Array 
  const mybodydata = {
    supplier_name: req.body.supplier_name,
    supplierp_place: req.body.supplierp_place,
    supplier_contact: req.body.supplier_contact,
  }
  var data = supplier(mybodydata);

  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record" + err);
    } else {
      res.redirect('/supplier_view');
    }
  })

});

router.post('/pay_add', function (req, res, next) {
  console.log(req.body);
var  pay_recno = req.body.pay_recno;
var  pay_date = req.body.pay_date;
 var purchaseid = req.body.purchase;
 var pay_amount =req.body.pay_amount;
 purchase.findById(purchaseid,function(err, data){
    pay_remaining = data.purchase_unpaidamount - pay_amount; 
    const mybodydata = {
      purchase: req.body.purchase,
      pay_amount: req.body.pay_amount,
      pay_date: req.body.pay_date,
      pay_recno: req.body.pay_recno,
      pay_remaining:pay_remaining,  
    }
    var data = pay(mybodydata);
    data.save(function (err) {
      if (err) {
        console.log("Error in Insert Record" + err);
      } else {
        console.log("????????????????????????????????????????????????????"+pay_remaining+pay_recno);
        const purchaseamount_update = {   
          purchase_unpaidamount : pay_remaining,
          pay_recno:pay_recno,
          pay_date:pay_date

        }
        
    purchase.findByIdAndUpdate(purchaseid,purchaseamount_update,function(err){
    
      if(err){
        console.log("Error In Record Update");
        res.redirect('/pay');
      }else{
        res.redirect('/purchase_view');
      }
    
      });
      }
    })

   
  });
  //Create an Array 
  

});

router.get('/supplier_view', function(req, res, next) {
  var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  AdminsModel.findById(req.session.userid,function(err,db_user_array){
  supplier.find(function(err,data){
  
    if(err){
      console.log("Error In  Fetch Data " + err)
    }
    else{
      console.log(data);
      
      res.render('supplier_view',{ user_array: db_user_array, supplier_view : data});
    
    }
  });
  });
});
router.get('/purchase_add', function(req, res, next) {
 AdminsModel.findById(req.session.userid,function(err,db_user_array){
 supplier.find(function(err,data){
  
    if(err){
      console.log("Error In  Fetch Data " + err)
    }
    else{
      console.log(data);
      
      res.render('purchase_add',{ user_array: db_user_array, supplier_view : data});
    
    }
 });
  });
});
router.get('/supplierp_place', function(req, res, next) {
  var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  var supplierp_place = req.query.q;
  console.log(supplierp_place);
  supplier.findById(supplierp_place,function(err,db_user_array){

    if(err){
      console.log("Error is Single Recode Fetch "+err);
    }
    else{
      console.log(db_user_array.supplierp_place);
      var result = db_user_array.supplierp_place;
      res.send({
        place: db_user_array.supplierp_place
      });
    }
  });
});
router.post('/purchase_add', function (req, res, next) {
 
  console.log("hardik?????????????????????????????????????????????????????????????????????");
  var supplier_id= req.body.supplier_name;
  supplier.findById(supplier_id,function(err,supplier_array){

    if(err){
      console.log(err);
    }
    else{
    console.log("????????????????????????????"+supplier_array.supplier_name);


    console.log("paid ====="+req.body.pay);
    if(req.body.pay=="paid"){
    
      const mybodydata = {
        supplier_name:supplier_array.supplier_name,
        supplierp_place: req.body.supplierp_place,
        purchase_billno: req.body.purchase_billno,
        date: req.body.date,
        pay:req.body.pay,
        dis:req.body.dis,
        pay_recno: req.body.pay_recno,
        purchase_amount: req.body.purchase_amount,
        purchase_unpaidamount:"0",
        
      }
      var data = purchase(mybodydata);
    
      data.save(function (err) {
        if (err) {
          console.log("Error in Insert Record" + err);
        } else {
          res.redirect('/purchase_view');
        }
      })
    
    
    }else{
      const mybodydata = {
        supplier_name: supplier_array.supplier_name,
        supplierp_place: req.body.supplierp_place,
        purchase_billno: req.body.purchase_billno,
        date: req.body.date,
        pay_date:"",
        pay:req.body.pay,
        dis:req.body.dis,
        pay_recno: "enter number",
        purchase_amount: req.body.purchase_amount,
        purchase_unpaidamount:req.body.purchase_amount,
        
      }
      var data = purchase(mybodydata);
    
      data.save(function (err) {
        if (err) {
          console.log("Error in Insert Record" + err);
        } else {
          res.redirect('/purchase_view');
        }
      })
    
    
    
    }
    }

  })


  
  //Create an Array 
 
});

router.get('/purchase_view', function(req, res, next) {
 var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
AdminsModel.findById(req.session.userid,function(err,db_user_array){
   purchase.find(function(err, data){
        if(err){
          console.log(err);
        }
        else{

          console.log("hardik");
          res.render('purchase_view',{user_array: db_user_array,  purchase_view : data, moment: moment });
        }
   });
    });
});
router.get('/today_inc', function(req, res, next) {
  var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  
  AdminsModel.findById(req.session.userid,function(err,db_user_array){

    console.log(req.session.userid);
    if(err){
      console.log("Error is Single Recode Fetch "+err);
    }
    else{
      console.log(db_user_array);
      res.render('today_inc',{user_array: db_user_array});
    }
  
  });

});

router.post('/today_inc', function (req, res, next) {
  console.log("hardik?????????????????????????????????????????????????????????????????????");
  console.log(req.body);

  //Create an Array 
  const mybodydata = {
    today_inc_date:req.body.today_inc_date,
    today_inc_amount:req.body.today_inc_amount
  }
  var data = today_inc(mybodydata);

  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record" + err);
    } else {
      res.redirect('/index');
    }
  })

});


router.get('/today_inc_view', function(req, res, next) {
  var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  AdminsModel.findById(req.session.userid,function(err,db_user_array){
  today_inc.find(function(err,data){
  
    if(err){
      console.log("Error In  Fetch Data " + err)
    }
    else{
      console.log(data);
      
      res.render('today_inc_view',{user_array: db_user_array,  today_inc_view : data,moment: moment});
    
    }
  });
  });

});


// delete purchase_view?????????????//////

router.get('/delet/:id', function(req, res, next) {
  var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  console.log(req.params.id);
  purchase.findByIdAndDelete(req.params.id,function(err,db_user_array){

    if(err){
      console.log("Error is Single Recode Fetch "+err);
      res.redirect('/users/User_display');
    }
    else{
      console.log("Recode Delet");
      res.redirect('/purchase_view');
    }

  });

});
// delete purchase_view?????????????//////
router.get('/supplier_view/:id', function(req, res, next) {
  var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  console.log(req.params.id);
  supplier.findByIdAndDelete(req.params.id,function(err,db_user_array){

    if(err){
      console.log("Error is Single Recode Fetch "+err);
      res.redirect('/users/User_display');
    }
    else{
      console.log("Recode Delet");
      res.redirect('/supplier_view');
    }

  });

});
router.get('/Purchase_list', function(req, res, next) {
  var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  AdminsModel.findById(req.session.userid,function(err,db_user_array){
 purchase.find(function(err, data){
  if(err){
    console.log(err);
  }
  else{

    console.log("hardik");
    res.render('Purchase_list',{ user_array: db_user_array, purchase_view : data, moment: moment });
  }
 });
});



});
router.get('/report', function(req, res, next) {
  var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  
  AdminsModel.findById(req.session.userid,function(err,db_user_array){

    console.log(req.session.userid);
    if(err){
      console.log("Error is Single Recode Fetch "+err);
    }
    else{
      console.log(db_user_array);
      res.render('report',{user_array: db_user_array});
    }
  
  });
});
router.get('/pay/:id', function(req, res, next) {
 var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
        
    AdminsModel.findById(req.session.userid,function(err,db_user_array){
    purchase.findById(req.params.id,function(err, data){})
    .populate('supplier')
    .exec(function(err, data) {
      console.log(data);
      console.log("hardik!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      res.render('pay', {user_array: db_user_array,   pay : data});

    }) 
    });
  });


router.get('/purchase_pay', function(req, res, next) {
  var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  var purchase_pay = req.query.q;
console.log("???????????????????????????????????????????????????????"+purchase_pay);
  purchase.findById(purchase_pay,function(err,data){
  
    if(err){
      console.log("Error In  Fetch Data " + err)
    }
    else{
      console.log(data);
      
      res.send({
        place: data.supplierp_place,
        bill:data.purchase_billno,
        amount:data.purchase_unpaidamount,
      });   
    }
  });
});


router.get('/pay_view', function(req, res, next) {
 var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
   AdminsModel.findById(req.session.userid,function(err,db_user_array){
  pay.find(function(err, data){
        
    console.log(data);
    if (err) res.json({message: 'There are no posts here.'});
    pay.find({})
    .populate('purchase').populate('supplier')
    .exec(function(err, data) {
      console.log(data);
      console.log("hardik");
      res.render('pay_view',{ user_array: db_user_array,   pay_view : data});

    })
  });
  });
});


//delete today_income

router.get('/today_inc_delete/:id', function(req, res, next) {
  var mysession = req.session.email;
if(!mysession){
  res.redirect('/');
}
  console.log(req.params.id);
  today_inc.findByIdAndDelete(req.params.id,function(err,db_user_array){

    if(err){
      console.log("Error is Single Recode Fetch "+err);
      res.redirect('/today_inc');
    }
    else{
      console.log("Recode Delet");
      res.redirect('/today_inc_view');
    }

  });

});



//ADMIN Login Page   ////



router.get('/', function(req, res, next) {
  res.render('Admin', { title: 'Express' });
});
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});
router.post('/signup', function (req, res, next) {
  console.log(req.body);

  //Create an Array 
  const mybodydata = {
    Admin_name: req.body.Admin_name,
    Admin_email: req.body.Admin_email,
    Admin_password: req.body.Admin_password,
    

  }
  var data = AdminsModel(mybodydata);

  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record" + err);
    } else {
      res.redirect('/');
    }
  })

});
router.get('/forgot_password', function(req, res, next) {
  res.render('forgot_password', { title: 'Express' });
});
 
router.post('/forgot_password', function(req, res, next) {
  var email = req.body.Admin_email; 

  console.log(req.body);
  AdminsModel.findOne({ "Admin_email": email }, function (err, db_Admins_array) {

    console.log("Find One " + db_Admins_array);

    if (db_Admins_array) {
      var db_email = db_Admins_array.Admin_email;
      var db_password = db_Admins_array.Admin_password;

    }

    console.log("db_Admins_array.Admin_email " + db_email);
    console.log("db_Admins_array.Admin_password " + db_password);

    if (db_email == null) {
      console.log("If");
      res.render('Admin/error');
    }
    else if (db_email == email) {
     
      
      

      "use strict";
      // setup email data with unicode symbols
  


  const nodemailer = require('nodemailer');
    
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "crazy2engineers@gmail.com", // generated ethereal user
            pass: "Crazy2@engineers" // generated ethereal password
        }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Crazy2Engineers" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: "Forgot Password", // Subject line
      text: "Hello your password is "  + db_password, // plain text body
      html: "Hello your password is "  + db_password // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  res.redirect('/');
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
  
    }
    else {
      console.log("Credentials wrong");
      res.end("Login invalid");
    }

 
  });
});

router.get('/forms',function(req,res,next)
{
res.render('forms');
});




router.get('/login',function(req,res,next)
{
res.render('login');
});

router.post('/loginprosee', function(req, res, next) {
  
  var var1 = req.body.Admin_email;
  var var2 =req.body.Admin_password;
  console.log("I am Variable "+ var1);
  req.session.mysession = var1;
  res.cookie("Email" , var2 , {maxAge : 60000});
  
  console.log("I am Session " + req.session.mysession);
 
  
  var email = req.body.Admin_email;
  var password = req.body.Admin_password;

  console.log(req.body);
  AdminsModel.findOne({ "Admin_email": email }, function (err, db_users_array) {

    console.log("Find One " + db_users_array);

    if (db_users_array) {
      var db_email = db_users_array.Admin_email;
      var db_password = db_users_array.Admin_password;

    }

    console.log("db_users_array.user_email " + db_email);
    console.log("db_users_array.user_password " + db_password);

    if (db_email == null) {
      console.log("If");
      res.render("admin");
    }
    else if (db_email == email && db_password == password) {
        req.session.userid=db_users_array._id;
      req.session.email = db_email;
      console.log("hardik");
      res.redirect('/index');
    }
    else {
      console.log("Credentials wrong");
      res.end("Login invalid");
    }

 
  });
});

router.get('/logout',function(req,res,next)
{
  req.session.destroy();
res.redirect('/');
});

module.exports = router;
