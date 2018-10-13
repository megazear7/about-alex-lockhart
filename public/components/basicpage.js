import {html, render} from '/vendor/lit-html.js';
import BlogList from '/components/BlogList.js';
import BlogConcat from '/components/BlogConcat.js';
import BloggerContent from '/components/BloggerContent.js';

export default class BasicPage {
  init(container, pageQuery) {
    this.container = container;
    this.pageQueryValue = pageQuery;
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

    this.pageQuery.get().then(page => {
      let blogListElement = this.container.querySelector('.blog-list-component');

      if (blogListElement) {
        new BlogList(blogListElement);
      }

      [...this.container.querySelectorAll('.blogger-content-component')]
      .forEach(bloggerContentElement => new BloggerContent(bloggerContentElement));

      [...this.container.querySelectorAll('.blogger-concat-component')]
      .forEach(bloggerConcatElement => new BlogConcat(bloggerConcatElement));
    });

    this.addEventListeners();
  }

  addEventListeners() {
    document.onscroll = (e) => {
      if (window.scrollY > 10 && document.body.clientWidth > 600) {
        document.body.classList.add('scrolled');
        window.document.body.style.marginTop = "7rem";
      } else if (window.scrollY <= 0 && document.body.clientWidth > 600) {
        document.body.classList.remove('scrolled');
        window.document.body.style.marginTop = "0";
      }
    };

    this.container.querySelector('.nav .current').addEventListener('click', e => {
      e.target.closest('.nav').classList.add('open');
    });

    this.navPagesQuery.then(() =>
      [...this.container.querySelectorAll('.nav .links a')].forEach(link =>
        link.addEventListener('click', e =>
          e.target.closest('.nav').classList.remove('open'))));

    this.container.querySelector('.nav .nav-close').addEventListener('click', e => {
      e.target.closest('.nav').classList.remove('open');
    });
  }

  set pageQuery(page) {
    this.pageQueryValue = page;
    this.render();
  }

  get pageQuery() {
    return this.pageQueryValue;
  }

  renderComponent(comp) {
    if (typeof comp === 'string') {
      return html`<p>${comp}</p>`;
    } else if (comp.type === 'image') {
      return html`<img src="${comp.src}"></a>`;
    } else if (comp.type === 'header') {
      return html`
        <hr>
        <h3 class="section">${comp.text}</h3>
      `;
    } else if (comp.type === 'BlogList') {
      return html`
        <div class="blog-list-component"
             data-blog-viewer="${comp.blogViewer}"></div>
      `;
    } else if (comp.type === 'BloggerContent') {
      return html`
        <div class="blogger-content-component"
             data-blogger-page-id="${comp.bloggerPageId}"></div>
      `;
    } else if (comp.type === 'BlogConcat') {
      return html`
        <div class="blogger-concat-component"
             data-label="${comp.label}"></div>
      `;
    }
  }

  static markup({pageQuery, homePageQuery, navPagesQuery, renderComponent}) {
    return html`
      <div class="header">
        <img src="/images/mountains-wide.png">
        <h2>Alex Lockhart</h2>
      </div>
      <div class="content">
        ${pageQuery.get().then(page => html`
          <p class="description">${page.data().description}</p>
          <hr>
          <div class="extended-content"></div>
          ${page.data().content ? page.data().content.map(comp => renderComponent(comp)) : ''}
        `)}
      </div>
      <div class="nav">
        <div class="current">
          ${pageQuery.get().then(page => html`
            ${page.data().title}
          `)}
        </div>
        <div class="links">
          ${homePageQuery.then(homePageQuery => homePageQuery.get()).then(homePage => html`
            <a href="${homePage.data().path}"
               class="${homePage.data().path === window.location.pathname ? 'active' : ''}">${homePage.data().title}</a>
          `)}
          ${navPagesQuery.then(navPages => navPages.map(navPage => html`
            <a href="${navPage.type === 'redirect' ? navPage.redirect : navPage.path}"
               target="${navPage.type === 'redirect' ? '_blank' : ''}"
               class="${window.location.pathname.indexOf(navPage.path) === 0 ? 'active' : ''}">${navPage.title}</a>
          `))}
        </div>
        <div class="nav-close">Close</div>
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
      this.init(container, doc);
      return BasicPage.refs[container.dataset.ref];
    }
  }
}

BasicPage.refs = {};
