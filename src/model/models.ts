export enum Gender {
    male = "male",
    female = "female",
    other = "other"
}

export interface User {
    _id?: string;
    username: string;
    email: string;
    password: string;
}

export interface Employee {
    _id?: string;
    first_name: string;
    last_name: string;
    email: string;
    gender: Gender;
    salary: number;
}

export interface UserInput {
    username: string;
    email: string;
    password: string;
}

export interface EmployeeInput {
    first_name: string;
    last_name: string;
    email: string;
    gender: Gender;
    salary: number;
}