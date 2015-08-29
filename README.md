#web-worker-csp

A [js-csp](https://github.com/ubolonton/js-csp) `channel` interface for [Web Workers](http://www.w3.org/TR/workers/)

>`csp.put` and `csp.take` from web workers

## Example
`main.js`

``` javascript

var csp = require('js-csp'),
    workerChannel = require('./index.js');

var worker = new Worker('echo.js'); // or preferably webworkify + compatible modified echo.js!

var end = csp.timeout(100);

var w = workerChannel(worker);

csp.go(function* () {
    var count = 0;
    var chi = w.chi;  // Input channel
    var cho = w.cho;  // Output channel
    while(true) {
        yield csp.put(chi, ++count);
        var result = yield csp.alts(cho, end);
        if (result.channel === end || result.value === csp.CLOSED) {
            return;
        }
        var msg = result.value;
        console.log(msg.data);
    }
}

```

`echo.js`

``` javascript
self.addEventListener('message', function (msg) {
    setTimeout( function() {
        self.postMessage(msg);
    }, 10);
})

```

`index.html`
``` html
<script src="bundle.js"></script>
```

where `bundle.js` is output of running [browserify](https://github.com/substack/browserify) on `main.js`

The browser console should show

```
1
2
3
...
```

## install
npm i web-worker-csp

## license
MIT
