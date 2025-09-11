module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/auth', // مطمئن شوید /auth صفحه‌ای دارد
      },
    ];
  },
};