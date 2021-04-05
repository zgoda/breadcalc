import { SectionTitle } from './pageinfo';

import wetingredients from './wetingredients.json';

function WetIngredients() {
  return (
    <>
      <SectionTitle title={'Mąka i składniki namaczane'} level={3} />
      <p>{wetingredients.text}</p>
    </>
  );
}

export { WetIngredients };
