import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FOOTER_LINKS = [
  { to: "/terms",   key: "footer.terms",   fallback: "Terms" },
  { to: "/privacy",  key: "footer.privacy",  fallback: "Privacy" },
  { to: "/cookies",  key: "footer.cookies",  fallback: "Cookies" },
  { to: "/refund",   key: "footer.refund",   fallback: "Refund Policy" },
  { to: "/faq",      key: "footer.faq",      fallback: "FAQ" },
  { to: "/contact",  key: "footer.contact",  fallback: "Contact" },
  { to: "/about",    key: "footer.about",    fallback: "About" },
];

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full py-8 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 transition-colors mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-5">
          {/* Links row with | separators */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 text-sm">
            {FOOTER_LINKS.map((link, i) => (
              <React.Fragment key={link.to}>
                {i > 0 && <span className="mx-3 text-slate-300 dark:text-slate-700 select-none">|</span>}
                <Link 
                  to={link.to} 
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {t(link.key, link.fallback)}
                </Link>
              </React.Fragment>
            ))}
          </div>
          
          {/* Copyright */}
          <p className="text-slate-400 dark:text-slate-500 text-xs text-center">
            © {new Date().getFullYear()} Muscle Map. {t('footer.rights', 'All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;