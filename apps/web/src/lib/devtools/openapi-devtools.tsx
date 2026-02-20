export function OpenAPIDevtoolsPanel() {
  return (
    // eslint-disable-next-line react/iframe-missing-sandbox -- Dev-only tool, needs full access
    <iframe
      src={import.meta.env.VITE_API_URL + '/openapi'}
      title='OpenAPI'
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
