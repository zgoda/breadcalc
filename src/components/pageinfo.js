import json from '../data/pageinfo.json';

function SectionTitle({ title, level, id }) {
  const Tag = `h${level}`;
  if (id != null) {
    return <Tag id={id}>{title}</Tag>;
  }
  return <Tag>{title}</Tag>;
}

function PageInfo({ title }) {
  return (
    <>
      <SectionTitle title={title} level={1} id="home" />
      {json.text.map((line, index) => (
        <p key={`appinfo-line-${index}`}>{line}</p>
      ))}
    </>
  );
}

export { PageInfo, SectionTitle };
