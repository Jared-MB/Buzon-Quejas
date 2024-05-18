"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { InputContainer } from "./ui/input";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

export default function ComplaintFilter() {
	const searchParams = useSearchParams();

	const [filter, setFilter] = useState(searchParams.get("filter") ?? "all");

	const pathname = usePathname();
	const router = useRouter();

	const handleFilterChange = (value: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("filter", value);
		router.replace(`${pathname}?${params.toString()}`);
		setFilter(value);
	};

	return (
		<InputContainer>
			<Label>Filtrar</Label>
			<Select onValueChange={handleFilterChange} defaultValue={filter}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Todas las quejas" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Todas las quejas</SelectItem>
					<SelectItem value="RESOLVED">Resueltas</SelectItem>
					<SelectItem value="IN_PROGRESS">En progreso</SelectItem>
					<SelectItem value="PENDING">Pendientes</SelectItem>
				</SelectContent>
			</Select>
		</InputContainer>
	);
}
