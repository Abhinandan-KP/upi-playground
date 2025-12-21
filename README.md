UPI Playground
A specialized developer tool designed to simulate, generate, and test Unified Payments Interface (UPI) deep-linking and QR code flows. This playground allows developers to visualize how payment requests behave across different mobile handles and merchant parameters.

🚀 Overview
The UPI Playground provides an interactive environment to construct UPI URI strings according to the NPCI specifications. It helps in debugging payment strings, testing merchant VPA (Virtual Payment Address) integration, and ensuring that mobile intent triggers work correctly across various UPI-enabled apps.

🛠 Tech Stack
I built this project using a modern, type-safe stack for maximum performance and a polished UI:

Framework: React with Vite for an ultra-fast dev experience.

Language: TypeScript to ensure robust handling of payment parameters.

Styling: Tailwind CSS for a sleek, responsive, and mobile-first design.

UI Components: shadcn/ui for accessible, professional-grade components.

Utilities: QR Code Styling for real-time, customizable QR generation.

✨ Features
Dynamic URI Generation: Generate upi://pay?... strings in real-time as you type.

Interactive QR Previews: Instant QR code generation with support for custom branding/logos.

Parameter Validation: Built-in checks for mandatory fields like pa (Payee Address) and pn (Payee Name).

Intent Testing: Copy or share generated links to test mobile app triggering on iOS and Android.

Amount Formatting: Automatic validation for transaction limits and decimal precision.

💻 Local Development
To run the playground locally and experiment with the source code:

Clone the project



Bash

npm install
Launch the development server

Bash

npm run dev
📖 How to Use
Input Details: Enter the Payee VPA, Merchant Name, and Transaction Note.

Set Amount: Specify the transaction value (optional for open-ended QR codes).

Customize: Adjust the QR code style or add a custom merchant logo.

Test: Use a UPI-enabled app (PhonePe, Google Pay, Paytm) to scan the generated QR or click the intent link on a mobile device.

Note: This is a frontend simulation tool.

