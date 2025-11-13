// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     rememberMe: false,
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Xử lý thay đổi input
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     setError("");
//   };

//   // Xử lý submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     // Validation
//     if (!formData.username || !formData.password) {
//       setError("Please enter both username and password");
//       setLoading(false);
//       return;
//     }

//     try {
//       // TODO: Thay thế bằng API thực tế
//       const response = await fetch("YOUR_API_URL/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Lưu token và thông tin user
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.role);
//         localStorage.setItem("username", data.username);

//         if (formData.rememberMe) {
//           localStorage.setItem("rememberMe", "true");
//         }

//         // Điều hướng theo role
//         switch (data.role) {
//           case "admin":
//             navigate("/admin");
//             break;
//           case "evm":
//           case "manager":
//             navigate("/evm");
//             break;
//           case "dealer-manager":
//             navigate("/dealer-manager");
//             break;
//           case "dealer-staff":
//             navigate("/dealer-staff");
//             break;
//           case "customer":
//             navigate("/customer");
//             break;
//           default:
//             navigate("/");
//         }
//       } else {
//         setError(data.message || "Login failed. Please try again.");
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again later.");
//       console.error("Login error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50 dark:bg-gray-800">
//       <div className="flex min-h-[100vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
//           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
//             Sign in
//           </h1>
//         </div>
//         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white dark:bg-gray-700 px-4 pb-4 pt-8 sm:rounded-lg sm:px-10 sm:pb-6 sm:shadow">
//             <form className="space-y-6" onSubmit={handleSubmit}>
//               {error && (
//                 <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
//                   <div className="text-sm text-red-700 dark:text-red-200">
//                     {error}
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <label
//                   htmlFor="username"
//                   className="block text-sm font-medium text-gray-700 dark:text-white"
//                 >
//                   Email address / Username
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     data-testid="username"
//                     required
//                     value={formData.username}
//                     onChange={handleChange}
//                     disabled={loading}
//                     className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700 dark:text-white"
//                 >
//                   Password
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     data-testid="password"
//                     autoComplete="current-password"
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     disabled={loading}
//                     className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-300 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     id="remember_me"
//                     name="rememberMe"
//                     type="checkbox"
//                     checked={formData.rememberMe}
//                     onChange={handleChange}
//                     disabled={loading}
//                     className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400 disabled:cursor-wait disabled:opacity-50"
//                   />
//                   <label
//                     htmlFor="remember_me"
//                     className="ml-2 block text-sm text-gray-900 dark:text-white"
//                   >
//                     Remember me
//                   </label>
//                 </div>
//                 <div className="text-sm">
//                   <a
//                     className="font-medium text-indigo-400 hover:text-indigo-500"
//                     href="/forgot-password"
//                   >
//                     Forgot your password?
//                   </a>
//                 </div>
//               </div>

//               <div>
//                 <button
//                   data-testid="login"
//                   type="submit"
//                   disabled={loading}
//                   className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:border-transparent dark:hover:bg-indigo-600 dark:focus:ring-indigo-400 dark:focus:ring-offset-2 disabled:cursor-wait disabled:opacity-50"
//                 >
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                     <svg
//                       className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                       aria-hidden="true"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </span>
//                   {loading ? "Signing in..." : "Sign In"}
//                 </button>
//               </div>
//             </form>

//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="bg-white dark:bg-gray-700 px-2 text-gray-500 dark:text-white">
//                     Or continue with
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-6 grid grid-cols-2 gap-3">
//                 <button
//                   type="button"
//                   disabled={loading}
//                   className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-500 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-wait disabled:opacity-50"
//                 >
//                   <span className="sr-only">Sign in with Google</span>
//                   <svg
//                     className="h-6 w-6"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                     aria-hidden="true"
//                   >
//                     <clipPath id="p.0">
//                       <path
//                         d="m0 0l20.0 0l0 20.0l-20.0 0l0 -20.0z"
//                         clipRule="nonzero"
//                       />
//                     </clipPath>
//                     <g clipPath="url(#p.0)">
//                       <path
//                         fill="currentColor"
//                         fillOpacity="0.0"
//                         d="m0 0l20.0 0l0 20.0l-20.0 0z"
//                         fillRule="evenodd"
//                       />
//                       <path
//                         fill="currentColor"
//                         d="m19.850197 8.270351c0.8574047 4.880001 -1.987587 9.65214 -6.6881847 11.218641c-4.700598 1.5665016 -9.83958 -0.5449295 -12.08104 -4.963685c-2.2414603 -4.4187555 -0.909603 -9.81259 3.1310139 -12.6801605c4.040616 -2.867571 9.571754 -2.3443127 13.002944 1.2301085l-2.8127813 2.7000687l0 0c-2.0935059 -2.1808972 -5.468274 -2.500158 -7.933616 -0.75053835c-2.4653416 1.74962 -3.277961 5.040613 -1.9103565 7.7366734c1.3676047 2.6960592 4.5031037 3.9843292 7.3711267 3.0285425c2.868022 -0.95578575 4.6038647 -3.8674583 4.0807285 -6.844941z"
//                         fillRule="evenodd"
//                       />
//                       <path
//                         fill="currentColor"
//                         d="m10.000263 8.268785l9.847767 0l0 3.496233l-9.847767 0z"
//                         fillRule="evenodd"
//                       />
//                     </g>
//                   </svg>
//                 </button>

//                 <button
//                   type="button"
//                   disabled={loading}
//                   className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-500 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-wait disabled:opacity-50"
//                 >
//                   <span className="sr-only">Sign in with GitHub</span>
//                   <svg
//                     className="h-6 w-6"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="currentColor"
//                     viewBox="0 0 32 32"
//                   >
//                     <path d="M16 1.375c-8.282 0-14.996 6.714-14.996 14.996 0 6.585 4.245 12.18 10.148 14.195l0.106 0.031c0.750 0.141 1.025-0.322 1.025-0.721 0-0.356-0.012-1.3-0.019-2.549-4.171 0.905-5.051-2.012-5.051-2.012-0.288-0.925-0.878-1.685-1.653-2.184l-0.016-0.009c-1.358-0.93 0.105-0.911 0.105-0.911 0.987 0.139 1.814 0.718 2.289 1.53l0.008 0.015c0.554 0.995 1.6 1.657 2.801 1.657 0.576 0 1.116-0.152 1.582-0.419l-0.016 0.008c0.072-0.791 0.421-1.489 0.949-2.005l0.001-0.001c-3.33-0.375-6.831-1.665-6.831-7.41-0-0.027-0.001-0.058-0.001-0.089 0-1.521 0.587-2.905 1.547-3.938l-0.003 0.004c-0.203-0.542-0.321-1.168-0.321-1.821 0-0.777 0.166-1.516 0.465-2.182l-0.014 0.034s1.256-0.402 4.124 1.537c1.124-0.321 2.415-0.506 3.749-0.506s2.625 0.185 3.849 0.53l-0.1-0.024c2.849-1.939 4.105-1.537 4.105-1.537 0.285 0.642 0.451 1.39 0.451 2.177 0 0.642-0.11 1.258-0.313 1.83l0.012-0.038c0.953 1.032 1.538 2.416 1.538 3.937 0 0.031-0 0.061-0.001 0.091l0-0.005c0 5.761-3.505 7.029-6.842 7.398 0.632 0.647 1.022 1.532 1.022 2.509 0 0.093-0.004 0.186-0.011 0.278l0.001-0.012c0 2.007-0.019 3.619-0.019 4.106 0 0.394 0.262 0.862 1.031 0.712 6.028-2.029 10.292-7.629 10.292-14.226 0-8.272-6.706-14.977-14.977-14.977-0.006 0-0.013 0-0.019 0h0.001z" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             <div className="m-auto mt-6 w-fit md:mt-8">
//               <span className="m-auto dark:text-gray-400">
//                 Don't have an account?{" "}
//                 <a
//                   className="font-semibold text-indigo-600 dark:text-indigo-100 hover:underline"
//                   href="/register"
//                 >
//                   Create Account
//                 </a>
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
