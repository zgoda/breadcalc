import { createElement } from 'preact';

import json from './pageinfo.json';

/**
 * @typedef {object} SectionTitleProps
 * @property {string} title
 * @property {number} level
 *
 * @param {SectionTitleProps} props
 * @returns {JSX.Element}
 */
function SectionTitle({ title, level }) {
  return createElement(`h${level}`, {}, title);
}

/**
 * @typedef {object} PageInfoProps
 * @property {string} title
 *
 * @param {PageInfoProps} props
 * @returns {JSX.Element}
 */
function PageInfo({ title }) {
  return (
    <>
      <SectionTitle title={title} level={1} />
      {json.text.map((line, index) => (
        <p key={`appinfo-line-${index}`}>{line}</p>
      ))}
    </>
  );
}

export { PageInfo, SectionTitle };
