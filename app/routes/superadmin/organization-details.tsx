import { ArrowLeft, AlertCircle, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Link, useParams, useSearchParams } from "react-router";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";
import { useGetOrganizationById } from "~/hooks/use-organization";
import { useCreateUser, useUpdateUser } from "~/hooks/use-user";
import { UpsertAdminForm } from "~/components/forms/upsert-admin-form";
import { formatDate, getInitials, getOrgColor } from "~/utils/organization-utils";
import type { CreateUser, UpdateUser } from "~/zod/user.zod";
import { toast } from "sonner";

type UserRow = {
	id: string;
	name: string;
	email: string;
	role: string;
	subRole: string;
	status: "active" | "inactive" | "suspended" | "archived";
};

function OrganizationDetailSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Skeleton className="h-10 w-10" />
				<Skeleton className="h-8 w-48" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Skeleton className="h-64" />
				<Skeleton className="h-64" />
			</div>
			<Skeleton className="h-96" />
		</div>
	);
}

export default function OrganizationDetailPage() {
	const params = useParams();
	const orgId = params.id as string;
	const [searchParams, setSearchParams] = useSearchParams();
	const action = searchParams.get("action");
	const editUserId = searchParams.get("userId") || "";
	const isModalOpen = action === "create-admin" || action === "edit-admin";
	const createUser = useCreateUser();
	const updateUser = useUpdateUser();

	const handleToggleStatus = async (user: UserRow) => {
		const newStatus = user.status === "active" ? "inactive" : "active";
		const mutationPromise = updateUser.mutateAsync({
			userId: user.id,
			data: { status: newStatus },
		});

		try {
			await toast.promise(mutationPromise, {
				loading: "Updating status...",
				success: () => ({
					message: `User ${newStatus === "active" ? "activated" : "deactivated"}`,
				}),
				error: (mutationError) => ({
					message:
						mutationError instanceof Error
							? mutationError.message
							: "Status Update Failed",
				}),
			});
		} catch (error) {
			console.error(error);
		}
	};

	const userColumns: DataTableColumn<UserRow>[] = [
		{
			key: "name",
			label: "Name",
			className: "pl-6",
			cellClassName: "pl-6",
			render: (_, user) => (
				<p className="text-sm font-medium text-foreground">{user.name}</p>
			),
		},
		{
			key: "email",
			label: "Email",
			render: (_, user) => (
				<p className="text-sm text-muted-foreground">{user.email}</p>
			),
		},
		{
			key: "role",
			label: "Role",
			render: (_, user) => (
				<Badge variant="outline" className="capitalize">
					{user.role}
				</Badge>
			),
		},
		{
			key: "subRole",
			label: "Sub Role",
			render: (_, user) => (
				<span className="text-sm text-muted-foreground capitalize">
					{user.subRole.replace("_", " ")}
				</span>
			),
		},
		{
			key: "status",
			label: "Status",
			className: "text-center",
			cellClassName: "text-center",
			render: (_, user) => (
				<Badge
					className={`text-[11px] ${
						user.status === "active"
							? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
							: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
					}`}>
					{user.status.charAt(0).toUpperCase() + user.status.slice(1)}
				</Badge>
			),
		},
		{
			key: "id",
			label: "Actions",
			className: "text-center",
			cellClassName: "text-center",
			render: (_, user) => (
				<div className="flex items-center justify-center gap-3">
					<Switch
						checked={user.status === "active"}
						onCheckedChange={() => handleToggleStatus(user)}
					/>
					<Button
						variant="ghost"
						size="icon"
						className="size-8"
						onClick={() =>
							setSearchParams({ action: "edit-admin", userId: user.id })
						}
					>
						<Pencil className="size-4" />
					</Button>
				</div>
			),
		},
	];

	const { data: organization, isLoading } = useGetOrganizationById(orgId, {
		fields:
			"id,name,code,description,logo,background,isDeleted,createdAt,updatedAt,users.id,users.email,users.userName,users.role,users.subRole,users.status,users.person.personalInfo",
	});

	if (isLoading) {
		return <OrganizationDetailSkeleton />;
	}

	if (!organization) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
					<h3 className="text-lg font-semibold">Organization not found</h3>
					<p className="text-sm text-muted-foreground">
						The organization you're looking for doesn't exist.
					</p>
				</div>
			</div>
		);
	}

	const users = organization.users ?? [];
	const userRows: UserRow[] = users.map((user) => {
		const personalInfo = user.person?.personalInfo;
		const fullName =
			personalInfo?.firstName && personalInfo?.lastName
				? `${personalInfo.firstName} ${personalInfo.lastName}`
				: user.userName || user.email;

		return {
			id: user.id,
			name: fullName,
			email: user.email,
			role: user.role,
			subRole: user.subRole,
			status: user.status as UserRow["status"],
		};
	});

	const orgColor = getOrgColor(organization.id);
	const orgInitials = getInitials(organization.name);
	const isActive = !organization.isDeleted;

	const handleAdminFormSubmit = async (data: CreateUser | UpdateUser) => {
		const isEdit = action === "edit-admin" && editUserId;
		const mutationPromise = isEdit
			? updateUser.mutateAsync({ userId: editUserId, data })
			: createUser.mutateAsync(data as CreateUser);

		try {
			await toast.promise(mutationPromise, {
				loading: isEdit ? "Updating Admin..." : "Creating Admin...",
				success: () => ({
					message: isEdit ? "Admin Updated" : "Admin Created",
				}),
				error: (mutationError) => ({
					message:
						mutationError instanceof Error
							? mutationError.message
							: isEdit
								? "Admin Update Failed"
								: "Admin Creation Failed",
				}),
			});
			setSearchParams({});
		} catch (error) {
			console.error(error);
		}
	};

	const handleAdminCancel = () => {
		setSearchParams({});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-4">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/superadmin/organizations">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>

				<div className="overflow-hidden rounded-2xl border border-border/60">
					<div
						className="relative min-h-[220px] px-5 pb-6 pt-5 sm:min-h-[250px] sm:px-7 sm:pt-7"
						style={
							organization.background
								? {
										backgroundImage: `linear-gradient(90deg, rgb(15 23 42 / 0.85), rgb(30 64 175 / 0.7)), url(${organization.background})`,
										backgroundSize: "cover",
										backgroundPosition: "center",
									}
								: undefined
						}>
						{!organization.background && (
							<div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-700 to-blue-500" />
						)}

						<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:24px_24px] opacity-35" />

						<div className="relative z-10 flex h-full items-end gap-4 sm:gap-5">
							<div className="rounded-2xl bg-background/95 p-2 shadow-xl backdrop-blur-sm">
								<Avatar className="size-20 rounded-xl sm:size-24">
									<AvatarImage src={organization.logo || undefined} alt={organization.name} />
									<AvatarFallback
										className={`${orgColor} rounded-xl text-2xl font-semibold text-white`}>
										{orgInitials}
									</AvatarFallback>
								</Avatar>
							</div>

							<div className="flex-1 pb-1">
								<div className="flex flex-wrap items-center gap-2.5">
									<h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
										{organization.name}
									</h1>
									<Badge variant="secondary" className="bg-white/15 text-white">
										{organization.code}
									</Badge>
									<Badge
										className={`text-[11px] ${
											isActive
												? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
												: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
										}`}>
										{isActive ? "Active" : "Inactive"}
									</Badge>
								</div>
								{organization.description && (
									<p className="mt-2 max-w-3xl text-sm text-blue-50 sm:text-base">
										{organization.description}
									</p>
								)}
								<p className="mt-1 text-xs text-blue-100 sm:text-sm">
									ID: #{organization.id}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Info Cards */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Organization Information */}
				<Card className="border-border/50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<Icon name="apartment" size={20} />
							Organization Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Name</span>
							<span className="font-medium">{organization.name}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Code</span>
							<span className="font-medium">{organization.code}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Description</span>
							<span className="font-medium">
								{organization.description || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Status</span>
							<Badge
								className={`text-[11px] ${
									isActive
										? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
										: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
								}`}>
								{isActive ? "Active" : "Inactive"}
							</Badge>
						</div>
					</CardContent>
				</Card>

				{/* Overview */}
				<Card className="border-border/50">
					<CardHeader>
						<CardTitle className="text-base">Overview</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-muted p-2">
									<Icon name="group" size={16} className="text-muted-foreground" />
								</div>
								<p className="text-sm font-medium">Users</p>
							</div>
							<div className="text-2xl font-bold">{users.length}</div>
							<p className="text-xs text-muted-foreground">Total members</p>
						</div>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="rounded-full bg-muted p-2">
									<Icon
										name="calendar_today"
										size={16}
										className="text-muted-foreground"
									/>
								</div>
								<p className="text-sm font-medium">Created</p>
							</div>
							<div className="text-2xl font-bold">
								{formatDate(organization.createdAt)}
							</div>
							<p className="text-xs text-muted-foreground">Date created</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Users Table */}
			<Card className="border-border/50">
				<CardHeader>
					<div className="flex justify-between items-center">
						<CardTitle className="flex items-center gap-2 text-base">
							<Icon name="group" size={20} />
							Users ({users.length})
						</CardTitle>
						<Button
							size="sm"
							onClick={() => setSearchParams({ action: "create-admin" })}
						>
							<Plus className="size-4 mr-1" />
							Create Admin
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<DataTable
						columns={userColumns}
						data={userRows}
						variant="organizations"
						className="rounded-none"
					/>
				</CardContent>
			</Card>

			<Dialog
				open={isModalOpen}
				onOpenChange={(open) => {
					if (!open) {
						setSearchParams({});
					}
				}}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{action === "edit-admin" ? "Edit Admin" : "Create Admin"}
						</DialogTitle>
						<DialogDescription>
							{action === "edit-admin"
								? "Update the admin details below."
								: "Enter admin details below."}
						</DialogDescription>
					</DialogHeader>
					<UpsertAdminForm
						onSubmit={handleAdminFormSubmit}
						onCancel={handleAdminCancel}
						userId={editUserId}
						orgId={orgId}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
