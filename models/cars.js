var mongoose = require("mongoose");

var carSchema = new mongoose.Schema({
	image: String,
	name: String,
	year: String,
	color: String,
	type: String,
	price: String,
	status: String,
	car_for_rent: String,
	rentType: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Cars", carSchema);