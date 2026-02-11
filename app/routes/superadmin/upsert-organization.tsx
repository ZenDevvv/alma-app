import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/ui/icon";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateOrganization } from "~/hooks/use-organization";
import {
	CreateOrganizationSchema,
	type CreateOrganization,
} from "~/zod/organization.zod";

export default function UpsertOrganizationPage() {
	const navigate = useNavigate();
	const createOrganization = useCreateOrganization();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<CreateOrganization>({
		resolver: zodResolver(CreateOrganizationSchema),
		defaultValues: {
			name: "",
			code: "",
			description: "",
			isDeleted: false,
		},
	});

	const onSubmit = async (values: CreateOrganization) => {
		const payload: CreateOrganization = {
			...values,
			name: values.name.trim(),
			code: values.code.trim(),
			description: values.description?.trim() || undefined,
		};

		try {
			await toast.promise(createOrganization.mutateAsync(payload), {
				loading: "Creating organization...",
				success: () => ({
					message: "Organization Created",
				}),
				error: (mutationError) => ({
					message:
						mutationError instanceof Error
							? mutationError.message
							: "Organization Creation Failed",
				}),
			});

			navigate("/superadmin/organizations");
		} catch (mutationError) {
			console.error(mutationError);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					className="size-9"
					onClick={() => navigate("/superadmin/organizations")}>
					<Icon name="arrow_back" size={20} />
				</Button>
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						Create Organization
					</h1>
					<p className="text-sm text-muted-foreground">
						Fill in the details below to create a new organization.
					</p>
				</div>
			</div>

			{/* Form Card */}
			<Card className="border-border/50 max-w-3xl mx-auto">
				<CardHeader>
					<CardTitle>Organization Details</CardTitle>
					<CardDescription>
						Enter the organization name, code, and description.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid gap-1">
							<Label htmlFor="name">Organization Name</Label>
							<Input id="name" {...register("name")} placeholder="Acme University" />
							{errors.name && (
								<p className="text-sm text-destructive">{errors.name.message}</p>
							)}
						</div>

						<div className="grid gap-1">
							<Label htmlFor="code">Code</Label>
							<Input id="code" {...register("code")} placeholder="ACME" />
							{errors.code && (
								<p className="text-sm text-destructive">{errors.code.message}</p>
							)}
						</div>

						<div className="grid gap-1">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								{...register("description")}
								placeholder="Add a short description"
							/>
							{errors.description && (
								<p className="text-sm text-destructive">{errors.description.message}</p>
							)}
						</div>

						<div className="grid gap-1">
							<Label htmlFor="status">Status</Label>
							<Controller
								control={control}
								name="isDeleted"
								render={({ field }) => (
									<Select
										value={field.value ? "inactive" : "active"}
										onValueChange={(value) => field.onChange(value === "inactive")}>
										<SelectTrigger id="status">
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="active">Active</SelectItem>
											<SelectItem value="inactive">Inactive</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.isDeleted && (
								<p className="text-sm text-destructive">{errors.isDeleted.message}</p>
							)}
						</div>

						<div className="flex justify-end gap-2 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/superadmin/organizations")}
								disabled={createOrganization.isPending}>
								Cancel
							</Button>
							<Button type="submit" disabled={createOrganization.isPending}>
								{createOrganization.isPending ? "Creating..." : "Create Organization"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
