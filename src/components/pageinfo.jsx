import { createElement } from 'preact';

import json from './pageinfo.json';

/**
 * @typedef {object} SectionTitleProps
 * @property {string} title
 * @property {number} level
 * @property {string} [id]
 *
 * @param {SectionTitleProps} props
 * @returns {JSX.Element}
 */
function SectionTitle({ title, level, id }) {
  const tag = `h${level}`;
  const props = {};
  if (id != null) {
    props.id = id;
  }
  return createElement(tag, props, title);
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
      <SectionTitle title={title} level={1} id="home" />
      {json.text.map((line, index) => (
        <p key={`appinfo-line-${index}`}>{line}</p>
      ))}
    </>
  );
}

export { PageInfo, SectionTitle };
