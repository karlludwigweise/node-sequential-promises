import { RunSequenceResult, RunSequenceStep } from "./types";

export const runSequence = async (steps: RunSequenceStep[]): Promise<RunSequenceResult> => {
  if (steps.length === 0) {
    return Promise.resolve({ success: true, started: [], fulfilled: [] });
  }

  let errorMessage;
  const started: number[] = [];
  const fulfilled: number[] = [];
  const success = await steps.reduce(async (promise: Promise<any>, step, i) => {
    try {
      const isOk = await promise;
      if (isOk) {
        // Statistics
        started.push(i);
        if (i - 1 >= 0) {
          fulfilled.push(i - 1);
        }

        return step();
      } else {
        // Stop alltogether, if one went wrong
        return Promise.reject(false);
      }
    } catch (e) {
      errorMessage = e;
      return Promise.resolve(false);
    }
  }, Promise.resolve(true));

  // Statistics
  if (success) {
    fulfilled.push(steps.length - 1);
  }

  let result = { success, started, fulfilled, errorMessage };
  if (errorMessage) {
    result = { ...result, errorMessage };
  }
  return Promise.resolve(result);
};
