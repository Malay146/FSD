#include <iostream>
#include <string>
using namespace std;

const int MAX_DOCTORS = 3;
const int MAX_APPOINTMENTS = 100;

struct Doctor {
    int id;
    string name;
    string department;
};

struct Appointment {
    int id;
    string patientName;
    int doctorId;
    string date;
};

Doctor doctors[MAX_DOCTORS];
Appointment appointments[MAX_APPOINTMENTS];
int appointmentCount = 0;
int appointmentIdCounter = 1;

void addDefaultDoctors() {
    doctors[0] = {101, "Dr. Asha", "Cardiology"};
    doctors[1] = {102, "Dr. Bharat", "Neurology"};
    doctors[2] = {103, "Dr. Chetna", "Orthopedics"};
}

void viewDoctors() {
    cout << "\nAvailable Doctors:\n";
    for (int i = 0; i < MAX_DOCTORS; i++) {
        cout << "Doctor ID: " << doctors[i].id
             << ", Name: " << doctors[i].name
             << ", Department: " << doctors[i].department << endl;
    }
}

bool doctorExists(int id) {
    for (int i = 0; i < MAX_DOCTORS; i++) {
        if (doctors[i].id == id)
            return true;
    }
    return false;
}

int countAppointments(int docId, string date) {
    int count = 0;
    for (int i = 0; i < appointmentCount; i++) {
        if (appointments[i].doctorId == docId && appointments[i].date == date)
            count++;
    }
    return count;
}

void bookAppointment() {
    string name, date;
    int docId;

    cout << "\nEnter Patient Name: ";
    cin.ignore();
    getline(cin, name);

    cout << "Enter Doctor ID: ";
    cin >> docId;

    if (!doctorExists(docId)) {
        cout << "Doctor not found.\n";
        return;
    }

    cout << "Enter Date (dd-mm-yyyy): ";
    cin >> date;

    if (countAppointments(docId, date) >= 5) {
        cout << "Doctor already has 5 appointments on that date.\n";
        return;
    }

    appointments[appointmentCount] = {appointmentIdCounter++, name, docId, date};
    appointmentCount++;

    cout << "Appointment booked successfully!\n";
}

void viewAppointments() {
    int docId;
    string date;

    cout << "\nEnter Doctor ID: ";
    cin >> docId;

    cout << "Enter Date (dd-mm-yyyy): ";
    cin >> date;

    bool found = false;
    for (int i = 0; i < appointmentCount; i++) {
        if (appointments[i].doctorId == docId && appointments[i].date == date) {
            cout << "Appointment ID: " << appointments[i].id
                 << ", Patient Name: " << appointments[i].patientName << endl;
            found = true;
        }
    }

    if (!found) {
        cout << "No appointments found.\n";
    }
}

void menu() {
    int choice;
    do {
        cout << "\n--- Hospital Appointment System ---\n";
        cout << "1. View Doctors\n";
        cout << "2. Book Appointment\n";
        cout << "3. View Appointments\n";
        cout << "4. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        if (choice == 1) viewDoctors();
        else if (choice == 2) bookAppointment();
        else if (choice == 3) viewAppointments();
        else if (choice == 4) cout << "Thank you!\n";
        else cout << "Invalid choice.\n";

    } while (choice != 4);
}

int main() {
    addDefaultDoctors();
    menu();
    return 0;
}
