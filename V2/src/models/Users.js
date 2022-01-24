const mongoose = require("mongoose");
const logger = require("../scripts/logger/users")
const UserSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    password:String,
    email:String,
    profile_image: String,
    token:String,
    
  },
  { timestamps: true, versionKey: false }
);
/* UserSchema.pre("save",(next ,doc)=>{
  console.log("öncesi "+doc)
  next();
}); */  
UserSchema.post("save",(doc)=>{
  
  logger.log({
    level: "info",
    message: doc,
  });
});
module.exports = mongoose.model("Users", UserSchema);
