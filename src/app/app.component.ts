import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { RegisterComponent } from "./auth/register/register.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, LoginComponent, RegisterComponent],
    templateUrl: "./app.component.html",
})
export class AppComponent {
    title = "101380203-comp3133-assig2";
    constructor() {
        console.log("AppComponent created");
    }
}
