export function DrizzleStudioDevtoolsPanel() {
  return (
    // eslint-disable-next-line react/iframe-missing-sandbox -- Dev-only tool, needs full access
    <iframe
      src='https://local.drizzle.studio/'
      title='Drizzle Studio'
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
