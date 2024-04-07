import { Component } from "@angular/core";
import { Employee, Gender } from "../../../model/models";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";

const EMPLOYEE_ID = gql`
    query getEmployeeById($_id: String!) {
        getEmployeeById(_id: $_id) {
            _id
            first_name
            last_name
            email
            gender
            salary
        }
    }
`;

@Component({
    selector: "app-emp-details",
    standalone: true,
    imports: [],
    templateUrl: "./emp-details.component.html",
})
export class EmpDetailsComponent {
    employee: Employee | null = null;

    constructor(private router: Router, private apollo: Apollo) {
        const nav = this.router.lastSuccessfulNavigation;
        if (!nav) return;

        const id = nav.extractedUrl.queryParams["_id"];
        this.apollo
            .watchQuery<{ getEmployeeById: Employee }>({
                query: EMPLOYEE_ID,
                variables: {
                    _id: id,
                },
            })
            .result()
            .then((res) => (this.employee = res.data.getEmployeeById));
    }

    backToList() {
        this.router.navigate(["app", "list"]);
    }
}
