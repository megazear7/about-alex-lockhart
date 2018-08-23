import {html, render} from '/vendor/lit-html.js';
import BloggerContent from '/components/BloggerContent.js';
import BasicPage from '/components/BasicPage.js';

export default class BlogPage extends BasicPage {
  render() {
    this.bloggerPageId = window.location.search.substr(1);

    this.contentQuery = fetch(`https://www.googleapis.com/blogger/v3/blogs/4624119844445838894/pages/${this.bloggerPageId}?key=AIzaSyCmMb9-ysFUJ0c-Ew71Hz3UgvVTeo_MbEk`)
    .then(response => response.json())
    .then(bloggerPage => bloggerPage);

    render(BasicPage.markup(this), this.container);

    this.contentQuery.then(bloggerPage => {
      var bloggerContentWrapper = html`
        <div class="blog-post">
          <div class="blogger-content-wrapper">
            <div class="blogger-content"></div>
          </div>
        </div>
      `;

      render(bloggerContentWrapper, this.container.querySelector('.extended-content'));
      this.container.querySelector('.blogger-content').innerHTML = bloggerPage.content;
    });
  }
}
