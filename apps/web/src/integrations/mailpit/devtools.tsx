export const MailpitDevtools = {
  name: 'Mailpit',
  render: <MailpitDevtoolsPanel />,
};

function MailpitDevtoolsPanel() {
  return (
    <iframe
      src='http://localhost:8025'
      title='Mailpit'
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
