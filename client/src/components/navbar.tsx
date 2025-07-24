import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GraduationCap, BarChart3, PlayCircle, PlusCircle, Gauge, Bell } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Gauge },
    { path: "/take-test", label: "Take Test", icon: PlayCircle },
    { path: "/create-test", label: "Create Test", icon: PlusCircle },
    { path: "/results", label: "Results", icon: BarChart3 },
  ];

  return (
    <header className="bg-white shadow-material sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <GraduationCap className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-bold text-primary">EduCentral</h1>
            </div>
            <nav className="hidden md:flex space-x-8 ml-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant="ghost"
                      className={`${
                        isActive
                          ? "text-primary border-b-2 border-primary"
                          : "text-neutral-600 hover:text-primary"
                      } pb-4 pt-4 rounded-none`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                JD
              </div>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
