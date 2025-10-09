// import React from "react";

// const Sidebar = () => {
//   return (
//     <aside className="w-[12rem] bg-blue-50 h-screen ">
//       <nav>
//         <ul>
//           <li>
//             <a href="/" className="block py-2 px-4 rounded hover:bg-gray-300  ">
//               Home
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;
import React, { useState } from "react";
import {
  HomeIcon,
  UserPlusIcon,
  UserCircleIcon,
  Bars3Icon as MenuIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  // return (
  //   <aside
  //     className={`h-screen border-r border-gray-300 p-4 transition-width duration-300 ease-in-out ${
  //       isOpen ? "w-48" : "w-16"
  //     }`}
  //   >
  //     {/* Toggle button */}
  //     <button
  //       onClick={() => setIsOpen(!isOpen)}
  //       className="mb-6 focus:outline-none"
  //       aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
  //     >
  //       <MenuIcon className="h-6 w-6 text-purple-900 cursor-pointer" />
  //     </button>

  //     <nav>
  //       <ul className="space-y-4">
  //         <li>
  //           <a
  //             href="/"
  //             title="home"
  //             className="flex items-center space-x-3 p-2 rounded hover:bg-gray-300"
  //           >
  //             <HomeIcon className="h-6 w-6 text-purple-900" />
  //             {isOpen && <span>Home</span>}
  //           </a>
  //         </li>
  //         {/* Add more items here */}
  //       </ul>
  //     </nav>
  //   </aside>
  // );
  return (
    <aside
      className={`h-screen border-r border-gray-300 p-4 transition-all duration-300 ease-in-out ${
        isOpen ? "w-48" : "w-16"
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-6 focus:outline-none"
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <MenuIcon className="h-6 w-6 text-purple-900 cursor-pointer" />
      </button>

      <nav>
        <ul className="space-y-4">
          {/* Home Link */}
          <li>
            <Link
              to="/"
              title="Home"
              className="flex items-center space-x-3 p-2 rounded hover:bg-gray-300"
            >
              <HomeIcon className="h-6 w-6 text-purple-900" />
              {isOpen && <span>Home</span>}
            </Link>
          </li>

          {/* SignUp Link */}
          <li>
            <Link
              to="/signup"
              title="Sign Up"
              className="flex items-center space-x-3 p-2 rounded hover:bg-gray-300"
            >
              <UserPlusIcon className="h-6 w-6 text-purple-900" />
              {isOpen && <span>Sign Up</span>}
            </Link>
          </li>
          {/* //login link */}
          <li>
            <Link
              to="/login"
              title="LogIn"
              className="flex items-center space-x-3 p-2 rounded hover:bg-gray-300"
            >
              <UserCircleIcon className="h-6 w-6 text-purple-900" />
              {isOpen && <span>Log In</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
