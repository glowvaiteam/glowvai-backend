import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../design';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  helperText?: string;
  prefix?: string | React.ReactNode;
  suffix?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  prefix,
  suffix,
  containerStyle,
  inputStyle,
  required,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const getInputContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.inputContainer];
    if (isFocused) list.push(styles.focused);
    if (error) list.push(styles.errorBorder);
    return list;
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>
            {label}
            {required ? <Text style={styles.requiredStar}> *</Text> : null}
          </Text>
        </View>
      ) : null}

      <View style={getInputContainerStyle()}>
        {prefix ? (
          typeof prefix === 'string' ? (
            <Text style={styles.prefixText}>{prefix}</Text>
          ) : (
            <View style={styles.prefixWrapper}>{prefix}</View>
          )
        ) : null}

        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={colors.text.tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label || rest.placeholder}
          {...rest}
        />

        {suffix ? <View style={styles.suffixWrapper}>{suffix}</View> : null}
      </View>

      {error ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
    width: '100%',
  },
  labelRow: {
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
  },
  requiredStar: {
    color: colors.status.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: borderRadius.md,
    minHeight: 52, // Accessible touch target
    paddingHorizontal: spacing.md,
  },
  focused: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.background.secondary,
  },
  errorBorder: {
    borderColor: colors.status.error,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    paddingVertical: spacing.md,
  },
  prefixText: {
    color: colors.brand.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginRight: spacing.sm,
  },
  prefixWrapper: {
    marginRight: spacing.sm,
  },
  suffixWrapper: {
    marginLeft: spacing.sm,
  },
  errorText: {
    color: colors.status.error,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
    fontWeight: typography.weights.medium,
  },
  helperText: {
    color: colors.text.tertiary,
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
});
