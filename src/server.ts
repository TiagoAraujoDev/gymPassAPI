import { app } from "./app";

app.listen(
  {
    host: "0.0.0.0",
    port: 8080
  },
  (err, address) => {
    if (!err) {
      console.log("🚀 Server running!");
      console.log(`🌐 Access: ${address}`);
    }
  }
);
