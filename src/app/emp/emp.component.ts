import { Component } from "@angular/core";
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { EmpDetailsComponent } from "./emp-details/emp-details.component";
import { EmpListComponent } from "./emp-list/emp-list.component";
import { User } from "../../model/models";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EmpEditComponent } from "./emp-edit/emp-edit.component"; // Import EmpEditComponent

interface Employee {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    gender: string; // Assuming gender is a string type, you can change it if it's an enum or another type
    salary: number;
}

@Component({
    selector: "emp-root",
    standalone: true,
    imports: [RouterOutlet, EmpDetailsComponent, EmpListComponent, RouterModule, CommonModule, EmpEditComponent], // Import EmpEditComponent
    templateUrl: "./emp.component.html",
})
export class EmpComponent {
    title = "Employee Management System";
    user: User | null = null;
    employees: Employee[] = []; // Define the employees property as an array of Employee interface

    constructor(private router: Router, private http: HttpClient) {
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

    onEdit(employeeId: string) {
        // Fetch employee details
        this.http.get<Employee>(`/api/employees/${employeeId}`).subscribe(
            (employee) => {
                // Display edit form/dialog with employee details
                // Replace `showEditDialog` with the appropriate logic to display the edit form
                console.log('Employee details:', employee);
            },
            (error) => {
                console.error('Error fetching employee details:', error);
            }
        );
    }

    onDelete(employeeId: string) {
        // Confirm deletion with user
        const confirmed = confirm('Are you sure you want to delete this employee?');
        if (!confirmed) {
            return;
        }

        // Send delete request to backend
        this.http.delete(`/api/employees/${employeeId}`).subscribe(
            () => {
                console.log('Employee deleted successfully');
                // Optionally update UI to remove deleted employee
            },
            (error) => {
                console.error('Error deleting employee:', error);
            }
        );
    }
}
    