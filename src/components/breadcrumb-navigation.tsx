"use client";

import { Routes } from "@/constants/routes";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function BreadcrumbNavigation() {
	const path = usePathname().split("/");

	return (
		<>
			{path[path.length - 1] !== "" && <span>|</span>}
			<Breadcrumb>
				<BreadcrumbList>
					{path.map((item, index) => {
						if (item === "") {
							return null;
						}

						const href = path.slice(0, index + 1).join("/");
						const isLast = index === path.length - 1;

						return (
							<Fragment key={item}>
								<BreadcrumbItem>
									<BreadcrumbLink href={href}>
										{(Routes as any)[item as any] ?? item}
									</BreadcrumbLink>
								</BreadcrumbItem>
								{!isLast && <BreadcrumbSeparator />}
							</Fragment>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
		</>
	);
}
