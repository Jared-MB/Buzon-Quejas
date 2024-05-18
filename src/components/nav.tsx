import { auth, signOut } from "@/auth";
import { getUserByEmail } from "@/db/queries/user.query";
// import { signOut } from "auth-astro/client";
import {
	AlignRight,
	LogIn,
	Menu,
	User,
	UserCircle,
	UserCircleIcon,
	UserPlus,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default async function Nav() {
	const session = await auth();
	let username = "";

	if (session?.user) {
		const user = await getUserByEmail(session.user.email ?? "");
		if (user) {
			username = user.username;
		}
	}

	if (!session) {
		return (
			<>
				<nav className="hidden md:flex flex-row items-center gap-x-4">
					<Link href="/login">Iniciar Sesión</Link>
					<Link
						href="/register"
						className={buttonVariants({
							variant: "default",
						})}
					>
						Registrarse
					</Link>
				</nav>
				<DropdownMenu>
					<DropdownMenuTrigger className="inline-block md:hidden">
						<AlignRight />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							<Link
								className="w-full h-full flex flex-row gap-x-2 items-center text-base"
								href="/login"
							>
								<UserCircle className="text-zinc-700" />
								Iniciar sesión
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link
								className="w-full h-full flex flex-row gap-x-2 items-center text-base"
								href="/register"
							>
								<LogIn className="text-zinc-700" />
								Registrarse
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</>
		);
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarFallback>{username[0]}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{username}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
				// onClick={() => (window.location.href = `/${username}/complaints`)}
				>
					<Link className="w-full h-full" href={`/${username}/complaints`}>
						Mis quejas
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>Perfil</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<form
						action={async () => {
							"use server";
							await signOut({
								redirectTo: "/login",
							});
						}}
					>
						<button type="submit">Cerrar sesión</button>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
