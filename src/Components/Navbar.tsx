import { useEffect, useRef, useState } from "react";
import { MdOutlineLogout } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const showProfile =
    location.pathname === "/question" || location.pathname === "/success";
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

 const handleLogout = () => {
    setShow(false);
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("UserID");
  };
 


  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  return (
    <>
      <div className="w-full flex justify-between items-center px-5 py-2 relative">
        <img src="/tseep_logo.png" alt="logo" className="w-56" />

        {showProfile && (
          <img
            src="/profile.png"
            alt="profile"
            className="w-12 h-12 cursor-pointer"
            onClick={() => setShow(!show)}
          />
        )}
      </div>

      {show && (
        <div
          ref={dropdownRef}
          className="bg-red-200 text-red-500 py-2 px-3 absolute top-20 right-9 w-fit flex gap-2 cursor-pointer items-center"
          onClick={handleLogout}
        >
          <MdOutlineLogout />
          <span>Logout</span>
        </div>
      )}
    </>
  );
}
