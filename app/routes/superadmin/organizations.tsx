import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";
import { TablePagination } from "~/components/molecule/table-pagination";
import { useGetOrganizations } from "~/hooks/use-organization";
import { useApiParams } from "~/hooks/util-hooks/use-api-params";
import type { OrganizationWithRelation } from "~/zod/organization.zod";
import { formatDate, getInitials, getOrgColor } from "~/utils/organization-utils";

const PAGE_LIMIT = 10;

type StatusFilter = "all" | "active" | "inactive";

export default function OrganizationsPage() {
	const navigate = useNavigate();
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

	const { apiParams, searchTerm, handleSearchChange, handlePageChange } = useApiParams({
		limit: PAGE_LIMIT,
		count: true,
		fields: "id,name,code,description,logo,background,createdAt,updatedAt,isDeleted,users",
	});

	const { data, isLoading, isFetching, isError, error } = useGetOrganizations(apiParams);

	const organizations: OrganizationWithRelation[] = data?.organizations ?? [];

	const filteredOrganizations =
		statusFilter === "all"
			? organizations
			: organizations.filter((org) =>
					statusFilter === "active" ? !org.isDeleted : org.isDeleted,
				);

	const totalResults = data?.count ?? data?.pagination?.total ?? organizations.length;
	const totalPages = data?.pagination?.totalPages ?? 1;
	const activeOrgs = organizations.filter((org) => !org.isDeleted).length;
	const inactiveOrgs = organizations.filter((org) => org.isDeleted).length;

	const statCards = [
		{
			label: "TOTAL ORGS",
			value: totalResults.toString(),
			icon: "apartment",
			iconBg: "bg-primary/10 text-primary",
		},
		{
			label: "ACTIVE",
			value: activeOrgs.toString(),
			icon: "check_circle",
			iconBg: "bg-emerald-500/10 text-emerald-600",
		},
		{
			label: "INACTIVE",
			value: inactiveOrgs.toString(),
			icon: "cancel",
			iconBg: "bg-red-500/10 text-red-600",
		},
	];

	const organizationColumns: DataTableColumn<OrganizationWithRelation>[] = [
		{
			key: "name",
			label: "Organization Name",
			className: "pl-6",
			cellClassName: "pl-6",
			render: (_, org) => (
				<div className="flex items-center gap-3">
					<Avatar className="size-10">
						<AvatarImage src={org.logo || undefined} alt={org.name} />
						<AvatarFallback
							className={`${getOrgColor(org.id)} text-white text-xs font-semibold`}>
							{getInitials(org.name)}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="text-sm font-medium text-foreground">{org.name}</p>
						<p className="text-xs text-muted-foreground">ID: #{org.id}</p>
					</div>
				</div>
			),
		},
		{
			key: "code",
			label: "Code",
			render: (_, org) => <p className="text-sm font-medium text-foreground">{org.code}</p>,
		},
		{
			key: "users",
			label: "Users",
			className: "text-center",
			cellClassName: "text-center",
			render: (_, org) => {
				const usersCount = Array.isArray(org.users) ? org.users.length : 0;
				return (
					<p className="text-sm font-medium text-foreground">
						{usersCount.toLocaleString()}
					</p>
				);
			},
		},
		{
			key: "description",
			label: "Description",
			render: (_, org) => (
				<p className="max-w-[320px] truncate text-sm text-muted-foreground">
					{org.description || "-"}
				</p>
			),
		},
		{
			key: "createdAt",
			label: "Created At",
			render: (_, org) => (
				<p className="text-sm text-foreground">{formatDate(org.createdAt)}</p>
			),
		},
		{
			key: "isDeleted",
			label: "Status",
			className: "text-center",
			cellClassName: "text-center",
			render: (_, org) => {
				const status = org.isDeleted ? "inactive" : "active";
				return (
					<div className="flex items-center justify-center gap-2.5">
						<Badge
							className={`text-[11px] ${
								status === "active"
									? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
									: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
							}`}>
							{status.charAt(0).toUpperCase() + status.slice(1)}
						</Badge>
					</div>
				);
			},
		},
		{
			key: "id",
			label: "Actions",
			className: "text-center pr-6",
			cellClassName: "text-center pr-6",
			render: () => (
				<div className="flex items-center justify-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="size-8 text-muted-foreground hover:text-foreground">
						<Icon name="bar_chart" size={20} />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="size-8 text-muted-foreground hover:text-foreground">
						<Icon name="edit" size={20} />
					</Button>
				</div>
			),
		},
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						Organization Management
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage schools, universities, and storage usage.
					</p>
				</div>
				<Button
					size="sm"
					className="gap-2"
					onClick={() => navigate("/superadmin/organizations/new")}>
					<Icon name="add" size={18} />
					Create Organization
				</Button>
			</div>

			{/* Search & Filters */}
			<Card className="border-border/50">
				<CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Icon
							name="search"
							size={18}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							placeholder="Search by name, code, description..."
							className="pl-9 bg-background"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
					</div>
					<div className="flex items-center gap-2">
						<Select
							value={statusFilter}
							onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Status: All" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Status: All</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="outline" size="icon" className="size-10">
							<Icon name="download" size={20} />
						</Button>
						<Button variant="outline" size="icon" className="size-10">
							<Icon name="tune" size={20} />
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Stat Cards */}
			<div className="grid gap-4 sm:grid-cols-3">
				{statCards.map((stat) => (
					<Card key={stat.label} className="border-border/50">
						<CardContent className="flex items-center gap-4 p-5">
							<div className={`rounded-xl p-2.5 ${stat.iconBg}`}>
								<Icon name={stat.icon} size={24} />
							</div>
							<div>
								<p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
									{stat.label}
								</p>
								<p className="text-2xl font-bold tracking-tight text-foreground">
									{stat.value}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Organizations Table */}
			<Card className="border-border/50">
				<CardContent className="p-0">
					{isError && (
						<p className="px-6 py-4 text-sm text-destructive">
							{error instanceof Error
								? error.message
								: "Failed to load organizations."}
						</p>
					)}

					<DataTable
						columns={organizationColumns}
						data={isLoading ? [] : filteredOrganizations}
						variant="organizations"
						className="rounded-none"
						onRowClick={(row) => navigate(`/superadmin/organizations/${row.id}`)}
					/>

					<TablePagination
						currentPage={apiParams.page ?? 1}
						onPageChange={handlePageChange}
						totalItems={totalResults}
						totalPages={totalPages}
						pageSize={PAGE_LIMIT}
						currentPageItemCount={filteredOrganizations.length}
						isLoading={isLoading}
						isUpdating={isFetching}
						loadingText="Loading organizations..."
						displayMode="simple"
						buttonVariant="ghost"
						activeButtonVariant="default"
						summaryClassName="text-xs"
						navButtonClassName="size-8 text-muted-foreground"
						pageButtonClassName="size-8 text-xs"
						inactivePageButtonClassName="text-muted-foreground"
						iconSize={20}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
