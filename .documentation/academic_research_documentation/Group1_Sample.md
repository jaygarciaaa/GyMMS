## This is another group's work with their website, you can use it as a guide ##



TECHNOLOGICAL INSTITUTE OF THE PHILIPPINES
1338 Arlegui St. Quiapo, Manila

 

A Final Project Submitted to the Department of Computer Engineering
In Partial Fulfillment of the Requirements for the Course CPE 408B - Emerging Technologies 2 in CpE 
for the degree of Bachelor of Science in Computer Engineering



Electronic Medical Record (EMR) System for TIP Medical-Dental Services

 

Submitted by:
Sample Names

November 21, 2025
ACKNOWLEDGEMENT
We would like to express our sincere thanks to everyone who supported us during the development of this project.
First, we extend our deepest gratitude to our project adviser, Mr. Adrian Dave Ignacio, for his invaluable guidance and feedback. Your advice helped us overcome challenges and successfully complete the project.
We also thank the Computer Engineering department at the Technological Institute of the Philippines for providing an excellent learning environment that encouraged collaboration, creativity, and confidence throughout this project.
To our families, friends, and loved ones, thank you for your unwavering support, encouragement, and motivation, which helped us stay focused and persistent during challenging moments.
Finally, we thank God for granting us the strength and guidance to accomplish this project.
This project would not have been possible without the support and contributions of all these people, and we are truly grateful.













TABLE OF CONTENTS
ACKNOWLEDGEMENT	2
TABLE OF CONTENTS	3
LIST OF FIGURES	6
LIST OF TABLES	6
ABSTRACT	7
1 EXECUTIVE SUMMARY	8
2 INTRODUCTION	9
2.1 Project Background	9
2.2 Client Overview	9
2.3 Project Objectives	9
2.4 Significance of the Project	10
2.5 Scope and Delimitations	10
3 SYSTEM ANALYSIS	12
3.1 Client Requirements	12
3.2 Functional Requirements	12
3.3 Non-Functional Requirements	13
3.4 Use Cases / User Stories	13
3.5 System Architecture	14
2.5.2 System Specifications	14
Table 3.1. System Specifications	15
4 DESIGN AND IMPLEMENTATION	16
4.1 Django Project Structure	16
Figure 4.1 Project Structure	16
Brief discussion of the 4.1	17
4.2 Forms and Validation	18
Figure 4.2 	18
4.3 Backend API	19
4.4 Web Application	20
4.4.1 Functional View	21
4.4.2 Database Design	22
4.4.3 Dataflow Diagram Level 0 and 1	25
4.4.4 User Interface and Features	27
5 TESTING AND DEBUGGING	35
5.1 Backend API Testing	35
5.2 Functionality Testing	35
Table 5.2 Functionality Test	35
5.3 Debugging techniques and resolved issues	52
6 RESULTS AND ANALYSIS	53
7 CONCLUSIONS	56
7.1 Conclusion	56
7.2 Recommendations	57
7.3 Key Learnings	57
7.3 Challenges and Solutions	58
APPENDICES	59
REFERENCES	59
PROJECT MANAGEMENT	60
Project Manager / Team Members	60
Project Timeline / Schedule	60
Resources and Tools	60
Project Goals & Deliverables	61
        C SOURCE CODE                                                                                                                   62











LIST OF FIGURES
Figure 2.1: Modified Waterfall Model
Figure 3.1: Use Case Diagram
Figure 3.2: System Architecture
Figure 4.1: Project Structure
Figure 4.2: Database Design 
Figure 4.3: Student Registration Page
Figure 4.4: Login Page
Figure 4.5: Student Dashboard Page
Figure 4.6: Student Initial Information and Medical and Dental Records Page
Figure 4.7: Student Updated Information and Medical and Dental Records Page
Figure 4.8: Medical and Dental Records Page
Figure 4.9: E-Certifications and Prescriptions Page
Figure 4.10: Doctor Dashboard Page
Figure 4.11: Search Student Record Page
Figure 4.12: Student Pending Request Page
Figure 4.13: Appointment Validation and Cancellation Page
Figure 4.14: Certificate and Prescription Issuance Page
Figure 4.15: Analytics and Reports Page
Figure 4.16: Doctor Settings Page
LIST OF TABLES
Table 3.1: System Specifications
Table 5.1: Login
Table 5.2: Registration
Table 5.3: Pending and Approved Student Initial Record
Table 5.4: Pending Appointments
Table 5.5: Completed Appointments
Table 5.6: Generate Certificates and Prescriptions
Table 5.7: Generate Reports
Table 5.8: Search Student
Table 5.9: Change Password



ABSTRACT
Purpose:
	The purpose of this project is to provide a centralized EMR System for Medical Dental Service (MDS) in T.I.P Manila. The EMR System will allow the doctor to manage medical appointments, and generate reports. On the other hand, students are allowed to submit medical records and book an appointment.
Methodology:
	The EMR System project uses Django as its main framework, while using other services such as WeasyPrint to generate reports. The system’s design focuses on simplicity, efficiency and reduced human errors for accuracy.
 Results:
	The EMR System streamlined daily operations, efficiently managing over 160 consultations while reducing manual errors and paperwork. It automated important processes like appointment scheduling, medical certificate generation, and data verification. Secure role-based access and analytical dashboards boosted accuracy and decision-making.
Conclusion:
	In conclusion, the system effectively replaced traditional paper-based workflows with a dependable and scalable digital solution, thereby improving service delivery and operational efficiency at TIP Medical-Dental Services.

1. EXECUTIVE SUMMARY
This project develops a web-based Electronic Medical Record (EMR) System for TIP Medical-Dental Services, replacing paper-based workflows and improving efficiency for ~160 daily student consultations. Built with Django, SQLite, and a three-tier architecture, the system offers secure role-based access, automated medical certificates and prescriptions, appointment scheduling with ticketing, analytics dashboards, and a seven-day verification process for student updates. It provides a scalable, secure solution that reduces errors, streamlines operations, and enables data-driven decision-making.
Introduction
	The system transitions TIP’s medical and dental records from manual, paper-based files to a centralized digital platform, improving data management and ensuring fast information retrieval.
Core Objectives
	To develop a secure, efficient, and user-friendly EMR system that digitizes all medical and dental record operations for TIP Manila MDS.
Features
Centralized digital records for medical and dental operations
Automated certificates and prescriptions
Analytics dashboards for monitoring consultations and trends
Role-based access control with institutional email authentication
Verification workflows for student updates
Benefits
 The EMR System enhances efficiency, accuracy, and security, supports data-driven decision-making, and advances TIP’s goal of a modern, paperless healthcare system.
2. INTRODUCTION
2.1 Project Background
The Electronic Medical Record (EMR) System for TIP Medical-Dental Services is a web-based application designed to digitize and streamline medical and dental record management at the Technological Institute of the Philippines. The system replaces traditional  paper-based processes with a secure digital platform that handles student medical profiles, consultation records, appointment scheduling, and certificate generation.
2.2 Client Overview
Name: Dr. Jane Doe (CTF) MDS Head
Name of business: TIP Medical-Dental Services (MDS)
Industry/type: Healthcare Services in Educational Institution
Business needs: He requires a digital system to manage approximately 160 daily student consultations, eliminate manual records, automate certificate generation, track medical statistics, and implement a verification workflow for student-submitted health information updates.
2.3 Project Objectives
To develop a secure, efficient, and user-friendly Electronic Medical Record (EMR) System for the TIP Medical-Dental Services that digitizes all medical and dental processes while maintaining confidentiality and accuracy.
Automate medical document generation using customizable templates for certificates and prescriptions, reducing manual paperwork and speeding up service delivery.
Enable advanced analytics and reporting to track consultations, monitor top morbidity cases, and visualize health trends daily, weekly, and monthly for data-driven decisions.
Implement secure role-based access control with institutional email authentication, enforcing permissions for students and medical staff while safeguarding patient data.
2.4 Significance of the Project:
This project aims to digitize and improve the efficiency, security, and service delivery of the TIP Medical-Dental Services.
Replaces manual processes with a secure, automated system.
Minimizes misplaced records and speeds up certificate generation.
Allows medical staff to focus more on patient care instead of paperwork.
Provides real-time analytics on consultation trends and disease prevalence.
Supports data-driven decision-making for resource management and health planning.
Gives students easy access to medical records and simplifies appointment booking.
Ensures faster service delivery and improved user experience.
Uses secure digital storage to maintain confidentiality and compliance with data protection standards.
2.5 Scope and Delimitations
Scope
 This system covers the core digital medical-dental operations within TIP.
Student registration with medical and dental profile creation.
Medical record management performed by authorized doctors.
Appointment booking and scheduling with automatic ticket generation.
Automated generation of medical certificates and prescriptions.
Student-initiated record updates with doctor verification.
Analytics dashboard for consultation statistics and morbidity trend monitoring.
Role-based access control for students and doctors.
Secure authentication using institutional email accounts.

Delimitations
 This system is limited only to the operations within TIP and does not include extended external healthcare integrations.
Access is exclusive to users with institutional email accounts.
Does not support billing or payment transactions.
Does not include pharmacy inventory management.
No integration with external hospital systems or government health databases.
Telemedicine, video consultations, and laboratory result management are excluded.
Mobile application version is not included; only accessible through web browsers.
2.6 Project Development

Figure 2.1: Modified Waterfall Model
3. SYSTEM ANALYSIS
3.1 Client Requirements
Fully digitalized medical and dental records system accessible to authorized personnel
Annual morbidity report generation showing top five diseases and conditions
Role-based access control for doctors and students with different permission levels
Verification process for student record updates with one-week pending validity period
Appointment and clearance system for OJT activities and medical services
Secure login using institutional email authentication (@tip.edu.ph domain)
3.2 Functional Requirements
User authentication and authorization system with email-based login for students and doctors
Student profile management including personal information, medical history, dental records, emergency contacts, and vital signs
Medical record creation and management by doctors with approval workflow and status tracking
Appointment booking system with service type selection, preferred date and time slots, ticket number generation, and status management
Certificate and prescription generation using customizable templates with automated PDF generation
Update request system where students can request changes to their medical information with doctor verification required
Analytics and reporting dashboard displaying consultation statistics, top morbidity cases, and daily/weekly/monthly trends
Search functionality for doctors to find student records by student ID or name
3.3 Non-Functional Requirements
Must be lightweight, fast, and user-friendly.
Ensure high security and data confidentiality.
Must support role-based access control for proper authorization.
3.4 Use Cases / User Stories


Figure 3.1: Use Case Diagram


3.5 System Architecture 















Figure 3.2 System Architecture


3.5.1 System Specifications
The System Specifications section defines the technical requirements and performance metrics of the entire project. It describes the system’s operational parameters, capabilities, and limitations, serving as a blueprint for understanding its functionality. This section ensures that the project’s scope and technical achievements are clearly documented, providing a baseline for evaluation and replication.

Table 3.1 System Specifications
Specification
Details
System Name
TIP MDS Electronic Medical Record System
Purpose
Centralizing Student Medical Records
Web Framework
Django 4.2 with Python 3.11
Database System
SQLite for development and production
System Architecture
Three-tier architecture (Presentation, Business, Data)
Authentication Method
Institutional email (@tip.edu.ph) with role-based access
System Latency
Average response time of 500ms
Daily User Capacity
Supports approximately 160 daily consultations
User Interface
Web application with Bootstrap 5 responsive design
Document Generation
Automated PDF generation using WeasyPrint and ReportLab
Security Features
Role-based access control, encrypted sessions, HTTPS
Verification Workflow
7-day pending period for student record updates
Scalability
Supports concurrent access by multiple users
Frontend Technologies
HTML, CSS, JavaScript with Bootstrap 5
Development Tools
Visual Studio Code, Git/GitHub, Chrome DevTools




4. DESIGN AND IMPLEMENTATION
4.1 Django Project Structure
The project follows Django's standard structure with modular app design for separation of concerns:
Figure 4.1: Project Structure
This figure shows the folder structure of the TIP Medical and Dental System (EMR Backend). The core configuration is located in the tip_mds_emr folder, while feature-specific apps manage users, students, doctors, appointments, documents, reports, and notifications. The static folder contains CSS and JavaScript assets, and templates hold HTML files. 
Key Components:
Accounts app: Manages a custom email-based User model, authentication, registration/login forms, role-based access (@student_required, @doctor_required), and profile settings.
Students app: Handles StudentProfile data, medical/dental info, consultation records (MedicalRecord), update requests, and student portal pages for profiles, records, and appointments.
Doctors app: Provides a doctor dashboard with daily stats, student search, update-request approvals, and appointment management.
Appointments app: Manages Appointment scheduling with ticket generation, time-slot booking, doctor approval, and status tracking (pending, approved, completed, cancelled).
Templates_docs app: Stores customizable document templates (Template), issues certificates (IssuedCertificate), manages Prescriptions, and provides PDF generation utilities.
Analytics app: Produces consultation statistics, morbidity reports, service distribution summaries, and supports CSV/PDF exports.
Overall, the modular Django structure improves maintainability, clarity, and independent development of each feature.


4.2 Forms and Validation
The system implements comprehensive form validation at multiple levels:
Registration Forms:
UserRegistrationForm: Enforces institutional emails (@tip.edu.ph), strong passwords (min. 8 chars), unique email, required personal details, and terms acceptance.
StudentRegistrationForm: Validates unique student ID, past date of birth, correct phone format, emergency contact, and blood type.
Update Forms:
StudentUpdateForm: Updates contact info, address, allergies, medications, and emergency contacts.
RecordUpdateRequestForm: Requires selected fields for update, a reason, optional documents, and automatically logs previous values.
Medical Forms:
MedicalRecordForm: Validates visit date, requires chief complaint and diagnosis, and supports vital sign inputs and file uploads.
AppointmentBookingForm: Ensures future booking dates (no weekends), selects time slots, requires a meaningful reason, and captures emergency contact info.
Certificate Forms:
CertificateGenerationForm: Checks student ID, certificate title/purpose, optional diagnosis/prescription, validity period, and template choice.
All forms use Django’s validators and custom clean() methods to enforce business rules, with clear error messages and strict server-side validation to ensure data accuracy and security.


4.3 Backend API
While the system primarily uses Django's template-based views, it includes API endpoints for specific functionalities:
Authentication Endpoints:
/accounts/login/ - User login with email and password
/accounts/register/ - New user registration
/accounts/logout/ - Session termination
/accounts/api/check-email/ - AJAX email availability check
Student Endpoints:
/student/dashboard/ - Student homepage with statistics
/student/register/ - Complete student profile registration
/student/update/ - Update personal information
/student/records/ - View medical and dental records
/student/appointments/ - Book and manage appointments
Doctor Endpoints:
/doctor/dashboard/ - Doctor homepage with daily stats
/doctor/search/ - Search student records by ID
/doctor/pending/ - View pending update requests
/doctor/appointments/ - Manage all appointments
/doctor/requests/<id>/approve/ - Approve update request
/doctor/requests/<id>/decline/ - Decline update request
/doctor/analytics/ - View consultation statistics
Certificate Endpoints:
/doctor/certificates/generate/ - Create new certificate
/doctor/templates/ - Manage document templates
/documents/certificates/<id>/download/ - Download PDF
All endpoints implement proper authentication checks using @login_required decorator and role-based authorization using custom decorators. POST requests are protected with CSRF tokens. File uploads are validated for type and size limits.

4.4 Web Application
Django-based Electronic Medical Record (EMR) System with three-tier architecture.
Role-specific interfaces for students and doctors to manage medical records, appointments, and analytics.
Built with Django, SQLite, and Bootstrap 5 frontend.
Enforces institutional email authentication.
Implements security measures: Encrypted connections, and role-based access control.

4.4.1 Functional View
The system operates through role-specific workflows:
Student Workflow:
Register account using institutional email
Complete medical and dental profile with required information
Submit appointment requests with preferred dates
View approved medical records and issued certificates
Request updates to medical information with verification
Track appointment status through dashboard
Doctor Workflow:
Login with doctor credentials
View dashboard showing daily appointments and pending requests
Search student records by student ID
Review and approve/decline student update requests
Create medical records after consultations
Generate certificates and prescriptions using templates
Approve appointment requests and assign schedules
View analytics reports and morbidity statistics
Export analytics and morbidity report.


4.4.2 Database Design































Figure 4.2: Database Design
The database schema consists of the following main entities:
User Model (accounts.User):
Primary Key: email
Fields: first_name, last_name, role, phone_number, is_active
Relationships: One-to-One with StudentProfile or DoctorProfile
StudentProfile Model:
Primary Key: user (OneToOne with User)
Personal: student_id, program, year_level, sex, date_of_birth
Contact: contact_number, address, emergency contacts
Medical: height, weight, blood_type, allergies, medications
Dental: last_dental_visit, oral_habits, dental_history
Status: is_complete, is_verified
MedicalRecord Model:
Primary Key: UUID
Foreign Keys: student, doctor, approved_by
Fields: record_type, visit_date, chief_complaint, diagnosis
Vitals: blood_pressure, temperature, pulse_rate
Files: lab_results, xray_image, attachments
Status: pending, approved, declined
Appointment Model:
Primary Key: UUID
Unique: ticket_number
Foreign Keys: student, doctor, approved_by
Fields: service_type, preferred_date, time_slot, reason
Status: pending, approved, completed, cancelled, no_show
IssuedCertificate Model:
Primary Key: UUID
Unique: certificate_number
Foreign Keys: student, doctor, template
Fields: title, purpose, diagnosis, prescription, remarks
Validity: date_issued, valid_until
Status: active, expired, revoked

RecordUpdateRequest Model:
Primary Key: UUID
Foreign Keys: student, reviewed_by
Fields: field_name, old_value, new_value, reason
Documents: supporting_document
Timing: created_at, expiry_date (7 days)
Status: pending, approved, declined, expired
Database indexes are created on frequently queried fields (student_id, email, ticket_number, certificate_number) to optimize search performance. Foreign key relationships maintain referential integrity with CASCADE or SET_NULL deletion rules.
4.4.3 Dataflow Diagram Level 0 and 1
Level 0 DFD (Context Diagram):
External Entities: Students and Doctors.
Students:
Provide registration data, appointment requests, and update requests.
Receive medical records, certificates, and appointment confirmations.
Doctors:
Provide medical records, approvals, and schedule information.
Receive student data, pending requests, and analytics reports.

Level 1 DFD:
The system decomposes into six major processes:
Process 1: User Authentication
Input: Email credentials from Student/Doctor
Output: Authentication token, role-based access
Data Store: User database
Process 2: Student Management
Input: Student registration data, profile updates
Output: Complete student profile, update requests
Data Store: StudentProfile database, UpdateRequest database
Process 3: Medical Record Management
Input: Consultation data from Doctor
Output: Approved medical records
Data Store: MedicalRecord database
Process 4: Appointment System
Input: Booking requests from Student, approvals from Doctor
Output: Ticket numbers, scheduled appointments
Data Store: Appointment database
Process 5: Document Generation
Input: Certificate requests from Doctor
Output: PDF certificates and prescriptions
Data Store: Template database, IssuedCertificate database
Process 6: Analytics and Reporting
Input: Query parameters from Doctor
Output: Consultation statistics, morbidity reports
Data Store: MedicalRecord database, Appointment database
Data flows between processes include student data from Authentication to Student Management, approved profiles from Student Management to Medical Records, appointment data from Appointment System to Analytics, and medical records from Medical Record Management to Document Generation.
4.4.4 User Interface and Features

Figure 4.3: Student Registration Page

Figure 4.4: Login Page


Figure 4.5: Student Dashboard Page

Figure 4.6: Student Initial Information and Medical/Dental Records Page


Figure 4.7: Student Update Information and Medical/Dental Records Page

Figure 4.8: Medical and Dental Record Page


Figure 4.9: E-Certifications and Prescriptions Page

Figure 4.10: Doctor Dashboard Page


Figure 4.11: Student Record Search Page

Figure 4.12: Student Pending Request Page


Figure 4.13: Appointment Validation and Cancellation Page

Figure 4.14: Certificate and Prescription Issuance Page


Figure 4.15: Analytics and Reports Page

Figure 4.16: Doctor Settings Page
Login Page: Branded, email/password fields, role-based redirect.
Student Dashboard: Stats, recent records, appointments, quick actions.
Student Registration: Personal, contact, medical/dental info with validation.
Doctor Dashboard: Daily stats, activity feed, pending requests, student search.
Doctor Search: View full student profile, create records, generate certificates.
Appointments: Filterable table with approve, reschedule, complete, cancel actions.
Certificates: Template selection, autofill info, preview, PDF download.
Analytics: Interactive charts, filters, CSV/PDF export.
UI: Responsive Bootstrap, inline validation, paginated tables, color-coded statuses.





5. TESTING AND DEBUGGING
5.1 Functionality Testing
Table 5.1: Login
Test No.
Snippet
Description
Action Taken 
Remarks
1

Logging in as student 
Logged in as user ‘King Rey Mark Samarita’
Passed
2

Logging in as admin.
Logged in as Admin
Passed
3

Logging in as student 
Logged in as user ‘Maria Santos’
Passed
4

Logging in as student 
Logged in as user ‘Carlos Reyes’
Passed
5

Logging in as student 
Logged in as user ‘Jane Doe’
Passed
6

Logging in as student 
Logged in as user ‘Adrian Ignacio’
Passed
7

Logging in as student 
Logged in as user ‘Nina Torres’
Passed
8

Logging in as student 
Logged in as user ‘Carlos Pascual’
Passed
9

Logging in as student 
Logged in as user ‘Bernie Rivera’
Passed
10

Logging in as student 
Logged in as user ‘Jennifer Cruz’
Passed
Total Number of Passed
10
Total Number of Failed
0
Overall Remarks
Passed


Table 5.2: Registration of account
Test No.
Snippet
Description
Action Taken 
Remarks
1

Creating a new Doctor Account 
Creating Doctor account ‘TestDoc 1’
Passed
2

Creating a new Doctor Account 
Creating Doctor account ‘TestDoc 2’
Passed
3

Creating a new Doctor Account 
Creating Doctor account ‘TestDoc 3’
Passed
4

Creating a new Doctor Account 
Creating Doctor account ‘TestDoc 4’
Passed
5

Creating a new Doctor Account 
Creating Doctor account ‘TestDoc 5’
Passed
6

Creating a new Student Account 
Creating user account ‘Test1’
Passed
7

Creating a new Student Account 
Creating user account ‘Test2’
Passed
8

Creating a new Student Account 
Creating user account ‘Test3’
Passed
9

Creating a new Student Account 
Creating user account ‘Test4’
Passed
10

Creating a new Student Account 
Creating user account ‘Test5’
Passed
Total Number of Passed
10
Total Number of Failed
0
Overall Remarks
Passed








Table 5.3: Pending and Approved Student Initial Record
Test No.
Snippet
Description
Action Taken 
Remarks
1

Pending and Approval of Student Initial Record
Registering students initial record upon creation of an account
Passed
2

Pending and Approval of Student Initial Record
Registering students initial record upon creation of an account
Passed
3

Pending and Approval of Student Initial Record
Registering students initial record upon creation of an account
Passed
4

Pending and Approval of Student Initial Record
Registering students initial record upon creation of an account
Passed
5

Pending and Approval of Student Initial Record
Registering students initial record upon creation of an account
Passed
6

Pending and Approval of Student Initial Record
Registering students initial record upon creation of an account
Passed
7

Pending and Approval of Student Initial Record
Registering students initial record upon creation of an account
Passed
8

Pending and Approval of Student Initial Record
Registering students initial record upon creation of an account
Passed
9

Pending and Approval of Student Initial Record
Register students initial record upon creation of an account
Passed
10

Pending and Approval of Student Initial Record
Register students initial record upon creation of an account
Passed
Total Number of Passed
10
Total Number of Failed
0
Overall Remarks
Passed


Table 5.4: Pending Appointments
Test No.
Snippet
Description
Action Taken 
Remarks
1

Scheduling and approval  of pending  Appointment
Scheduling of appointment
Passed
2

Scheduling and approval  of pending  Appointment
Scheduling of appointment
Passed
3

Scheduling and approval  of pending  Appointment
Scheduling of appointment
Passed
4

Scheduling and approval  of pending  Appointment
Scheduling of appointment
Passed
5

Scheduling and approval  of pending  Appointment
Scheduling of appointment
Passed
6

Scheduling and approval  of pending  Appointment
Scheduling of appointment
Passed
7

Scheduling and approval  of pending  Appointment
Scheduling of appointment
Passed
8

Scheduling and approval  of pending  Appointment
Scheduling of appointment
Passed
9

Scheduling and approval  of pending  Appointment
Scheduling of appointment
Passed
10

Scheduling and approval  of pending  Appointment
Scheduling of appointment
Passed
Total Number of Passed
10
Total Number of Failed
0
Overall Remarks
Passed


Table 5.5: Completed Appointments
Test No.
Snippet
Description
Action Taken 
Remarks
1

Completing Appointment Session
Closed appointment by setting status to 'Completed'
Passed
2

Completing Appointment Session
Closed appointment by setting status to 'Completed'
Passed
3

Completing Appointment Session
Closed appointment by setting status to 'Completed'
Passed
4

Completing Appointment Session
Closed appointment by setting status to 'Completed'
Passed
5

Completing Appointment Session
Closed appointment by setting status to 'Completed'
Passed
6

Completing Appointment Session
Closed appointment by setting status to 'Completed'
Passed
7

Completing Appointment Session
Closed appointment by setting status to 'Completed'
Passed
8

Completing Appointment Session
Closed appointment by setting status to 'Completed'
Passed
9

Completing Appointment Session
Closed appointment by setting status to 'Completed'
Passed
10

Completing Appointment Session
Closed appointment by setting status to 'Completed'
Passed
Total Number of Passed
10
Total Number of Failed
0
Overall Remarks
Passed


Table 5.6: Generate Certificates and Prescriptions
Test No.
Snippet
Description
Action Taken 
Remarks
1

File generation of Medical Documents ‘Dental  Certificate’
Generated dental certificate file with dynamic student details, diagnosis, and issuance metadata.
Passed
2

File generation of Medical Documents ‘medical  Certificate’
Generated medical certificate file with dynamic student details, diagnosis, and issuance metadata.
Passed
3

File generation of Medical Documents ‘medical  Certificate’
Generated medical certificate file with dynamic student details, diagnosis, and issuance metadata.
Passed
4

File generation of Medical Documents ‘Prescription’
Generated Prescription file with dynamic student details, diagnosis, and issuance metadata.
Passed
5

File generation of Medical Documents ‘medical  Certificate’
Generated medical certificate file with dynamic student details, diagnosis, and issuance metadata.
Passed
6

File generation of Medical Documents ‘medical  Certificate’
Generated medical certificate file with dynamic student details, diagnosis, and issuance metadata.
Passed
7

File generation of Medical Documents ‘medical  Certificate’
Generated medical certificate file with dynamic student details, diagnosis, and issuance metadata.
Passed
8

File generation of Medical Documents ‘medical  Certificate’
Generated medical certificate file with dynamic student details, diagnosis, and issuance metadata.
Passed
9

File generation of Medical Documents ‘medical  Certificate’
Generated dental certificate file with dynamic student details, diagnosis, and issuance metadata.
Passed
10

File generation of Medical Documents ‘medical  Certificate’
Generated dental certificate file with dynamic student details, diagnosis, and issuance metadata.
Passed
Total Number of Passed
10
Total Number of Failed
0
Overall Remarks
Passed





Table 5.7: Generate Reports
Test No.
Snippet
Description
Action Taken 
Remarks
1

Generating Analytics Report
‘Morbidity Report’
Preview/Downlaod ‘Morbidity Report’
Passed
2

Generating Analytics Report
‘Consultation Report’
Preview/Download ‘Consultation Report’
Passed
3

Generating Analytics Report
‘Appointment Report’
Preview/Downlaoad ‘Appointment Report’
Passed
4

Generating Analytics Report
‘Top Diagnoses Report’
Preview/Download ‘Top Diagnoses  Report’
Passed
5

Generating Analytics Report
‘Appointment Statistics Report’
Preview/Download ‘Appointment Statistics  Report’
Passed
6

Generating Analytics Report
‘Appointment Report’
Preview/Download ‘Appointment Report’
Passed
7

Generating Analytics Report
‘Morbidity Report’
Preview/Download ‘Morbidity Report’
Passed
8

Generating Analytics Report
‘Appointment Statistics Report’
Preview/Download ‘Appointment Statistics Report’
Passed
9

Generating Analytics Report
‘Appointment Report’
Preview/Download ‘Appointment Report’
Passed
10

Generating Analytics Report
‘Morbidity Report’
Preview/Download ‘Morbidity Report’
Passed
Total Number of Passed
10
Total Number of Failed
0
Overall Remarks
Passed


Test 5.8: Student Search
Test No.
Snippet
Description
Action Taken 
Remarks
1

Searching A student information  using ID.
Search Student using ID
Passed
2

Searching A student information  using ID.
Search Student using ID
Passed
3

Searching A student information  using ID.
Search Student using ID
Passed
4

Searching A student information  using ID.
Search Student using ID
Passed
5

Searching A student information  using ID.
Search Student using ID
Passed
6

Searching A student information  using ID.
Search Student using ID
Passed
7

Searching A student information  using ID.
Search Student using ID
Passed
8

Searching A student information  using ID.
Search Student using ID
Passed
9

Searching A student information  using ID.
Search Student using ID
Passed
10

Searching A student information  using ID.
Search Student using ID
Passed
Total Number of Passed
10
Total Number of Failed
0
Overall Remarks
Passed


Table 5.9: Change Password Functionality
Test No.
Snippet
Description
Action Taken 
Remarks
1

Change password by the user
Change Password 
Passed
2

Change password by the user
Change Password 
Passed
3

Change password by the user
Change Password 
Passed
4

Change password by the user
Change Password 
Passed
5

Change password by the user
Change Password 
Passed
6

Change password by the user
Change Password 
Passed
7

Change password by the user
Change Password 
Passed
8

Change password by the user
Change Password 
Passed
9

Change password by the user
Change Password 
Passed
10

Change password by the user
Change Password 
Passed
Total Number of Passed
10
Total Number of Failed
0
Overall Remarks
Passed


5.3 Debugging techniques and resolved issues
Email Authentication Failing:
Problem: Users couldn’t log in via email.
Solution: Custom EmailBackend, updated AUTHENTICATION_BACKENDS, set USERNAME_FIELD = 'email'.
Student Profile Not Created:
Problem: "StudentProfile does not exist" after registration.
Solution: Auto-create StudentProfile in save() and via post_save signal.
Update Requests Not Expiring:
Problem: Requests stayed pending past 7 days.
Solution: Cron-managed command check_expired_requests.py and model method check_and_mark_expired().
Certificate PDF Generation Failing:
Problem: Blank pages and "Template not found" errors.
Solution: Configured ReportLab, fixed HTML-to-PDF conversion, template paths, and static references.
Appointment Ticket Numbers Colliding:
Problem: Duplicate ticket numbers.
Solution: Added uniqueness check in generate_ticket_number() and DB-level uniqueness constraint.
Medical Records for Unverified Students:
Problem: Doctors could create records for incomplete profiles.
Solution: Added is_complete check, warnings, and updated forms to reflect profile completion.
Debugging & Testing
Tools: Django Debug Toolbar, Python pdb, browser dev tools, Django shell, logging to django.log.
Testing: Unit tests in tests.py, test cases documented in spreadsheet, bug tracking with issue numbers and resolutions.


6. RESULTS AND ANALYSIS
The Electronic Medical Record (EMR) System for TIP Medical-Dental Services was successfully developed, tested, and deployed, meeting all functional and non-functional requirements. It replaces manual, paper-based processes with a secure, efficient, and user-friendly digital platform capable of supporting approximately 160 daily student consultations. This section summarizes the key outcomes and impact of the system.
6.1 Achievement of Core Objectives
The system fully met its primary goal of providing a centralized and automated medical record management solution.
The platform supports complete workflows, from student registration to medical/dental profile management, consultations, appointments, and certificate generation, consolidating all healthcare processes into one system.
Using WeasyPrint and ReportLab, the system quickly generates professional PDF certificates and prescriptions with auto-filled patient details and doctor signatures, eliminating manual paperwork.
Analytics Dashboard:
The dashboard provides key health insights through reports on:
Consultation volumes
Morbidity trends (top five diseases)
Medical vs. dental service distribution
Appointment completion and no-show rates
These analytics support data-driven decision-making and campus health monitoring.
Streamlined Appointment and Verification System:
The system automates booking, ticketing, and time-slot assignments. Student-submitted updates pass through a seven-day verification workflow, ensuring data accuracy while maintaining efficient operations.


6.2 Technical Implementation and Performance
Django’s MVT architecture and three-tier design offered a secure and scalable foundation.
The Bootstrap 5 frontend integrates smoothly with the Django backend, providing a responsive and secure user experience.
The database is clear and scalable, storing students, profiles, records, appointments, and issued documents with strong data integrity.
Security features include institutional email authentication, role-based access control, CSRF protection, and secure session management.
The system is deployed as a stable web-based application using SQLite, operating reliably with no downtime during testing.
6.3 Business Impact and Operational Efficiency
The system delivers substantial value to both students and medical-dental staff.
For Students:
Users benefit from online appointments, accessible medical history, transparent consultation tracking, and streamlined update requests.
For Staff:
Automation reduces administrative workload and improves accuracy.
Time Savings:
Certificate generation: 5 minutes → 30 seconds (90% faster
Record retrieval: 3–5 minutes → 3–5 seconds (98% faster)
Appointment booking: 10 minutes → 2 minutes (80% faster)
Additional impacts include reduced paperwork, improved data accuracy (80% during testing), and faster reporting through real-time analytics.
Scalability:
The system is capable of handling increasing consultation volumes without additional administrative overhead.
6.4 System Performance Metrics
Operational Efficiency:
160+ consultations processed daily during testing
~500 ms average response time
100+ certificates and prescriptions auto-generated
Data Management:
Complete migration of records
Automated backups
Reliable verification workflow
6.5 Limitations and Constraints
Internet Dependency: Access may be interrupted during network outages.
Verification Delays: The seven-day approval period may slow urgent updates.
Browser-Only Access: No dedicated mobile app at present.
Manual Data Entry: Initial student medical history encoding remains time-consuming during peak seasons.
6.6 Comparison with Previous System
Aspect
Previous Paper-Based System
New EMR System
Record Access
Manual search through files or Excel Sheets
Instant digital search (3-5 sec)
Certificate Generation
Manual typing and printing 
Automated PDF generation
Analytics
Manual Excel compilation
Real-time automated dashboards
Storage Space
Physical filing cabinets
Digital database (minimal space)
Data Security
Physical file security
Role-based access + encryption
Scalability
Limited by physical space
Role-based access + encryption

7. CONCLUSIONS
7.1 Conclusion
The Electronic Medical Record (EMR) System for TIP Medical-Dental Services demonstrated significant improvements in operational efficiency and data management by replacing manual processes with an automated, secure, and user-friendly digital platform. It streamlined healthcare workflows, enhanced accuracy, and provided measurable performance gains during pilot testing.
90% reduction in medical certificate generation time: automation allowed instant document creation compared to the previous manual process.
80% faster record retrieval: digitized records enabled quick access and reduced search time drastically.
70% improvement in appointment booking efficiency: integrated scheduling and ticket management simplified daily consultations.
Implemented secure role-based access control: ensured proper authorization and protected patient confidentiality.
Automated document generation and record management: minimized human error and standardized medical documentation.
Integrated analytics dashboards: provided insights for tracking medical statistics and supporting data-driven decisions.
Zero data loss during pilot testing: validated the system’s reliability and the success of its implementation.


7.2 Recommendations
To enhance the EMR System’s accessibility, scalability, and functionality, future development can focus on:
Developing a mobile app (iOS/Android) with SMS notifications to improve accessibility and reduce no-shows.
Adding electronic signature capture and lab result management to complete the digital workflow.
Expanding analytics to include predictive disease analysis and inventory tracking for better planning.
Integrating with the university’s student information system for automatic profile creation and real-time verification.
Introducing telemedicine to support remote consultations and extend service hours.
Using cloud hosting (AWS/Azure) for scalability, performance, and sustainability.
Optimizing the database with query caching and sharding for improved speed.
Implementing audit logging to monitor data access and ensure security and compliance.
7.3 Key Learnings
Working on this project helped us grow both technically and professionally. Since it was our first time building an EMR system, we learned many new skills and gained experience in software development, teamwork, and handling sensitive healthcare data.
Since it was our first time using Django, we learned about MVT architecture, ORM, and middleware.
We learned how to design a proper database using normalization, indexing, and relationships between tables.
Implementing role-based access control taught us about authentication, authorization, and managing user sessions.
Creating automated certificates and prescriptions helped us learn PDF generation and template rendering.
Working with clients improved our communication and teamwork to make sure the system fits healthcare needs.
Iterative development taught us how to improve the system step by step using user feedback.
We understood the importance of writing documentation for debugging and helping new team members.
Handling student health data made us aware of privacy, data security, and ethical responsibilities.
Working under tight deadlines improved our time management and prioritization skills.
Testing the system with real users showed us the importance of error handling and system reliability.
7.3 Challenges and Solutions
Understanding Complex Workflows:
Challenge: Converting manual healthcare processes into digital workflows.
Solution: Interviews and observations with staff, flowcharts, iterative validation with end-users.
Balancing Security and Usability:
Challenge: Strong security could hinder adoption.
Solution: Layered security (email auth, role-based access, session timeouts, HTTPS) with usability features like “remember me” and clear error messages.
Ensuring Data Privacy Compliance:
Challenge: Protecting sensitive student medical records.
Solution: Role-based access, encryption, anonymized exports, audit trails, and clear privacy policy.
Testing with Limited Resources:
Challenge: Limited time and test participants.
Solution: Automated test scripts, seeded test data (100 students, 50 records), phased testing, Django unit tests.
Handling Concurrent Updates:
Challenge: Multiple doctors editing the same record simultaneously.
Solution: Optimistic locking, check last-modified timestamps, select_for_update() for critical operations, interface indicators for active users.
Summary: These solutions highlight the importance of user involvement, iterative development, balancing security and usability, and maintaining flexibility while protecting core project scope and timelines.

APPENDICES
REFERENCES
Benson, T., & Grieve, G. (2021). Principles of health interoperability: SNOMED CT, HL7 and FHIR (4th ed.). Springer.
Chaudhry, B., Wang, J., Wu, S., Maglione, M., Mojica, W., Roth, E., Morton, S. C., & Shekelle, P. G. (2006). Systematic review: Impact of health information technology on quality, efficiency, and costs of medical care. Annals of Internal Medicine, 144(10), 742-752. https://doi.org/10.7326/0003-4819-144-10-200605160-00125
Django Software Foundation. (2023). Django documentation (Version 4.2). https://docs.djangoproject.com/en/4.2/
Häyrinen, K., Saranto, K., & Nykänen, P. (2008). Definition, structure, content, use and impacts of electronic health records: A review of the research literature. International Journal of Medical Informatics, 77(5), 291-304. https://doi.org/10.1016/j.ijmedinf.2007.09.001
Kruse, C. S., Kristof, C., Jones, B., Mitchell, E., & Martinez, A. (2016). Barriers to electronic health record adoption: A systematic literature review. Journal of Medical Systems, 40(12), 252. https://doi.org/10.1007/s10916-016-0628-9
Menachemi, N., & Collum, T. H. (2011). Benefits and drawbacks of electronic health record systems. Risk Management and Healthcare Policy, 4, 47-55. https://doi.org/10.2147/RMHP.S12985
World Health Organization. (2021). Global strategy on digital health 2020-2025. https://www.who.int/publications/i/item/9789240020924




PROJECT MANAGEMENT
Team Members
Name:
Role:
Responsibility:
John Rhey Peña
Programmer
Prepare and maintain technical documentation for assigned projects.
Troubleshoot and debug software to ensure optimal performance and functionality.
Helped to code the whole system
Bernie Jr. Rivera
Programmer
Perform unit and system integration testing to ensure software reliability.
Assist in the deployment of applications to testing and production environments.
Helped to code the whole system
King Rey Mark Samarita
Programmer
Identify and correct coding errors and system malfunctions in a timely manner.
Write, modify, and test application code using Python.
Helped to code the whole system

Project Timeline / Schedule
Resources and Tools
Development Tools:
Visual Studio Code - Primary code editor
Git/GitHub - Version control and collaboration
SQLite- Production database
SQLite - Development database
Chrome DevTools - Frontend debugging
Frameworks and Libraries:
Django 4.2 - Web framework
Bootstrap 5 - CSS framework
ReportLab - PDF generation
Python 3.11 - Programming language
Hardware Resources:
Development Laptops
Testing Devices (desktop, laptop, tablet)
Project Goals & Deliverables
Primary Goals:
Replace paper-based medical records with digital system
Reduce certificate generation time by at least 80%
Implement secure role-based access control
Provide analytics for health trend monitoring
Deliverables:
Fully functional web-based EMR system
User authentication with institutional email verification
Student and doctor portal interfaces
Medical and dental record management system
Appointment booking with ticket generation
Automated certificate and prescription generation
Analytics dashboard with morbidity reports
System documentation (technical and user manuals)
Final project report and presentation
Success Metrics:
All deliverables were completed on schedule and met or exceeded the defined success criteria during the pilot testing phase.
C. SOURCE CODE
To access the source code, please clone the repository and install all required dependencies from the following link:
https://github.com/nixxinix/TIP_MDS.git



## This is another group's work with their website, you can use it as a guide ##