import { text, links } from './about.json';

export function About() {
  return (
    <footer class="container">
      {text.map((line, index) => (
        <p key={`about-line-${index}`}>{line}</p>
      ))}
      <div class="grid">
        {links.map((item, index) => {
          const [title, url] = item;
          return (
            <div key={`link-${index}`} class="center">
              <p>
                <a href={url}>{title}</a>
              </p>
            </div>
          );
        })}
      </div>
    </footer>
  );
}
