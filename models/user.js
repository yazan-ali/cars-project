var mongoose=require("mongoose");
var passportMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
    name:{
		first:String,
		last:String
	},
	username:String,
	password:String,
	dataEntry:String
});



userSchema.plugin(passportMongoose);

module.exports=mongoose.model("User",userSchema);