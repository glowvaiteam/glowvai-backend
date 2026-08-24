import { Stack } from 'expo-router';
import React from 'react';

export default function VendorLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#090D16',
        },
      }}
    />
  );
}
