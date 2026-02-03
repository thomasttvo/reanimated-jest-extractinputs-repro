# Reanimated extractInputs Circular Reference Bug

Minimal reproduction for https://github.com/software-mansion/react-native-reanimated/issues/8913

## Reproduce

```bash
yarn install
yarn test
```

## Error

```
RangeError: Maximum call stack size exceeded
  at extractInputs (node_modules/react-native-reanimated/src/mappers.ts:140:25)
```

## Root Cause

1. `React.createContext()` returns `{ Provider: <self> }` where `Context.Provider === Context`
2. Referencing Context inside a worklet → Babel captures it in `__closure`
3. `extractInputs` recursively iterates plain objects to find SharedValues
4. Context is a plain object, so `extractInputs` hits `Context.Provider.Provider...` → infinite recursion

In production, `makeShareableCloneRecursiveNative` has cycle detection. In Jest, `makeShareableCloneRecursiveWeb` returns values unchanged (no cycle detection).
