import React, {createContext} from 'react';
import {Text} from 'react-native';
import {render} from '@testing-library/react-native';
import Animated, {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

// React Context has: Context.Provider === Context (self-reference)
const MyContext = createContext(false);

function AnimatedComponent() {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    // Reference Context inside worklet - this captures the circular ref
    const _ctx = MyContext;
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Text>Hello</Text>
    </Animated.View>
  );
}

describe('Minimal repro - Context circular reference', () => {
  it('should fail due to Context.Provider === Context self-reference', () => {
    const {getByText} = render(<AnimatedComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
