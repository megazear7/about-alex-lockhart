import {html, render} from '/vendor/lit-html.js';

export default class BlogConcat {
  init(container) {
    this.container = container;
    this.label = this.container.dataset.label;

    this.postsQuery = fetch('https://www.googleapis.com/blogger/v3/blogs/4624119844445838894/posts?key=AIzaSyCmMb9-ysFUJ0c-Ew71Hz3UgvVTeo_MbEk&maxResults=20&labels='+this.label)
    .then(result => result.json())
    .then(({items}) => items);

    this.render();
  }

  render() {
    this.postsQuery.then(posts => posts.forEach(post => {
      var postContainer = document.createElement('div');
      postContainer.classList.add('blog-post');

      var postMarkup = html`
        <div class="blog-concat"></div>
      `;

      render(postMarkup, postContainer);
      postContainer.querySelector('.blog-concat').innerHTML = post.content;

      this.container.prepend(postContainer);
    }));

    this.addEventListeners();
  }

  addEventListeners() {
  }

  constructor(container) {
    // The constructor should only contain the boiler plate code for finding or creating the reference.
    if (typeof container.dataset.ref === 'undefined') {
      this.ref = Math.random();
      BlogConcat.refs[this.ref] = this;
      container.dataset.ref = this.ref;
      this.init(container);
    } else {
      // If this element has already been instantiated, use the existing reference.
      return BlogConcat.refs[container.dataset.ref];
    }
  }
}

BlogConcat.refs = {};
