export default function manifest() {
  return {
    name: 'KMC Stock',
    short_name: 'KMC',
    description: 'Mobile-first daily investment signal check app',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0b0d',
    theme_color: '#0a0b0d',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ]
  };
}
