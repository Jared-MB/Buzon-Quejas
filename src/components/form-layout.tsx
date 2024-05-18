import { Card } from "./ui/card";

export default function FormLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<main className="flex justify-center h-full relative z-0">
			<div className="md:w-2/5 my-16 h-fit">
				<Card>{children}</Card>
			</div>
		</main>
	);
}
