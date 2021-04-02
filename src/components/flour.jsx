import flour from './flour.json';

function FlourIngredients() {
  return (
    <>
      <h2>Mąka</h2>
      <p>{flour.text}</p>
      <form>
        <fieldset>
          <div class="row X--middle">
            <div class="M4">
              <label>
                Nazwa
                <input type="text" />
              </label>
            </div>
            <div class="M4">
              <label>
                Ilość (g)
                <input type="number" inputMode="numeric" step="1" />
              </label>
            </div>
          </div>
        </fieldset>
      </form>
    </>
  );
}

export { FlourIngredients };
