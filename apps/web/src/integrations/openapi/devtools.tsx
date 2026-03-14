export const OpenAPIDevtools = {
  name: 'OpenAPI',
  render: <OpenAPIDevtoolsPanel />,
};

function OpenAPIDevtoolsPanel() {
  return (
    <iframe
      src={import.meta.env.VITE_API_URL + '/openapi'}
      title='OpenAPI'
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
