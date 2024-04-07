import { Routes } from "@angular/router";

import { AuthComponent } from "./auth/auth.component";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";

import { EmpComponent } from "./emp/emp.component";
import { EmpListComponent } from "./emp/emp-list/emp-list.component";
import { EmpDetailsComponent } from "./emp/emp-details/emp-details.component";

export const routes: Routes = [
    {
        path: "app",
        component: EmpComponent,
        children: [
            { path: "list", component: EmpListComponent },
            // { path: "edit", redirectTo: "list", pathMatch: "full" },
            { path: "details", component: EmpDetailsComponent, data: { queryParams: true } },
            { path: "", redirectTo: "list", pathMatch: "full" },
        ],
    },
    {
        path: "auth",
        component: AuthComponent,
        children: [
            { path: "login", component: LoginComponent },
            { path: "register", component: RegisterComponent },
            { path: "", redirectTo: "login", pathMatch: "full" },
        ],
    },
    {
        path: "",
        redirectTo: "/auth",
        pathMatch: "full",
    },
];
