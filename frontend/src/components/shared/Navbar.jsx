import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const roleLinks = {
    admin: [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/me", label: "Profile" },
        { to: "/admin/users", label: "User Management" },
    ],
    manager: [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/me", label: "Profile" },
        { to: "/admin/users", label: "User Management" },
    ],
    user: [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/me", label: "Profile" },
    ],
};

const Navbar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const links = useMemo(() => roleLinks[user?.role] || roleLinks.user, [user?.role]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
        } catch (error) {
            console.error("Logout request failed", error);
        } finally {
            navigate("/login", { replace: true });
        }
    };

    return (
        <nav className="fixed left-0 top-0 z-50 w-full border-b-2 border-black bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
                <div className="text-sm font-black uppercase tracking-[0.2em]">PurpleMerit</div>

                <div className="hidden items-center gap-2 md:flex md:gap-3">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] transition ${
                                    isActive ? "bg-black text-white" : "bg-white text-black"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <p className="hidden text-[10px] font-black uppercase tracking-[0.14em] text-zinc-600 md:block">
                        {user?.name || "User"} ({user?.role || "user"})
                    </p>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="border-2 border-black bg-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black"
                    >
                        Logout
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="inline-flex items-center justify-center border-2 border-black p-2 text-black md:hidden"
                    aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="border-t-2 border-black bg-white px-4 py-3 md:hidden">
                    <div className="mb-3 text-[10px] font-black uppercase tracking-[0.14em] text-zinc-600">
                        {user?.name || "User"} ({user?.role || "user"})
                    </div>

                    <div className="flex flex-col gap-2">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `border-2 border-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition ${
                                        isActive ? "bg-black text-white" : "bg-white text-black"
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="border-2 border-black bg-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;