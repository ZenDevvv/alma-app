import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Store, Search } from "lucide-react";
import { DataTable, type DataTableColumn } from "~/components/molecule/data-table-updated";

interface Vendor {
	id: string;
	name: string;
	email: string;
	phone: string;
	productsCount: number;
	status: "active" | "inactive" | "pending";
	joinedDate: string;
}

const MOCK_VENDORS: Vendor[] = [
	{
		id: "v1",
		name: "TechWorld Electronics",
		email: "contact@techworld.com",
		phone: "+1 555-0101",
		productsCount: 45,
		status: "active",
		joinedDate: "2024-01-15",
	},
	{
		id: "v2",
		name: "Office Essentials Co.",
		email: "sales@officeessentials.com",
		phone: "+1 555-0102",
		productsCount: 32,
		status: "active",
		joinedDate: "2024-02-20",
	},
	{
		id: "v3",
		name: "Gadget Hub",
		email: "info@gadgethub.com",
		phone: "+1 555-0103",
		productsCount: 28,
		status: "active",
		joinedDate: "2024-03-10",
	},
	{
		id: "v4",
		name: "Premium Furnishings",
		email: "hello@premiumfurnishings.com",
		phone: "+1 555-0104",
		productsCount: 15,
		status: "pending",
		joinedDate: "2024-06-01",
	},
	{
		id: "v5",
		name: "SmartLife Devices",
		email: "support@smartlife.com",
		phone: "+1 555-0105",
		productsCount: 0,
		status: "inactive",
		joinedDate: "2023-11-25",
	},
];

export default function AdminVendorsPage() {
	const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredVendors = vendors.filter((vendor) =>
		vendor.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const columns: DataTableColumn<Vendor>[] = [
		{
			key: "name",
			label: "Vendor Name",
			sortable: true,
			searchable: true,
			render: (value, row) => (
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
						<Store className="h-5 w-5 text-muted-foreground" />
					</div>
					<div>
						<div className="font-medium">{row.name}</div>
						<div className="text-sm text-muted-foreground">{row.email}</div>
					</div>
				</div>
			),
		},
		{
			key: "phone",
			label: "Phone",
			sortable: true,
		},
		{
			key: "productsCount",
			label: "Products",
			sortable: true,
			render: (value) => <span className="font-medium">{value}</span>,
		},
		{
			key: "status",
			label: "Status",
			sortable: true,
			filterable: true,
			filterOptions: [
				{ label: "Active", value: "active" },
				{ label: "Inactive", value: "inactive" },
				{ label: "Pending", value: "pending" },
			],
			render: (value) => {
				const variants: Record<string, "default" | "secondary" | "outline"> = {
					active: "default",
					inactive: "secondary",
					pending: "outline",
				};
				return (
					<Badge
						variant={variants[value as string] || "secondary"}
						className="capitalize">
						{value}
					</Badge>
				);
			},
		},
		{
			key: "joinedDate",
			label: "Joined",
			sortable: true,
			render: (value) => new Date(value as string).toLocaleDateString(),
		},
		{
			key: "id",
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
							<DropdownMenuItem>View Details</DropdownMenuItem>
							<DropdownMenuItem>Edit Vendor</DropdownMenuItem>
							<DropdownMenuItem>View Products</DropdownMenuItem>
							<DropdownMenuItem className="text-red-600">
								Deactivate Vendor
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
					<p className="text-muted-foreground">
						Manage your vendor partnerships and listings.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search vendors..."
							className="pl-8 w-[200px] lg:w-[280px] bg-white border-input"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Add Vendor
					</Button>
				</div>
			</div>

			<div className="rounded-md border bg-card">
				<DataTable columns={columns} data={filteredVendors} />
			</div>
		</div>
	);
}
