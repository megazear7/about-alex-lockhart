import {html, render} from '/vendor/lit-html.js';
import BasicPage from '/components/BasicPage.js';

export default class Router {
  init(container) {
    this.container = container;

    document.onclick = (e) => {
      e = e ||  window.event;
      var element = e.target || e.srcElement;

      if (element.tagName == 'A' && element.getAttribute('href').startsWith('/')) {
        window.history.pushState({}, null, element.getAttribute('href'));
        this.pageComponent.pageQuery = Router.getPath(window.location.pathname);
        return false; // prevent default action and stop event propagation
      }
    };

    this.render();
  }

  render() {
    render(Router.markup(this), this.container);
    this.pageComponent = new BasicPage(this.container.querySelector('.page'), Router.getPath(window.location.pathname));
  }

  static markup({}) {
    return html`<div class="page"></div>`;
  }

  static getPath(path) {
    const truePath = ['', '/'].includes(path) ? '/us/en/home' : path;
    const parts = truePath.substring(1).split('/')
    let query = db.collection('pages');
    parts.forEach((part, index) => {
      query = query.doc(part);
      if (index !== parts.length -1) query = query.collection('children');
    });
    return query;
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
