import './App.scss';
import Main from './main/Main';
import { initI18n } from 'services/i18n/init';

initI18n();

function App() {
  return <Main />;
}

export default App;
