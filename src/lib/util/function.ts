export const memoizeWeakMap = <A extends object, R>(fn: (a: A) => R) => {
  const cache = new WeakMap();

  return function weakMapMemoized(a: A): R {
    if (!cache.has(a)) cache.set(a, fn(a));

    return cache.get(a);
  };
};
