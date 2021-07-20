export {};

declare global {
  type ArrayItem<T> = T extends Array<infer U> ? U : T;
}
