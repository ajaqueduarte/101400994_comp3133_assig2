import { FormsModule } from "@angular/forms";
import { Component } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { User } from "../../../model/models";
import { Router } from "@angular/router";

const LOGIN = gql`
    query login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            _id
            username
            email
            password
        }
    }
`;

@Component({
    selector: "app-login",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./login.component.html",
})
export class LoginComponent {
    username = "";
    password = "";
    loading = false;

    constructor(private apollo: Apollo, private route: Router) {
        // console.log(this.route);
    }

    performLogin() {
        this.loading = true;
        this.apollo
            .watchQuery<{ login?: User }>({
                query: LOGIN,
                fetchPolicy: "network-only",
                variables: {
                    username: this.username,
                    password: this.password,
                },
            })
            .result()
            .then((res) => {
                this.loading = false;
                if (!res.data || !res.data.login) return;

                console.log(res.data.login._id);
                
                sessionStorage.setItem("user", JSON.stringify(res.data.login));
                this.route.navigate(["/app"], {
                    state: { user: res.data.login },
                });
            })
            .catch((ex) => {
                this.loading = false;
                console.error(ex);
            });
    }

    navigateToRegister() {
        this.route.navigate(["/auth/register"]);
    }
}
