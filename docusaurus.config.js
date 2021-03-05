module.exports = {
  title: 'Event Easy docs',
  tagline: 'Simplifying the events.',
  url: 'events-easy.firebaseapp.com/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'tarunsinghdev', // Usually your GitHub org/user name.
  projectName: 'docs-event-easy', // Usually your repo name.
  themeConfig: {
    hideableSidebar: true,
    navbar: {
      title: 'Event Easy docs',
      logo: {
        alt: 'Event Easy',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/getting-started',
          activeBasePath: 'docs',
          label: 'Getting Started',
          position: 'right',
        },
        { to: 'blog', label: 'Blog', position: 'right' },
        {
          href: 'https://github.com/tarunsinghdev/docs-event-easy',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Event Easy, Inc. Built with Docusaurus.`,
    },
    announcementBar: {
      id: 'website_under_construction',
      content:
        '<div style="font-weight: bold">Welcome to the official documentation of Event Easy. <a target="_blank" href="https://events-easy.firebaseapp.com/">Click to see live website.</a></div>',
      backgroundColor: '#000',
      textColor: '#f5f6f7',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/tarunsinghdev/docs-event-easy/tree/master/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/tarunsinghdev/docs-event-easy/tree/master/blog',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
