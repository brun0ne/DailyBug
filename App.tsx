import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DefaultTheme, PaperProvider } from 'react-native-paper';

import Main from './components/Main';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'green',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{flexGrow: 1}}>
        <Main />
      </GestureHandlerRootView>
    </PaperProvider>
  );
};
