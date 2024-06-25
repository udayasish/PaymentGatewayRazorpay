import dbConnect from "./db/index.js";
import { app } from "./app.js";

dbConnect()
  .then(() => {
    //Its always good to handle errors before listening
    app.on("error", (error) => {
      console.log("Error while listening !!!", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is listening on port: 8000`);
    });
  })
  .catch((error) => {
    console.log("Mongo DB Connection Failed !!!! ", error);
  });
