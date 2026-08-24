import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../design';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'glass' | 'highlight';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
}) => {
  const getCardStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    if (variant === 'elevated') list.push(styles.elevated);
    if (variant === 'glass') list.push(styles.glass);
    if (variant === 'highlight') list.push(styles.highlight);

    if (style) list.push(style);
    return list;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={getCardStyle()}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={getCardStyle()}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.md,
  },
  elevated: {
    backgroundColor: colors.background.elevated,
    ...shadows.card,
  },
  glass: {
    backgroundColor: colors.background.glass,
    borderColor: colors.border.subtle,
  },
  highlight: {
    borderColor: colors.brand.primary,
    ...shadows.glowPrimary,
  },
});
