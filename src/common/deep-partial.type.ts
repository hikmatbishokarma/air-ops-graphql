
export declare type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends Array<infer U> ? DeepPartial<U>[] : T[K] extends object ? DeepPartial<T[K]> : T[K];
  };