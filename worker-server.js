const express = require("express");
const { Worker } = require("worker_threads");

const app = express();

function chunkify(array, n) {
  const chunks = [];
  for (let i = n; i > 0; i--) {
    chunks.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return chunks;
}

// Without Promise

// function run(jobs, concurrentWorkders) {
//   const chunks = chunkify(jobs, concurrentWorkders);
//   chunks.forEach((data, i) => {
//     const worker = new Worker("./worker.js");
//     worker.postMessage(data);
//     worker.on("message", () => {
//       console.log(`Worker ${worker.threadId} finished and ${i}`);
//     });
//   });
// }

// With Promise
function run(jobs, concurrentWorkders) {
  const chunks = chunkify(jobs, concurrentWorkders);
  const promises = chunks.map((data, i) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker("./worker.js");
      worker.postMessage(data);
      worker.on("message", () => {
        console.log(`Worker ${worker.threadId} finished and ${i}`);
        resolve();
      });
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  });

  return Promise.all(promises);
}

app.get("/", async (req, res) => {
  const jobs = Array.from({ length: 100 }, () => 1e6);
  try {
    await run(jobs, 4);
    res.json({ message: "Done" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/", (req, res) => {
  const jobs = Array.from({ length: 100 }, () => 1e9);
  run(jobs, 4);
  res.json({ message: "Done" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
