# CloudShield AI – Use Cases

## 1. Actors

### Administrator

The Administrator manages the CloudShield AI platform and monitors infrastructure and security information.

### Security Analyst

The Security Analyst investigates suspicious activities, anomalies, risks, and security incidents.

---

## 2. Use Case: User Login

**Actor:** Administrator / Security Analyst

**Purpose:** Allow authorized users to access the platform securely.

**Flow:**

1. User opens the login page.
2. User enters username/email and password.
3. System validates the credentials.
4. If credentials are valid, the user is logged in.
5. System displays the appropriate dashboard.

---

## 3. Use Case: Monitor Infrastructure

**Actor:** Administrator

**Purpose:** Monitor the health and performance of cloud/server infrastructure.

**Flow:**

1. System collects infrastructure metrics.
2. Metrics are processed and stored.
3. Administrator opens the monitoring dashboard.
4. System displays CPU, RAM, disk, network, and server health information.
5. Administrator reviews the current infrastructure status.

---

## 4. Use Case: Analyze Security Events

**Actor:** Security Analyst / Administrator

**Purpose:** Review security-related events collected from the monitored environment.

**Flow:**

1. System collects relevant security information.
2. Security events are stored.
3. User opens the security events section.
4. System displays the available events.
5. User reviews suspicious or important events.

---

## 5. Use Case: Detect Anomaly

**Actor:** System

**Purpose:** Identify unusual behavior in collected monitoring or security data.

**Flow:**

1. System receives monitoring/security data.
2. Data is prepared for analysis.
3. AI/ML model analyzes the data.
4. Model identifies normal or anomalous behavior.
5. Detected anomalies are stored.
6. Anomaly information is displayed to authorized users.

---

## 6. Use Case: Risk Analysis

**Actor:** System / Security Analyst

**Purpose:** Determine the severity of detected events.

**Flow:**

1. System receives an event or anomaly.
2. Relevant characteristics are analyzed.
3. A risk/severity level is assigned.
4. The result is stored.
5. The risk level is displayed on the dashboard.

---

## 7. Use Case: Alert Administrator

**Actor:** System

**Purpose:** Notify users about important or high-risk events.

**Flow:**

1. System detects an important event.
2. System determines the event severity.
3. If the event meets the alert condition, an alert is generated.
4. Administrator receives the notification.
5. Alert is recorded in the system.

---

## 8. Use Case: Manage Incident

**Actor:** Administrator / Security Analyst

**Purpose:** Track and manage security incidents.

**Flow:**

1. User opens an incident.
2. User reviews the event and risk information.
3. User investigates the incident.
4. User adds relevant notes.
5. User updates the incident status.
6. Incident can be marked as resolved.

---

## 9. Use Case: View Reports

**Actor:** Administrator / Security Analyst

**Purpose:** Review historical monitoring and security information.

**Flow:**

1. User opens the reports section.
2. User selects the required report.
3. System retrieves historical information.
4. System displays the report.