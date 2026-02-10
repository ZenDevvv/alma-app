export type Employee = {
	id: string;
	name: string;
	email: string;
	department: string;
	status: "active" | "inactive" | "on_leave";
	creditLimit: number;
	usedAmount: number;
	joinDate: string;
};

export type PurchaseRequest = {
	id: string;
	employeeId: string;
	employeeName: string;
	productName: string;
	amount: number;
	status: "pending" | "approved" | "rejected";
	date: string;
	installments: number;
};

export type DashboardStats = {
	totalOutstanding: number;
	activeUsers: number;
	monthlyVolume: number;
	pendingApprovals: number;
};

export const MOCK_EMPLOYEES: Employee[] = [
	{
		id: "EMP-001",
		name: "Alice Johnson",
		email: "alice.j@example.com",
		department: "Engineering",
		status: "active",
		creditLimit: 5000,
		usedAmount: 1200,
		joinDate: "2023-01-15",
	},
	{
		id: "EMP-002",
		name: "Bob Smith",
		email: "bob.s@example.com",
		department: "Marketing",
		status: "active",
		creditLimit: 3000,
		usedAmount: 2800,
		joinDate: "2023-03-10",
	},
	{
		id: "EMP-003",
		name: "Charlie Brown",
		email: "charlie.b@example.com",
		department: "Sales",
		status: "on_leave",
		creditLimit: 4000,
		usedAmount: 0,
		joinDate: "2022-11-05",
	},
	{
		id: "EMP-004",
		name: "Diana Prince",
		email: "diana.p@example.com",
		department: "Engineering",
		status: "active",
		creditLimit: 6000,
		usedAmount: 4500,
		joinDate: "2021-06-20",
	},
	{
		id: "EMP-005",
		name: "Evan Wright",
		email: "evan.w@example.com",
		department: "HR",
		status: "inactive",
		creditLimit: 2000,
		usedAmount: 500,
		joinDate: "2024-01-02",
	},
];

export const MOCK_REQUESTS: PurchaseRequest[] = [
	{
		id: "REQ-1001",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "MacBook Pro M3",
		amount: 2499,
		status: "pending",
		date: "2024-03-15",
		installments: 12,
	},
	{
		id: "REQ-1002",
		employeeId: "EMP-002",
		employeeName: "Bob Smith",
		productName: "iPhone 15 Pro",
		amount: 1199,
		status: "approved",
		date: "2024-03-14",
		installments: 6,
	},
	{
		id: "REQ-1003",
		employeeId: "EMP-004",
		employeeName: "Diana Prince",
		productName: "Dell UltraSharp Monitor",
		amount: 800,
		status: "rejected",
		date: "2024-03-10",
		installments: 3,
	},
	{
		id: "REQ-1004",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "Standing Desk",
		amount: 650,
		status: "pending",
		date: "2024-03-16",
		installments: 6,
	},{
		id: "REQ-1001",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "MacBook Pro M3",
		amount: 2499,
		status: "pending",
		date: "2024-03-15",
		installments: 12,
	},
	{
		id: "REQ-1002",
		employeeId: "EMP-002",
		employeeName: "Bob Smith",
		productName: "iPhone 15 Pro",
		amount: 1199,
		status: "approved",
		date: "2024-03-14",
		installments: 6,
	},
	{
		id: "REQ-1003",
		employeeId: "EMP-004",
		employeeName: "Diana Prince",
		productName: "Dell UltraSharp Monitor",
		amount: 800,
		status: "rejected",
		date: "2024-03-10",
		installments: 3,
	},
	{
		id: "REQ-1004",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "Standing Desk",
		amount: 650,
		status: "pending",
		date: "2024-03-16",
		installments: 6,
	},{
		id: "REQ-1001",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "MacBook Pro M3",
		amount: 2499,
		status: "pending",
		date: "2024-03-15",
		installments: 12,
	},
	{
		id: "REQ-1002",
		employeeId: "EMP-002",
		employeeName: "Bob Smith",
		productName: "iPhone 15 Pro",
		amount: 1199,
		status: "approved",
		date: "2024-03-14",
		installments: 6,
	},
	{
		id: "REQ-1003",
		employeeId: "EMP-004",
		employeeName: "Diana Prince",
		productName: "Dell UltraSharp Monitor",
		amount: 800,
		status: "rejected",
		date: "2024-03-10",
		installments: 3,
	},
	{
		id: "REQ-1004",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "Standing Desk",
		amount: 650,
		status: "pending",
		date: "2024-03-16",
		installments: 6,
	},{
		id: "REQ-1001",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "MacBook Pro M3",
		amount: 2499,
		status: "pending",
		date: "2024-03-15",
		installments: 12,
	},
	{
		id: "REQ-1002",
		employeeId: "EMP-002",
		employeeName: "Bob Smith",
		productName: "iPhone 15 Pro",
		amount: 1199,
		status: "approved",
		date: "2024-03-14",
		installments: 6,
	},
	{
		id: "REQ-1003",
		employeeId: "EMP-004",
		employeeName: "Diana Prince",
		productName: "Dell UltraSharp Monitor",
		amount: 800,
		status: "rejected",
		date: "2024-03-10",
		installments: 3,
	},
	{
		id: "REQ-1004",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "Standing Desk",
		amount: 650,
		status: "pending",
		date: "2024-03-16",
		installments: 6,
	},{
		id: "REQ-1001",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "MacBook Pro M3",
		amount: 2499,
		status: "pending",
		date: "2024-03-15",
		installments: 12,
	},
	{
		id: "REQ-1002",
		employeeId: "EMP-002",
		employeeName: "Bob Smith",
		productName: "iPhone 15 Pro",
		amount: 1199,
		status: "approved",
		date: "2024-03-14",
		installments: 6,
	},
	{
		id: "REQ-1003",
		employeeId: "EMP-004",
		employeeName: "Diana Prince",
		productName: "Dell UltraSharp Monitor",
		amount: 800,
		status: "rejected",
		date: "2024-03-10",
		installments: 3,
	},
	{
		id: "REQ-1004",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "Standing Desk",
		amount: 650,
		status: "pending",
		date: "2024-03-16",
		installments: 6,
	},{
		id: "REQ-1001",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "MacBook Pro M3",
		amount: 2499,
		status: "pending",
		date: "2024-03-15",
		installments: 12,
	},
	{
		id: "REQ-1002",
		employeeId: "EMP-002",
		employeeName: "Bob Smith",
		productName: "iPhone 15 Pro",
		amount: 1199,
		status: "approved",
		date: "2024-03-14",
		installments: 6,
	},
	{
		id: "REQ-1003",
		employeeId: "EMP-004",
		employeeName: "Diana Prince",
		productName: "Dell UltraSharp Monitor",
		amount: 800,
		status: "rejected",
		date: "2024-03-10",
		installments: 3,
	},
	{
		id: "REQ-1004",
		employeeId: "EMP-001",
		employeeName: "Alice Johnson",
		productName: "Standing Desk",
		amount: 650,
		status: "pending",
		date: "2024-03-16",
		installments: 6,
	},
];

export const MOCK_STATS: DashboardStats = {
	totalOutstanding: 125000,
	activeUsers: 142,
	monthlyVolume: 45000,
	pendingApprovals: 5,
};

export type Product = {
	id: string;
	name: string;
	category: string;
	price: number;
	vendor: string;
	status: "active" | "draft" | "archived";
	stock: number;
	image?: string;
};

export const MOCK_PRODUCTS: Product[] = [
	{
		id: "PROD-001",
		name: "MacBook Pro M3",
		category: "Electronics",
		price: 2499.0,
		vendor: "Tech Supply Co.",
		status: "active",
		stock: 45,
		image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
	},
	{
		id: "PROD-002",
		name: "Ergonomic Office Chair",
		category: "Furniture",
		price: 599.0,
		vendor: "Home Comforts",
		status: "active",
		stock: 12,
		image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
	},
	{
		id: "PROD-003",
		name: "iPhone 15 Pro",
		category: "Electronics",
		price: 1199.0,
		vendor: "Tech Supply Co.",
		status: "active",
		stock: 8,
		image: "https://images.unsplash.com/photo-1696426718956-8219488a0715?q=80&w=1000&auto=format&fit=crop",
	},
	{
		id: "PROD-004",
		name: "Wireless Noise Cancelling Headphones",
		category: "Electronics",
		price: 349.0,
		vendor: "Audio Experts",
		status: "draft",
		stock: 0,
		image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
	},
];
