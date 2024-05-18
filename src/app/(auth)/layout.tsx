import FormLayout from "@/components/form-layout";
import type React from "react";

export default function AuthLayout({
	children,
}: { children: React.ReactNode }) {
	return <FormLayout>{children}</FormLayout>;
}
