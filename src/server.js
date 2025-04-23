import app from "./app.js";
let server
async function main (){
  try{
      server = app.listen(5000, () => {
          console.log(`app is listening on port ${5000}`);
        });
  
  }catch(error){
  console.log(error)
  }
  }
  
  main()
  
  process.on('unhandledRejection', (err) => {
    console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    }
    process.exit(1);
  });
  
  process.on('uncaughtException', () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    process.exit(1);
  });