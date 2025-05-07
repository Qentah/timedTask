// Import the 'deasync' module to turn async functions into sync ones.
// WARNING: Using 'deasync' can block the Node.js event loop, use with caution!
const deasync = require('deasync');

// Custom error for handling timeout situations.
class TimeOutError extends Error {
    constructor(ms) {
        super(ms + " ms timeout exceeded");
        this.name = "TimeoutError";
    }
}

/**
 * Executes an asynchronous task synchronously with a timeout.
 * Useful for integrating async APIs into synchronous code (e.g., scripts, migrations, etc.).
 * 
 * @param {Function} task - Asynchronous function taking a callback (err, result).
 * @param {Object} options - Execution options.
 * @param {number} options.ms - Timeout in milliseconds (default: 1000 ms).
 * @returns {*} - Task result if successful, otherwise throws an exception.
 * @throws {TimeoutError} - If the timeout is exceeded.
 * @throws {NodeJS.ErrnoException} - If the task fails.
 * 
 * @example
 * // Basic usage:
 * const result = timedTask(cb => setTimeout(() => cb(null, 42), 500), { ms: 1000 });
 * console.log(result); // 42
 */
const timedTask = (task, option = { ms : 1000 }) => deasync((ms, callback) => {
    // Start a timeout to ensure the task finishes.
    const id = setTimeout(() => callback(new TimeOutError(ms), null), ms);
    // Callback to pass to the user task.
    const taskCallback = (err, result) => {
        clearTimeout(id); // Cancel the timeout if the task finishes first.
        callback(err, result);
    }
    // Execute the asynchronous task.
    task(taskCallback);
})(option.ms);

// export timedTask and TimeOutError for use in other modules.
module.exports = { timedTask, TimeOutError };