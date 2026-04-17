import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const links = useMemo(() => roleLinks[user?.role] || roleLinks.user, [user?.role]);

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

                <div className="flex items-center gap-2 md:gap-3">
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

                <div className="flex items-center gap-3">
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
            </div>
        </nav>
    );
};

export default Navbar;