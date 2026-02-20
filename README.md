# node-sequential-promises

A tiny script to run async functions aka promises one after the other

## Usage

Import package:

```
import { runSequence } from "@klw/node-sequential-promises";
```

Your async functions must follow a few rules:

- If it's successful, it must `return Promise.resolve()`
- If it fails, it must
  - `return Promise.reject()` or
  - `return Promise.reject("Your Error Message Here")` or
  - `return Promise.reject(new Error("Your Error Message Here"))`

```
const myAsyncFunc1 = async () => {
    if (1 + 1 = 2) {
        return Promise.resolve();
    } else {
        return Promise.reject("Your Error Message Here");
    }
}
```

Run your async functions on the order you like:

```
const result = await runSequence([myAsyncFunc1, myAsyncFunc2, myAsyncFunc3]);
```

`node-sequential-promises` will run them one after the other.

- If one should fail, it will stop running all others.
- Even if it fails, you will get a resolved result.

## Return value

A positive result:

```
{
  success: true,
  started: [0, 1, 2],
  fulfilled: [0, 1, 2],
}
```

A negative result (2nd async function failed):

```
{
  success: false,
  started: [0, 1],
  fulfilled: [0],
  errorMessage: "Your Error Message Here",
}
```

## Status Callback

You can add a status callback function that will let you know, when each promise resolved.

```
const status = (index: number) => {
  // sends the index of the resolved promise
  // do something with it
};
const result = await runSequence([myAsyncFunc1, myAsyncFunc2, myAsyncFunc3], status);
```
