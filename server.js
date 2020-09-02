var express                =require("express"), 
    app                    =express(),
	bodyParser             =require("body-parser"),
	mongoose               =require("mongoose"),
    flash                  =require("connect-flash"),
	methodOverride         =require("method-override"),
	cars                   =require("./models/cars"),
    user                   =require("./models/user"),
    comments               =require("./models/comment"),
	passport               =require("passport"),
	passportLocal          =require("passport-local"),
	passportMongoose       =require("passport-local-mongoose");


var paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Congue quisque egestas diam in arcu cursus euismod. At risus viverra adipiscing at in Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Congue quisque egestas diam in arcu cursus euismod. At risus viverra."

mongoose.connect("mongodb+srv://yazan1ali:yazan154ali@cluster1-x9sw4.mongodb.net/<dbname>?retryWrites=true&w=majority",{
  useUnifiedTopology:true,
  useNewUrlParser:true,
  useCreateIndex:true
});



app.use(bodyParser.urlencoded({extened:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());


//passport configuer
app.use(require("express-session")({
	secret:"rasingan is the best power",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.success=req.flash("success");
	res.locals.error=req.flash("error");
 next();
});



//Landing Route
app.get("/",function(req,res){
	res.render("landing");
});


// Cars Restful Routes

// index route
app.get("/cars",function(req,res){
	cars.find({car_for_rent:"no"},function(err,allCars){
		if(err){
			req.flash("error",err.message);
		} else{
			res.render("index",{cars:allCars,header:"Welcome To MCV CARS",paragraph:paragraph});
		}
	});
	
});



// New Route
app.get("/cars/new",checkOwnership,function(req,res){
	res.render("new");
});

// Create Route
app.post("/cars",checkOwnership,function(req,res){
	var newCar={
		name:req.body.car_name,
		image:req.body.car_image,
		year:req.body.car_year,
		color:req.body.car_color,
		type:req.body.car_type,
		price:req.body.car_price,
		status:req.body.car_status,
		car_for_rent:req.body.forRent,
		rentType:req.body.rentType,
		description:req.body.car_description
	}
	cars.create(newCar,function(err,addedCar){
		if(err){
			req.flash("error",err.message);
		} else{
			req.flash("success","Successfully added car");
            res.redirect("/cars");
		}
	});
})

//Show Route
app.get("/cars/:id" , function(req,res){
    cars.findById(req.params.id).populate("comments").exec(function(err,foundCar){
        if(err || !foundCar){
			req.flash("error",err.message);
           res.redirect("back");
        }else{
           console.log(foundCar);	
           res.render("show", {car:foundCar});
           }
  });
	
});

//Edit Route
app.get("/cars/:id/edit",checkOwnership,function(req,res){
	cars.findById(req.params.id,function(err,foundCar){
		if(err || !foundCar){
			req.flash("error",err.message);
			res.redirect("back");
		} else{
			res.render("edit",{car:foundCar});
		}
	});
});

// Update Route
app.put("/cars/:id",checkOwnership,function(req,res){
	cars.findByIdAndUpdate(req.params.id, req.body.Car,function(err,updatedCar){
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		} else{
			req.flash("success","Successfully updated car");
			res.redirect("/cars/"+req.params.id);
		}
	});
});

//Delete Route
app.delete("/cars/:id",checkOwnership,function(req,res){
	cars.findByIdAndRemove(req.params.id,function(err){
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		} else{
			req.flash("success","Successfully deleted car");
			res.redirect("/cars");
		}
	})
});

//Show all new cars
app.get("/new-cars",function(req,res){
	cars.find({status:"New"},function(err,newCar){
		if(err || !newCar){
			req.flash("error",err.message);
		} else{
			res.render("index",{cars:newCar,header:"All New Cars",paragraph:""});
		}
	});
});

//Show all used cars
app.get("/used-cars",function(req,res){
	cars.find({status:"Used"},function(err,usedCar){
		if(err || !usedCar){
			req.flash("error",err.message);
		} else{
			res.render("index",{cars:usedCar,header:"All Used Cars",paragraph:""});
		}
	});
});

// Cars Rent Routes

app.get("/rent-cars/:type",function(req,res){
var type=req.params.type.toLowerCase();
	if(type==="normal"){
	   cars.find({car_for_rent:"yes",rentType:"normal"},function(err,normalRent){
		  if(err || !normalRent){
			req.flash("error",err.message);
		  } else {
			  res.render("indexNormal",{rentCar:normalRent,header:"Rent Normal Car"});	
		  }
	   });
	}
	
	else if(type==="cermony"){
	   cars.find({car_for_rent:"yes",rentType:"cermony"},function(err,cermonyRent){
		  if(err || !cermonyRent){
			req.flash("error",err.message);
		  } else {
			  res.render("indexCermony",{rentCar:cermonyRent,header:"Rent Cermony Car"});	
		  }
	   });
	}
	});

// Edit rout for rent car 
app.get("/rent-cars/:type/:id/edit",checkOwnership,function(req,res){
	cars.findById(req.params.id,function(err,foundCar){
		if(err || !foundCar){
			req.flash("error","Car not found");
			res.redirect("back");
		} else{
			res.render("editRentCar",{car:foundCar});
		}
	});
});

// Update Route for rent car
app.put("/rent-cars/:id",checkOwnership,function(req,res){
	cars.findByIdAndUpdate(req.params.id, req.body.Car,function(err,updatedCar){
		if(err){
			req.flash("error","Something went wrong");
			res.redirect("back");
		} else{
			req.flash("success","Successfully updatedCar car");
			res.redirect("/rent-cars/"+updatedCar.rentType);
		}
	});
});

// Delete route for rent car
app.delete("/rent-cars/:type/:id",checkOwnership,function(req,res){
	cars.findByIdAndRemove(req.params.id,function(err){
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		} else{
			res.redirect("/rent-cars/"+req.params.type);
		}
	});
});

// installment route
app.get("/installment",function(req,res){
	cars.find({car_for_rent:"no"},function(err,foundCar){
		if(err){
			req.flash("error","Car not found");
			res.redirect("/cars")
		} else{
			res.render("installment",{car:foundCar});
		}
	});
});

// comment route
app.get("/cars/:id/comment/new",isLoggedIn,function(req,res){
	cars.findById(req.params.id,function(err,foundCar){
		if(err || !foundCar){
			req.flash("error","Car not found");
		} else{
			res.render("newComment",{car:foundCar});
		}
	});
});

//Comments Create
app.post("/cars/:id/comment",isLoggedIn,function(req, res){
   //lookup campground using ID
   cars.findById(req.params.id, function(err, car){
       if(err || !car){
		 req.flash("error","Car not found");
           res.redirect("/cars");
       } else {
        comments.create(req.body.comment, function(err, comment){
           if(err){
			     req.flash("error","Something went wrong");
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.name.first = req.user.name.first;
			   comment.author.name.last = req.user.name.last;
               //save comment
               comment.save();
               car.comments.push(comment);
               car.save();
			   req.flash("success","Successfully added comment");
               res.redirect("/cars/" + car._id);
           }
        });
       }
   });
});

// Comments edit route
app.get("/cars/:id/comment/:comment_id/edit",checkCommentOwnership,function(req,res){
	cars.findById(req.params.id,function(err,foundCar){
		if(err || !foundCar){
			req.flash("error","Car not found");
			return res.redirect("back");
		}
			comments.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		} else{
			res.render("editComment",{car:foundCar, comment:foundComment});
		}
	  });
   });
});


// Comments Update route
app.put("/cars/:id/comment/:comment_id",checkCommentOwnership,function(req,res){
	comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updateComment){
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		} else{
			req.flash("success","Successfully updated comment");
			res.redirect("/cars/"+req.params.id);
		}
	});
});

// Comment Destroy Router
app.delete("/cars/:id/comment/:comment_id",checkCommentOwnership,function(req,res){
	comments.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			req.flash("error",err.message);
			res.redirect("back");
		} else{
			req.flash("success","Successfully deleted comment");
			res.redirect("/cars/"+req.params.id);
		}
	});
});


//Register Route
app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	var newUser=new user ({username:req.body.username,name:req.body.name,dataEntry:req.body.dataEntry});

	user.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			res.redirect("register");
		} else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome "+user.name.first+" "+user.name.last);
				res.redirect("/cars");
			});
		}
	});
});

//data entry register
app.get("/register/data",function(req,res){
	res.render("dataEntreRegister");
});


app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",{
	successRedirect:"/cars",
	failureRedirect:"/login"
	}),
	function(req,res){
	
});

app.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Successfully logged out");
    res.redirect("/cars");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

function checkOwnership(req,res,next){
	if(req.isAuthenticated()){
		user.find({}, function(err, foundUser){
		if(err || !foundUser){
			req.flash("error","User not found");
			res.redirect("back");
		} else{
			// does user own the campground?
			if(req.user.dataEntry==="yes"){
               next();
			} else{
				req.flash("error","You don't have permission to do that");
				res.redirect("back");
			}
		}
    });
	}
		else{
	       req.flash("error","You need to be logged in to do that");
           res.redirect("back");
	}
}
		
function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
		comments.findById(req.params.comment_id,function(err,foundComment){
			if(err || !foundComment){
				req.flash("error","Comment not found");
				res.redirect("back");
			} else{
				if(foundComment.author.id.equals(req.user.id)){
					next();
				} else{
					req.flash("error","You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else{
		 req.flash("error","You need to be logged in to do that");
		 res.redirect("back");
	}
}

app.listen(3000,function(){
	console.log("the server has started");
});