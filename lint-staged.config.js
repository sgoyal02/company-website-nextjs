export default {
  'apps/web/**/*.{ts,tsx,js,jsx}': (filenames) => 
    `pnpm --filter web exec eslint ${filenames.join(' ')} --fix`,
  'apps/cms/**/*.{ts,tsx,js,jsx}': () => 
    'pnpm --filter cms lint',
};