export function ReactEmailDevtoolsPanel() {
  return (
    // eslint-disable-next-line react/iframe-missing-sandbox -- Dev-only tool, needs full access
    <iframe
      src='http://localhost:3030'
      title='React Email'
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
