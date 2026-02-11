import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { toast } from "sonner";
import { UpsertOrgForm } from "~/components/forms/upsert-org-form";
import { useCreateOrganization } from "~/hooks/use-organization";
import type { CreateOrganization } from "~/zod/organization.zod";

export default function UpsertOrganizationPage() {
	const navigate = useNavigate();
	const createOrganization = useCreateOrganization();

	const handleSubmit = async (formData: CreateOrganization) => {
		const mutationPromise = createOrganization.mutateAsync(formData);

		try {
			await toast.promise(mutationPromise, {
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
			<Card className="border-border/50 max-w-2xl">
				<CardHeader>
					<CardTitle>Organization Details</CardTitle>
					<CardDescription>
						Enter the organization name, code, and description.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<UpsertOrgForm
						onSubmit={handleSubmit}
						onCancel={() => navigate("/superadmin/organizations")}
						isSubmitting={createOrganization.isPending}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
