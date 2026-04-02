//src/components/common/ResumeButton.tsx

const ResumeButton = () => (
  <button
    className="fixed bottom-7 right-7 z-[200] font-mono text-[13px] text-white px-5 py-2.5 rounded-full bg-crimson hover:brightness-110 transition-all"
    style={{ animation: 'resumePulse 3s infinite' }}
    onClick={() => window.open('/resume.pdf', '_blank')}
  >
    ↓ Resume
  </button>
);

export default ResumeButton;


