export function MailpitDevtoolsPanel() {
  return (
    // eslint-disable-next-line react/iframe-missing-sandbox -- Dev-only tool, needs full access
    <iframe
      src="http://localhost:8025"
      title="Mailpit"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  )
}
