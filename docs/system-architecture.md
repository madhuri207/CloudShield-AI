# CloudShield AI – System Architecture

## 1. Architecture Overview

CloudShield AI follows a modular architecture consisting of infrastructure monitoring, data collection, backend services, database storage, security analysis, AI/ML anomaly detection, risk analysis, alert management, incident management, and a web dashboard.

## 2. Data Flow

Cloud/server infrastructure
        ↓
HCD Monitoring Module
        ↓
Data Collection
        ↓
Backend/API
        ↓
Database
        ↓
Security and Log Analysis
        ↓
AI/ML Anomaly Detection
        ↓
Risk Analysis
        ↓
Alert and Incident Management
        ↓
Web Dashboard

## 3. HCD Integration

The existing HCD monitoring module will be integrated into CloudShield AI as the infrastructure monitoring and data collection layer.

It will provide information such as:

- CPU usage
- RAM usage
- Disk usage
- Network activity
- Server health

This information will be sent to the CloudShield AI backend for storage and further analysis.

## 4. Backend Layer

The backend will be developed using Python and FastAPI.

It will provide APIs for:

- Receiving monitoring data
- Receiving security events
- Reading stored data
- Running analysis
- Returning AI/ML results
- Managing alerts
- Managing incidents
- Providing data to the dashboard

## 5. Database Layer

The database will store:

- Infrastructure metrics
- Security events
- Detected anomalies
- Risk information
- Alerts
- Incidents
- Incident status
- Historical records

SQLite will be used during initial development. PostgreSQL can be used for the production/cloud deployment stage.

## 6. AI/ML Layer

The AI/ML module will analyze collected data and identify unusual patterns.

An anomaly detection approach such as Isolation Forest will be evaluated for identifying abnormal infrastructure or security-related behavior.

The AI model will produce an anomaly result that will be passed to the risk analysis component.

## 7. Risk Analysis Layer

The risk analysis component will evaluate detected events and assign a severity level.

Example levels:

- Low
- Medium
- High
- Critical

Risk information will be displayed on the dashboard and can trigger alerts.

## 8. Alert Layer

The alert module will generate alerts for important or high-risk events.

Alerts will be stored so that users can review them later.

## 9. Incident Management Layer

Important security events can be converted into incidents.

Authorized users can:

- View incidents
- Investigate incidents
- Add notes
- Change incident status
- Resolve incidents

## 10. Dashboard

The web dashboard will provide centralized visibility into:

- Infrastructure health
- Monitoring metrics
- Security events
- AI anomalies
- Risk levels
- Alerts
- Incidents
- Historical information

## 11. Deployment

The application will initially be developed and tested locally.

Docker and AWS deployment can be added during the deployment stage to demonstrate cloud-based operation.

## 12. Security Principle

Security will be considered throughout the architecture, including authentication, authorization, secure configuration, protected credentials, input validation, and controlled access to system resources.