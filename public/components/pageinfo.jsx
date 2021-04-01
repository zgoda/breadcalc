import json from './pageinfo.json';

function PageInfo({ title }) {
  return (
    <>
      <h1>{title}</h1>
      {json.text.map((line) => (<p>{line}</p>))}
    </>
  );
}

export { PageInfo };
