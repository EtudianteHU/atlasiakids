const csp = `
  default-src 'self';
  img-src 'self' data:;
  connect-src 'self' http://localhost:5000;
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
`.replace(/\s{2,}/g, ' ').trim();

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};