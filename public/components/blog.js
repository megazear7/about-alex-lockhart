import {html, render} from '/vendor/lit-html.js';

export default class Blog {
  init(container) {
    this.container = container;

    this.postsQuery = fetch('https://www.googleapis.com/blogger/v3/blogs/4624119844445838894/posts?key=AIzaSyCmMb9-ysFUJ0c-Ew71Hz3UgvVTeo_MbEk')
    .then(result => result.json())
    .then(({items}) => items);

    this.render();
  }

  render() {
    this.postsQuery.then(posts => posts.forEach(post => {
      var innerDiv = document.createElement('div');
      innerDiv.classList.add('blog-post');

      this.container.append(innerDiv);
      innerDiv.innerHTML = post.content;

      var readMore = document.createElement('a');
      readMore.href = post.url;
      innerDiv.prepend(readMore);
    }));

    this.addEventListeners();
  }

  addEventListeners() {
  }

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      this.ref = Math.random();
      Blog.refs[this.ref] = this;
      container.dataset.ref = this.ref;
      this.init(container);
    } else {
      // If this element has already been instantiated, use the existing reference.
      return Blog.refs[container.dataset.ref];
    }
  }
}

Blog.refs = {};
