import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/cli.ts'],
    format: ['cjs'],
    target: 'node22',
    clean: true,
    minify: true,
    dts: false,
    sourcemap: false,
    shims: true,
    noExternal: [/(.*)/], // Bundle everything
    outExtension({ format }) {
        return {
            js: '.cjs',
        };
    },
});
