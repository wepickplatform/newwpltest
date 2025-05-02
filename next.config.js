module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['letter.wepick.kr'],
    formats: ['image/avif', 'image/webp'],
  },
  i18n: {
    locales: ['ko'],
    defaultLocale: 'ko',
  },
  // 추가: 서버 사이드 렌더링 활성화
  trailingSlash: true
}
