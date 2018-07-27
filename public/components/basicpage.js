export default class BasicPage {
  init(container, pageQuery) {
    this.children = [];

    pageQuery.get().then(page => {
      this.container = container;
      this.page = page.data();

      this.render();
    });

    pageQuery.collection('children').get().then(children => {
      this.children = [];
      children.forEach(child => {
        console.log(child);
        this.children.push(child.data());
      });

      this.render();
    });
  }

  render() {
    this.container.innerHTML = BasicPage.markup(this);
  }

  static markup({page, children}) {
    return `
      ${page ? `
        <h1>${page.title}</h1>
        <p>${page.description}</p>
      ` : ``}
      <a href='/us/en/home'>Home</a>
      ${children.map(child => `
        <a href='${child.path}'>${child.title}</a>
      `).join('')}
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
