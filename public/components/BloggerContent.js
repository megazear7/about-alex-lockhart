import {html, render} from '/vendor/lit-html.js';

export default class BloggerContent {
  init(container) {
    this.container = container;
    this.bloggerPageId = container.dataset.bloggerPageId;

    this.contentQuery = fetch(`https://www.googleapis.com/blogger/v3/blogs/4624119844445838894/pages/${this.bloggerPageId}?key=AIzaSyCmMb9-ysFUJ0c-Ew71Hz3UgvVTeo_MbEk`)
    .then(response => response.json())
    .then(bloggerPage => bloggerPage);

    this.render();
  }

  render() {
    this.contentQuery.then(bloggerPage => {
      var bloggerContentWrapper = html`
      <div class="blogger-content-wrapper">
        <div class="blogger-content"></div>
      </div>
      `;

      render(bloggerContentWrapper, this.container);
      this.container.querySelector('.blogger-content').innerHTML = bloggerPage.content;
    });
  }

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      this.ref = Math.random();
      BloggerContent.refs[this.ref] = this;
      container.dataset.ref = this.ref;
      this.init(container);
    } else {
      // If this element has already been instantiated, use the existing reference.
      return BloggerContent.refs[container.dataset.ref];
    }
  }
}

BloggerContent.refs = {};
