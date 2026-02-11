import { useEffect, useState, type ChangeEvent } from "react";
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
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
	const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
	const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState<string | null>(null);

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

	const handleImageChange = (
		event: ChangeEvent<HTMLInputElement>,
		setter: (file: File | null) => void,
	) => {
		const file = event.target.files?.[0] ?? null;
		setter(file);
	};

	useEffect(() => {
		if (!logoFile) {
			setLogoPreviewUrl(null);
			return;
		}

		const nextUrl = URL.createObjectURL(logoFile);
		setLogoPreviewUrl(nextUrl);

		return () => {
			URL.revokeObjectURL(nextUrl);
		};
	}, [logoFile]);

	useEffect(() => {
		if (!backgroundFile) {
			setBackgroundPreviewUrl(null);
			return;
		}

		const nextUrl = URL.createObjectURL(backgroundFile);
		setBackgroundPreviewUrl(nextUrl);

		return () => {
			URL.revokeObjectURL(nextUrl);
		};
	}, [backgroundFile]);

	const onSubmit = async (values: CreateOrganization) => {
		const payload: CreateOrganization = {
			...values,
			name: values.name.trim(),
			code: values.code.trim(),
			description: values.description?.trim() || undefined,
		};
		const formData = new FormData();
		formData.append("name", payload.name);
		formData.append("code", payload.code);
		formData.append("isDeleted", String(Boolean(payload.isDeleted)));
		if (payload.description) formData.append("description", payload.description);
		if (logoFile) formData.append("logo", logoFile);
		if (backgroundFile) formData.append("background", backgroundFile);

		try {
			await toast.promise(createOrganization.mutateAsync(formData), {
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
		<div className="mx-auto max-w-5xl space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-foreground">
					Create New Organization
				</h1>
				<p className="text-sm text-muted-foreground">
					Onboard a new school or university to the LMS platform.
				</p>
			</div>

			<form id="create-organization-form" onSubmit={handleSubmit(onSubmit)}>
				<Card className="overflow-hidden border-border/60">
					<CardHeader className="pb-4">
						<div className="flex items-center gap-2">
							<Icon name="badge" size={18} className="text-primary" />
							<CardTitle className="text-lg font-semibold">Organization Details</CardTitle>
						</div>
						<CardDescription className="text-sm text-muted-foreground">
							Set the primary organization information.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8 p-6 pt-0">
						<div className="space-y-5">
							<div className="grid gap-1.5">
								<Label htmlFor="name">Organization Name</Label>
								<Input id="name" {...register("name")} placeholder="e.g. Lincoln High School" />
								{errors.name && (
									<p className="text-sm text-destructive">{errors.name.message}</p>
								)}
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="grid gap-1.5">
									<Label htmlFor="code">Organization Code</Label>
									<Input id="code" {...register("code")} placeholder="LHS" />
									{errors.code && (
										<p className="text-sm text-destructive">{errors.code.message}</p>
									)}
								</div>

								<div className="grid gap-1.5">
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
							</div>

							<div className="grid gap-1.5">
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									{...register("description")}
									placeholder="Briefly describe the organization"
									className="min-h-24"
								/>
								{errors.description && (
									<p className="text-sm text-destructive">{errors.description.message}</p>
								)}
							</div>
						</div>

						<div className="-mx-6 border-t border-border/60" />

						<div className="space-y-5">
							<div className="flex items-center gap-2">
								<Icon name="palette" size={18} className="text-primary" />
								<h2 className="text-lg font-semibold text-foreground">
									Branding &amp; Appearance
								</h2>
							</div>

							<div className="grid gap-4 lg:grid-cols-[240px_1fr]">
								<div className="grid gap-2">
									<Label htmlFor="logo">Organization Logo</Label>
									<Input
										id="logo"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={(event) => handleImageChange(event, setLogoFile)}
									/>
									<Label
										htmlFor="logo"
										className="relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center transition-colors hover:bg-muted/50">
										{logoPreviewUrl ? (
											<img
												src={logoPreviewUrl}
												alt="Organization logo preview"
												className="absolute inset-0 h-full w-full object-cover"
											/>
										) : (
											<>
												<Icon name="image" size={28} className="text-primary" />
												<p className="mt-3 text-sm font-semibold text-foreground">
													Click to upload
												</p>
												<p className="text-xs text-muted-foreground">
													SVG, PNG, JPG (max 2MB)
												</p>
											</>
										)}
									</Label>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="background">Hero / Background Image</Label>
									<Input
										id="background"
										type="file"
										accept="image/*"
										className="hidden"
										onChange={(event) => handleImageChange(event, setBackgroundFile)}
									/>
									<Label
										htmlFor="background"
										className="relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center transition-colors hover:bg-muted/50">
										{backgroundPreviewUrl ? (
											<img
												src={backgroundPreviewUrl}
												alt="Organization background preview"
												className="absolute inset-0 h-full w-full object-cover"
											/>
										) : (
											<>
												<Icon name="imagesmode" size={28} className="text-primary" />
												<p className="mt-3 text-sm font-semibold text-foreground">
													Drag and drop or click to upload
												</p>
												<p className="text-xs text-muted-foreground">
													High-resolution JPG or PNG recommended
												</p>
											</>
										)}
									</Label>
								</div>
							</div>
						</div>
					</CardContent>

					<div className="flex items-center justify-end gap-3 border-t border-border/60 bg-muted/20 px-6 py-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate("/superadmin/organizations")}
							disabled={createOrganization.isPending}>
							Cancel
						</Button>
						<Button type="submit" disabled={createOrganization.isPending} className="gap-2">
							<Icon name="check" size={18} />
							{createOrganization.isPending ? "Creating..." : "Create Organization"}
						</Button>
					</div>
				</Card>
			</form>
		</div>
	);
}
