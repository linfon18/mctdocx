import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MinecraftConnectTool Docx",
  description: "Minecraft 联机工具官方文档，涵盖快速上手、故障排查等指南，助你轻松实现零门槛跨网段联机",
head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
  srcDir: 'pages',
  outDir: 'dist',
  ignoreDeadLinks: true,
  cleanUrls: true,
  themeConfig: {
    logo: '/favicon.ico'  ,   
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      level: [1, 3],    // 显示 h1 到 h3 级别的标题
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: '快速开始', link: '/quick-start/quick-start' },
      { text: '下载', link: '/function/download' }
    ],

    sidebar: [
      {
        text: '联机_快速开始',
        collapsed: true,
        items: [
          { text: '快速联机', link: '/quick-start/quick-start' },
          { text: '常见问题', link: '/quick-start/normalquesion' },
          { text: '获取支持', link: '/quick-start/gethelp' }
        ]
      },
      {
        text: 'MCTLogServer日志收集',
        collapsed: true,
        items: [
          { text: 'Readme.md', link: '/function/logcollege' },
          { text: 'Config配置说明', link: '/function/logconfig' },
          { text: 'Example(C#)', link: '/example/logexample' }
        ]
      },
      {
        text: 'MCTRoomList',
        collapsed: true,
        items: [
          { text: 'Build for Production', link: '/quick-start/quick-start#build-for-production' },
          { text: 'GitHub Pages', link: '/quick-start/quick-start#deploy-to-github-pages' },
          { text: 'Netlify', link: '/quick-start/quick-start#netlify-deployment' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/examples/markdown-examples' },
          { text: 'Runtime API Examples', link: '/examples/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/linfon18/mctdocx' }
    ]
  }
})
