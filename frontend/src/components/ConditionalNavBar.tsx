"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/navbar";

export default function ConditionalNavBar() {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith("/admin");

    if (isAdminPage) {
        return null;
    }

    return <NavBar />;
}
