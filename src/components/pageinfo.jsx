import json from './pageinfo.json';

function SectionTitle({ title, level }) {
  const Tag = `h${level}`;
  return <Tag>{title}</Tag>;
}

function PageInfo({ title }) {
  return (
    <>
      <SectionTitle title={title} level={1} />
      {json.text.map((line) => (<p key={line}>{line}</p>))}
    </>
  );
}

export { PageInfo, SectionTitle };
