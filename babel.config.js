module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@alifd/next',
        style: (name) => `${name}/style2`,
      },
    ],
  ],
};
