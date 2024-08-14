import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import ProdaptLogo from "./prodapt";
import { cookies } from "next/headers";
import Link from "next/link";

export default function NavbarComponent() {
  const cookieStore = cookies();
  return (
    cookieStore?.get("fullName") && (
      <Navbar fluid rounded>
        <NavbarBrand href={process.env.BASE_URL}>
          <ProdaptLogo className="w-[100px]" />
        </NavbarBrand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar>
                <AvatarImage />
                <AvatarFallback>
                  {cookieStore.get("fullName").value.charAt(0)}
                </AvatarFallback>
              </Avatar>
            }
          >
            <DropdownHeader>
              <span className="block text-sm">
                {cookieStore.get("fullName").value}
              </span>
              <span className="block truncate text-sm font-medium">
                {cookieStore.get("email").value}
              </span>
            </DropdownHeader>
            <DropdownItem as="div">
              <Link href={process.env.BASE_URL + "/profile"}>Profile</Link>
            </DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownDivider />
            <DropdownItem as="div">
              <a href={process.env.BASE_URL + "/logout"}>Sign out</a>
            </DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <Link href={process.env.BASE_URL}>
            <NavbarLink as="div">Home</NavbarLink>
          </Link>
          <Link href={process.env.BASE_URL + "/dashboard"}>
            <NavbarLink as="div">Dashboard</NavbarLink>
          </Link>
          <Link href={process.env.BASE_URL + "/timesheet"}>
            <NavbarLink as="div">Timesheet</NavbarLink>
          </Link>
          <Link href={process.env.BASE_URL + "/foodticket"}>
            <NavbarLink as="div">Food Ticket</NavbarLink>
          </Link>
        </NavbarCollapse>
      </Navbar>
    )
  );
}
