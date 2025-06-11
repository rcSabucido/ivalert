import React from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';

const { height } = Dimensions.get('window');
const THRESHOLD = height * 0.4;

type AlertProps = {
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export default function Alert({ isVisible, onClose, children }: AlertProps) {
  const translateY = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);


const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          Animated.timing(translateY, {
            toValue: height,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClose());
          return;
        }
        
        if (gestureState.dy < -THRESHOLD) {
          Animated.spring(translateY, {
            toValue: height,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.alertText}>
            Swipe up to dismiss this alert!
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  alertText: {
    fontSize: 20,
    textAlign: 'center',
  },
});