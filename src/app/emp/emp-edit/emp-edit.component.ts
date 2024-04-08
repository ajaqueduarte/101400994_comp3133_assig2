import { Component, ViewChild, ElementRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Employee, EmployeeInput, Gender } from "../../../model/models";
import { Apollo, gql } from "apollo-angular";
import { CommonModule } from "@angular/common";
import { HttpClient } from '@angular/common/http';


const EMPLOYEE_ADD = gql`
    mutation addEmployee($employee: EmployeeInput!) {
        addEmployee(employee: $employee) {
            _id
        }
    }
`;

const EMPLOYEE_EDIT = gql`
    mutation updateEmployee($_id: String!, $employee: EmployeeInput!) {
        updateEmployee(_id: $_id, employee: $employee) {
            _id
            first_name
            last_name
            email
            gender
            salary
        }
    }
`;

const EMPLOYEE_DELETE = gql`
    mutation deleteEmployee($_id: String!) {
        deleteEmployee(_id: $_id)
    }
`;


export enum Actions {
    ADD = "add",
    EDIT = "edit",
}

@Component({
    selector: "app-emp-edit",
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: "./emp-edit.component.html",
})
export class EmpEditComponent {
    title = "";
    action: Actions | null = null;

    _id?: string = undefined;
    first_name?: string = undefined;
    last_name?: string = undefined;
    email?: string = undefined;
    gender?: Gender = undefined;
    salary?: number = undefined;

    genders = Object.values(Gender);

    @ViewChild("editDialog", { static: false })
    editDialog!: ElementRef<HTMLDialogElement>;
    loading: boolean = false;

    constructor(private apollo: Apollo) {}

    openModal(action: Actions, employeeData?: Employee) {
        this.action = action;
        this.title = action === Actions.ADD ? "Add Employee" : "Edit Employee";

        const emp = employeeData ?? {
            first_name: "",
            last_name: "",
            email: "",
            gender: Gender.male,
            salary: 0,
        };

        this._id = employeeData?._id;
        this.first_name = emp.first_name;
        this.last_name = emp.last_name;
        this.email = emp.email;
        this.gender = emp.gender;
        this.salary = emp.salary;

        this.editDialog.nativeElement.showModal();
    }

    closeModal(e: Event) {
        e.preventDefault();
        this.editDialog.nativeElement.close();
        this.action = null;
        this.cleanData();
    }

    onSubmit(e: Event) {
        e.preventDefault();

        const data: EmployeeInput = {
            first_name: this.first_name as string,
            last_name: this.last_name as string,
            email: this.email as string,
            gender: this.gender as Gender,
            salary: this.salary as number,
        };

        if (this.action === Actions.ADD) this.addEmployee(data);
        else this.editEmployee(this._id as string, data);
    }

    private cleanData() {
        this._id = undefined;
        this.first_name = undefined;
        this.last_name = undefined;
        this.email = undefined;
        this.gender = undefined;
        this.salary = undefined;
    }

    private addEmployee(emp: EmployeeInput) {
        this.loading = true;
        this.apollo
            .mutate<{ addEmployee: { _id: string } }>({
                mutation: EMPLOYEE_ADD,
                variables: {
                    employee: emp,
                },
            })
            .subscribe({
                next: (res) => {
                    this.loading = false;

                    if (res.errors) console.error(res.errors);
                    if (!res.data || !res.data.addEmployee) return;
                    this.closeModal(new Event("close"));
                },
                error: (ex) => {
                    this.loading = false;
                    console.error(ex);
                },
            });
    }

    private editEmployee(_id: string, employee: EmployeeInput) {
        this.loading = true;
        this.apollo
            .mutate<{ updateEmployee: EmployeeInput }>({
                mutation: EMPLOYEE_EDIT,
                variables: {
                    _id,
                    employee,
                },
            })
            .subscribe({
                next: (res) => {
                    this.loading = false;

                    if (res.errors) console.error(res.errors);
                    if (!res.data || !res.data.updateEmployee) return;
                    this.closeModal(new Event("close"));
                },
                error: (ex) => {
                    this.loading = false;
                    console.error(ex);
                },
            });
    }
    onDelete(_id: string) {
        if (!confirm("Are you sure you want to delete this employee?")) {
            return;
        }

        this.loading = true;
        this.apollo
            .mutate<{ deleteEmployee: boolean }>({
                mutation: EMPLOYEE_DELETE,
                variables: {
                    _id,
                },
            })
            .subscribe({
                next: (res) => {
                    this.loading = false;

                    if (res.errors) {
                        console.error(res.errors);
                        return;
                    }

                    if (res.data && res.data.deleteEmployee) {
                        console.log("Employee deleted successfully");
                        // You can add further actions here, like refreshing the employee list.
                    } else {
                        console.error("Failed to delete employee");
                    }
                },
                error: (ex) => {
                    this.loading = false;
                    console.error(ex);
                },
            });
    }
}
