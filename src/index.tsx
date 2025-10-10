import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createDarkTheme, createLightTheme } from '@fluentui/react-components';

import type { BrandVariants, Theme } from '@fluentui/react-components';

import App from './App';

const wennsoft: BrandVariants = {
  10: '#020304',
  20: '#12181E',
  30: '#1A2733',
  40: '#213345',
  50: '#274057',
  60: '#2D4D6A',
  70: '#335B7E',
  80: '#386992',
  90: '#3E77A6',
  100: '#4485BC',
  110: '#5B93C6',
  120: '#73A1CD',
  130: '#8AAFD5',
  140: '#A0BDDD',
  150: '#B5CBE4',
  160: '#CADAEC',
};

const lightTheme: Theme = {
  ...createLightTheme(wennsoft),
};

const darkTheme: Theme = {
  ...createDarkTheme(wennsoft),
};

darkTheme.colorBrandForeground1 = wennsoft[110]; // use brand[110] instead of brand[100]
darkTheme.colorBrandForeground2 = wennsoft[120]; // use brand[120] instead of brand[110]

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App lightTheme={lightTheme} darkTheme={darkTheme} />
  </React.StrictMode>
);
