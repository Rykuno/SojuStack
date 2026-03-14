export const RustFSDevtools = {
  name: 'RustFS',
  render: <RustFSDevtoolsPanel />,
};

function RustFSDevtoolsPanel() {
  return (
    <iframe
      src='http://localhost:9001'
      title='RustFS'
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
