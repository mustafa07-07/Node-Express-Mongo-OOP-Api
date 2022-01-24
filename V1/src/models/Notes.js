const mongoose = require('mongoose')
const NoteSchema = new mongoose.Schema(
    {
        note: String,
        like_count: Number,
        comments: [
            {
                comment: String,
                commented_at: Date,
                user_id: {
                    type: mongoose.Types.ObjectId,
                    ref: 'Users',
                },
            },
        ],
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Users',
        },
    },
    { timestamps: true, versionKey: false }
)
/* UserSchema.pre("save",(next ,doc)=>{
  console.log("öncesi "+doc)
  next();
}); */
NoteSchema.post('save', (doc) => {})
module.exports = mongoose.model('Notes', NoteSchema)
