import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  return (
    <div className="flex space-x-2">
      <button onClick={() => i18n.changeLanguage("en")} className="px-2">EN</button>
      <button onClick={() => i18n.changeLanguage("hi")} className="px-2">HI</button>
      <button onClick={() => i18n.changeLanguage("te")} className="px-2">TE</button>
    </div>
  );
};

export default LanguageSelector;
