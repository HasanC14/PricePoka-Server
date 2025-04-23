import app from "./app.js";

const PORT = process.env.PORT || 3000;



async function bootStrap() {
  const server = app.listen(PORT, () =>
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
  const unexpectedErrorHandler = (error) => {
    console.error(error);
    exitHandler();
  };
  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
}
bootStrap();