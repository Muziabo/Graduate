import { useState } from "react";
import { Menu, MenuItemLink } from "react-admin";
import {
    GraduationCap,
    ShoppingCart,
    SchoolIcon,
    Users2Icon,
    ChevronDown,
    ChevronRight,
    ShoppingBagIcon,
    UserCog2Icon,
    DotIcon,
    Dot, Package2Icon,
} from "lucide-react";
import { useSession } from "next-auth/react";

const CustomMenu = (props: any) => {
    const { data: session } = useSession();
    const [productsOpen, setProductsOpen] = useState(false);
    const [managerOpen, setManagerOpen] = useState(false);
    const [administratorOpen, setAdministratorOpen] = useState(false);

    // Handle dropdown toggling
    const handleManagerClick = () => {
        setManagerOpen(!managerOpen);
        setProductsOpen(false); // Close other dropdowns
        setAdministratorOpen(false);
    };

    const handleProductsClick = () => {
        setProductsOpen(!productsOpen);
        setManagerOpen(false); // Close other dropdowns
        setAdministratorOpen(false);
    };

    const handleAdministratorClick = () => {
        setAdministratorOpen(!administratorOpen);
        setManagerOpen(false); // Close other dropdowns
        setProductsOpen(false);
    };

    return (
        <Menu {...props}>
            {/* Dashboard */}
            <Menu.DashboardItem />

            {/* Orders */}
            <MenuItemLink
                to="/orders"
                primaryText={
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                        <ShoppingCart size={20} color={"red"} />
                        <span>Orders</span>
                    </div>
                }
            />

            {/* Manager (Dropdown) */}
            <div
                role="button"
                aria-expanded={managerOpen}
                aria-controls="manager-submenu"
                onClick={handleManagerClick}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: managerOpen ? "bold" : "normal",
                    backgroundColor: managerOpen ? "#f0f0f0" : "transparent",
                    transition: "background-color 0.2s ease",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <Package2Icon size={20} color={"green"} />
                    <span>Manager</span>
                </div>
                {managerOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>

            {/* Submenu for Manager */}
            {managerOpen && (
                <div
                    id="manager-submenu"
                    style={{
                        paddingLeft: "1.5rem",
                        marginTop: "0.5rem",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: managerOpen ? 1 : 0,
                        transform: managerOpen ? "translateY(0)" : "translateY(-10px)",
                    }}
                >
                    <MenuItemLink
                        to="/institutions"
                        primaryText={
                            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                <SchoolIcon size={20} />
                                <span>Institutions</span>
                            </div>
                        }
                    />
                    <MenuItemLink
                        to="/students"
                        primaryText={
                            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                <Users2Icon size={20} />
                                <span>Students</span>
                            </div>
                        }
                    />
                </div>
            )}

            {/* Products (Dropdown) */}
            <div
                role="button"
                aria-expanded={productsOpen}
                aria-controls="products-submenu"
                onClick={handleProductsClick}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: productsOpen ? "bold" : "normal",
                    backgroundColor: productsOpen ? "#f0f0f0" : "transparent",
                    transition: "background-color 0.2s ease",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <ShoppingBagIcon size={20} color={"orange"} />
                    <span>Products</span>
                </div>
                {productsOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>

            {/* Submenu for Products */}
            {productsOpen && (
                <div
                    id="products-submenu"
                    style={{
                        paddingLeft: "1.5rem",
                        marginTop: "0.5rem",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: productsOpen ? 1 : 0,
                        transform: productsOpen ? "translateY(0)" : "translateY(-10px)",
                    }}
                >
                    <MenuItemLink
                        to="/gowns"
                        primaryText={
                            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                <GraduationCap size={18} color={"purple"} />
                                <span>Gowns</span>
                            </div>
                        }
                    />
                </div>
            )}

            {/* Administrator (Dropdown) */}
            {session?.user.role === "ADMIN" && (
                <div
                    role="button"
                    aria-expanded={administratorOpen}
                    aria-controls="administrator-submenu"
                    onClick={handleAdministratorClick}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: administratorOpen ? "bold" : "normal",
                        backgroundColor: administratorOpen ? "#f0f0f0" : "transparent",
                        transition: "background-color 0.2s ease",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                        <UserCog2Icon size={20} color={"blue"} />
                        <span>Administrator</span>
                    </div>
                    {administratorOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
            )}

            {/* Submenu for Administrator */}
            {administratorOpen && (
                <div
                    id="administrator-submenu"
                    style={{
                        paddingLeft: "1.5rem",
                        marginTop: "0.5rem",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: administratorOpen ? 1 : 0,
                        transform: administratorOpen ? "translateY(0)" : "translateY(-10px)",
                    }}
                >
                    <MenuItemLink
                        to="/system"
                        primaryText={
                            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                <DotIcon size={30} />
                                <span>System Admin</span>
                            </div>
                        }
                    />
                    <MenuItemLink
                        to="/instadmin"
                        primaryText={
                            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                <Dot size={30} />
                                <span>Institution Admin</span>
                            </div>
                        }
                    />
                </div>
            )}
        </Menu>
    );
};

export default CustomMenu;