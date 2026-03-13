import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, InsertUser } from "@shared/schema";

type AuthContextType = {
    user: User | null | undefined;
    isLoading: boolean;
    error: Error | null;
    loginMutation: ReturnType<typeof useLoginMutation>;
    logoutMutation: ReturnType<typeof useLogoutMutation>;
    registerMutation: ReturnType<typeof useRegisterMutation>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();

    const {
        data: user,
        error,
        isLoading,
    } = useQuery<User | null>({
        queryKey: ["/api/user"],
        queryFn: async () => {
            try {
                const res = await apiRequest("GET", "/api/user");
                if (res.status === 401) return null;
                return await res.json();
            } catch (e) {
                return null; // Return null on error, don't throw
            }
        },
        staleTime: Infinity,
    });

    const loginMutation = useMutation({
        mutationFn: async (credentials: Pick<InsertUser, "username" | "password">) => {
            const res = await apiRequest("POST", "/api/login", credentials);
            if (!res.ok) {
                throw new Error(await res.text() || "Invalid credentials");
            }
            return await res.json();
        },
        onSuccess: (user: User) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({ title: "Welcome back!", description: "Logged in successfully." });
        },
        onError: (error: Error) => {
            toast({
                title: "Login failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (credentials: Pick<InsertUser, "username" | "password">) => {
            const res = await apiRequest("POST", "/api/register", credentials);
            if (!res.ok) {
                throw new Error(await res.text() || "Registration failed");
            }
            return await res.json();
        },
        onSuccess: (user: User) => {
            queryClient.setQueryData(["/api/user"], user);
            toast({ title: "Welcome!", description: "Registered successfully." });
        },
        onError: (error: Error) => {
            toast({
                title: "Registration failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await apiRequest("POST", "/api/logout");
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
            toast({ title: "Logged out", description: "You have been logged out." });
        },
        onError: (error: Error) => {
            toast({
                title: "Logout failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                error,
                loginMutation,
                logoutMutation,
                registerMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// These are exported solely for their return types
function useLoginMutation() {
    return useAuth().loginMutation;
}
function useLogoutMutation() {
    return useAuth().logoutMutation;
}
function useRegisterMutation() {
    return useAuth().registerMutation;
}
