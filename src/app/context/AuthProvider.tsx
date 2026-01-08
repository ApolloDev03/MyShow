// "use client";

// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// export type Role = "admin" | "superadmin";

// export type AuthUser = {
//   id?: string;
//   name?: string;
//   email?: string;
//   role?: Role;
//   [key: string]: any;
// };

// type LoginInput = {
//   role: Role;
//   token: string;
//   user?: AuthUser;
// };

// type AuthContextValue = {
//   loading: boolean;
//   token: string | null;
//   role: Role | null;
//   user: AuthUser | null;

//   isAuthenticated: boolean;

//   login: (input: LoginInput) => void;
//   logout: () => void;
//   refresh: () => void;
// };

// const AuthContext = createContext<AuthContextValue | null>(null);

// const KEYS = {
//   adminToken: "adminToken",
//   superToken: "superadminToken",
//   role: "role",
//   user: "user",
// };

// function readStorage() {
//   if (typeof window === "undefined") return { token: null as string | null, role: null as Role | null, user: null as AuthUser | null };

//   const superToken = localStorage.getItem(KEYS.superToken);
//   const adminToken = localStorage.getItem(KEYS.adminToken);

//   const roleRaw = localStorage.getItem(KEYS.role) as Role | null;
//   const role: Role | null = roleRaw || (superToken ? "superadmin" : adminToken ? "admin" : null);

//   const token = role === "superadmin" ? superToken : role === "admin" ? adminToken : (superToken || adminToken);

//   let user: AuthUser | null = null;
//   const raw = localStorage.getItem(KEYS.user);
//   if (raw) {
//     try {
//       user = JSON.parse(raw);
//     } catch {
//       user = null;
//     }
//   }

//   return { token: token ?? null, role, user };
// }

// function writeStorage(input: LoginInput) {
//   try {
//     // clear old
//     localStorage.removeItem(KEYS.adminToken);
//     localStorage.removeItem(KEYS.superToken);

//     if (input.role === "admin") localStorage.setItem(KEYS.adminToken, input.token);
//     if (input.role === "superadmin") localStorage.setItem(KEYS.superToken, input.token);

//     localStorage.setItem(KEYS.role, input.role);

//     if (input.user) localStorage.setItem(KEYS.user, JSON.stringify({ ...input.user, role: input.role }));
//     else localStorage.removeItem(KEYS.user);
//   } catch {}
// }

// function clearStorage() {
//   try {
//     localStorage.removeItem(KEYS.adminToken);
//     localStorage.removeItem(KEYS.superToken);
//     localStorage.removeItem(KEYS.role);
//     localStorage.removeItem(KEYS.user);
//   } catch {}
// }

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState<string | null>(null);
//   const [role, setRole] = useState<Role | null>(null);
//   const [user, setUser] = useState<AuthUser | null>(null);

//   const refresh = () => {
//     const s = readStorage();
//     setToken(s.token);
//     setRole(s.role);
//     setUser(s.user);
//   };

//   const login = (input: LoginInput) => {
//     writeStorage(input);
//     refresh();
//   };

//   const logout = () => {
//     clearStorage();
//     setToken(null);
//     setRole(null);
//     setUser(null);
//   };

//   useEffect(() => {
//     refresh();
//     setLoading(false);
//   }, []);

//   const value = useMemo<AuthContextValue>(
//     () => ({
//       loading,
//       token,
//       role,
//       user,
//       isAuthenticated: !!token,
//       login,
//       logout,
//       refresh,
//     }),
//     [loading, token, role, user]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// }



"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "admin" | "superadmin";

export type AuthUser = {
    id?: string;
    name?: string;
    email?: string;
    role?: Role;
    [key: string]: any;
};

type LoginInput = {
    role: Role;
    token: string;
    user?: AuthUser;
};

type AuthContextValue = {
    loading: boolean;
    token: string | null;
    role: Role | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (input: LoginInput) => void;
    logout: () => void;
    refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const KEYS = {
    adminToken: "adminToken",
    superToken: "superadminToken",
    role: "role",
    user: "user",

    // ✅ legacy keys (your old code)
    adminUser: "adminUser",
    superUser: "superadminUser",
};

function readStorage() {
    if (typeof window === "undefined") {
        return { token: null as string | null, role: null as Role | null, user: null as AuthUser | null };
    }

    const superToken = localStorage.getItem(KEYS.superToken);
    const adminToken = localStorage.getItem(KEYS.adminToken);

    const roleRaw = localStorage.getItem(KEYS.role) as Role | null;
    const role: Role | null = roleRaw || (superToken ? "superadmin" : adminToken ? "admin" : null);

    const token =
        role === "superadmin" ? superToken :
            role === "admin" ? adminToken :
                (superToken || adminToken);

    let user: AuthUser | null = null;

    // ✅ prefer "user", fallback to legacy role-based key
    const raw =
        localStorage.getItem(KEYS.user) ||
        (role === "admin" ? localStorage.getItem(KEYS.adminUser) : null) ||
        (role === "superadmin" ? localStorage.getItem(KEYS.superUser) : null);

    if (raw) {
        try {
            user = JSON.parse(raw);
        } catch {
            user = null;
        }
    }

    return { token: token ?? null, role, user };
}

function writeStorage(input: LoginInput) {
    try {
        // clear old tokens
        localStorage.removeItem(KEYS.adminToken);
        localStorage.removeItem(KEYS.superToken);

        if (input.role === "admin") localStorage.setItem(KEYS.adminToken, input.token);
        if (input.role === "superadmin") localStorage.setItem(KEYS.superToken, input.token);

        localStorage.setItem(KEYS.role, input.role);

        if (input.user) {
            const userData = { ...input.user, role: input.role };
            localStorage.setItem(KEYS.user, JSON.stringify(userData));

            // ✅ legacy compatibility
            if (input.role === "admin") localStorage.setItem(KEYS.adminUser, JSON.stringify(userData));
            if (input.role === "superadmin") localStorage.setItem(KEYS.superUser, JSON.stringify(userData));
        } else {
            localStorage.removeItem(KEYS.user);
            localStorage.removeItem(KEYS.adminUser);
            localStorage.removeItem(KEYS.superUser);
        }
    } catch { }
}

function clearStorage() {
    try {
        localStorage.removeItem(KEYS.adminToken);
        localStorage.removeItem(KEYS.superToken);
        localStorage.removeItem(KEYS.role);
        localStorage.removeItem(KEYS.user);

        // ✅ legacy
        localStorage.removeItem(KEYS.adminUser);
        localStorage.removeItem(KEYS.superUser);
    } catch { }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);

    const refresh = () => {
        const s = readStorage();
        setToken(s.token);
        setRole(s.role);
        setUser(s.user);
    };

    const login = (input: LoginInput) => {
        writeStorage(input);
        refresh();
    };

    const logout = () => {
        clearStorage();
        setToken(null);
        setRole(null);
        setUser(null);
    };

    useEffect(() => {
        refresh();
        setLoading(false);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            loading,
            token,
            role,
            user,
            isAuthenticated: !!token,
            login,
            logout,
            refresh,
        }),
        [loading, token, role, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
