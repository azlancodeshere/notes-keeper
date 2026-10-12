import { useState,useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";


export default function SignUpPage() {

  
  const navigate = useNavigate();

  const { setUser, setIsAuthenticated } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
   

    const response = await api.post("/users/register", {
      ...formData,
    });

    console.log(response.data);

    const registerUser = response.data.data;

    setUser(registerUser);
    setIsAuthenticated(true);

    navigate("/home")

    
  } catch (error) {
    console.error("Error during registration:", error);

       alert(
      error.response?.data?.message ||
        "Registration failed. Please try again."
    );
  }
};



  const input =
    "w-full rounded-xl border-[1.5px] border-[#d9d5f5] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[#5b43f0] focus:ring-4 focus:ring-[#5b43f0]/20 dark:border-[#35306b] dark:bg-[#1a1544] dark:focus:border-[#8a78ff] dark:focus:ring-[#8a78ff]/20";
  const label = "mb-2 mt-4 block text-sm font-semibold";
  const muted = "text-[#625e8a] dark:text-[#a29dd0]";

  return (
    <div className="grid min-h-screen bg-[#f4f2ff] text-[#17123f] dark:bg-[#0f0c28] dark:text-[#f1efff] md:grid-cols-[1.1fr_1fr]">
      
      <section className="relative flex flex-col justify-between gap-6 overflow-hidden bg-[#1f1850] py-8 pl-14 pr-6 text-white dark:bg-[#171240] sm:pl-20 md:gap-8 md:py-12 md:pl-24 md:pr-12 bg-[repeating-linear-gradient(to_bottom,transparent_0_35px,rgba(255,255,255,0.07)_35px_36px)]">
        <div className="absolute inset-y-0 left-9 w-0.5 bg-[#ff6f91]/80 sm:left-12 md:left-[68px]" />

        <div className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight md:text-xl">
          <span className="grid h-7 w-7 -rotate-6 place-items-center rounded-lg bg-[#ffd166] text-sm text-[#1f1850]">
            ✎
          </span>
          Notes Keeper
        </div>

        <div>
          <h1 className="max-w-[14ch] text-3xl font-extrabold leading-[1.1] tracking-tighter sm:text-4xl md:max-w-[12ch] lg:text-5xl">
            Your notes, all in one place.
          </h1>
          <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-white/70 md:mt-4 md:text-base">
            Write quick notes, make lists, and find anything in seconds. Always
            with you, on every device.
          </p>
        </div>

       
        <div className="relative hidden h-60 lg:block" aria-hidden="true">
          <div className="absolute left-0 top-10 w-40 -rotate-6 rounded bg-[#ffd166] p-4 text-sm leading-snug text-[#1f1850] shadow-2xl">
            <b className="mb-1 block">Grocery</b>
            Milk, eggs, chai patti, bread
          </div>
          <div className="absolute left-36 top-0 w-40 rotate-[4deg] rounded bg-[#6ee7b7] p-4 text-sm leading-snug text-[#1f1850] shadow-2xl">
            <b className="mb-1 block">Friday</b>
            Send the project report to sir
          </div>
          <div className="absolute left-72 top-12 w-40 -rotate-3 rounded bg-[#ff9eb5] p-4 text-sm leading-snug text-[#1f1850] shadow-2xl">
            <b className="mb-1 block">App idea</b>
            Add reminders and dark mode
          </div>
        </div>
      </section>

      {/* Form */}
      <main className="flex items-start justify-center px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 sm:px-8 md:items-center md:py-8">
        <div className="w-full max-w-[410px]">
          <h2 className="mb-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Create your account
          </h2>
          <p className={`mb-6 ${muted}`}>Free to start. No card needed.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username" className={label}>
              Username
            </label>
            <input
              id="username"
              name="username"
              onChange={handleChange}
              value={formData.username}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              className={input}
            />
            <p className={`mt-1 text-xs ${muted}`}>
              Your handle will be @username
            </p>

            <label htmlFor="email" className={label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              inputMode="email"
              className={input}
            />

            <label htmlFor="password" className={label}>
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className={`${input} pr-16`}
              />
             
            </div>
            <div className="mt-2 flex gap-1.5">
              <i className="h-1.5 flex-1 rounded-full bg-[#d9d5f5] dark:bg-[#35306b]" />
              <i className="h-1.5 flex-1 rounded-full bg-[#d9d5f5] dark:bg-[#35306b]" />
              <i className="h-1.5 flex-1 rounded-full bg-[#d9d5f5] dark:bg-[#35306b]" />
              <i className="h-1.5 flex-1 rounded-full bg-[#d9d5f5] dark:bg-[#35306b]" />
            </div>

            <button
              type="submit"
              className="mt-7 w-full rounded-xl bg-[#5b43f0] py-3.5 text-base font-bold text-white transition hover:brightness-110 active:scale-[0.985] dark:bg-[#8a78ff] dark:text-[#120d3a]"
            >
              Create account
            </button>
          </form>

          <p className={`mt-5 text-center text-sm ${muted}`}>
            Already have an account?{" "}
            <Link
            to="/login"
            className="font-bold text-[#5b43f0] dark:text-[#8a78ff]">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}