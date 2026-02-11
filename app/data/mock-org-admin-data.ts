export const MOCK_ORG_STATS = {
	totalStudents: 2845,
	totalStudentsTrend: "+12%",
	activeInstructors: 142,
	activeInstructorsTrend: "+4%",
	activeCourses: 315,
	activeCoursesTrend: "~0%",
	completionRate: 87.4,
	completionRateTrend: "~2%",
};

export const MOCK_AT_RISK_STUDENTS = [
	{
		id: "1",
		name: "Michael Scott",
		initials: "MS",
		avatarColor: "bg-violet-600",
		course: "Intro to Management",
		riskFactor: "Grade: 54%",
		riskType: "grade" as const,
	},
	{
		id: "2",
		name: "Dwight Schrute",
		initials: "DS",
		avatarColor: "bg-amber-600",
		course: "Advanced Beets",
		riskFactor: "Attendance: 65%",
		riskType: "attendance" as const,
	},
	{
		id: "3",
		name: "Jim Halpert",
		initials: "JH",
		avatarColor: "bg-blue-600",
		course: "Sales Strategies",
		riskFactor: "Grade: 48%",
		riskType: "grade" as const,
	},
];

export const MOCK_PERFORMANCE_OVERVIEW = [
	{ department: "Science", rate: 85, color: "bg-blue-400" },
	{ department: "Business", rate: 92, color: "bg-blue-600" },
	{ department: "Arts", rate: 70, color: "bg-blue-400" },
	{ department: "Engineering", rate: 88, color: "bg-blue-600" },
	{ department: "Medicine", rate: 78, color: "bg-blue-400" },
];

export const MOCK_EVENTS = [
	{
		id: "1",
		date: "Today, 10:00 AM",
		title: "System Maintenance",
		description:
			"Scheduled downtime for LMS server upgrades. Expected duration: 2...",
		dotColor: "bg-blue-500",
	},
	{
		id: "2",
		date: "Nov 15, 2023",
		title: "End of Term Grading",
		description:
			"Deadline for all instructors to submit final grades for the Fall semester.",
		dotColor: "bg-amber-500",
	},
	{
		id: "3",
		date: "Nov 20, 2023",
		title: "Department Head Meeting",
		description:
			"Quarterly review of curriculum effectiveness in Conference Room A.",
		dotColor: "bg-emerald-500",
	},
];
