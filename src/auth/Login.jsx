import { useState } from "react";
import { MdPerson, MdLock } from "react-icons/md";
import { useLanguageContext } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const { t, currentLanguage, changeLanguage } = useLanguageContext();
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !pass) {
      setError(t("login.error.enterCredentials"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: pass }),
      });

      if (!res.ok) throw new Error(t("login.error.wrongCredentials"));

      const response = await res.json();
      const token = response.data.accessToken;
      localStorage.setItem("token", token);

    
      const payload = JSON.parse(atob(token.split(".")[1]));
      const subRole = payload.sub.toLowerCase(); 
      const displayRole = payload.role;

    
      sessionStorage.setItem("usernameRole", subRole);
      sessionStorage.setItem("displayRole", displayRole);

      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      if (subRole === "admin") navigate("/admin");
      else if (subRole === "staff") navigate("/staff");
      else navigate("/");

    } catch (err) {
      setError(err.message || t("login.error.failed"));
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () =>
    changeLanguage(currentLanguage === "vi" ? "en" : "vi");

  const reloadPage = () => window.location.reload();

  return (
    <div className="w-screen h-screen bg-[url('/backg.webp')] bg-cover bg-no-repeat bg-center bg-fixed flex flex-col">
      {/* NAVBAR */}
      <nav className="relative top-[20px] mx-auto flex justify-between items-center px-[120px] py-3 
        bg-white/30 backdrop-blur-xl border border-white/30 rounded-[14px] shadow-lg
        w-[70vw] transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
        <img
          src="/logo1.jpeg"
          alt="Logo"
          className="h-[60px] w-[70px] rounded-[14px] object-cover transition-transform duration-300 hover:scale-110 cursor-pointer"
          onClick={reloadPage}
        />
        <button
          onClick={toggleLanguage}
          className="flex items-center p-[4px] ml-4 rounded-md transition-transform duration-300 hover:scale-105"
        >
          <img
            src={currentLanguage === "vi" ? "/vn.png" : "/uk.jpg"}
            className="w-[28px] h-[18px] rounded-[3px] shadow transition-transform duration-300 hover:scale-110"
          />
          <span className="ml-[6px] uppercase tracking-wide">{currentLanguage}</span>
        </button>
      </nav>

      {/* LOGIN MODAL */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          bg-white/30 backdrop-blur-2xl border border-white/30 shadow-white/40
          rounded-[32px] px-[40px] pt-[48px] pb-[32px] min-w-[380px] text-center text-black
          shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl
          ${error ? "animate-shake" : ""}`}
      >
        {/* Avatar */}
        <div className="w-[110px] h-[110px] bg-black rounded-full flex items-center justify-center shadow-[0_4px_24px] mx-auto -mt-[80px] mb-[24px] transition-transform duration-300 hover:scale-110">
          <svg viewBox="0 0 24 24" fill="none" className="w-[60px] h-[60px] text-white">
            <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
            <path d="M4 20c0-4 8-4 8-4s8 0 8 4" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <h2 className="mb-8 font-bold text-[2.4rem]">{t("login.title")}</h2>

        <form onSubmit={handleLogin}>
          {/* USERNAME */}
          <div className="flex items-center rounded-[14px] border-2 border-black mb-[18px] pl-[16px] py-2 bg-white transition-shadow duration-300 focus-within:shadow-md">
            <MdPerson size={20} className="mr-[12px] text-black" />
            <input
              type="text"
              placeholder={t("login.username")}
              className="bg-white rounded-md border-none text-black py-[12px] px-[8px] w-full outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative flex items-center rounded-[14px] border-2 border-black mb-[18px] pl-[16px] py-2 bg-white transition-shadow duration-300 focus-within:shadow-md">
            <MdLock size={20} className="mr-[12px] text-black" />
            <input
              type={showPass ? "text" : "password"}
              placeholder={t("login.password")}
              className="bg-white rounded-md border-none text-black py-[12px] px-[8px] w-full outline-none"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 p-1 text-gray-700 hover:text-black transition"
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          {/* ERROR */}
          {error && <div className="text-red-500 mb-3 text-center">{error}</div>}

          {/* SUBMIT BUTTON WITH SLIDING GRADIENT */}
          <button
            type="submit"
            disabled={loading}
            className="relative overflow-hidden px-6 py-2 rounded-[16px] border-2 border-black group
              transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]"
          >
            {/* Sliding gradient background */}
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out group-hover:w-full"></span>

            {/* Text */}
            <div className="relative z-10 flex justify-center items-center w-full
                text-white transition-colors duration-300 group-hover:text-black">
              {loading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              )}
              {loading ? t("login.loading") : t("login.submit")}
            </div>
          </button>
        </form>
      </div>

      {/* SUCCESS POPUP (Framer Motion) */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed top-5 right-5 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg 
                       w-[260px] flex flex-col z-50"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">Đăng nhập thành công!</span>
              <button
                onClick={() => setShowSuccess(false)}
                className="font-bold text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-[4px] bg-white/30 rounded mt-3 overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: 0 }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-full bg-white"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;
