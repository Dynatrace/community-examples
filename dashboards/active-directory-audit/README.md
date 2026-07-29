# 🛡️ Active Directory Audit Dashboards

This repository contains a **collection of Dynatrace dashboards** designed to provide **deep visibility into Active Directory activity, security events, and change auditing**.

⚠️ **Important:** This is **not a single dashboard**. It is a **set of multiple dashboards**, each focused on a specific Active Directory use case such as logins, lockouts, password changes, group modifications, GPO changes, and file auditing.

Together, these dashboards enable security, IAM, and operations teams to **detect anomalies faster, investigate incidents efficiently, and support compliance requirements**.

---

## 📚 Contained Dashboards

0. [Executive Summary](#0️⃣-executive-summary-dashboard) – High-level Active Directory activity snapshot  
1. [Password Changes](#1️⃣-password-changes-dashboard) – User and administrator password reset tracking  
2. [Lockout Source Investigation](#2️⃣-lockout-source-investigation-dashboard) – Root cause analysis for account lockouts  
3. [Account Changes Audit](#3️⃣-account-changes-audit-dashboard) – User lifecycle and account modifications  
4. [Group Modifications](#4️⃣-group-modifications-dashboard) – Group membership and privilege changes  
5. [Lockout & Disable Root Cause](#5️⃣-lockout--disable-root-cause-dashboard) – Combined investigation dashboard  
6. [Extended Attributes Audit](#6️⃣-extended-attributes-audit-dashboard) – Deep audit of directory attribute changes  
7. [User & OU Movement Tracking](#7️⃣-user--ou-movement-tracking-dashboard) – Object moves and renames  
8. [GPO Changes](#8️⃣-gpo-changes-dashboard) – Group Policy Object modifications  
9. [File Audit (DFS)](#9️⃣-file-audit-dfs-dashboard) – File access and permission auditing  

Each dashboard can be used independently but is **designed to work together** for faster investigations and better visibility.

---

## 0️⃣ Executive Summary Dashboard

<img width="1727" height="822" alt="00_Executive_Summary" src="https://github.com/user-attachments/assets/3f9639ec-0933-4800-bdc8-a65516750770" />

### 🎯 Purpose

Provides a **quick snapshot of your Active Directory login and change activity**, focusing on authentication behavior, security events, and directory modifications.

This dashboard is ideal as a **starting point** for daily monitoring and executive-level visibility.

### 📊 What You’ll See

- **Successful vs. Failed Logins**
- **Account Lockouts and Kerberos Pre-Authentication Failures**
- **Password Changes and Administrator Resets**
- **Accounts Created, Disabled, and Deleted**
- **Group Membership Adds and Removes**
- **GPO Changes and Directory Object Moves**
- **File Server / DFS Auditing Summaries** (if file or DFS servers are connected)

---

## 1️⃣ Password Changes Dashboard

<img width="1723" height="782" alt="01_Password_Changes" src="https://github.com/user-attachments/assets/90df07c8-3fc6-4bb9-a6cd-163ebfaf0994" />

### 🎯 Purpose

Tracks **where and by whom passwords are being changed or reset**.

This helps ensure:
- Administrators follow expected procedures  
- SSO-synced accounts update correctly  
- Users can successfully reset their own passwords  

### 📊 What You’ll See

- **User-initiated password changes vs. administrator resets**
- **Password change activity over time**
- **Which account or domain performed the password update**
- **Where password resets are originating from**

---

## 2️⃣ Lockout Source Investigation Dashboard

<img width="1726" height="787" alt="02_Lockout_Source_Investigation" src="https://github.com/user-attachments/assets/9cf38b44-fab6-46cb-b787-b851617e78dc" />

### 🎯 Purpose

Identifies the **source of account lockouts** and pinpoints the **device, IP address, or client** responsible.

Optimized for **incident response and troubleshooting**.

### 📊 What You’ll See

- **Summary tiles** for:
  - Account lockouts and administrator unlocks  
  - Failed logins  
  - Kerberos pre-authentication failures  
- **Lockout events over time**
- **Detailed views** showing:
  - Which accounts are locked out  
  - Where login attempts originate  
- **Top locked-out users**
- **Top devices causing lockouts**
- **Top failed logins and pre-auth failures by user and IP/client**

---

## 3️⃣ Account Changes Audit Dashboard

<img width="1503" height="973" alt="03_Account_Changes_Audit" src="03_Account_Changes_Audit.png" />

### 🎯 Purpose

Provides a **complete audit trail of Active Directory account lifecycle changes**.

Covers:
- Account creation (4720)
- Modification (4738)
- Enable (4722)
- Disable (4725)
- Deletion (4726)

### 📊 What You’ll See

- **Summary tiles** for accounts created, modified, enabled, disabled, and deleted
- **Account change activity over time**
- **Detailed breakdowns** showing:
  - Which account performed the change  
  - Which account was affected  
- **Top accounts performing changes**

---

## 4️⃣ Group Modifications Dashboard

<img width="1718" height="782" alt="04_Group_Modifications" src="https://github.com/user-attachments/assets/5cb3d86b-e1e8-41e2-97f4-06a68a374e40" />

### 🎯 Purpose

Monitors **group membership and privilege changes**, a critical area for security and compliance.

### 📊 What You’ll See

- **Summary of group membership adds, removals, and changes**
- **Domain Admin group additions**
- **Group modification activity over time**
- **Detailed views** showing:
  - Who performed the change  
  - Who was added or removed  
  - Which group was affected  

---

## 5️⃣ Lockout & Disable Root Cause Dashboard

<img width="1722" height="782" alt="05_Lockout_Disable_Root_Cause" src="https://github.com/user-attachments/assets/a92ccfd1-f8a7-4c24-9802-cdfd37fee8da" />

### 🎯 Purpose

Investigates the **root causes of account lockouts and account disable events** by correlating multiple authentication and directory events.

### 📊 What You’ll See

- **Summary of**:
  - Account lockouts  
  - Account disables  
  - Failed logins  
  - Kerberos failures  
- **Combined activity view of related events**
- **Detailed analysis** showing:
  - Where lockouts originate  
  - Who is disabling accounts  
  - Why logins are failing  
  - Repeat offenders and patterns  

---

## 6️⃣ Extended Attributes Audit Dashboard

<img width="1681" height="813" alt="06_Extended_Attributes_Audit" src="https://github.com/user-attachments/assets/943a6f24-147a-49f4-aa09-09886e18c84b" />

### 🎯 Purpose

Audits **changes to extended directory attributes** using **Directory Service Changes events (5136)**.

### 📊 What You’ll See

- **Summary of attribute change volume**
- **Attribute change activity over time**
- **Detailed views** showing:
  - Who made the change  
  - Which object was affected  
  - Old and new attribute values  
- **Top modified attributes**
- **Top accounts making changes**

---

## 7️⃣ User & OU Movement Tracking Dashboard

<img width="1746" height="708" alt="07_User_OU_Movement_Tracking" src="https://github.com/user-attachments/assets/683afc03-0dc2-4883-ab0d-4e8119afe16e" />

### 🎯 Purpose

Tracks **directory object movement and renames**, including users and organizational units.

### 📊 What You’ll See

- **Summary of objects moved and renamed**
- **Movement and rename activity over time**
- **Details on who performed the move or rename**
- **Old DN and New DN locations**

---

## 8️⃣ GPO Changes Dashboard

<img width="1683" height="787" alt="08_GPO_Changes" src="https://github.com/user-attachments/assets/27b906e9-c90f-451d-a5de-e064f4dcc52e" />

### 🎯 Purpose

Confirms **who modified Group Policy Objects** and reviews **which settings were changed**.

### 📊 What You’ll See

- **Summary of GPO modifications and domain policy changes**
- **Changes over time activity**
- **Detailed views** showing:
  - Who made the change  
  - Which values were modified  
  - Whether settings were added or deleted  

---

## 9️⃣ File Audit (DFS) Dashboard

<img width="1722" height="812" alt="09_File_Audit_DFS" src="https://github.com/user-attachments/assets/8f5a62a5-eb63-4410-adc6-7444ffdc5c01" />

### 🎯 Purpose

Audits **file access and permission changes** on DFS and file servers.

### 📊 What You’ll See

- **Summary of file access, handles, and permission changes**
- **File activity over time**
- **Detailed audit views** showing:
  - Who accessed which file  
  - When the access occurred  
- **Top users accessing files**
- **Top files accessed**

---
