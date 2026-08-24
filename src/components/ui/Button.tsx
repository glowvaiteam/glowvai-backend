import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  AccessibilityProps,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../../design';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends AccessibilityProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) => {
  const isInteractive = !disabled && !isLoading;

  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    // Size
    if (size === 'sm') list.push(styles.sizeSm);
    if (size === 'md') list.push(styles.sizeMd);
    if (size === 'lg') list.push(styles.sizeLg);

    // Variant
    if (variant === 'primary') list.push(styles.primary);
    if (variant === 'secondary') list.push(styles.secondary);
    if (variant === 'outline') list.push(styles.outline);
    if (variant === 'danger') list.push(styles.danger);
    if (variant === 'ghost') list.push(styles.ghost);

    // Full width
    if (fullWidth) list.push(styles.fullWidth);

    // Disabled
    if (!isInteractive) list.push(styles.disabled);

    if (style) list.push(style);
    return list;
  };

  const getTextStyle = (): TextStyle[] => {
    const list: TextStyle[] = [styles.textBase];

    if (size === 'sm') list.push(styles.textSm);
    if (size === 'md') list.push(styles.textMd);
    if (size === 'lg') list.push(styles.textLg);

    if (variant === 'primary') list.push(styles.textPrimary);
    if (variant === 'secondary') list.push(styles.textSecondary);
    if (variant === 'outline') list.push(styles.textOutline);
    if (variant === 'danger') list.push(styles.textDanger);
    if (variant === 'ghost') list.push(styles.textGhost);

    if (!isInteractive) list.push(styles.textDisabled);

    if (textStyle) list.push(textStyle);
    return list;
  };

  return (
    <TouchableOpacity
      onPress={isInteractive ? onPress : undefined}
      activeOpacity={0.8}
      disabled={!isInteractive}
      style={getContainerStyle()}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !isInteractive, busy: isLoading }}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.background.primary : colors.brand.primary}
        />
      ) : (
        <>
          {icon ? <>{icon}</> : null}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    minHeight: 48, // Standard Android touch target
  },
  sizeSm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 40,
    borderRadius: borderRadius.sm,
  },
  sizeMd: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
    borderRadius: borderRadius.md,
  },
  sizeLg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    minHeight: 56,
    borderRadius: borderRadius.lg,
  },
  primary: {
    backgroundColor: colors.brand.primary,
    ...shadows.glowPrimary,
  },
  secondary: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.brand.primary,
  },
  danger: {
    backgroundColor: colors.status.error,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  textBase: {
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  textSm: {
    fontSize: typography.sizes.sm,
  },
  textMd: {
    fontSize: typography.sizes.md,
  },
  textLg: {
    fontSize: typography.sizes.lg,
  },
  textPrimary: {
    color: colors.background.primary,
    fontWeight: typography.weights.bold,
  },
  textSecondary: {
    color: colors.text.primary,
  },
  textOutline: {
    color: colors.brand.primary,
  },
  textDanger: {
    color: colors.text.primary,
  },
  textGhost: {
    color: colors.text.secondary,
  },
  textDisabled: {
    color: colors.text.tertiary,
  },
});
