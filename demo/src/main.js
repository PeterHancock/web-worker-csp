var csp = require('js-csp'),
    webworkify = require('webworkify'),
    workerChan = require('../../index'),
    webWorker = require('./worker');

var end = csp.timeout(300);

function run(worker) {
    csp.go(function* () {
        while(true) {
            var msg = Math.random();
            yield csp.put(worker.chi, msg);
            console.log("Putting " + msg + " on web worker channel " + worker.id);
            var result = yield csp.alts([worker.cho, end]);
            if (result.channel === end || result.value === csp.CLOSED) {
                console.log('' + worker.id + ' out closed' );
                return;
            }
            var buf = new Int8Array(result.value.data);
            console.log("Taken " + buf[0] + " from web worker channel " + worker.id);
        }
    })
}

[1,2,3].forEach( function (id) {
     run(workerChan(webworkify(webWorker), { id: '#' + id , close: true }))
 })
