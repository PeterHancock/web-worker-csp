var csp = require('js-csp'),
    assign = require('object-assign'),
    debug = require('debug')('js-csp-worker'),
    uuid = require('uuid').v4;

function worker(worker, opts) {
    opts = opts || {};
    var id = opts.id || uuid();
    var close = !!opts.close || true;
    var chi = opts.chi || csp.chan();
    var cho = opts.cho || csp.chan();

    worker.onmessage = function (msg) {
        csp.putAsync(cho, assign({ worker_id: id }, msg));
    }

    csp.go(function* () {
        while(true) {
            var msg = yield csp.take(chi);
            if (msg === csp.CLOSED) {
                debug('Input channel %s closed', id);
                worker.terminate()
                if (close) {
                    cho.close();
                    debug('Output channel %s closed', id);
                }
                return
            }
            worker.postMessage(msg);
        }
    })
    return {
        id: id,
        chi: chi,
        cho: cho
    };
}

module.exports = worker;
