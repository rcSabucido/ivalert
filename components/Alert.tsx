import { Image } from 'expo-image';
import React from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';
import { ChevronDoubleUpIcon, ExclamationTriangleIcon } from 'react-native-heroicons/outline';

const { height } = Dimensions.get('window');

type AlertProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function Alert({ isVisible, onClose }: AlertProps) {
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
        if (gestureState.dy <= 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          Animated.timing(translateY, {
            toValue: -height, 
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClose());
          return;
        }
        

        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
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
        <View style={styles.headerContainer}>
            <ExclamationTriangleIcon size={24} color="white" />
            <Text style={styles.headerText}>
                IV BAG LOW
            </Text>
            <ExclamationTriangleIcon size={24} color="white" />
        </View>

        <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
                Fluid level is below the safe threshold.
            </Text>
            <Text style={styles.messageText}>
                Immediate attention required.
            </Text>
        </View>

        <View style={styles.bigBoxOverlay}>
          <Image
            source={require('../assets/images/warning.gif')}
            style={styles.warningGif}
            contentFit="contain"
          />
        </View>

        <View style={styles.footerContainer}>
            <ChevronDoubleUpIcon size={24} color="white" />
            <Text style={styles.footerText}>Swipe Up to Acknowledge</Text>
        </View>
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
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#2AB4FD',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    gap: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: '30%',
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: 'white',
    textAlign: 'center',
  },
  messageContainer: {
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: 'white',
    textAlign: 'center',
  },
  bigBoxOverlay: {
    width: '80%',
    height: 235,
    backgroundColor: '#d2edfc',
    alignSelf: 'center',
    borderRadius: 12,
  },
  warningGif: {
    width: '100%',
    height: '100%',
  },
  footerContainer: {
    alignItems: 'center',
    gap: 8,
    marginTop: '45%'
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: 'white',
    textAlign: 'center',
  },
});