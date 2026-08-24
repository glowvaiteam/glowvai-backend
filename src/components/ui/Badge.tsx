import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../design';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  style,
  textStyle,
  icon,
}) => {
  const getBadgeStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];
    if (variant === 'success') list.push(styles.success);
    if (variant === 'warning') list.push(styles.warning);
    if (variant === 'error') list.push(styles.error);
    if (variant === 'info') list.push(styles.info);
    if (variant === 'brand') list.push(styles.brand);
    if (variant === 'neutral') list.push(styles.neutral);
    if (style) list.push(style);
    return list;
  };

  const getTextStyle = (): TextStyle[] => {
    const list: TextStyle[] = [styles.textBase];
    if (variant === 'success') list.push(styles.textSuccess);
    if (variant === 'warning') list.push(styles.textWarning);
    if (variant === 'error') list.push(styles.textError);
    if (variant === 'info') list.push(styles.textInfo);
    if (variant === 'brand') list.push(styles.textBrand);
    if (variant === 'neutral') list.push(styles.textNeutral);
    if (textStyle) list.push(textStyle);
    return list;
  };

  return (
    <View style={getBadgeStyle()}>
      {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
      <Text style={getTextStyle()}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  success: {
    backgroundColor: colors.status.successBg,
    borderColor: colors.status.success,
    borderWidth: 1,
  },
  warning: {
    backgroundColor: colors.status.warningBg,
    borderColor: colors.status.warning,
    borderWidth: 1,
  },
  error: {
    backgroundColor: colors.status.errorBg,
    borderColor: colors.status.error,
    borderWidth: 1,
  },
  info: {
    backgroundColor: colors.status.infoBg,
    borderColor: colors.status.info,
    borderWidth: 1,
  },
  brand: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: colors.brand.primary,
    borderWidth: 1,
  },
  neutral: {
    backgroundColor: colors.background.tertiary,
    borderColor: colors.border.default,
    borderWidth: 1,
  },
  textBase: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  textSuccess: {
    color: colors.status.success,
  },
  textWarning: {
    color: colors.status.warning,
  },
  textError: {
    color: colors.status.error,
  },
  textInfo: {
    color: colors.status.info,
  },
  textBrand: {
    color: colors.brand.primary,
  },
  textNeutral: {
    color: colors.text.secondary,
  },
});
