import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@/components/ui/icon";
import { Link, useParams } from "react-router";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";
import { useGetOrganizationById } from "~/hooks/use-organization";
import { formatDate, getInitials, getOrgColor } from "~/utils/organization-utils";

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
];

export default function OrganizationDetailPage() {
	const params = useParams();
	const orgId = params.id as string;

	const { data: organization, isLoading } = useGetOrganizationById(orgId, {
		fields:
			"id,name,code,description,isDeleted,createdAt,updatedAt,users.id,users.email,users.userName,users.role,users.subRole,users.status,users.person.personalInfo",
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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link to="/superadmin/organizations">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<Avatar className="size-12">
					<AvatarFallback className={`${orgColor} text-white text-sm font-semibold`}>
						{orgInitials}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1">
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-bold tracking-tight text-foreground">
							{organization.name}
						</h1>
						<Badge variant="outline">{organization.code}</Badge>
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
						<p className="text-sm text-muted-foreground mt-1">
							{organization.description}
						</p>
					)}
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
					<CardTitle className="flex items-center gap-2 text-base">
						<Icon name="group" size={20} />
						Users ({users.length})
					</CardTitle>
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
		</div>
	);
}
