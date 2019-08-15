# streamface

> The pattern was wet.
  Shared among several packages.
  The pattern is dry.

Streamface is a simple command-line wrapper for stream-based tools. I wrote it because I found myself repeating a certain patterns in several packges I was working on.

## Install

```
npm i streamface
```

## Usage

In order to use streamface, you first need to implement two functions within your project:

### `readAll`

A function which takes a string, an Array or a ReadableStream and returns a promise.

### `readToStream`

A function which takes a string, an Array or a ReadableStream and returns a ReadableStream.

Once you've implemented these functions, you can then invoke the `streamface.wrap` method inside your entry point script. Be sure to pass the `module` object so that streamface can detect the runtime context properly.

```
streamface.wrap({ readAll, readToStream, module });
```

### Example Implementation

Here's an example of an implementation which simply passes input through, unchanged. You don't have to write it this way, but this should serve as an example or as a starting point if you don't know where to begin.

```
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
```

# License

MIT
