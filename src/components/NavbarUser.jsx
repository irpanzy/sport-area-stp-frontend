import { Menu } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

const NavbarUser = ({
  logo = {
    url: "#top",
    src: "/images/logo.png",
    alt: "logo",
  },

  menu = [
    { title: "Home", url: "#" },
    { title: "Panduan", url: "#" },
    {
      title: "Sewa Lapangan",
      url: "#",
      items: [
        {
          title: "Basket",
          description: "Lapangan basket outdoor siap digunakan.",
          src: "/icons/basketball.svg",
          className: "w-5 h-5",
          url: "#",
        },
        {
          title: "Futsal",
          description: "Lapangan futsal outdoor nyaman dan luas.",
          src: "/icons/soccer-ball.svg",
          className: "w-5 h-5",
          url: "#",
        },
      ],
    },
    { title: "Laporan", url: "#" },
  ],

  auth = {
    logout: { title: "Logout", url: "#" },
  },
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token tidak ditemukan");
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = Date.now() > payload.exp * 1000;

      if (isExpired) {
        toast.error("Token kadaluarsa");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (payload.role === "admin") {
        toast.error("Anda tidak memiliki akses ke halaman ini");
        navigate("/admin");
        return;
      }

      if (payload.role !== "user") {
        toast.error("Akses tidak diizinkan");
        navigate("/login");
        return;
      }
    } catch {
      toast.error("Token tidak valid");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);
  return (
    <section className="py-4">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Desktop Menu */}
        <nav className="hidden justify-between md:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center gap-4">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("token");
                toast.success("Anda telah logout");
                navigate("/login");
              }}
            >
              {auth.logout.title}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader></SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        localStorage.removeItem("token");
                        toast.success("Anda telah logout");
                        navigate("/login");
                      }}
                    >
                      {auth.logout.title}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="relative">
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="left-0 bg-popover text-popover-foreground">
          <div className="w-[300px] flex flex-col gap-2 p-2">
            {item.items.map((subItem) => (
              <NavigationMenuLink asChild key={subItem.title}>
                <SubMenuLink item={subItem} />
              </NavigationMenuLink>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }) => {
  return (
    <a
      className="flex items-start gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      {/* Icon */}
      {item.src && (
        <img
          src={item.src}
          alt={`${item.title} icon`}
          className={item.className || "w-5 h-5"}
        />
      )}

      {/* Title & description */}
      <div className="space-y-1">
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
      </div>
    </a>
  );
};

export { NavbarUser };
