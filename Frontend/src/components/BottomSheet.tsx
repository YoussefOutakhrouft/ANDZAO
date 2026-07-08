import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
}: BottomSheetProps) {
  const colors = Colors;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animation d'ouverture
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animation de fermeture
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={handleClose}
      animationType="none"
    >
      <View style={styles.modalOverlay}>
        {/* Arrière-plan sombre cliquable pour fermer */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View 
            style={[
              styles.backdrop, 
              { 
                opacity: backdropOpacity,
                backgroundColor: '#000000'
              }
            ]} 
          />
        </TouchableWithoutFeedback>

        {/* Le Bottom Sheet */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Indicateur visuel de glissement (Grabber) */}
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />

          {/* En-tête */}
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              {subtitle && (
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  {subtitle}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.backgroundElement }]}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <X size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Contenu */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 600, // Limite la largeur sur le Web (Desktop)
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
  },
});
