import { PageInfo } from './components/pageinfo';
import { CalcStart } from './components/calcstart';
import { About } from './components/about';

export function App() {
  return (
    <>
      <PageInfo title="Kalkulator ciasta chlebowego" />
      <CalcStart />
      <hr />
      <About />
    </>
  );
}
