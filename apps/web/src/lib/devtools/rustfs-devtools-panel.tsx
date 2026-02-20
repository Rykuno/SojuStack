export function RustFSDevtoolsPanel() {
  return (
    // eslint-disable-next-line react/iframe-missing-sandbox -- Dev-only tool, needs full access
    <iframe
      src="http://localhost:9001"
      title="RustFS"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  )
}
