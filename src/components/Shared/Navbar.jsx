import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Home, LogOut, User2, Briefcase, Search, Building, LayoutDashboard, Menu, X, Settings } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { logoutUser } from "@/redux/authSlice";
import { motion } from "framer-motion";
import { RainbowButton } from "../ui/rainbow-button";

const QuestCareersLogo = () => (
  <Link to="/" className="flex items-center cursor-pointer">
    <div className="relative w-12 h-12 mr-2">
      <img
        src="/src/assets/CS_Ellipse_7.png"
        alt="QuestCareers Logo"
        className="w-full h-full"
      />
    </div>
    <span className="text-2xl font-bold">
      <span className="text-white">Quest</span>
      <span className="text-purple-300">Careers</span>
    </span>
  </Link>
);

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mouseX, setMouseX] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(logoutUser());
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const navItems = user
    ? user.role === "Admin"
      ? [
        { to: "/", icon: Home, label: "Home" },
        { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      ]
      : user.role === "Recruiter"
        ? [
          { to: "/", icon: Home, label: "Home" },
          { to: "/admin/companies", icon: Building, label: "Companies" },
          { to: "/admin/jobs", icon: Briefcase, label: "Jobs" },
        ]
        : [
          { to: "/", icon: Home, label: "Home" },
          { to: "/jobs", icon: Briefcase, label: "Jobs" },
          { to: "/browse", icon: Search, label: "Browse" },
        ]
    : [];

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <QuestCareersLogo />

          <div className="hidden md:flex items-center space-x-4">
            <Dock mouseX={mouseX}>
              {navItems.map((item) => (
                <DockIcon
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  active={location.pathname === item.to}
                >
                  {item.label}
                </DockIcon>
              ))}
            </Dock>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <div className="flex items-center space-x-3">
                <Link to="/LogIn">
                  <RainbowButton variant="outline" className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-purple-800 transition duration-300 font-semibold px-4 py-2">
                    LogIn
                  </RainbowButton>
                </Link>
                <Link to="/SignUp">
                  <RainbowButton className="bg-white text-purple-800 hover:bg-purple-800 border-2 border-white hover:text-white hover:bg-transparent transition duration-300 font-semibold px-4 py-2">
                    SignUp
                  </RainbowButton>
                </Link>
              </div>
            ) : (
              <UserMenu user={user} logoutHandler={logoutHandler} />
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-purple-300 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <MobileNavLink key={item.to} to={item.to} icon={item.icon} active={location.pathname === item.to}>
                {item.label}
              </MobileNavLink>
            ))}
            {!user ? (
              <div className="flex flex-col space-y-2 mt-4">
                <Link to="/LogIn">
                  <RainbowButton variant="outline" className="w-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#a277cc] transition duration-300 font-semibold px-4 py-2">
                    LogIn
                  </RainbowButton>
                </Link>
                <Link to="/SignUp">
                  <RainbowButton className="w-full bg-white text-[#a277cc] hover:bg-[#a277cc] border-2 border-white hover:text-white hover:bg-transparent transition duration-300 font-semibold">
                    SignUp
                  </RainbowButton>
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <MobileUserMenu user={user} logoutHandler={logoutHandler} />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Dock = ({ children, mouseX }) => {
  return (
    <div className="flex items-center space-x-4">
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { mouseX });
      })}
    </div>
  );
};

const DockIcon = ({ to, icon: Icon, active, children, mouseX }) => {
  const ref = React.useRef(null);

  const [elCenterX, setElCenterX] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setElCenterX(rect.left + rect.width / 2);
    }
  }, [ref]);

  const distance = Math.abs(mouseX - elCenterX);
  const scale = Math.max(1, 1.5 - distance / 100);

  return (
    <Link
      ref={ref}
      to={to}
      className={`text-white transition-all duration-200 flex items-center px-3 py-2 rounded-full ${active
        ? 'bg-white bg-opacity-20'
        : 'hover:bg-gray-800 hover:bg-opacity-10'
        }`}
    >
      <motion.div
        style={{
          scale: active ? 1 : scale,
        }}
        className="flex items-center"
      >
        <Icon className="h-6 w-6" />
        <span className="ml-2 text-sm font-medium">{children}</span>
      </motion.div>
    </Link>
  );
};

const UserMenu = ({ user, logoutHandler }) => (
  <Popover>
    <PopoverTrigger asChild>
      <div className="flex items-center space-x-3 cursor-pointer">
        <Avatar className="h-10 w-10 ring-2 ring-white hover:ring-purple-300 transition-all duration-200">
          <AvatarImage src={user?.profile?.profilePhoto} alt={user?.name} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-white text-sm">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-base opacity-75">{user?.fullname}</p>
        </div>
      </div>
    </PopoverTrigger>
    <PopoverContent className="w-64 bg-white text-gray-800 p-4 rounded-md shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
        <hr />
        <PopoverItem icon={User2} to={user.role === "Admin" ? "/admin/profile" : user.role === "Recruiter" ? "/view-profile" : "/profile"}>
          View Profile
        </PopoverItem>
        <PopoverItem icon={LogOut} onClick={logoutHandler}>
          Logout
        </PopoverItem>
      </div>
    </PopoverContent>
  </Popover>
);

const MobileUserMenu = ({ user, logoutHandler }) => (
  <div className="space-y-2">
    <MobileNavLink to={user.role === "Admin" ? "/admin/profile" : user.role === "Recruiter" ? "/view-profile" : "/profile"} icon={User2}>
      View Profile
    </MobileNavLink>
    <button
      onClick={logoutHandler}
      className="w-full text-left text-gray-300 hover:text-white transition-colors duration-200 flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-purple-700"
    >
      <LogOut className="mr-3 h-5 w-5" />
      Logout
    </button>
  </div>
);

const PopoverItem = ({ icon: Icon, to, onClick, children }) => (
  <div
    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    {to ? (
      <Link to={to} className="text-sm">{children}</Link>
    ) : (
      <span className="text-sm">{children}</span>
    )}
  </div>
);

export default Navbar;
