export default class Router {
  init(container) {
    this.container = container;

    Router.getPath(window.location.pathname).then(page => {
      if (page.exists) {
        this.page = page.data();
        this.render();
      } else {
        console.error("No such page exists!");
      }
    });
  }

  render() {
    this.container.innerHTML = Router.markup(this);
  }

  static markup({page: {title, description}}) {
    return `
      <h1>${title}</h1>
      <p>${description}</p>
      <a href='/us/en/home'>Home</a>
      <a href='/us/en/home/blog'>Blog</a>
      <a href='/us/en/home/portfolio'>Portfolio</a>
      <a href='/us/en/home/health'>Health</a>
    `;
  }

  static getPath(path) {
    const truePath = ['', '/'].includes(path) ? '/us/en/home' : path;
    const parts = truePath.substring(1).split('/')
    let query = db.collection('pages');
    parts.forEach((part, index) => {
      query = query.doc(part);
      if (index !== parts.length -1) query = query.collection('children');
    });
    return query.get();
  }

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      this.ref = Math.random();
      Router.refs[this.ref] = this;
      container.dataset.ref = this.ref;
      this.init(container);
    } else {
      // If this element has already been instantiated, use the existing reference.
      return Router.refs[container.dataset.ref];
    }
  }
}

Router.refs = {};

document.addEventListener('DOMContentLoaded', () => {
  new Router(document.getElementById('router'))
});
