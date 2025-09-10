
import React from 'react';
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { ExternalLink, Server, RefreshCw } from "lucide-react";

interface ApiNavigationMenuProps {
  onErpClick: () => void;
}

const ApiNavigationMenu: React.FC<ApiNavigationMenuProps> = ({ onErpClick }) => (
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Integration Guides</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {[
              { name: "SAP Integration", icon: Server, description: "Connect GreenTruth with SAP ERP systems" },
              { name: "Microsoft Integration", icon: Server, description: "Connect with Microsoft Azure and Dynamics" },
              { name: "Salesforce Integration", icon: Server, description: "Connect with Salesforce CRM" },
              { name: "Siemens SiGreen", icon: Server, description: "Connect with Siemens SiGreen platform" }
            ].map((item) => (
              <li key={item.name}>
                <NavigationMenuLink asChild>
                  <a
                    href="#"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    onClick={e => { e.preventDefault(); onErpClick(); }}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <div className="text-sm font-medium">{item.name}</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {item.description}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Button variant="link" asChild>
          <a href="#" target="_blank" rel="noreferrer" className="flex items-center">
            API Reference <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onErpClick}
        >
          <RefreshCw className="h-4 w-4" />
          Configure ERP Sync
        </Button>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

export default ApiNavigationMenu;
