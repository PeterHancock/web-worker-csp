var csp = require('js-csp'),
    test = require('tape'),
    assign = require('object-assign'),
    webWorkerCsp = require('../index');

function worker(assert, config) {
    return assign({
        terminate: () => assert.fail('terminate()'),
        postMessage: data => assert.fail('postMessage(%s)', data)
    }, config);
};

test('Test 1', assert =>  {
    assert.plan(2);
    var webWorker = worker(assert, {
        postMessage: function (msg) {
            this.onmessage({ data: msg });
        }
    });

    var workerChannels =  webWorkerCsp(webWorker, { id: '#worker' });

    csp.go(function* () {
        var chi = workerChannels.chi;
        var cho = workerChannels.cho;
        yield csp.put(chi, 1);
        var msg = yield csp.take(cho);
        assert.equals(1, msg.data);
        assert.equals('#worker', msg.worker_id);
    })
})
