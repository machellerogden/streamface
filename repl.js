'use strict';

const { EOL } = require('os');
const repl = require('repl');
const { inspect } = require('util');
const clipboardy = require('clipboardy');

function pprint(v) {
    return inspect(v, { depth: null, colors: true });
}

function isRecoverableError(error) {
    if (error.name === 'SyntaxError') {
        return /^Unexpected end of input/.test(error.message);
    }
    return false;
}

function writer(output) {
    try {
        const str = JSON.stringify(output[0]);
        clipboardy.write(str).catch(() => {});
    } catch(e) {}
    return Array.isArray(output)
        ? output.map(pprint).join(EOL)
        : pprint(output);
}

function Repl({ readAll }) {

    function evaluate(cmd, context, filename, callback) {
        return readAll(cmd)
            .then(output => callback(null, output))
            .catch(error => {
                if (isRecoverableError(error)) {
                    return callback(new repl.Recoverable(error));
                }
            });
    }

    function start() {
        return repl.start({
            eval: evaluate,
            writer
        });
    }

    return { start };
}

module.exports = Repl;
