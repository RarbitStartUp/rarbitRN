/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
// import type {PropsWithChildren} from 'react';
import {
  // SafeAreaView,
  // ScrollView,
  StatusBar,
  // StyleSheet,
  // Text,
  useColorScheme,
  // View,
} from 'react-native';

// import {
//   // Colors,
//   // DebugInstructions,
//   // Header,
//   // LearnMoreLinks,
//   // ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import {WebSocketProvider} from './src/util/useWebSocket';

import UploadVideo from './src/screens/UploadVideo';
import Checkbox from './src/screens/Checkbox';
import CameraScreen from './src/screens/CameraScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): React.JSX.Element {
//   // const isDarkMode = useColorScheme() === 'dark';
//   return (
//     // <View style={styles.sectionContainer}>
//     <View className="mt-8 px-2">
//       {/* <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}> */}
//       <Text className="text-2xl text-black dark:text-white">
//         {title}
//         {title}
//       </Text>
//       {/* <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}> */}
//       <Text className="mt-2 text-lg text-black dark:text-white">
//         {children}
//       </Text>
//     </View>
//   );
// }

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  const backgroundStyle = 'flex flex-1 bg-slate-800 dark:bg-slate-900';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Toast />
        {/* <SafeAreaView style={backgroundStyle}> */}
        {/* <SafeAreaView className={backgroundStyle}> */}
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          // backgroundColor={backgroundStyle.backgroundColor}
          backgroundColor={backgroundStyle}
        />
        <WebSocketProvider>
          <Stack.Navigator
            initialRouteName="UploadVideo"
            screenOptions={{
              headerShown: true,
            }}>
            <Stack.Screen name="UploadVideo" component={UploadVideo} />
            <Stack.Screen name="Checkbox" component={Checkbox} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
          </Stack.Navigator>
          {/* <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            className={backgroundStyle}> */}
          {/* <Header /> */}
          {/* <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}> */}
          {/* <View className="bg-white dark:bg-black"> */}
          {/* <Section title="Step One"> */}
          {/* Edit <Text style={styles.highlight}>App.tsx</Text> to change this */}
          {/* Hi Edit <Text className="font-bold">App.js</Text> to change this */}
          {/* screen and then come back to see your edits. */}
          {/* </Section> */}
          {/* <Section title="See Your Changes"> */}
          {/* <ReloadInstructions /> */}
          {/* </Section> */}
          {/* <Section title="Debug"> */}
          {/* <DebugInstructions /> */}
          {/* </Section> */}
          {/* <Section title="Learn More"> */}
          {/* Read the docs to discover what to do next: */}
          {/* </Section> */}
          {/* <LearnMoreLinks /> */}
          {/* </View> */}
          {/* </ScrollView> */}
          {/* </SafeAreaView> */}
        </WebSocketProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
