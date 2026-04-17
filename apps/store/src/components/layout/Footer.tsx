const Footer = () => {
  return (
    <footer>
      <div className="mx-auto w-full text-sm text-slate-600 border-t border-slate-200 flex items-start justify-center pt-10 h-[300px]">
        © {new Date().getFullYear()} MonoChic
      </div>
    </footer>
  );
};

export default Footer;
