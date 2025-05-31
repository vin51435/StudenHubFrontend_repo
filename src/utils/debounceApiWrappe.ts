export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let resolveList: Array<(value: Awaited<ReturnType<T>>) => void> = [];
  let rejectList: Array<(error: any) => void> = [];
  let latestArgs: Parameters<T>;

  return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    latestArgs = args;

    if (timeout) {
      clearTimeout(timeout);
    }

    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      resolveList.push(resolve);
      rejectList.push(reject);

      timeout = setTimeout(async () => {
        timeout = null;
        try {
          const result = await fn(...latestArgs);
          resolveList.forEach((r) => r(result));
        } catch (error) {
          rejectList.forEach((rej) => rej(error));
        } finally {
          resolveList = [];
          rejectList = [];
        }
      }, wait);
    });
  };
}
