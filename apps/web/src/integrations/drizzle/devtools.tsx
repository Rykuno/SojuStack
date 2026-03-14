export const DrizzleStudioDevtools = {
  name: 'Drizzle Studio',
  render: <DrizzleStudioDevtoolsPanel />,
};

function DrizzleStudioDevtoolsPanel() {
  return (
    <iframe
      src='https://local.drizzle.studio/'
      title='Drizzle Studio'
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
