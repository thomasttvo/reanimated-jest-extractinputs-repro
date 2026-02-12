"use strict";

/**
 * This file simulates CommonJS-compiled output of a third-party library.
 *
 * When Jest resolves a package via its "main" field (CommonJS build),
 * imports look like:
 *
 *   var _reactNative = require('react-native');
 *   _reactNative.Platform.OS === 'android'
 *
 * The reanimated Babel plugin captures `_reactNative` (the entire module)
 * in __closure — not just `Platform`.
 */

var _react = require('react');
var _reactNative = require('react-native');
var _reactNativeReanimated = require('react-native-reanimated');

function AnimatedComponent() {
  var opacity = (0, _reactNativeReanimated.useSharedValue)(1);

  // This worklet captures `_reactNative` (the whole module) in __closure
  // because Platform is accessed as `_reactNative.Platform`
  var animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(function () {
    'worklet';
    return {
      opacity: _reactNative.Platform.OS === 'android' ? 0 : opacity.value,
    };
  });

  return _react.createElement(
    _reactNativeReanimated.default.View,
    {style: animatedStyle},
    _react.createElement(_reactNative.Text, null, 'Hello'),
  );
}

exports.AnimatedComponent = AnimatedComponent;
