import { Component } from "@angular/core";
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { EmpDetailsComponent } from "./emp-details/emp-details.component";
import { EmpListComponent } from "./emp-list/emp-list.component";
import { User } from "../../model/models";

@Component({
    selector: "emp-root",
    standalone: true,
    imports: [RouterOutlet, EmpDetailsComponent, EmpListComponent, RouterModule],
    templateUrl: "./emp.component.html",
})
export class EmpComponent {
    title = "Employee Management System";
    user: User | null = null;

    constructor(private router: Router) {
        this.router.getCurrentNavigation();

        if (!sessionStorage.getItem("user")) {
            this.router.navigate(["/auth/login"]);
        }

        this.user = JSON.parse(sessionStorage.getItem("user") || "{}");
    }

    onLogout() {
        sessionStorage.removeItem("user");
        this.router.navigate(["/auth/login"]);
    }
}
