import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";

// --- ICONS (SVG) ---
const IconEye = ({ visible }) => (
  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {visible ? (
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    ) : (
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    )}
    {visible && <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconAlert = () => (
  <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// --- REGEX PATTERNS ---
const PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  name: /^[a-zA-Z\s]{3,30}$/, 
  password: {
    length: /^.{8,}$/,
    capital: /[A-Z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*]/,
  },
};

// --- FLOATING INPUT COMPONENT (MOVED OUTSIDE) ---
// Bhai ye main component ke bahar hona chahiye taaki focus na hile
const FloatingInput = ({ label, type, value, onChange, error, isSuccess, togglePass }) => (
  <div className="relative mt-5">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      className={`peer block w-full rounded-xl border px-4 pb-2.5 pt-4 text-sm bg-slate-900/50 text-slate-100 focus:ring-1 focus:outline-none transition-all
        ${error 
          ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20" 
          : isSuccess 
          ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20"
          : "border-slate-700 focus:border-sky-500 focus:ring-sky-500/20"
        }`}
    />
    <label className="pointer-events-none absolute left-4 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-slate-400 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-sky-400">
      {label}
    </label>
    
    <div className="absolute right-3 top-3.5 flex items-center gap-2">
      {togglePass && (
        <button type="button" onClick={togglePass} className="hover:bg-slate-800 p-1 rounded-full transition">
          <IconEye visible={type === "text"} />
        </button>
      )}
      {error && <IconAlert />}
      {!error && isSuccess && <IconCheck />}
    </div>

    <AnimatePresence>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="absolute -bottom-5 left-1 text-[10px] font-medium text-rose-400"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const Register = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [errors, setErrors] = useState({});
  const [passStrength, setPassStrength] = useState(0);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  // --- VALIDATION LOGIC ---
  useEffect(() => {
    const newErrors = {};
    let strength = 0;

    // Name Validation
    if (touched.name && !PATTERNS.name.test(formData.name)) {
      newErrors.name = "Enter a valid full name (letters only, min 3 chars)";
    }

    // Email Validation
    if (touched.email && !PATTERNS.email.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password Validation
    if (formData.password) {
      if (PATTERNS.password.length.test(formData.password)) strength++;
      if (PATTERNS.password.capital.test(formData.password)) strength++;
      if (PATTERNS.password.number.test(formData.password)) strength++;
      if (PATTERNS.password.special.test(formData.password)) strength++;
      setPassStrength(strength);

      if (touched.password && strength < 4) {
        newErrors.password = "Password is too weak";
      }
    } else {
      setPassStrength(0);
    }

    setErrors(newErrors);
  }, [formData, touched]);

  // --- HANDLERS ---
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Mark as touched immediately when typing starts
    if (!touched[field]) setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleInitialSubmit = async (e) => {
  e.preventDefault();

  setTouched({ name: true, email: true, password: true });

  if (
    Object.keys(errors).length > 0 ||
    !formData.name ||
    !formData.email ||
    !formData.password
  ) {
    return;
  }

  setLoading(true);
  setGlobalError("");

  try {
    await api.post("/auth/send-otp", {
      email: formData.email,
    });

    setStep(2); // 🔥 OTP SCREEN
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    setGlobalError(
      err?.response?.data?.message || "Failed to initiate registration"
    );
  } finally {
    setLoading(false);
  }
};


  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleFinalRegister = async (e) => {
  e.preventDefault();

  const otpCode = otp.join("");
  if (otpCode.length < 6) {
    setGlobalError("Please enter the complete 6-digit code");
    return;
  }

  setLoading(true);
  setGlobalError("");

  try {
    await api.post("/auth/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      otp: otpCode,
    });

    navigate("/login"); // ✅ SUCCESS
  } catch (err) {
    setGlobalError(
      err?.response?.data?.message || "Invalid OTP or registration failed"
    );
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  } finally {
    setLoading(false);
  }
};


   const googleSuccess = async (credentialResponse) => {
    setLoading(true);
    setGlobalError("");

    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      // ✅ SAVE AUTH
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      navigate("/");
    } catch (err) {
      setGlobalError("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };
  return (
  <GoogleOAuthProvider clientId="543384475421-5car7anockgvbksvo7qq7h73b9sglkfj.apps.googleusercontent.com">
      <main className="min-h-screen bg-[#0B1120] text-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
        
        {/* Ambient Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-[420px]">
          
          <div className="mb-8 text-center">
             <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 shadow-[0_0_40px_rgba(14,165,233,0.3)] mb-4">
                <span className="text-2xl">🍬</span>
             </div>
             <h1 className="text-2xl font-bold tracking-tight text-white">
                {step === 1 ? "Create Account" : "Verify Email"}
             </h1>
             <p className="text-slate-400 text-sm mt-2">
                {step === 1 ? "Join us for sweet delights." : `We sent a code to ${formData.email}`}
             </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl">
            
            {globalError && (
               <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex gap-2 items-center">
                 <IconAlert /> {globalError}
               </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleInitialSubmit}>
                {/* Name */}
                <FloatingInput 
                  label="Full Name" 
                  type="text" 
                  value={formData.name} 
                  onChange={(v) => handleChange("name", v)}
                  error={errors.name}
                  isSuccess={touched.name && !errors.name && formData.name.length > 0}
                />

                {/* Email */}
                <FloatingInput 
                  label="Email Address" 
                  type="email" 
                  value={formData.email} 
                  onChange={(v) => handleChange("email", v)}
                  error={errors.email}
                  isSuccess={touched.email && !errors.email && formData.email.length > 0}
                />

                {/* Password */}
                <FloatingInput 
                  label="Password" 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password} 
                  onChange={(v) => handleChange("password", v)}
                  error={errors.password}
                  togglePass={() => setShowPassword(!showPassword)}
                  isSuccess={false}
                />

                {/* Strength Meter */}
                {formData.password && (
                  <div className="mt-6 space-y-2">
                    <div className="flex h-1 w-full gap-1 overflow-hidden rounded-full bg-slate-800">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-full flex-1 transition-all duration-500 ${
                            passStrength >= level 
                              ? passStrength <= 2 ? "bg-rose-500" : passStrength === 3 ? "bg-amber-400" : "bg-emerald-400" 
                              : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                    <ul className="grid grid-cols-2 gap-1 text-[10px] text-slate-500">
                      <li className={PATTERNS.password.length.test(formData.password) ? "text-emerald-400" : ""}>• 8+ Characters</li>
                      <li className={PATTERNS.password.capital.test(formData.password) ? "text-emerald-400" : ""}>• Uppercase & Lower</li>
                      <li className={PATTERNS.password.number.test(formData.password) ? "text-emerald-400" : ""}>• Number</li>
                      <li className={PATTERNS.password.special.test(formData.password) ? "text-emerald-400" : ""}>• Special Char</li>
                    </ul>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] hover:shadow-sky-500/40 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {loading ? "Processing..." : "Continue"}
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f1623] px-2 text-slate-500">Or register with</span></div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={googleSuccess}
                        onError={() => setGlobalError("Google Sign-In failed")}
                        theme="filled_black"
                        shape="circle"
                        width="100%"
                    />
                </div>
              </form>
            ) : (
              // STEP 2: OTP
              <form onSubmit={handleFinalRegister}>
                <div className="flex justify-between gap-2 mb-8">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl border border-slate-700 bg-slate-800/50 text-center text-xl font-bold text-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 outline-none transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] hover:shadow-emerald-500/40"
                >
                   {loading ? "Creating Account..." : "Verify & Complete"}
                </button>

                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="mt-6 w-full text-center text-xs text-slate-400 hover:text-slate-200"
                >
                  Wrong email? Go back
                </button>
              </form>
            )}

          </div>
          
          <div className="text-center mt-6">
             <p className="text-xs text-slate-500">
                Already have an account? <span onClick={() => navigate("/login")} className="text-sky-400 cursor-pointer hover:underline">Log in</span>
             </p>
          </div>
        </div>
      </main>
    </GoogleOAuthProvider>
  );
};

export default Register;