import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
	MOCK_STATS,
	MOCK_ORGANIZATIONS,
	MOCK_SYSTEM_HEALTH,
} from "~/data/mock-admin-data";
import {
	Building2,
	Users,
	UserCheck,
	HeartPulse,
	Download,
	Plus,
	TrendingUp,
	Minus,
	MoreVertical,
	RefreshCw,
	BarChart3,
} from "lucide-react";

const statCards = [
	{
		title: "Total Organizations",
		value: MOCK_STATS.totalOrganizations.toLocaleString(),
		trend: "+5% this month",
		trendType: "up" as const,
		icon: Building2,
		iconBg: "bg-primary/10 text-primary",
	},
	{
		title: "Total Users",
		value: MOCK_STATS.totalUsers.toLocaleString(),
		trend: "+12% vs last month",
		trendType: "up" as const,
		icon: Users,
		iconBg: "bg-chart-2/15 text-chart-2",
	},
	{
		title: "Active Users (24h)",
		value: MOCK_STATS.activeUsersToday.toLocaleString(),
		trend: "Stable",
		trendType: "neutral" as const,
		icon: UserCheck,
		iconBg: "bg-chart-3/15 text-chart-3",
	},
	{
		title: "System Health",
		value: `${MOCK_STATS.systemHealth}%`,
		trend: "All systems operational",
		trendType: "up" as const,
		icon: HeartPulse,
		iconBg: "bg-emerald-500/10 text-emerald-600",
	},
];

// Simple bar chart data for API response visualization
const apiResponseBars = [40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 65];

export default function AdminDashboard() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						Dashboard Overview
					</h1>
					<p className="text-sm text-muted-foreground">
						Welcome back, here's what's happening in your system today.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" className="gap-2">
						<Download className="size-4" />
						Export Report
					</Button>
					<Button size="sm" className="gap-2">
						<Plus className="size-4" />
						New Organization
					</Button>
				</div>
			</div>

			{/* Stat Cards */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{statCards.map((stat) => (
					<Card key={stat.title} className="border-border/50">
						<CardContent className="p-5">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium text-muted-foreground">
									{stat.title}
								</p>
								<div className={`rounded-lg p-2 ${stat.iconBg}`}>
									<stat.icon className="size-4" />
								</div>
							</div>
							<div className="mt-3">
								<p className="text-3xl font-bold tracking-tight text-foreground">
									{stat.value}
								</p>
								<div className="mt-1 flex items-center gap-1.5">
									{stat.trendType === "up" && (
										<TrendingUp className="size-3.5 text-emerald-600" />
									)}
									{stat.trendType === "neutral" && (
										<Minus className="size-3.5 text-muted-foreground" />
									)}
									<span
										className={`text-xs font-medium ${
											stat.trendType === "up"
												? "text-emerald-600"
												: "text-muted-foreground"
										}`}>
										{stat.trend}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Bottom Section: Organizations + System Health */}
			<div className="grid gap-6 lg:grid-cols-5">
				{/* Recent Organizations */}
				<Card className="border-border/50 lg:col-span-3">
					<CardHeader className="flex flex-row items-center justify-between pb-4">
						<CardTitle className="text-lg font-semibold">
							Recent Organizations
						</CardTitle>
						<Button variant="link" size="sm" className="text-primary">
							View All
						</Button>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						{/* Table Header */}
						<div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 border-b border-border/50 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<span>Organization</span>
							<span className="w-20 text-center">Status</span>
							<span className="w-20 text-center">Students</span>
							<span className="w-20 text-center">Created</span>
							<span className="w-10 text-center">Action</span>
						</div>

						{/* Table Rows */}
						<div className="divide-y divide-border/40">
							{MOCK_ORGANIZATIONS.map((org) => (
								<div
									key={org.id}
									className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 py-4 transition-colors hover:bg-muted/30">
									{/* Org Info */}
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
												{org.domain}
											</p>
										</div>
									</div>

									{/* Status */}
									<div className="w-20 text-center">
										<Badge
											className={`text-[11px] ${
												org.status === "active"
													? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
													: org.status === "pending"
														? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400"
														: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
											}`}>
											{org.status.charAt(0).toUpperCase() +
												org.status.slice(1)}
										</Badge>
									</div>

									{/* Students */}
									<span className="w-20 text-center text-sm text-foreground">
										{org.students.toLocaleString()}
									</span>

									{/* Created */}
									<span className="w-20 text-center text-xs text-muted-foreground">
										{org.createdAt}
									</span>

									{/* Actions */}
									<div className="flex w-10 justify-center">
										<Button
											variant="ghost"
											size="icon"
											className="size-8 text-muted-foreground hover:text-foreground">
											<MoreVertical className="size-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* System Health */}
				<Card className="border-border/50 lg:col-span-2">
					<CardHeader className="flex flex-row items-center justify-between pb-4">
						<CardTitle className="text-lg font-semibold">
							System Health
						</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							className="size-8 text-muted-foreground">
							<RefreshCw className="size-4" />
						</Button>
					</CardHeader>
					<CardContent className="space-y-6 px-6 pb-6">
						{/* Server Uptime */}
						<div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-foreground">
									{MOCK_SYSTEM_HEALTH[0].label}
								</span>
								<span className="text-sm font-bold text-emerald-600">
									{MOCK_SYSTEM_HEALTH[0].value}
									{MOCK_SYSTEM_HEALTH[0].unit}
								</span>
							</div>
							<Progress
								value={MOCK_SYSTEM_HEALTH[0].value}
								className="mt-2 h-2 bg-emerald-100 dark:bg-emerald-950 [&>[data-slot=progress-indicator]]:bg-emerald-500"
							/>
							<p className="mt-1.5 text-xs text-muted-foreground">
								{MOCK_SYSTEM_HEALTH[0].detail}
							</p>
						</div>

						{/* API Response */}
						<div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-foreground">
									{MOCK_SYSTEM_HEALTH[1].label}
								</span>
								<span className="text-sm font-bold text-primary">
									{MOCK_SYSTEM_HEALTH[1].value}
									{MOCK_SYSTEM_HEALTH[1].unit}
								</span>
							</div>
							{/* Mini Bar Chart */}
							<div className="mt-2 flex items-end gap-1 h-16">
								{apiResponseBars.map((height, i) => (
									<div
										key={i}
										className="flex-1 rounded-sm bg-primary/20 transition-colors hover:bg-primary/40"
										style={{ height: `${height}%` }}
									/>
								))}
							</div>
							<p className="mt-1.5 text-xs text-muted-foreground">
								{MOCK_SYSTEM_HEALTH[1].detail}
							</p>
						</div>

						{/* Database Load */}
						<div>
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium text-foreground">
									{MOCK_SYSTEM_HEALTH[2].label}
								</span>
								<span className="text-sm font-bold text-amber-600">
									{MOCK_SYSTEM_HEALTH[2].value}
									{MOCK_SYSTEM_HEALTH[2].unit}
								</span>
							</div>
							<Progress
								value={MOCK_SYSTEM_HEALTH[2].value}
								className="mt-2 h-2 bg-amber-100 dark:bg-amber-950 [&>[data-slot=progress-indicator]]:bg-amber-500"
							/>
						</div>

						{/* View Detailed Metrics Button */}
						<Button
							variant="outline"
							className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/5">
							<BarChart3 className="size-4" />
							View Detailed Metrics
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Footer */}
			<div className="py-4 text-center">
				<p className="text-xs text-muted-foreground">
					&copy; {new Date().getFullYear()} ALMA LMS Platform. All rights
					reserved.
				</p>
			</div>
		</div>
	);
}
