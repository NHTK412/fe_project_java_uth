import React, { useEffect, useState } from "react";
import { useLoginPopup } from "../../contexts/LoginPopupContext";
import { useLanguageContext } from "../../contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md"; // import icon

export default function LoginPopup() {
  const { showPopup, closePopup } = useLoginPopup();
  const { t } = useLanguageContext();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let timer;
    if (showPopup) {
      setProgress(100);
      const start = Date.now();
      timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.max(100 - (elapsed / 3000) * 100, 0);
        setProgress(percent);
        if (percent <= 0) clearInterval(timer);
      }, 16);

      const timeout = setTimeout(closePopup, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }
  }, [showPopup, closePopup]);

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 w-80 bg-white shadow-lg rounded-xl p-4 z-[9999] pointer-events-auto"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{t("login.title")}</h3>
            <button
              onClick={closePopup}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <MdClose size={20} className="text-gray-500 hover:text-black" />
            </button>
          </div>
          <p className="text-gray-700 text-sm mb-2">{t("login.success")}</p>

          {/* Thanh thời gian */}
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
