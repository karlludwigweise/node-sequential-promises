import { runSequence } from "../index";
import { RunSequenceStep } from "../types";

const success: RunSequenceStep = () => Promise.resolve();
const failure: RunSequenceStep = () => Promise.reject();
const failureWithString: RunSequenceStep = () => Promise.reject("Something went wrong!");
const failureWithError: RunSequenceStep = () => Promise.reject(new Error("Something went wrong!"));

test("should run through all successful promises", async () => {
  const expected = {
    success: true,
    started: [0, 1, 2],
    fulfilled: [0, 1, 2],
  };
  const received = await runSequence([success, success, success]);
  expect(received).toEqual(expected);
});

test("should stop, when rejected", async () => {
  const expected = {
    success: false,
    started: [0, 1],
    fulfilled: [0],
  };
  const received = await runSequence([success, failure, success]);
  expect(received).toEqual(expected);
});

test("should stop with an errorMessage, when rejected with string", async () => {
  const expected = {
    success: false,
    started: [0, 1],
    fulfilled: [0],
    errorMessage: "Something went wrong!",
  };
  const received = await runSequence([success, failureWithString, success]);
  expect(received).toEqual(expected);
});

test("should stop with an errorMessage, when rejected with Error", async () => {
  const expected = {
    success: false,
    started: [0, 1],
    fulfilled: [0],
    errorMessage: Error("Something went wrong!"),
  };
  const received = await runSequence([success, failureWithError, success]);
  expect(received).toEqual(expected);
});

test("should trigger status callback after each successful promise", async () => {
  const callback = jest.fn();
  await runSequence([success, success, success], callback);
  expect(callback).toHaveBeenCalledTimes(3);
  expect(callback).toHaveBeenLastCalledWith(2);
});
