// src/components/Footer.jsx

function Footer() {
  return (
    <footer className="border-top bg-white text-center py-3 mt-auto" style={{ fontSize: '0.85rem', color: '#64748b' }}>
      © {new Date().getFullYear()} Tool Aura — Built with the MERN Stack
    </footer>
  );
}

export default Footer;

