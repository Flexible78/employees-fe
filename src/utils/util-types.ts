type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T];

export type NonFunctionProps<T> = Pick<T, NonFunctionKeys<T>>;