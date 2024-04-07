import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

@Component({
    selector: "auth-root",
    standalone: true,
    imports: [RouterOutlet, LoginComponent, RegisterComponent],
    templateUrl: "./auth.component.html",
})
export class AuthComponent {
    title = "Authenticate User";
    constructor(private router: Router) {
        if (sessionStorage.getItem("user")) {
            this.router.navigate(["/app"]);
        }
    }
}
