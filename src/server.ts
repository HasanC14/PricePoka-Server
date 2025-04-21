import app from "./app";
import { Server } from "http";
const PORT = process.env.PORT || 3000;



async function bootStrap() {
  const server: Server = app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed");
      });
    }
    process.exit(1);
  };
  const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
  };
  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
}
bootStrap();