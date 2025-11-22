3. SYSTEM ANALYSIS

3.1 Client Requirements

The client requirements were gathered through structured interviews and operational observations to identify the key functional and operational needs for the system.

- Centralized member tracking system replacing notebooks and spreadsheets
- Dashboard with at-a-glance operational metrics and member status indicators
- Automated identification of expiring memberships for renewal outreach
- Financial reporting for revenue trends, payment methods, and facility usage
- Integration with Philippine digital payment platforms (GCash, Maya, GoTyme)
- Simple, intuitive interface requiring minimal technical expertise
- Fast member search and information retrieval
- Automated subscription extension upon payment processing
- Audit trails for all transactions and member changes
- Mobile-friendly access for on-the-go management

3.2 Functional Requirements

The functional requirements define the system's core capabilities organized by domain.

**Authentication and Access Control:**
- Secure login with email/password and complexity requirements
- Role-based access: Owner (full access) and Staff (operational access)
- Session management with 30-minute timeout
- Password change with verification and history tracking

**Member Management:**
- Member registration with required and optional fields
- Auto-generated unique member IDs (GYM + 7 alphanumeric)
- Profile editing with audit logging
- Soft-delete preserving payment and attendance history
- Photo upload with auto-resize (800x800px max)
- Fast search by ID, name, phone, or email (< 500ms)
- Color-coded status indicators (green=active, red=expired, orange=expiring soon)

**Payment Processing:**
- Support for multiple transaction types (membership, walk-in, misc fees)
- Seven payment methods (Cash, GCash, Maya, GoTyme, Bank Transfer, PayPal, Card)
- UUID transaction identifiers
- Intelligent subscription extension logic
- Data preservation for audit trails
- Transaction status tracking (Completed, Pending, Failed, Refunded)
- Comprehensive payment history with filters and pagination

**Attendance Tracking:**
- Check-in recording with timestamp and staff attribution
- Maximum 3 check-ins per member per day
- Duplicate check-in prevention
- Membership validation before check-in
- Check-out with session duration calculation
- Real-time facility occupancy count
- Peak hours analysis with visualizations

**Dashboard and Analytics:**
- Operational statistics (members, revenue, check-ins, occupancy)
- Membership trend visualizations (charts and graphs)
- Recent activity feed (last 10 check-ins)
- Key performance indicators (duration, renewal rate, revenue per member)
- Report export (CSV/PDF for payments, members, attendance)

**Administrative Functions (Owner Only):**
- Staff account management (create, edit, soft-delete)
- Membership pricing configuration (create, edit tiers)
- Email uniqueness validation
- Role assignment and modification
- Audit logging for administrative actions

3.3 Non-Functional Requirements

The non-functional requirements define system qualities and constraints that impact user satisfaction, maintainability, and operational viability.

Performance:
- Average page load under 800ms for dashboard (5 concurrent users)
- Search results within 500ms for up to 1,000 member records
- Scalable to 5,000 members, 50,000 payments, 100,000 check-ins
- Support 5+ concurrent users without degradation

Usability:
- Maximum 2 hours training for basic computer users
- Consistent navigation with persistent top bar and breadcrumbs
- Clear, actionable error messages in friendly tone
- Automatic formatting and inline validation
- Accessibility compliant (WCAG AA, keyboard navigation, 44px touch targets)

Reliability:
- Mean Time Between Failures exceeding 30 days
- Defensive programming with input validation and exception handling
- Data integrity through database constraints and audit logging
- Automated backup procedures with 30-minute restore time

Security:
- Password hashing with bcrypt (minimum 10 rounds)
- Prevention of SQL injection, XSS, CSRF, clickjacking
- Role-based authorization checks with audit logging
- Secure session management with 30-minute timeout

Maintainability:
- Modular architecture with six Django apps
- Consistent coding conventions (PEP 8, Django standards)
- Comprehensive documentation (architecture, schema, deployment, user guides)
- Version control with Git and meaningful commit messages

Compatibility:
- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Responsive mobile (iOS 13+, Android 10+, 320px-1920px screens)
- Cross-platform deployment via Docker containerization

Infrastructure:
- Docker Engine 24.0+ with multi-container architecture
- Raspberry Pi 5 support (8GB RAM, NVMe SSD, active cooling)
- Cloudflare Tunnel for secure remote access
- Monitoring for system, application, database, and business metrics
- Daily automated backups with 7-day retention

3.4 Use Cases and User Stories

The use case analysis identifies primary actors, their goals, and the interaction sequences required to achieve those goals, providing scenario-based requirements documentation that captures both normal flows and exceptional conditions. User stories complement use cases by expressing requirements from user perspective in simple, narrative format emphasizing user value rather than system mechanics.

[Figure 3.1: Use Case Diagram - INSERT IMAGE HERE]
*The use case diagram illustrates the primary actors (Owner, Staff, Member) and their interactions with major system functions including Authentication, Member Management, Payment Processing, Check-in Tracking, Dashboard Viewing, and Administrative Functions, with extend and include relationships showing auxiliary use cases.*

**Use Case 1: Member Registration**

**Primary Actor:** Staff or Owner  
**Goal:** Create new member account with complete profile information  
**Preconditions:** User is authenticated and has Staff or Owner role  
**Trigger:** User navigates to Member Management and clicks "Add New Member"

**Main Success Scenario:**
1. System displays member registration form with required and optional fields
2. User enters member full name (e.g., "Juan Dela Cruz")
3. User enters phone number (e.g., "09171234567")
4. User selects sex from dropdown (Male/Female)
5. User enters address (e.g., "123 Barangay St., Manila")
6. User optionally enters email address (e.g., "juan@email.com")
7. User optionally enters emergency contact name (e.g., "Maria Dela Cruz")
8. User optionally enters emergency phone (e.g., "09187654321")
9. System auto-sets start date to current date
10. System auto-calculates end date as 30 days from start date
11. User enters membership fee (e.g., "1000.00")
12. System auto-generates unique member ID (e.g., "GYMA7X2K9P")
13. User clicks "Add Member" button
14. System validates all required fields are completed
15. System validates phone number format and email format if provided
16. System saves member record to database
17. System displays success notification "Member registered successfully"
18. System redirects to member list showing new member with Active status

**Alternative Flows:**
- 14a. Required field validation fails: System highlights missing fields with red borders and displays "Please complete all required fields" message, remains on form allowing correction
- 15a. Phone format invalid: System displays "Please enter valid 11-digit Philippine mobile number" message, highlights phone field
- 15b. Email format invalid: System displays "Please enter valid email address" message, highlights email field
- 16a. Database error during save: System displays "Error creating member account, please try again" message, preserves form data for retry

**Postconditions:**
- New member record exists in database with Active status
- Member appears in member list
- Member is searchable by name, ID, phone, or email
- Member can check in to facility
- Audit log records user who created member and timestamp

**User Story Format:**
*"As a gym staff member, I want to quickly register new members with their contact information and subscription details, so that they can immediately start using the facility without paperwork delays or confusion about their membership status."*

**Use Case 2: Processing Membership Payment**

**Primary Actor:** Staff or Owner  
**Goal:** Record payment and extend member subscription  
**Preconditions:** User is authenticated, member account exists, payment pricing tiers are configured  
**Trigger:** User navigates to Payments and searches for member

**Main Success Scenario:**
1. System displays payment processing page with member search field
2. User enters member name or ID (e.g., "Juan" or "GYMA7X2K9P")
3. System searches database and displays matching members in dropdown
4. User selects correct member from dropdown
5. System displays member information card showing current subscription status
6. System displays pricing options as selectable cards (1 Month, 3 Months, 6 Months, 1 Year)
7. User clicks desired pricing option (e.g., "1 Month - ₱1,000.00")
8. System highlights selected pricing and enables payment method dropdown
9. User selects payment method from dropdown (e.g., "GCash")
10. System displays reference number field for digital payment methods
11. User enters reference number (e.g., "GC2024XXXX")
12. User optionally enters remarks (e.g., "Renewal payment")
13. User clicks "Process Payment" button
14. System validates all required fields completed
15. System creates payment record with UUID identifier
16. System calculates new end date based on member's current status:
    - If subscription active (end date in future): new end date = current end date + duration days
    - If subscription expired (end date in past): new end date = today + duration days
17. System updates member end date to calculated value
18. System saves payment record with status "Completed"
19. System displays success notification with new end date
20. System clears form for next transaction

**Alternative Flows:**
- 3a. No members found matching search: System displays "No members found" message, suggests checking spelling or registering new member
- 14a. Required fields missing: System highlights missing fields and displays "Please select pricing plan and payment method"
- 14b. Reference number required but not provided: System displays "Reference number required for digital payments"
- 16a. Date calculation error: System logs error, displays "Error processing payment" message, does not save payment or update member
- 18a. Database error during save: System rolls back transaction, displays error message, preserves form data for retry

**Postconditions:**
- Payment record exists with "Completed" status
- Member subscription end date extended by purchased duration
- Transaction appears in payment history
- Member status updated to Active if previously expired
- System revenue totals updated to include payment
- Audit log records transaction details and processing user

**User Story Format:**
*"As a gym owner, I want to process membership payments through multiple methods including GCash and cash, with automatic subscription extension, so that I can serve members quickly regardless of their payment preference and ensure their access continues immediately without manual calculation."*

**Use Case 3: Member Check-in**

**Primary Actor:** Staff or Owner  
**Goal:** Record member facility entry and validate membership status  
**Preconditions:** User is authenticated, member account exists with active subscription  
**Trigger:** Member arrives at facility and requests check-in

**Main Success Scenario:**
1. System displays check-in page with member search field
2. User enters member name or ID
3. System searches database and displays matching members
4. User selects correct member
5. System validates member subscription status (end date >= today)
6. System checks daily check-in count for member (< 3 today)
7. System checks for active check-in without check-out
8. System creates check-in record with current timestamp and date
9. System displays success notification "Check-in successful"
10. System shows member name, check-in time, and current active count
11. System updates dashboard "Currently Active" count (+1)

**Alternative Flows:**
- 3a. No members found: System displays "Member not found" message
- 5a. Membership expired: System displays "Membership expired on [date]. Please renew to check in." with red warning styling
- 6a. Daily limit reached: System displays "Maximum check-ins (3) reached for today. Please contact administrator if you need assistance."
- 7a. Already checked in: System displays "Member is already checked in. Please check out before checking in again."
- 8a. Database error: System displays "Error recording check-in, please try again", does not update active count

**Postconditions:**
- Check-in record exists with member ID, timestamp, date, and null check-out
- Member appears in "Currently Active" list
- Dashboard statistics updated
- Audit log records check-in and processing staff

**User Story Format:**
*"As gym staff, I want to quickly check in members when they arrive by searching their name or ID and clicking confirm, with automatic validation that their membership is active and they haven't exceeded daily limits, so that facility access is controlled while check-in process remains fast and non-intrusive."*

**Use Case 4: Viewing Dashboard Analytics**

**Primary Actor:** Owner or Staff  
**Goal:** Monitor business performance and operational metrics  
**Preconditions:** User is authenticated  
**Trigger:** User navigates to Dashboard or logs in (dashboard is default landing page)

**Main Success Scenario:**
1. System queries database for operational statistics
2. System calculates total member count (active + inactive)
3. System counts active memberships (end date >= today)
4. System counts expired memberships (end date < today)
5. System counts expiring soon (end date between today and today+7)
6. System counts new members (start date >= first day of current month)
7. System counts daily unique check-ins (distinct members with check-ins today)
8. System counts monthly total check-ins (all check-ins since first day of month)
9. System counts currently active (check-ins today without check-out)
10. System sums today's payments with "Completed" status
11. System sums monthly payments with "Completed" status
12. System aggregates check-ins by hour for peak hours chart
13. System retrieves last 10 check-ins for recent activity feed
14. System renders dashboard with all statistics and visualizations
15. System displays loading time (typically 400-600ms)

**Alternative Flows:**
- 1a. Database connection error: System displays "Unable to load dashboard data" message with retry button
- 1b. Query timeout: System displays cached statistics (if available) with "Data may be outdated" warning
- 14a. No data available (new installation): System displays "No data yet" messages with helpful prompts to register first member

**Postconditions:**
- User has current awareness of business performance
- User can identify operational issues (e.g., low daily check-ins, many expiring memberships)
- User can plan actions based on metrics

**User Story Format:**
*"As a gym owner, I want to see a comprehensive dashboard showing my active member count, daily revenue, facility occupancy, and members needing renewal, so that I can understand my business health at a glance and prioritize my daily tasks effectively."*

3.5 System Architecture

The system architecture employs a three-tier client-server model organizing the application into distinct layers with well-defined responsibilities and interfaces, facilitating modularity, maintainability, and scalability. This architectural pattern separates presentation concerns from business logic and data management, enabling independent evolution of each layer and supporting distributed deployment if future scaling requirements emerge.

[Figure 3.2: System Architecture Diagram - INSERT IMAGE HERE]
*The system architecture diagram illustrates the three-tier structure showing: (1) Presentation Tier - web browsers on desktop, tablet, and mobile devices accessing the application through HTTPS, (2) Application Tier - Django web server processing requests through six modular applications with business logic layer, authentication middleware, and static file serving, (3) Data Tier - PostgreSQL database with nine interconnected tables, Docker container orchestration, and data persistence layer.*

**Presentation Tier:**

The presentation tier encompasses client-side components executed within user web browsers, responsible for rendering user interfaces, capturing user inputs, performing client-side validation, and managing interactive behaviors. This tier is implemented using standard web technologies including HTML5 for semantic document structure, CSS3 for visual styling and layout (utilizing CSS Grid and Flexbox for responsive positioning), and vanilla JavaScript for client-side logic without dependencies on heavy frameworks like React or Vue that would increase complexity and load times.

The presentation architecture follows mobile-first responsive design principles, establishing base styles optimized for small mobile screens (320px minimum width) then progressively enhancing for larger viewports through CSS media queries at breakpoints of 480px (large phones), 768px (tablets), and 1024px (desktops). Fluid typography implemented through CSS clamp() functions ensures text remains readable across device sizes without requiring viewport-specific overrides. Touch interaction optimization includes minimum 44x44 pixel tap targets for buttons and interactive elements, appropriate spacing preventing accidental adjacent element activation, and touch-action CSS properties eliminating 300ms tap delays on mobile devices.

Client-side validation provides immediate feedback improving user experience by highlighting errors before form submission, using HTML5 input types (email, tel, number) for basic validation and custom JavaScript validators for complex rules like Philippine mobile number format (09XX XXX XXXX). However, the architecture implements defense-in-depth security principle requiring server-side validation replication, never trusting client-provided data regardless of client-side checks since malicious users can bypass JavaScript validation through browser developer tools or direct HTTP requests.

**Application Tier:**

The application tier implemented using Django 5.0+ web framework constitutes the core business logic layer, processing HTTP requests from client browsers, executing authentication and authorization checks, performing data validation and business rule enforcement, orchestrating database operations, and generating HTTP responses rendered from templates or serialized as JSON for AJAX requests. Django's Model-View-Template (MVT) architectural pattern organizes this tier into distinct components with specific responsibilities.

The Model layer defines data structures and database operations through Object-Relational Mapping (ORM) that abstracts SQL queries into Python class methods, with nine model classes (StaffUser, Member, MembershipConfig, Payment, MembershipPricing, GymCheckIn, DashboardStats, PaymentSummary, ActiveMemberSnapshot) implementing database schema through Python code. Models include field definitions specifying data types and constraints, relationship declarations through ForeignKey fields establishing one-to-many associations, custom methods implementing domain logic (e.g., is_membership_active() on Member model), and Meta classes configuring indexes, ordering, and permissions. The ORM generates database-agnostic SQL enabling PostgreSQL usage in production and SQLite in development without code changes, while parameterized queries prevent SQL injection vulnerabilities.

The View layer contains request processing logic implemented as Python functions or classes receiving HttpRequest objects and returning HttpResponse objects, with function-based views preferred for simple operations and class-based views utilized for standard CRUD patterns benefiting from inheritance. Views perform authentication verification through @login_required decorators, role-based authorization checks comparing request.user.role against required privileges, input validation processing form data through Django Form classes with clean() methods, business logic execution including payment processing and subscription calculations, database queries using ORM methods (filter(), get(), aggregate()), and response generation rendering HTML templates with context data or JSON serialization for AJAX endpoints. Error handling within views catches exceptions, logs errors for debugging, and returns appropriate HTTP status codes (400 Bad Request, 403 Forbidden, 404 Not Found, 500 Internal Server Error) with user-friendly messages.

The Template layer generates HTML responses through Django's template engine processing template files with embedded template tags and filters, combining static HTML structure with dynamic content from view context, implementing template inheritance through {% extends %} reducing duplication, and including reusable components through {% include %} for modular construction. Templates implement presentation logic only, avoiding complex business logic that belongs in views or models, with conditional rendering through {% if %} tags, iteration through {% for %} loops, and URL generation through {% url %} template tags preventing hardcoded paths. Templates automatically escape output preventing XSS attacks unless explicitly marked safe through |safe filter or {% autoescape off %} block.

The modular application structure organizes code into six Django apps each focused on specific domain: (1) Core app provides shared utilities including authentication, global navigation, notification system, and input validation; (2) Users app manages staff accounts, authentication, profiles, and role-based permissions; (3) Memberships app handles member lifecycle from registration through renewal and deletion; (4) Payments app processes transactions, integrates payment methods, and maintains financial records; (5) Dashboard app aggregates statistics, generates visualizations, and displays operational metrics; (6) Metrics app computes historical trends and generates analytical reports. This modularity reduces coupling, improves maintainability by isolating changes, enables parallel development by multiple developers, and supports code reuse across similar projects.

**Data Tier:**

The data tier comprises PostgreSQL 16 relational database system providing persistent storage with ACID transaction guarantees ensuring data consistency, concurrent access control supporting multiple simultaneous users, and backup/recovery capabilities protecting against data loss. The database schema consists of nine tables with foreign key relationships implementing referential integrity, check constraints enforcing data validity, unique constraints preventing duplicates, and indexes optimizing query performance.

The deployment architecture utilizes Docker containerization packaging the Django application, PostgreSQL database, and dependencies into portable containers ensuring consistent operation across environments and simplifying deployment through docker-compose orchestration. The web container runs Gunicorn WSGI server providing production-grade request handling with configurable worker processes, thread pooling, and timeout management. The database container persists data through Docker volumes preventing data loss when containers restart, with volume mounting enabling backup procedures copying database files to host filesystem. Environment-specific configuration (database credentials, secret keys, debug settings) loads from .env files excluded from version control, supporting distinct development, staging, and production configurations without code changes.

3.6 System Specifications

The system specifications document defines quantitative characteristics, operational parameters, and technical requirements establishing measurable criteria for system evaluation and performance benchmarks enabling comparison with alternative solutions or future enhancements.

[Table 3.1: System Specifications - INSERT TABLE HERE]

| Specification | Details |
|---------------|---------|
| **System Name** | Gym Membership Management System (GyMMS) |
| **Primary Purpose** | Automate membership tracking, payment processing, and operational analytics for small-scale fitness centers |
| **Development Framework** | Django 5.0+ with Python 3.11 |
| **Database System** | PostgreSQL 16 for production, SQLite for development |
| **Deployment Architecture** | Docker containerization with docker-compose orchestration |
| **Web Server** | Gunicorn 20.1+ WSGI server with 3 worker processes |
| **Supported Browsers** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Mobile Support** | iOS Safari 13+, Android Chrome 10+, responsive design 320px-1920px |
| **Authentication Method** | Email/password with bcrypt hashing, role-based access control |
| **User Roles Supported** | Owner (full access), Staff (operational access) |
| **Maximum Concurrent Users** | 10 simultaneous authenticated sessions without degradation |
| **Average Response Time** | 500ms for dashboard, 300ms for search, 650ms for payments |
| **Database Capacity** | Tested with 5,000 members, 50,000 payments, 100,000 check-ins |
| **Data Collection Frequency** | Real-time for check-ins, on-demand for analytics |
| **Payment Methods Supported** | Cash, GCash, Maya, GoTyme, Bank Transfer, PayPal, Card (7 total) |
| **Payment Transaction Format** | UUID4 identifiers with data preservation for audit trails |
| **Check-in Limit Enforcement** | Maximum 3 check-ins per member per calendar day |
| **Subscription Extension Logic** | Intelligent date calculation: extend active, restart expired |
| **Notification Types** | Success, error, warning, info with 3-second auto-dismiss |
| **Session Timeout** | 30 minutes of inactivity |
| **Password Requirements** | Minimum 8 characters, uppercase, lowercase, number, special |
| **Upload File Types** | Images (JPEG, PNG) for member/staff photos |
| **Maximum Upload Size** | 5MB per image with automatic resize to 800x800px |
| **Backup Capability** | PostgreSQL pg_dump for full database backup |
| **Operating Requirements** | Docker 20.10+, 2GB RAM minimum, 10GB storage |
| **Network Requirements** | Internet connectivity for payment platform integration |
| **Timezone Configuration** | Asia/Manila (Philippine Time UTC+8) |
| **Currency Format** | Philippine Peso (₱) with two decimal places |
| **Date Format** | ISO 8601 (YYYY-MM-DD) in database, localized display formats |
| **Audit Logging** | Captures user actions, timestamps, before/after values |
| **Code Documentation** | 5,000+ lines covering architecture, APIs, deployment |
| **Automated Testing** | Functional tests for CRUD operations, validation logic |
| **Security Measures** | CSRF protection, SQL injection prevention, XSS escaping, session security |
| **Scalability Design** | Modular architecture supporting horizontal scaling |
| **Expected Lifespan** | 5+ years with maintenance and periodic updates |

The specifications demonstrate that GyMMS implements enterprise-grade technical architecture providing robust performance, comprehensive security, and scalable design appropriate for small business deployment while maintaining simplicity and affordability that distinguish it from complex enterprise software requiring specialized IT support and substantial licensing costs.
