import {
  FluentProvider,
  webLightTheme,
  Theme,
} from '@fluentui/react-components';
// import { Orientation as Example } from './example';
import { Orientation as Example } from './example2';
// import PeopleGrid, { Person } from './pager';
import PeopleGrid, { Person } from './pager2';
import DataGridHeaderMenuDemo from './headerMenu';

export interface ContentProps {
  lightTheme: Theme;
  darkTheme: Theme;
}
const App: React.FC<ContentProps> = (props) => {
  const persons = new Array(200).fill(0).map((_, i) => {
    let person: Person = {
      id: `${i}`,
      name: `Gary ${i}`,
      role: `Role ${i}`,
      location: `Location ${i}`,
    };
    return person;
  });

  return (
    <FluentProvider theme={props.lightTheme}>
      <>
        <Example currentTheme={props.lightTheme} lightTheme={props.lightTheme} darkTheme={props.darkTheme} />
        {/* <PeopleGrid rows={persons} /> */}
        {/* <DataGridHeaderMenuDemo /> */}
      </>
    </FluentProvider>
  );
};

export default App;
