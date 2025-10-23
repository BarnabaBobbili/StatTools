import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sigma } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sigma className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">StatTools</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <UserMenu />
            <Link to="/">
              <Button variant={isActive("/") ? "default" : "ghost"} size="sm">
                Home
              </Button>
            </Link>
            <Link to="/distributions">
              <Button variant={isActive("/distributions") ? "default" : "ghost"} size="sm">
                Distributions
              </Button>
            </Link>
            <Link to="/analysis">
              <Button variant={isActive("/analysis") ? "default" : "ghost"} size="sm">
                Analysis
              </Button>
            </Link>
            <Link to="/comparison">
              <Button variant={isActive("/comparison") ? "default" : "ghost"} size="sm">
                Comparison
              </Button>
            </Link>
            <Link to="/probability">
              <Button variant={isActive("/probability") ? "default" : "ghost"} size="sm">
                Probability
              </Button>
            </Link>
            <Link to="/hypothesis">
              <Button variant={isActive("/hypothesis") ? "default" : "ghost"} size="sm">
                Hypothesis
              </Button>
            </Link>
            <Link to="/confidence">
              <Button variant={isActive("/confidence") ? "default" : "ghost"} size="sm">
                Confidence
              </Button>
            </Link>
            <Link to="/simulations">
              <Button variant={isActive("/simulations") ? "default" : "ghost"} size="sm">
                Simulations
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <UserMenu />
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive("/") && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium">Home</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/distributions"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive("/distributions") && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium">Distributions</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/analysis"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive("/analysis") && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium">Analysis</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/comparison"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive("/comparison") && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium">Comparison</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/probability"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive("/probability") && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium">Probability</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/hypothesis"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive("/hypothesis") && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium">Hypothesis</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/confidence"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive("/confidence") && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium">Confidence</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/simulations"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              isActive("/simulations") && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium">Simulations</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
