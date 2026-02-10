import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
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
import { MOCK_ORGANIZATIONS } from "~/data/mock-admin-data";
import {
	Search,
	Plus,
	Download,
	SlidersHorizontal,
	Building2,
	CheckCircle2,
	HardDrive,
	BarChart3,
	Pencil,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

const TOTAL_ORGS = 124;
const ACTIVE_ORGS = 118;
const TOTAL_STORAGE = "450 TB";

const statCards = [
	{
		label: "TOTAL ORGS",
		value: TOTAL_ORGS.toString(),
		icon: Building2,
		iconBg: "bg-primary/10 text-primary",
	},
	{
		label: "ACTIVE",
		value: ACTIVE_ORGS.toString(),
		icon: CheckCircle2,
		iconBg: "bg-emerald-500/10 text-emerald-600",
	},
	{
		label: "TOTAL STORAGE",
		value: TOTAL_STORAGE,
		icon: HardDrive,
		iconBg: "bg-chart-2/15 text-chart-2",
	},
];

function formatStorage(used: number, total: number, unit: string) {
	if (used >= 1000) {
		return { usedLabel: `${(used / 1000).toFixed(1)} TB`, totalLabel: `of ${total >= 1000 ? `${(total / 1000).toFixed(0)} TB` : `${total} ${unit}`}` };
	}
	return { usedLabel: `${used} ${unit}`, totalLabel: `of ${total >= 1000 ? `${(total / 1000).toFixed(0)} TB` : `${total} ${unit}`}` };
}

function storageColor(used: number, total: number) {
	const pct = (used / total) * 100;
	if (pct >= 80) return "bg-amber-500";
	if (pct >= 50) return "bg-primary";
	return "bg-primary";
}

export default function OrganizationsPage() {
	const [statusFilter, setStatusFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = 12;

	const filteredOrgs =
		statusFilter === "all"
			? MOCK_ORGANIZATIONS
			: MOCK_ORGANIZATIONS.filter((org) => org.status === statusFilter);

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
				<span className="hover:text-foreground cursor-pointer transition-colors">
					Home
				</span>
				<span>/</span>
				<span className="text-foreground font-medium">Organizations</span>
			</nav>

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
				<Button size="sm" className="gap-2">
					<Plus className="size-4" />
					Create Organization
				</Button>
			</div>

			{/* Search & Filters */}
			<Card className="border-border/50">
				<CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search by name, admin..."
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
						<Button variant="outline" size="icon" className="size-10">
							<Download className="size-4" />
						</Button>
						<Button variant="outline" size="icon" className="size-10">
							<SlidersHorizontal className="size-4" />
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
								<stat.icon className="size-5" />
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
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Organization Name
								</TableHead>
								<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Main Admin
								</TableHead>
								<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
									Students
								</TableHead>
								<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Storage Used
								</TableHead>
								<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
									Status
								</TableHead>
								<TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center pr-6">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredOrgs.map((org) => {
								const storage = formatStorage(
									org.storageUsed,
									org.storageTotal,
									org.storageUnit,
								);
								const pct =
									(org.storageUsed / org.storageTotal) * 100;

								return (
									<TableRow
										key={org.id}
										className="hover:bg-muted/30">
										{/* Organization Name */}
										<TableCell className="pl-6">
											<div className="flex items-center gap-3">
												<Avatar className="size-10">
													<AvatarFallback
														className={`${org.color} text-white text-xs font-semibold`}>
														{org.initials}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="text-sm font-medium text-foreground">
														{org.name}
													</p>
													<p className="text-xs text-muted-foreground">
														ID: #{org.id}
													</p>
												</div>
											</div>
										</TableCell>

										{/* Main Admin */}
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="size-8">
													<AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-semibold">
														{org.adminInitials}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="text-sm font-medium text-foreground">
														{org.adminName}
													</p>
													<p className="text-xs text-muted-foreground">
														{org.adminEmail}
													</p>
												</div>
											</div>
										</TableCell>

										{/* Students */}
										<TableCell className="text-center">
											<p className="text-sm font-semibold text-foreground">
												{org.students.toLocaleString()}
											</p>
											<p className="text-[11px] text-muted-foreground">
												Active users
											</p>
										</TableCell>

										{/* Storage Used */}
										<TableCell>
											<div className="min-w-[140px]">
												<div className="flex items-baseline gap-1.5">
													<span className="text-sm font-semibold text-foreground">
														{storage.usedLabel}
													</span>
													<span className="text-[11px] text-muted-foreground">
														{storage.totalLabel}
													</span>
												</div>
												<Progress
													value={pct}
													className={`mt-1.5 h-1.5 bg-muted [&>[data-slot=progress-indicator]]:${storageColor(org.storageUsed, org.storageTotal)}`}
												/>
											</div>
										</TableCell>

										{/* Status */}
										<TableCell className="text-center">
											<div className="flex items-center justify-center gap-2.5">
												<Badge
													className={`text-[11px] ${
														org.status === "active"
															? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
															: org.status ===
																  "pending"
																? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400"
																: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
													}`}>
													{org.status
														.charAt(0)
														.toUpperCase() +
														org.status.slice(1)}
												</Badge>
												<Switch
													checked={org.enabled}
													className="data-[state=checked]:bg-primary"
												/>
											</div>
										</TableCell>

										{/* Actions */}
										<TableCell className="text-center pr-6">
											<div className="flex items-center justify-center gap-1">
												<Button
													variant="ghost"
													size="icon"
													className="size-8 text-muted-foreground hover:text-foreground">
													<BarChart3 className="size-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													className="size-8 text-muted-foreground hover:text-foreground">
													<Pencil className="size-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>

					{/* Pagination */}
					<div className="flex items-center justify-between border-t border-border/50 px-6 py-4">
						<p className="text-xs text-muted-foreground">
							Showing{" "}
							<span className="font-medium text-foreground">
								1
							</span>{" "}
							to{" "}
							<span className="font-medium text-foreground">
								10
							</span>{" "}
							of{" "}
							<span className="font-medium text-foreground">
								{TOTAL_ORGS}
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
								<ChevronLeft className="size-4" />
							</Button>
							{[1, 2, 3].map((page) => (
								<Button
									key={page}
									variant={
										currentPage === page
											? "default"
											: "ghost"
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
								<ChevronRight className="size-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
