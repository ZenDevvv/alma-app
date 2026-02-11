import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { MOCK_ORG_ADMINS } from "~/data/mock-admin-data";

const TOTAL_ADMINS = 48;

const statCards = [
	{
		label: "TOTAL ADMINS",
		value: TOTAL_ADMINS.toString(),
		icon: "shield_person",
		iconBg: "bg-primary/10 text-primary",
	},
	{
		label: "ACTIVE",
		value: "42",
		icon: "check_circle",
		iconBg: "bg-emerald-500/10 text-emerald-600",
	},
	{
		label: "ORGANIZATIONS",
		value: "124",
		icon: "apartment",
		iconBg: "bg-chart-2/15 text-chart-2",
	},
	{
		label: "PENDING INVITES",
		value: "3",
		icon: "hourglass_top",
		iconBg: "bg-amber-500/10 text-amber-600",
	},
];

function roleBadgeClass(role: string) {
	switch (role) {
		case "owner":
			return "border-primary/30 bg-primary/10 text-primary dark:border-primary/40 dark:bg-primary/20";
		case "admin":
			return "border-chart-2/30 bg-chart-2/10 text-chart-2 dark:border-chart-2/40 dark:bg-chart-2/20";
		case "manager":
			return "border-chart-5/30 bg-chart-5/10 text-chart-5 dark:border-chart-5/40 dark:bg-chart-5/20";
		default:
			return "";
	}
}

function statusBadgeClass(status: string) {
	switch (status) {
		case "active":
			return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400";
		case "inactive":
			return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400";
		case "pending":
			return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400";
		default:
			return "";
	}
}

export default function OrgAdminsPage() {
	const [statusFilter, setStatusFilter] = useState("all");
	const [roleFilter, setRoleFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = 5;

	const filteredAdmins = MOCK_ORG_ADMINS.filter((admin) => {
		const matchesStatus =
			statusFilter === "all" || admin.status === statusFilter;
		const matchesRole = roleFilter === "all" || admin.role === roleFilter;
		return matchesStatus && matchesRole;
	});

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
				<span className="hover:text-foreground cursor-pointer transition-colors">
					Home
				</span>
				<span>/</span>
				<span className="text-foreground font-medium">
					Organization Admins
				</span>
			</nav>

			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						Organization Admins
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage administrators across all organizations.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" className="gap-2">
						<Icon name="download" size={18} />
						Export
					</Button>
					<Button size="sm" className="gap-2">
						<Icon name="person_add" size={18} />
						Add Admin
					</Button>
				</div>
			</div>

			{/* Stat Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{statCards.map((stat) => (
					<Card key={stat.label} className="border-border/50">
						<CardContent className="p-5">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium text-muted-foreground">
									{stat.label}
								</p>
								<div className={`rounded-lg p-2 ${stat.iconBg}`}>
									<Icon name={stat.icon} size={20} />
								</div>
							</div>
							<div className="mt-3">
								<p className="text-3xl font-bold tracking-tight text-foreground">
									{stat.value}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
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
							placeholder="Search by name, email, organization..."
							className="pl-9 bg-background"
						/>
					</div>
					<div className="flex items-center gap-2">
						<Select
							value={statusFilter}
							onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[140px]">
								<SelectValue placeholder="Status: All" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Status: All</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={roleFilter}
							onValueChange={setRoleFilter}>
							<SelectTrigger className="w-[130px]">
								<SelectValue placeholder="Role: All" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Role: All</SelectItem>
								<SelectItem value="owner">Owner</SelectItem>
								<SelectItem value="admin">Admin</SelectItem>
								<SelectItem value="manager">Manager</SelectItem>
							</SelectContent>
						</Select>
						<Button variant="outline" size="icon" className="size-10">
							<Icon name="tune" size={20} />
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Admins Table */}
			<Card className="border-border/50">
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Admin
								</TableHead>
								<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Organization
								</TableHead>
								<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
									Role
								</TableHead>
								<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
									Status
								</TableHead>
								<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
									Last Login
								</TableHead>
								<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
									Added
								</TableHead>
								<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center pr-6">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredAdmins.map((admin) => (
								<TableRow
									key={admin.id}
									className="hover:bg-muted/30">
									{/* Admin */}
									<TableCell className="pl-6">
										<div className="flex items-center gap-3">
											<Avatar className="size-10">
												<AvatarFallback
													className={`${admin.color} text-white text-xs font-semibold`}>
													{admin.initials}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="text-sm font-medium text-foreground">
													{admin.name}
												</p>
												<p className="text-xs text-muted-foreground">
													{admin.email}
												</p>
											</div>
										</div>
									</TableCell>

									{/* Organization */}
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="size-8">
												<AvatarFallback
													className={`${admin.organizationColor} text-white text-[10px] font-semibold`}>
													{admin.organizationInitials}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="text-sm font-medium text-foreground">
													{admin.organizationName}
												</p>
												<p className="text-xs text-muted-foreground">
													{admin.organizationId}
												</p>
											</div>
										</div>
									</TableCell>

									{/* Role */}
									<TableCell className="text-center">
										<Badge
											className={`text-[11px] ${roleBadgeClass(admin.role)}`}>
											{admin.role.charAt(0).toUpperCase() +
												admin.role.slice(1)}
										</Badge>
									</TableCell>

									{/* Status */}
									<TableCell className="text-center">
										<Badge
											className={`text-[11px] ${statusBadgeClass(admin.status)}`}>
											{admin.status.charAt(0).toUpperCase() +
												admin.status.slice(1)}
										</Badge>
									</TableCell>

									{/* Last Login */}
									<TableCell className="text-center">
										<span className="text-sm text-muted-foreground">
											{admin.lastLogin}
										</span>
									</TableCell>

									{/* Added */}
									<TableCell className="text-center">
										<span className="text-xs text-muted-foreground">
											{admin.addedAt}
										</span>
									</TableCell>

									{/* Actions */}
									<TableCell className="text-center pr-6">
										<div className="flex items-center justify-center gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="size-8 text-muted-foreground hover:text-foreground">
												<Icon name="edit" size={20} />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="size-8 text-muted-foreground hover:text-destructive">
												<Icon name="delete" size={20} />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{/* Pagination */}
					<div className="flex items-center justify-between border-t border-border/50 px-6 py-4">
						<p className="text-xs text-muted-foreground">
							Showing{" "}
							<span className="font-medium text-foreground">1</span>{" "}
							to{" "}
							<span className="font-medium text-foreground">
								{filteredAdmins.length}
							</span>{" "}
							of{" "}
							<span className="font-medium text-foreground">
								{TOTAL_ADMINS}
							</span>{" "}
							results
						</p>
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								className="size-8 text-muted-foreground"
								disabled={currentPage === 1}
								onClick={() =>
									setCurrentPage((p) => Math.max(1, p - 1))
								}>
								<Icon name="chevron_left" size={20} />
							</Button>
							{[1, 2, 3].map((page) => (
								<Button
									key={page}
									variant={
										currentPage === page ? "default" : "ghost"
									}
									size="icon"
									className={`size-8 text-xs ${currentPage === page ? "" : "text-muted-foreground"}`}
									onClick={() => setCurrentPage(page)}>
									{page}
								</Button>
							))}
							<span className="px-1 text-xs text-muted-foreground">
								...
							</span>
							<Button
								variant="ghost"
								size="icon"
								className="size-8 text-xs text-muted-foreground"
								onClick={() => setCurrentPage(totalPages)}>
								{totalPages}
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="size-8 text-muted-foreground"
								disabled={currentPage === totalPages}
								onClick={() =>
									setCurrentPage((p) =>
										Math.min(totalPages, p + 1),
									)
								}>
								<Icon name="chevron_right" size={20} />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
