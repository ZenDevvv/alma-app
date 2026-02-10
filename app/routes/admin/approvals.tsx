import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, X } from "lucide-react";
import { MOCK_REQUESTS, type PurchaseRequest } from "~/data/mock-admin-data";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";

export default function AdminApprovals() {
	const [requests, setRequests] = useState<PurchaseRequest[]>(MOCK_REQUESTS);

	const handleStatusUpdate = (id: string, newStatus: "approved" | "rejected") => {
		setRequests(requests.map((req) => (req.id === id ? { ...req, status: newStatus } : req)));
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
			case "rejected":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
			default:
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
		}
	};

	const columns: DataTableColumn<PurchaseRequest>[] = [
		{
			key: "id",
			label: "Request ID",
			sortable: true,
			searchable: true,
			className: "font-medium",
		},
		{
			key: "employeeName",
			label: "Employee",
			sortable: true,
			searchable: true,
			render: (_, row) => (
				<div className="flex flex-col">
					<span className="font-medium text-sm">{row.employeeName}</span>
					<span className="text-xs text-muted-foreground">ID: {row.employeeId}</span>
				</div>
			),
		},
		{
			key: "productName",
			label: "Product",
			sortable: true,
			searchable: true,
		},
		{
			key: "amount",
			label: "Amount",
			sortable: true,
			render: (value) => `$${value.toLocaleString()}`,
		},
		{
			key: "installments",
			label: "Installments",
			sortable: true,
			render: (value) => `${value} months`,
		},
		{
			key: "date",
			label: "Date",
			sortable: true,
		},
		{
			key: "status",
			label: "Status",
			sortable: true,
			filterable: true,
			filterOptions: [
				{ label: "Pending", value: "pending" },
				{ label: "Approved", value: "approved" },
				{ label: "Rejected", value: "rejected" },
			],
			render: (value) => (
				<Badge variant="secondary" className={getStatusColor(value as string)}>
					{value}
				</Badge>
			),
		},
		{
			key: "id", // Using ID for actions column
			label: "Actions",
			className: "text-right",
			render: (_, row) => (
				<div className="text-right">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							{row.status === "pending" && (
								<>
									<DropdownMenuItem
										onClick={() => handleStatusUpdate(row.id, "approved")}>
										<Check className="mr-2 h-4 w-4 text-green-500" />
										Approve
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleStatusUpdate(row.id, "rejected")}>
										<X className="mr-2 h-4 w-4 text-red-500" />
										Reject
									</DropdownMenuItem>
								</>
							)}
							<DropdownMenuItem>View Details</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
					<p className="text-muted-foreground">
						Manage and review employee purchase requests.
					</p>
				</div>
			</div>

			<div className="rounded-md border bg-card">
				<DataTable columns={columns} data={requests} />
			</div>
		</div>
	);
}
