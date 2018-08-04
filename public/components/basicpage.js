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
    })();
  }

  get navPagesQuery() {
    return this.homePageQuery
    .then(homePageQuery => homePageQuery.collection('children').get())
    .then(children => {
      let firstLevelPages = [];
      children.forEach(child => {
        firstLevelPages.push(child.data());
      });
      return firstLevelPages
    });
  }

  render() {
    render(BasicPage.markup(this), this.container);
    this.header = this.container.querySelector('.header');
    this.addEventListeners();
  }

  addEventListeners() {
    document.onscroll = (e) => {
      if (window.scrollY > 10) {
        document.body.classList.add('scrolled');
        window.document.body.style.marginTop = "7rem";
      } else if (window.scrollY <= 0) {
        document.body.classList.remove('scrolled');
        window.document.body.style.marginTop = "0";
      }
    };
  }

  set pageQuery(page) {
    this.pageQueryValue = page;
    this.render();
  }

  get pageQuery() {
    return this.pageQueryValue;
  }

  static markup({pageQuery, homePageQuery, navPagesQuery}) {
    return html`
      <div class="header">
        <img src="/images/mountains-wide.png">
        <h2>Alex Lockhart</h2>
      </div>
      <div class="content">
        ${pageQuery.get().then(page => html`
          <p>${page.data().description}</p>
        `)}
      </div>
      <div class="nav">
        ${pageQuery.get().then(page => html`
          <div class="current">
            ${page.data().title}
          </div>
        `)}
        <div class="links">
          ${homePageQuery.then(homePageQuery => homePageQuery.get()).then(homePage => html`
            <a href="${homePage.data().path}">${homePage.data().title}</a>
          `)}
          ${navPagesQuery.then(navPages => navPages.map(navPage => html`
            <a href="${navPage.type === 'redirect' ? navPage.redirect : navPage.path}">${navPage.title}</a>
          `))}
        </div>
      </div>
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
