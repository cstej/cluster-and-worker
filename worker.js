const { parentPort } = require("worker_threads");

parentPort.on("message", (jobs) => {
  for (job of jobs) {
    let count = 0;
    for (let i = 0; i < job; i++) {
      count += i;
    }
  }
  parentPort.postMessage("done");
});
