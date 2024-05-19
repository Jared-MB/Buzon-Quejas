import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

type Action = (
	_prev: unknown,
	data: FormData,
) => Promise<Record<string, any> | { errors: Record<string, string[]> }>;
type State = Record<string, any> | { errors: Record<string, string[]> };

export default function useDialogForm(
	action: Action,
	initialState: State,
	{
		entityName,
		gender = "male",
	}: {
		entityName: string;
		gender?: "male" | "female";
	},
) {
	const [state, formAction] = useFormState(action, initialState);
	const handleAction = (data: FormData) => {
		const id = toast.loading("Cargando...");
		setId(id);
		formAction(data);
	};

	const [open, setOpen] = useState(false);

	const [id, setId] = useState<string | null | number>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setOpen(false);
		if ("errors" in state && state.errors) {
			const errors = Object.entries(state.errors);
			const typeOfError = typeof state.errors;
			const errorMessage =
				typeOfError === "object"
					? `${errors[0][0]}: ${errors[0][1]}`
					: `Error al agregar ${
							gender === "male" ? "el" : "la"
						} ${entityName.toLowerCase()}`;
			toast.error(errorMessage, { id: id ?? "" });
			return;
		}
		if (id != null) {
			toast.success(
				`${entityName} agregad${gender === "male" ? "o" : "a"} correctamente`,
				{ id: id ?? "" },
			);
		}
		setId(null);
	}, [state]);

	return {
		modal: {
			open,
			setOpen,
		},
		action: handleAction,
	};
}
