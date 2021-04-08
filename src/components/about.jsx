import { SectionTitle } from './pageinfo';
import json from './about.json';

function About({ title }) {
  return (
    <>
      <SectionTitle title={title} level={2} id="about" />
      {json.text.map((line, index) => (<p key={`about-line-${index}`}>{line}</p>))}
      <div class="footerlinks">
        <ul>
          {json.links.map((item, index) => {
            const [title, url] = [...item];
            return (
              <li key={`link-${index}`}>
                <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export { About };
