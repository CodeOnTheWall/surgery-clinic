import { Schema, model, models } from "mongoose";

const ClinicSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
});

// this would be thr express way where the server is always up and running
// but in nextJS its only up when its needed/called
// const User = model("User", UserSchema);
// export default User;

// look into the models first, if not there (||), create new one
const Clinic = models.Clinic || model("Clinic", ClinicSchema);
export default Clinic;
