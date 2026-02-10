import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Hexagon } from "lucide-react";
import { useAuth } from "~/hooks/use-auth";
import { useNavigate } from "react-router";
import { PAGE_TITLES } from "~/config/page-titles";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
	return [{ title: PAGE_TITLES.login }];
}

export default function LoginPage() {
	const { login, error } = useAuth();

	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Bypass authentication for demo
			// const user = await login(identifier, password);

			// Simulate a small delay for better UX
			await new Promise((resolve) => setTimeout(resolve, 800));
			navigate("/admin");
		} catch (err) {
			console.error("Login failed:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-[800px]">
			<div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
				<div className="mx-auto grid w-full max-w-[400px] gap-6">
					<div className="grid gap-2 text-center pb-4">
						<div className="flex justify-center mb-4">
							<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
								<Hexagon className="h-10 w-10" />
							</div>
						</div>
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
							Welcome back!
						</h1>
						<p className="text-balance text-muted-foreground dark:text-gray-400">
							Enter your credentials to access the portal
						</p>
					</div>

					<form onSubmit={handleSubmit} className="grid gap-4">
						{error && (
							<div className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/10 dark:bg-red-900/20 dark:text-red-400 text-center">
								{error}
							</div>
						)}

						<div className="grid gap-2">
							<Label htmlFor="identifier">Email</Label>
							<Input
								id="identifier"
								type="text"
								placeholder="name@example.com"
								value={identifier}
								onChange={(e) => setIdentifier(e.target.value)}
								required
								disabled={isLoading}
								className="bg-white dark:bg-gray-950"
							/>
						</div>

						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<a
									href="#"
									className="text-sm font-medium text-primary hover:underline underline-offset-4">
									Forgot password?
								</a>
							</div>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									disabled={isLoading}
									className="bg-white dark:bg-gray-950 pr-10"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}
									disabled={isLoading}>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
									<span className="sr-only">Toggle password visibility</span>
								</Button>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full mt-2"
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

					<div className="text-center text-sm text-muted-foreground mt-4">
						Don&apos;t have an account?{" "}
						<a
							href="#"
							className="font-medium text-primary hover:underline underline-offset-4">
							Contact support
						</a>
					</div>
				</div>
			</div>

			<div className="hidden lg:block relative bg-muted">
				<img
					src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2670"
					alt="Login Background"
					className="h-full w-full object-cover dark:brightness-[0.4] dark:grayscale-[0.3]"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-16 text-white">
					<div className="max-w-md space-y-4">
						<blockquote className="space-y-2">
							<p className="text-lg font-medium leading-relaxed">
								&ldquo;This portal has revolutionized how we manage our employee
								purchases. Streamlined, efficient, and beautifully designed.&rdquo;
							</p>
							<footer className="text-sm text-gray-300">Admin Team, Tech Corp</footer>
						</blockquote>
					</div>
				</div>
			</div>
		</div>
	);
}
