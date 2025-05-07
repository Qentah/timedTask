# timedTask

A Node.js utility to synchronously execute asynchronous tasks with timeout management.

## Description

`timedTask` allows you to run an asynchronous (callback-style) function in a synchronous way, enforcing a maximum execution time. If the task does not complete within the given time, a `TimeoutError` is thrown.

> ⚠️ Warning: This module uses [`deasync`](https://www.npmjs.com/package/deasync), which blocks the Node.js event loop. Use only in scripts, migrations, or contexts where blocking is acceptable.

## Installation

```bash
npm install deasync
```

Copy the `index.js` file into your project or import it as a module.

## Usage

```js
const { timedTask, TimeOutError } = require('./index');

try {
    const result = timedTask(cb => setTimeout(() => cb(null, 42), 500), { ms: 1000 });
    console.log(result); // 42
} catch (err) {
    if (err instanceof TimeOutError) {
        console.error('The task timed out.');
    } else {
        console.error('Task execution error:', err);
    }
}
```

### Parameters

- **task**: Asynchronous function taking a callback `(err, result)`.
- **option.ms**: Maximum duration in milliseconds (default: 1000 ms).

### Exceptions

- `TimeoutError`: If the task exceeds the timeout.
- Any error returned by the task.

## Advanced Example

```js
const fs = require('fs');
const { timedTask } = require('./index');

const data = timedTask(cb => fs.readFile('file.txt', 'utf8', cb), { ms: 2000 });
console.log(data);
```

## License

MIT
