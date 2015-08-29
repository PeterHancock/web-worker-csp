module.exports = function(self) {
    self.addEventListener('message', function (msg) {
        var data = msg.data;
        var buffer = new ArrayBuffer(8);
        var view   = new Int8Array(buffer);
        setTimeout(function () {
            view[0] = data * 255;
            self.postMessage(buffer, [buffer]);
        }, 20)
    }, false);
}
