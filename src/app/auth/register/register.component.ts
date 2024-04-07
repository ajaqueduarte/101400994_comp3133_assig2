import { FormsModule } from "@angular/forms";
import { Component } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { User } from "../../../model/models";
import { Router } from "@angular/router";

const REGISTER = gql`
    mutation signup($user: UserInput!) {
        signup(user: $user) {
            _id
            username
            email
            password
        }
    }
`;

@Component({
    selector: "app-register",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./register.component.html",
})
export class RegisterComponent {
    username: string = "";
    email: string = "";
    password: string = "";
    confirmPassword: string = "";
    loading: boolean = false;

    constructor(private apollo: Apollo, private route: Router) {}

    performRegister(e: SubmitEvent) {
        if (
            !this.username ||
            !this.email ||
            !this.password ||
            !this.confirmPassword
        ) {
            alert("Please fill in all fields!");
            return;
        }

        if (this.password !== this.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        this.loading = true;
        this.apollo
            .mutate<{ signup?: User }>({
                mutation: REGISTER,
                variables: {
                    user: {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                    },
                },
            })
            .subscribe({
                next: (res) => {
                    this.loading = false;
                    if (!res.data || !res.data.signup) return;
                    console.log(res.data.signup._id);
                    this.route.navigate(["/auth/login"]);
                },
                error: (ex) => {
                    this.loading = false;
                    console.error(ex);
                },
            });
    }

    navigateToLogin() {
        this.route.navigate(["/auth/login"]);
    }
}
