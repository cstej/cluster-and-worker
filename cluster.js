const cluster = require('cluster');
const os = require('os');
const express = require('express');

function delay(ms) {
    var start = Date.now();
    while (Date.now() - start < ms) {}
}

if (cluster.isMaster) {
    const cpuCount = os.cpus().length;
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
} else {
    const app = express();
    app.get('/', async (req, res) => {
        await delay(4000);
        res.json({ message: `Hello World ${process.pid}` });
    });

    app.listen(3000, () => {
        console.log(`Server is running on http://localhost:3000 and worker ${process.pid} is listening...`);
    });
}

cluster.on('exit', function(worker) {
    console.log('Worker %d died :(', worker.id);
    cluster.fork();
});