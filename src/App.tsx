import './App.css'
import { MantineProvider } from '@mantine/core';
import { TspSvg } from './libs/TspSvg';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <TspSvg />
    </MantineProvider>
  );
}
export default App
