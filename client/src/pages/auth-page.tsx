import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";

export default function AuthPage() {
    const { loginMutation, user, isLoading } = useAuth();
    const [, setLocation] = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col justify-center items-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    // Redirect if already logged in
    if (user) {
        setLocation("/admin");
        return null;
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ username, password });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm mb-8 text-center">
                <div className="inline-flex w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-display font-bold text-white tracking-widest">SECURE ACCESS</h1>
            </div>

            <Card className="w-full max-w-sm border-white/10 bg-card/50 backdrop-blur-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-display">Staff Login</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest">
                        Enter your credentials to manage inventory
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-black/50 border-white/10 rounded-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-black/50 border-white/10 rounded-sm"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 rounded-sm uppercase tracking-widest text-xs"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            Access Dashboard
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
