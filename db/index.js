import mongoose from "mongoose";

const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
console.log(dbName);

const dbConnect = async () => {
  try {
    // const connectionInstance = await mongoose.connect(`${url}/${dbName}`);
    const connectionInstance = await mongoose.connect(`${url}/payment-gateway`);
    console.log(
      `MongoDB connected succesfully!! Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection FAILED !! : ", error);
    process.exit(1); //process is an inbuilt method of node, we can exit from different exit codes
  }
};

export default dbConnect;
