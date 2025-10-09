import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true, //false when using centralized saving as this clashes with vir password
      select: false,
    },
  },
  { timestamps: true }
);

// userSchema
//   .virtual("password")
//   .set(function (password) {
//     this._password = password;
//   })
//   .get(function () {
//     return this._password;
//   });

// // ✅ Pre-save hook: hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this._password) {
//     return next(new Error("Password is required."));
//   }

//   try {
//     const hash = await bcrypt.hash(this._password, 10);
//     this.passwordHash = hash;
//     next();
//   } catch (err) {
//     next(err);
//   }
// });
//used for centralized passsowrd hashing

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Create model

export const UserModel = mongoose.model("User", userSchema);
