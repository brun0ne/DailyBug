import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

import Main from './components/Main';
import { theme } from './util/Theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{flexGrow: 1}}>
        <Main />
      </GestureHandlerRootView>
    </PaperProvider>
  );
};
