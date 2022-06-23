import { SectionTitle } from './misc';
import json from './pageinfo.json';

/**
 * @typedef {object} PageInfoProps
 * @property {string} title
 *
 * @param {PageInfoProps} props
 * @returns {JSX.Element}
 */
export function PageInfo({ title }) {
  return (
    <section>
      <SectionTitle title={title} level={1} />
      {json.text.map((line, index) => (
        <p key={`appinfo-line-${index}`}>{line}</p>
      ))}
    </section>
  );
}
