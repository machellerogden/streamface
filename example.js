#!/usr/bin/env node
'use strict';

const streamface = require('.');
const streamify = require('async-stream-generator');

async function* toAsync(statements) {
    for await (const statement of statements) yield statement;
}

function read(data = '') {
    return data[Symbol.asyncIterator]
        ? data
        : Array.isArray(data)
            ? data.values()
            : [ data ].values();
}

function readToStream(data = '', opts) {
    return streamify(toAsync(read(data)));
}

async function readAll(data = '', opts) {
    const results = [];
    for await (const result of read(data, opts)) results.push(result);
    return results;
}

streamface.wrap({ readAll, readToStream, module });
