import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search, Download, Plus } from "lucide-react";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";
import { TablePagination } from "~/components/molecule/table-pagination";
import {
	MOCK_COURSES,
	MOCK_COURSE_CATEGORIES,
	type MockCourse,
	type CourseStatus,
} from "~/data/mock-org-admin-data";

const PAGE_SIZE = 5;

const statusBadge: Record<CourseStatus, string> = {
	Active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
	Archived:
		"border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
	Draft: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
};

export default function OrgAdminCourses() {
	const [searchQuery, setSearchQuery] = useState("");
	const [levelFilter, setLevelFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);

	const filteredCourses = useMemo(() => {
		return MOCK_COURSES.filter((course) => {
			const matchesSearch =
				!searchQuery ||
				course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.description.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesLevel = levelFilter === "all" || course.level === levelFilter;
			const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
			const matchesStatus = statusFilter === "all" || course.status === statusFilter;

			return matchesSearch && matchesLevel && matchesCategory && matchesStatus;
		});
	}, [searchQuery, levelFilter, categoryFilter, statusFilter]);

	const totalResults = filteredCourses.length;
	const paginatedCourses = filteredCourses.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	const hasActiveFilters =
		searchQuery || levelFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all";

	const resetFilters = () => {
		setSearchQuery("");
		setLevelFilter("all");
		setCategoryFilter("all");
		setStatusFilter("all");
		setCurrentPage(1);
	};

	const courseColumns = useMemo<DataTableColumn<MockCourse>[]>(
		() => [
			{
				key: "code",
				label: "Code",
				className: "pl-6 w-24",
				cellClassName: "pl-6 py-4",
				render: (_, course) => (
					<span className="text-sm text-muted-foreground">{course.code}</span>
				),
			},
			{
				key: "name",
				label: "Course Name",
				cellClassName: "py-4",
				render: (_, course) => (
					<div>
						<p className="text-sm font-medium text-primary hover:underline cursor-pointer">
							{course.name}
						</p>
						<p className="text-xs text-muted-foreground mt-0.5">{course.description}</p>
					</div>
				),
			},
			{
				key: "category",
				label: "Category",
				cellClassName: "py-4",
				render: (_, course) => (
					<span className="text-sm text-foreground">{course.category}</span>
				),
			},
			{
				key: "level",
				label: "Level",
				cellClassName: "py-4",
				render: (_, course) => (
					<span className="text-sm text-foreground">{course.level}</span>
				),
			},
			{
				key: "hasPrereqs",
				label: "Prereqs",
				className: "text-center",
				cellClassName: "py-4 text-center",
				render: (_, course) => (
					<div className="flex flex-col items-center gap-1">
						<Switch checked={course.hasPrereqs} className="pointer-events-none" />
						{course.hasPrereqs && course.prereqLabel && (
							<span className="text-[10px] font-semibold text-primary">
								{course.prereqLabel}
							</span>
						)}
					</div>
				),
			},
			{
				key: "lastUpdated",
				label: "Last Updated",
				cellClassName: "py-4",
				render: (_, course) => (
					<div>
						<p className="text-sm text-foreground">{course.lastUpdated}</p>
						<p className="text-xs text-muted-foreground">by {course.updatedBy}</p>
					</div>
				),
			},
			{
				key: "status",
				label: "Status",
				className: "text-center",
				cellClassName: "py-4 text-center",
				render: (_, course) => (
					<Badge className={`text-[11px] ${statusBadge[course.status]}`}>
						{course.status}
					</Badge>
				),
			},
		],
		[],
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-foreground">
						Course Catalog
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage academic structures, prerequisites, and course offerings.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" className="gap-2">
						<Download className="size-4" />
						Export CSV
					</Button>
					<Button size="sm" className="gap-2">
						<Plus className="size-4" />
						Create Course
					</Button>
				</div>
			</div>

			{/* Filters */}
			<Card className="border-border/50">
				<CardContent className="p-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="relative flex-1 max-w-xs">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
							<Input
								placeholder="Search by name, code or keyword..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setCurrentPage(1);
								}}
								className="pl-9 h-9"
							/>
						</div>
						<Select
							value={levelFilter}
							onValueChange={(val) => {
								setLevelFilter(val);
								setCurrentPage(1);
							}}>
							<SelectTrigger className="w-36 h-9">
								<SelectValue placeholder="All Levels" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Levels</SelectItem>
								<SelectItem value="Undergraduate">Undergraduate</SelectItem>
								<SelectItem value="Graduate">Graduate</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={categoryFilter}
							onValueChange={(val) => {
								setCategoryFilter(val);
								setCurrentPage(1);
							}}>
							<SelectTrigger className="w-40 h-9">
								<SelectValue placeholder="All Categories" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								{MOCK_COURSE_CATEGORIES.map((cat) => (
									<SelectItem key={cat} value={cat}>
										{cat}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={statusFilter}
							onValueChange={(val) => {
								setStatusFilter(val);
								setCurrentPage(1);
							}}>
							<SelectTrigger className="w-36 h-9">
								<SelectValue placeholder="All Statuses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="Active">Active</SelectItem>
								<SelectItem value="Archived">Archived</SelectItem>
								<SelectItem value="Draft">Draft</SelectItem>
							</SelectContent>
						</Select>
						{hasActiveFilters && (
							<Button
								variant="link"
								size="sm"
								className="text-primary shrink-0"
								onClick={resetFilters}>
								Reset Filters
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Table */}
			<Card className="border-border/50">
				<CardContent className="p-0">
					<DataTable
						columns={courseColumns}
						data={paginatedCourses}
						variant="organizations"
						className="rounded-none"
					/>

					{/* Pagination */}
					{totalResults > 0 && (
						<TablePagination
							currentPage={currentPage}
							onPageChange={setCurrentPage}
							totalItems={totalResults}
							pageSize={PAGE_SIZE}
							currentPageItemCount={paginatedCourses.length}
							buttonVariant="outline"
							activeButtonVariant="default"
							summaryClassName="text-sm"
							navButtonClassName="size-8"
							pageButtonClassName="size-8 text-xs"
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
