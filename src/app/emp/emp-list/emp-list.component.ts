import { Component, OnInit, ViewChild } from "@angular/core";
import { Employee } from "../../../model/models";
import { Router } from "@angular/router";
import { Apollo, gql } from "apollo-angular";
import { Actions, EmpEditComponent } from "../emp-edit/emp-edit.component";
import { WatchQueryFetchPolicy } from "@apollo/client";

const EMPLOYEES = gql`
    query employees {
        getAllEmployees {
            _id
            first_name
            last_name
            email
            gender
            salary
        }
    }
`;

const DELETE_EMPLOYEE = gql`
    mutation deleteEmployee($_id: String!) {
        deleteEmployee(_id: $_id)
    }
`;

@Component({
    selector: "app-emp-list",
    standalone: true,
    imports: [EmpEditComponent],
    templateUrl: "./emp-list.component.html",
})
export class EmpListComponent implements OnInit {
    employees: Employee[];
    @ViewChild(EmpEditComponent)
    editDialog: EmpEditComponent | null = null;

    constructor(private router: Router, private apollo: Apollo) {
        this.employees = [];
    }

    ngOnInit() {
        this.fetchEmployees();
    }

    ngAfterViewInit() {
        this.editDialog?.editDialog.nativeElement.addEventListener(
            "close",
            () => {
                console.log("closed");
                this.fetchEmployees(true);
            },
        );
    }

    fetchEmployees(_force?: boolean) {
        this.apollo
            .watchQuery<{ getAllEmployees: Employee[] }>({
                query: EMPLOYEES,
                fetchPolicy: _force ? "network-only" : undefined,
            })
            .result()
            .then((res) => (this.employees = res.data.getAllEmployees));
    }

    editEmployee(id: string | undefined) {
        if (!id) return;

        this.editDialog?.openModal(
            Actions.EDIT,
            this.employees.find((e) => e._id === id),
        );
    }

    addEmployee() {
        this.editDialog?.openModal(Actions.ADD);
    }

    deleteEmployee(id: string | undefined) {
        if (!id) return;

        this.apollo
            .mutate({
                mutation: DELETE_EMPLOYEE,
                variables: { _id: id },
            })
            .subscribe({
                next: () => this.fetchEmployees(true),
                error: (ex) => console.error(ex),
            });
    }
}
