import {html, render} from '/vendor/lit-html.js';

export default class BlogList {
  init(container) {
    this.container = container;
    this.blogViewer = this.container.dataset.blogViewer;

    this.postsQuery = fetch('https://www.googleapis.com/blogger/v3/blogs/4624119844445838894/posts?key=AIzaSyCmMb9-ysFUJ0c-Ew71Hz3UgvVTeo_MbEk')
    .then(result => result.json())
    .then(({items}) => items);

    this.render();
  }

  render() {
    this.postsQuery.then(posts => posts.forEach(post => {
      var postContainer = document.createElement('div');
      postContainer.classList.add('blog-post');

      var postMarkup = html`
        <h2>${post.title}</h3>
        <img class="primary-image" src="">
        <div class="blog-preview"></div>
        <div class="blog-read-more">
          <a href="${this.blogViewer}?${post.id}" target="_blank">Read More</a>
        </div>
      `;

      render(postMarkup, postContainer);
      postContainer.querySelector('.blog-preview').innerHTML = post.content;

      // This will grab the larger image.
      var imageUrl = postContainer
                     .querySelector('.blog-preview')
                     .querySelector('img').
                     src.replace(/s\d\d\d\d?/, 's1000');
      postContainer.querySelector('.primary-image').src = imageUrl;

      this.container.append(postContainer);
    }));

    this.addEventListeners();
  }

  addEventListeners() {
  }

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      this.ref = Math.random();
      BlogList.refs[this.ref] = this;
      container.dataset.ref = this.ref;
      this.init(container);
    } else {
      // If this element has already been instantiated, use the existing reference.
      return BlogList.refs[container.dataset.ref];
    }
  }
}

BlogList.refs = {};
