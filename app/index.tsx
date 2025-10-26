/**
 * Index Screen - Redirects to Todo Tabs
 *
 * This screen automatically redirects authenticated users to the active todos tab.
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/active" />;
}
