export const ReactEmailDevtools = {
  name: 'React Email',
  render: <ReactEmailDevtoolsPanel />,
};

function ReactEmailDevtoolsPanel() {
  return (
    <iframe
      src='http://localhost:3030'
      title='React Email'
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
