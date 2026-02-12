import React from 'react';
import {render, act} from '@testing-library/react-native';

/**
 * Reproduction: extractInputs infinite recursion in Jest.
 *
 * When a third-party library is resolved via its "main" field
 * (CommonJS build), imports look like:
 *
 *   var _reactNative = require('react-native');
 *   _reactNative.Platform.OS === 'android' // inside a worklet
 *
 * The reanimated Babel plugin captures `_reactNative` (the entire module)
 * in __closure. extractInputs then recurses into the 84-key module object.
 *
 * In React 19, Context.Provider === Context (circular self-reference).
 * The react-native module exports Context-based components, so extractInputs
 * hits the circular reference and blows the stack.
 *
 * This is NOT about developers deliberately referencing Context in worklets.
 * It's an unavoidable side effect of CommonJS module resolution + the
 * reanimated Babel plugin.
 */

// Import a CommonJS-compiled component (simulates lib/commonjs/ resolution)
const {AnimatedComponent} = require('../src/AnimatedComponent');

describe('extractInputs infinite recursion via CommonJS module capture', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('crashes when CommonJS worklet closure captures react-native module', () => {
    render(React.createElement(AnimatedComponent));
    // Flush requestAnimationFrame to trigger startMapper -> extractInputs
    act(() => {
      jest.advanceTimersByTime(100);
    });
  });
});
