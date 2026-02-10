import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useAuth } from "~/hooks/use-auth";
import { useNavigate } from "react-router";
import { PAGE_TITLES } from "~/config/page-titles";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
	return [{ title: PAGE_TITLES.login }];
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
	return (
		<span className={`material-symbols-outlined ${className}`} style={{ fontSize: "inherit" }}>
			{name}
		</span>
	);
}

export default function LoginPage() {
	const { login, error } = useAuth();

	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [keepLoggedIn, setKeepLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Bypass authentication for demo
			const user = await login(identifier, password);

			navigate("/admin");
		} catch (err) {
			console.error("Login failed:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
			{/* Left Panel - Hero */}
			<div className="hidden lg:flex relative overflow-hidden">
				<img
					src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2670"
					alt="Modern office interior"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				<div className="absolute inset-0 bg-primary/85" />

				<div className="relative z-10 flex flex-col justify-between w-full p-10">
					{/* Logo */}
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white font-bold text-sm">
							<Icon name="school" className="text-xl" />
						</div>
						<span className="text-white font-semibold text-lg tracking-tight">
							ALMA LMS
						</span>
					</div>

					{/* Headline */}
					<div className="max-w-lg space-y-6">
						<h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
							Empowering the next generation of{" "}
							<span className="italic">innovators.</span>
						</h1>
						<p className="text-white/80 text-base leading-relaxed max-w-md">
							Access your courses, collaborate with peers, and track your progress in
							one secure, unified learning environment.
						</p>

						{/* Badges */}
						<div className="flex items-center gap-3 pt-2">
							<span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
								<Icon name="lock" className="text-sm" />
								Secure Access
							</span>
							<span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
								<Icon name="monitoring" className="text-sm" />
								Real-time Analytics
							</span>
						</div>
					</div>

					{/* Footer */}
					<p className="text-white/50 text-sm">
						&copy; {new Date().getFullYear()} ALMA Education Systems. All rights
						reserved.
					</p>
				</div>
			</div>

			{/* Right Panel - Login Form */}
			<div className="flex flex-col min-h-screen lg:min-h-0 bg-white dark:bg-gray-950">
				{/* Need help link */}
				<div className="flex justify-end p-6">
					<a
						href="#"
						className="text-sm font-medium text-primary hover:underline underline-offset-4">
						Need help?
					</a>
				</div>

				{/* Form area */}
				<div className="flex flex-1 items-center justify-center px-6 pb-12">
					<div className="w-full max-w-[400px] space-y-8">
						{/* Header */}
						<div className="space-y-2">
							<h2 className="text-2xl font-bold tracking-tight text-foreground">
								Welcome back
							</h2>
							<p className="text-sm text-muted-foreground">
								Please enter your details to sign in.
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-5">
							{error && (
								<div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-500/10 dark:bg-red-900/20 dark:text-red-400">
									{error}
								</div>
							)}

							{/* Email field */}
							<div className="space-y-2">
								<Label htmlFor="identifier" className="text-sm font-medium">
									Email Address
								</Label>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg leading-none">
										<Icon name="mail" className="text-lg" />
									</span>
									<Input
										id="identifier"
										type="text"
										placeholder="student@1bis.edu"
										value={identifier}
										onChange={(e) => setIdentifier(e.target.value)}
										required
										disabled={isLoading}
										className="pl-10 bg-white dark:bg-gray-950 h-11"
									/>
								</div>
							</div>

							{/* Password field */}
							<div className="space-y-2">
								<Label htmlFor="password" className="text-sm font-medium">
									Password
								</Label>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg leading-none">
										<Icon name="lock" className="text-lg" />
									</span>
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										disabled={isLoading}
										className="pl-10 pr-10 bg-white dark:bg-gray-950 h-11"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-0 top-0 h-11 w-10 text-muted-foreground hover:bg-transparent"
										onClick={() => setShowPassword(!showPassword)}
										disabled={isLoading}>
										<span className="text-lg leading-none">
											<Icon
												name={
													showPassword ? "visibility" : "visibility_off"
												}
												className="text-lg"
											/>
										</span>
										<span className="sr-only">Toggle password visibility</span>
									</Button>
								</div>
							</div>

							{/* Keep logged in + Forgot password */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Checkbox
										id="keep-logged-in"
										checked={keepLoggedIn}
										onCheckedChange={(checked) =>
											setKeepLoggedIn(checked === true)
										}
									/>
									<Label
										htmlFor="keep-logged-in"
										className="text-sm font-normal text-muted-foreground cursor-pointer">
										Keep me logged in
									</Label>
								</div>
								<a
									href="#"
									className="text-sm font-medium text-primary hover:underline underline-offset-4">
									Forgot password?
								</a>
							</div>

							{/* Sign In button */}
							<Button
								type="submit"
								className="w-full h-11"
								disabled={isLoading}
								size="lg">
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Signing in...
									</>
								) : (
									"Sign In"
								)}
							</Button>
						</form>

						{/* Divider */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-border" />
							</div>
							<div className="relative flex justify-center text-xs">
								<span className="bg-white dark:bg-gray-950 px-3 text-muted-foreground">
									Or access via
								</span>
							</div>
						</div>

						{/* SSO Button */}
						<Button
							type="button"
							variant="outline"
							className="w-full h-11 gap-2"
							disabled={isLoading}>
							<span className="text-lg leading-none text-primary">
								<Icon name="passkey" className="text-lg" />
							</span>
							Single Sign-On (SSO)
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
