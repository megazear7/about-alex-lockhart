import {html, render} from '/vendor/lit-html.js';

export default class BasicPage {
  init(container, pageQuery) {
    this.container = container;
    this.pageQueryValue = pageQuery;
    this.children = [];
    this.render();
  }

  get homePageQuery() {
    return (async () => {
      let pageQuery = this.pageQuery;
      let type = (await pageQuery.get()).data().type;

      while (type != 'home') {
        pageQuery = pageQuery.parent.parent;
        type = (await pageQuery.get()).data().type;
      }

      return pageQuery;
    });
  }

  render() {
    render(BasicPage.markup(this), this.container);

    this.homePageQuery(this.pageQuery)
    .then(homePageQuery => {
      homePageQuery.collection('children').get().then(children => {
        this.children = [];
        children.forEach(child => {
          this.children.push(child.data());
        });
        render(BasicPage.markup(this), this.container);
      });

      return homePageQuery.get();
    })
    .then(homePage => {
      this.homePage = homePage.data();
      render(BasicPage.markup(this), this.container);
    });
  }

  set pageQuery(page) {
    this.pageQueryValue = page;
    this.render();
  }

  get pageQuery() {
    return this.pageQueryValue;
  }

  static markup({pageQuery, children}) {
    return html`
      ${pageQuery.get().then((page) => html`
        <h1>${page.data().title}</h1>
        <p>${page.data().description}</p>
      `)}
      <a href='/us/en/home'>Home</a>
      ${children.map(child => html`
        <a href='${child.path}'>${child.title}</a>
      `)}
    `;
  }

  constructor(container, doc) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      this.ref = Math.random();
      BasicPage.refs[this.ref] = this;
      container.dataset.ref = this.ref;
      this.init(container, doc);
    } else {
      // If this element has already been instantiated, use the existing reference.
      return BasicPage.refs[container.dataset.ref];
    }
  }
}

BasicPage.refs = {};
