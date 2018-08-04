import {html, render} from '/vendor/lit-html.js';

export default class BasicPage {
  init(container, pageQuery) {
    this.container = container;
    this.pageQueryValue = pageQuery;
    this.page = null;
    this.children = [];
    this.render();
  }

  static async getHomePage(pageQuery) {
    let type = (await pageQuery.get()).data().type;

    while (type != 'home') {
      pageQuery = pageQuery.parent.parent;
      type = (await pageQuery.get()).data().type;
    }

    return pageQuery;
  }

  render() {
    render(BasicPage.markup(this), this.container);

    this.pageQuery.get().then(page => {
      this.page = page.data();
      render(BasicPage.markup(this), this.container);
    });

    BasicPage.getHomePage(this.pageQuery)
    .then(homePageQuery => {
      homePageQuery.collection('children').get().then(children => {
        this.children = [];
        children.forEach(child => {
          this.children.push(child.data());
        });
        this.render();
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

  static markup({page, children}) {
    return html`
      ${page ? html`
        <h1>${page.title}</h1>
        <p>${page.description}</p>
      ` : ``}
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
