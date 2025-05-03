export const catchDrizzzzzleError = function<T>(promise: Promise<T>): Promise<[undefined, T] | [PostgresError]> {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      return [error];
    });
}

export const catchError = function<T>(promise: Promise<T>): Promise<[undefined, T] | [Error] > {
  return promise.then((data) => {
    return [undefined, data] as [undefined, T];
  }).catch((error) => {
    const err = error as Error;
    return [err];
  })
}