// https://stackoverflow.com/questions/43080547/how-to-override-type-properties-in-typescript
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
