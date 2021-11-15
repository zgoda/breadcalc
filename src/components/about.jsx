import json from './about.json';

function About() {
  return (
    <footer class="container">
      {json.text.map((line, index) => (
        <p key={`about-line-${index}`}>{line}</p>
      ))}
      <div class="row">
        {json.links.map((item, index) => {
          const [title, url] = item;
          return (
            <div key={`link-${index}`} class="column center">
              <a href={url}>{title}</a>
            </div>
          );
        })}
      </div>
    </footer>
  );
}

export { About };
