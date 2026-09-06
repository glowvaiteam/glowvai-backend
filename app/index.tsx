import React from 'react';
import { Redirect } from 'expo-router';

export default function AppEntryScreen() {
  return <Redirect href="/(customer)/(tabs)" />;
}
