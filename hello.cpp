#include <iostream>
#include <string>
using namespace std;

const int MAX_DOCTORS = 3;
const int MAX_APPOINTMENTS = 100;

class Doctor {
public:
    int DoctorId;
    string Name;
    string Department;
};

class Appointment {
public:
    int AppointmentId;
    string PatientName;
    int DoctorId;
    string AppointmentDate;
};

class HospitalSystem {
private:
    Doctor doctors[MAX_DOCTORS];
    Appointment appointments[MAX_APPOINTMENTS];
    int appointmentCount;
    int appointmentIdCounter;

public:
    HospitalSystem() {
        appointmentCount = 0;
        appointmentIdCounter = 1;
        AddDefaultDoctors();
    }

    void AddDefaultDoctors() {
        doctors[0] = {101, "Dr. Asha", "Cardiology"};
        doctors[1] = {102, "Dr. Bharat", "Neurology"};
        doctors[2] = {103, "Dr. Chetna", "Orthopedics"};
    }

    void ViewDoctors() {
        cout << "\nAvailable Doctors:\n";
        for (int i = 0; i < MAX_DOCTORS; i++) {
            cout << "Doctor ID: " << doctors[i].DoctorId
                 << ", Name: " << doctors[i].Name
                 << ", Department: " << doctors[i].Department << endl;
        }
    }

    bool DoctorExists(int id) {
        for (int i = 0; i < MAX_DOCTORS; i++) {
            if (doctors[i].DoctorId == id) return true;
        }
        return false;
    }

    int CountAppointments(int docId, string date) {
        int count = 0;
        for (int i = 0; i < appointmentCount; i++) {
            if (appointments[i].DoctorId == docId && appointments[i].AppointmentDate == date) {
                count++;
            }
        }
        return count;
    }

    void BookAppointment() {
        string name, date;
        int docId;

        cout << "\nEnter Patient Name: ";
        cin.ignore();
        getline(cin, name);

        cout << "Enter Doctor ID: ";
        cin >> docId;

        if (!DoctorExists(docId)) {
            cout << "Error: Doctor not found.\n";
            return;
        }

        cout << "Enter Appointment Date (dd-mm-yyyy): ";
        cin >> date;

        if (CountAppointments(docId, date) >= 5) {
            cout << "Error: Doctor already has 5 appointments on that day.\n";
            return;
        }

        appointments[appointmentCount] = {appointmentIdCounter++, name, docId, date};
        appointmentCount++;

        cout << "Booking Successful!\n";
        cout << "Appointment ID: " << appointmentIdCounter - 1
             << ", Patient: " << name
             << ", Doctor ID: " << docId
             << ", Date: " << date << endl;
    }

    void ViewAppointments() {
        int docId;
        string date;

        cout << "\nEnter Doctor ID: ";
        cin >> docId;

        if (!DoctorExists(docId)) {
            cout << "Error: Doctor not found.\n";
            return;
        }

        cout << "Enter Appointment Date (dd-mm-yyyy): ";
        cin >> date;

        bool found = false;
        cout << "\nAppointments for Doctor ID " << docId << " on " << date << ":\n";
        for (int i = 0; i < appointmentCount; i++) {
            if (appointments[i].DoctorId == docId && appointments[i].AppointmentDate == date) {
                cout << "Appointment ID: " << appointments[i].AppointmentId
                     << ", Patient: " << appointments[i].PatientName << endl;
                found = true;
            }
        }
        if (!found) {
            cout << "No appointments found.\n";
        }
    }

    void Run() {
        int choice;
        do {
            cout << "\n--- Hospital Appointment Management System ---\n";
            cout << "1. View all available doctors\n";
            cout << "2. Book appointment\n";
            cout << "3. View appointments by doctor and date\n";
            cout << "4. Exit\n";
            cout << "Enter your choice: ";
            cin >> choice;

            switch (choice) {
                case 1: ViewDoctors(); break;
                case 2: BookAppointment(); break;
                case 3: ViewAppointments(); break;
                case 4: cout << "Exiting...\n"; break;
                default: cout << "Invalid choice. Try again.\n";
            }
        } while (choice != 4);
    }
};

int main() {
    HospitalSystem hs;
    hs.Run();
    cout<<endl;
    cout<<"23DCS082 Malay Patel";
    return 0;

}
