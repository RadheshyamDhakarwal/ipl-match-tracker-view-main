// import { NavLink, useLocation } from "react-router-dom";
// import { useTheme } from "@/pages/ThemeContext";
// import { useEffect, useRef, useState } from "react";
// import { Menu } from "lucide-react";

// const Navbar = () => {
//   const { theme, toggleTheme } = useTheme();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const location = useLocation();
//   const showBackButton = location.pathname !== "/";
//   const menuRef = useRef(null);
//   const backgroundColor = theme === "dark" ? "#212121" : "#223577";

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <nav
//       className="dark:bg-[#212121] light:bg-[#223577]  p-3 shadow-lg sticky top-0 text-white"
//       style={{
//         backgroundColor,
//         zIndex: 999999,
//       }}
//     >
//       <div className=" mx-auto flex  sm:flex-row justify-between  ">
//         <NavLink
//           to="/"
//           className="text-2xl font-bold mb-0 sm:mb-0  text-[12px]"
//         >
//           <div className="flex items-center">
//             {showBackButton && (
//               <button className="mr-2">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="30"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="w-6 h-6"
//                 >
//                   <path d="M15 18l-6-6 6-6" />
//                 </svg>
//               </button>
//             )}
//             <img
//               src="/Images/logoweb.png"
//               alt="criclogo"
//               className="rounded-lg hidden md:block   sm:block "
//               width={140}
//             />
//             <img
//               src="/Images/logoweb.png"
//               alt="criclogo"
//               className="rounded-lg block md:hidden "
//               width={100}
//             />
//           </div>
//         </NavLink>

//         <div className="relative"  ref={menuRef}>
//           {/* Hamburger button for small devices */}
//           <div className="sm:hidden flex justify-end ">
//             <button onClick={() => setMenuOpen(!menuOpen)}>
//               <Menu className="w-6 h-6 text-white" />
//             </button>
//           </div>

//           {/* Navigation Links */}
//           <div
//             className={`flex-col sm:flex sm:flex-row sm:space-x-4 text-[14px] sm:text-[16px] items-start sm:items-center text-left sm:static absolute right-4 top-10 z-50 bg-[#444] sm:bg-transparent rounded-md px-4 py-3 sm:p-0 transition-all duration-300 ${
//               menuOpen ? "flex w-[200px] right-0" : "hidden"
//             }`}
//           >
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 isActive ? "border-b-2 border-white" : "transition-colors"
//               }
//                onClick={() => setMenuOpen(false)}
//             >
//               Matches
//             </NavLink>
//             <NavLink
//               to="https://live.cricindia.com/"
//               className={({ isActive }) =>
//                 isActive ? "border-b-2 border-white" : "transition-colors"
//               }
//                onClick={() => setMenuOpen(false)}
//             >
//               Commentary
//             </NavLink>
//             <NavLink
//               to="/rankings"
//               className={({ isActive }) =>
//                 isActive ? "border-b-2 border-white" : "transition-colors"
//               }
//                onClick={() => setMenuOpen(false)}
//             >
//               Table
//             </NavLink>
//             <NavLink
//               to="/news"
//               className={({ isActive }) =>
//                 isActive ? "border-b-2 border-white" : "transition-colors"
//               }
//                onClick={() => setMenuOpen(false)}
//             >
//               News
//             </NavLink>
//             <NavLink
//               to="/about"
//               className={({ isActive }) =>
//                 isActive ? "border-b-2 border-white" : "transition-colors"
//               }
//                onClick={() => setMenuOpen(false)}
//             >
//               About Us
//             </NavLink>

//             <NavLink
//               to="/contactus"
//               className={({ isActive }) =>
//                 isActive ? "border-b-2 border-white" : "transition-colors"
//               }
//                onClick={() => setMenuOpen(false)}
//             >
//               Contact Us
//             </NavLink>

//             <NavLink
//               to="/terms"
//               className={({ isActive }) =>
//                 isActive ? "border-b-2 border-white" : "transition-colors"
//               }
//                onClick={() => setMenuOpen(false)}
//             >
//               Terms
//             </NavLink>

//             <NavLink
//               to="/privacy"
//               className={({ isActive }) =>
//                 isActive ? "border-b-2 border-white" : "transition-colors"
//               }
//                onClick={() => setMenuOpen(false)}
//             >
//               Privacy
//             </NavLink>
//           </div>

//           {/* <div className="flex items-center mt-2 sm:mt-0">
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="sr-only peer"
//                 checked={theme === "dark"}
//                 onChange={toggleTheme}
//               />
//               <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black relative"></div>
//               <span className="ml-2 text-sm text-white sm:text-gray-900">
//                 {theme === "dark" ? "Dark" : "Light"}
//               </span>
//             </label>
//           </div> */}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@/pages/ThemeContext";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const showBackButton = location.pathname !== "/";
  const menuRef = useRef(null);
  const backgroundColor = theme === "dark" ? "#212121" : "#223577";

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="dark:bg-[#212121] light:bg-[#223577] p-3 shadow-lg sticky top-0 text-white"
      style={{
        backgroundColor,
        zIndex: 999999,
      }}
    >
      <div className="mx-auto flex justify-between items-center">
        {/* Logo and Back Button */}
        <NavLink to="/" className="text-2xl font-bold text-[12px]">
          <div className="flex items-center">
            {showBackButton && (
              <button className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <img
              src="/Images/logoweb.png"
              alt="criclogo"
              className="rounded-lg hidden sm:block"
              width={140}
            />
            <img
              src="/Images/logoweb.png"
              alt="criclogo"
              className="rounded-lg block sm:hidden"
              width={100}
            />
          </div>
        </NavLink>

        {/* Hamburger Button */}
        <div className="sm:hidden lg:hidden  md:hidden z-50">
          <button onClick={() => setMenuOpen(true)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex sm:space-x-4 text-[14px] sm:text-[16px] items-center">
          <NavLinks onClick={() => {}} />
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-[250px] bg-[#444] text-white z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <span className="text-lg font-bold">Menu</span>
          <X className="cursor-pointer" onClick={() => setMenuOpen(false)} />
        </div>

        {/* Drawer Links */}
        <div className="flex flex-col space-y-4 px-4 py-6 text-[16px]">
          <NavLinks onClick={() => setMenuOpen(false)} />
        </div>

        <div className="flex items-center mt-2 sm:mt-0 ms-3">
          <label className="relative inline-flex items-center cursor-pointer ">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black relative"></div>
            <span className="ml-2 text-sm text-white sm:text-gray-900">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </label>
        </div>
      </div>
    </nav>
  );
};

const NavLinks = ({ onClick }) => (
  <>
    <NavLink
      to="/"
      className={({ isActive }) =>
        isActive ? "border-b-2 border-white" : "transition-colors"
      }
      onClick={onClick}
    >
      Matches
    </NavLink>
    <NavLink
      to="https://live.cricindia.com/"
      className={({ isActive }) =>
        isActive ? "border-b-2 border-white" : "transition-colors"
      }
      onClick={onClick}
    >
      Commentary
    </NavLink>
    <NavLink
      to="/rankings"
      className={({ isActive }) =>
        isActive ? "border-b-2 border-white" : "transition-colors"
      }
      onClick={onClick}
    >
      Table
    </NavLink>
    <NavLink
      to="/news"
      className={({ isActive }) =>
        isActive ? "border-b-2 border-white" : "transition-colors"
      }
      onClick={onClick}
    >
      News
    </NavLink>
    <NavLink
      to="/about"
      className={({ isActive }) =>
        isActive ? "border-b-2 border-white" : "transition-colors"
      }
      onClick={onClick}
    >
      About Us
    </NavLink>
    <NavLink
      to="/contactus"
      className={({ isActive }) =>
        isActive ? "border-b-2 border-white" : "transition-colors"
      }
      onClick={onClick}
    >
      Contact Us
    </NavLink>
    <NavLink
      to="/terms"
      className={({ isActive }) =>
        isActive ? "border-b-2 border-white" : "transition-colors"
      }
      onClick={onClick}
    >
      Terms
    </NavLink>
    <NavLink
      to="/privacy"
      className={({ isActive }) =>
        isActive ? "border-b-2 border-white" : "transition-colors"
      }
      onClick={onClick}
    >
      Privacy
    </NavLink>
  </>
);

export default Navbar;
