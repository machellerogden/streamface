'use strict';

function wrap({ readToStream, readAll, module }) {
    if (require.main === module) {
        process.stdin.isTTY
            ? process.argv[2] == null
                ? require('./repl')({ readAll }).start()
                : readToStream(process.argv.slice(2)).pipe(process.stdout)
            : readToStream(process.stdin).pipe(process.stdout);
    }
}

module.exports = { wrap };
