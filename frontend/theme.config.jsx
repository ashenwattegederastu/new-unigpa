export default {
  logo: <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>🎓 UniGPA</span>,
  project: {
    link: 'https://github.com/ashenwattegederastu/new-unigpa'
  },
  docsRepositoryBase: 'https://github.com/ashenwattegederastu/new-unigpa',
  footer: {
    text: '© 2024 UniGPA Calculator'
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – UniGPA Calculator'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="UniGPA Calculator" />
      <meta property="og:description" content="Calculate your university GPA with ease" />
    </>
  ),
  navigation: false,
  sidebar: {
    defaultMenuCollapseLevel: 1
  }
};
