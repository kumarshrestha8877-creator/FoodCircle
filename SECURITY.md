# Security Policy

## Supported Versions

FoodCircle actively maintains security updates on the following releases:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

The FoodCircle team takes security seriously, particularly concerning:
* User privacy and location data exposure
* Tampering with camera verification or pickup proof mechanisms
* Delivery confirmation spoofing

### How to Report

If you discover a security vulnerability within FoodCircle:
1. **Do not disclose the vulnerability publicly** in a GitHub issue or discussion.
2. Email your findings directly to the maintainers at `security@foodcircle.org` (or contact through repository maintainer channels).
3. Please include:
   * Description of the vulnerability and potential impact
   * Step-by-step instructions or proof-of-concept to reproduce the issue
   * Affected browser versions or operating systems

### Response Timeline
* **Initial Response:** Within 48 hours.
* **Triage & Status Update:** Within 5 business days.
* **Resolution & Patch:** Deployed to `main` with public disclosure following reasonable remediation time.

---

## Security Best Practices in FoodCircle

* **Camera Permissions:** Always requested explicitly through `navigator.mediaDevices.getUserMedia`. Videos are captured in-memory as object URLs and never broadcasted without explicit user verification.
* **Geolocation Safety:** Exact residential coordinates can be masked or rounded for buyer privacy while preserving route calculation accuracy.
* **No Gallery Uploads:** Anti-scam protection prevents arbitrary malicious file uploads by restricting listing media strictly to live camera capture.
