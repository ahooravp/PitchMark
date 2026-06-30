# 🚀 Startup Directory Platform

**[Live Demo](https://your-vercel-deployment-link.vercel.app)** | **[Video Walkthrough](Link to a Loom or YouTube video if you have one)**

A modern, full-stack web application built for founders to pitch their startups and for users to discover the next big thing. 

This platform provides a seamless, highly polished user experience for submitting startup details, complete with a Markdown editor for comprehensive pitches, secure image uploads, and an aesthetic glassmorphic UI. Under the hood, it utilizes a strict, robust architecture leveraging Next.js Server Actions, Sanity CMS, and uncompromising client-to-server validation.

## ✨ Key Features

* **Secure Authentication:** Passwordless OAuth login via NextAuth (Auth.js) supporting both GitHub and Google providers, with normalized database mapping.
* **Founder Profiles:** Automatically generated user profiles with the ability to update personal bios and avatars securely.
* **Rich Text Pitches:** Integrated Markdown editor (`@uiw/react-md-editor`) allowing founders to format their startup pitches beautifully.
* **Optimized Submission Pipeline:** * Strict mathematical client-side validation using Zod.
  * Decoupled background image uploading for heavy assets to prevent submission bottlenecks.
  * Real-time, progressive upload UI with controlled state management to prevent data loss on failed submissions.
* **Modern UI/UX:** Built with Tailwind CSS, featuring visual harmony, interactive glass effects (`backdrop-blur`), and responsive design.
* **Error Tracking:** Fully integrated with Sentry for real-time edge and server crash monitoring.

## 🛠 Tech Stack

* **Framework:** Next.js (App Router, Server Actions)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database & Content Management:** Sanity CMS (Headless)
* **Authentication:** NextAuth.js (Auth.js)
* **Validation:** Zod
* **Monitoring:** Sentry

## 🏗 Architecture Highlights

This project prioritizes data integrity and server protection without compromising the user experience:
1. **The Double-Boundary Validation:** Form submissions are strictly validated on the client side via Zod to preserve user input state, and then validated again on the server to prevent malicious API bypassing.
2. **Decoupled Asset Management:** Heavy image payloads are intercepted at the file-selection level and uploaded to Sanity's secure asset servers in the background. The final Server Action only mutates lightweight reference strings, ensuring database writes execute in milliseconds.
3. **Type-Safe Ecosystem:** From Sanity query projections to form states and Zod schemas, the entire data pipeline is strictly typed to catch errors at compile time.

## 🔄 The User Flow

1. **Authentication:** Users sign in securely using their existing GitHub or Google accounts.
2. **The Pitch:** Founders navigate to the submission form to pitch their startup.
3. **Background Processing:** As the founder uploads a thumbnail, the image is securely transmitted to the Sanity asset server in the background, keeping the UI completely unblocked.
4. **Validation & Publishing:** Upon clicking submit, the form validates the text payload and the image reference ID. If successful, the document is instantly compiled and published to the live directory.