// @krds-ui/tailwindcss-plugin (v0.6.0)은 타입 선언을 제공하지 않으므로
// Tailwind 플러그인 형태로 모듈을 선언한다.
declare module '@krds-ui/tailwindcss-plugin' {
  import type { PluginCreator } from 'tailwindcss/types/config';
  const plugin: { handler: PluginCreator; config?: object };
  export default plugin;
}
