import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'cryptorill-web-components',
  globalStyle: 'src/global/normalize.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [{ src: '**/test/*.html' }],
    },
    // React output target
    reactOutputTarget({
      outDir: '../cryptorill-react/src/components/stencil-generated',
      stencilPackageName: '@cryptorill/web-components',
      // Import the pure, side-effect-free modules so unused wrappers can be
      // tree-shaken instead of auto-registering every component.
      customElementsDir: 'tree-shakeable',
      // One module per wrapper instead of a single barrel.
      esModules: true,
    }),
    // Angular output target
    angularOutputTarget({
      componentCorePackage: '@cryptorill/web-components',
      directivesProxyFile: 'angular-components/proxies.ts',
    }),
    // Vue output target
    vueOutputTarget({
      componentCorePackage: '@cryptorill/web-components',
      // Import types from the per-component barrel (it re-exports JSX/Components)
      // and register components from the auto-defining component modules.
      customElementsDir: 'components',
      proxiesFile: 'vue-components/components.ts',
      includeImportCustomElements: true,
    }),
    // Tree-shakeable barrel output (single side-effect-free export module).
    // This is what the package root (".") resolves to. Consumers call the
    // exported defineCustomElement* functions to register what they use.
    {
      type: 'dist-custom-elements',
      dir: 'dist/tree-shakeable',
      customElementsExportBehavior: 'single-export-module',
      externalRuntime: false,
    },
  ],
  testing: {
    browserHeadless: 'shell',
    // Only run component tests (exclude unit tests that use bun)
    testPathIgnorePatterns: ['/node_modules/', 'src/core/', 'src/utils/'],
  },
};
