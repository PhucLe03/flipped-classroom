# E-Learning Website

## Web Design & Implementation Requirements

### 1. Project Overview

The client requires the design and implementation of an **e-learning website** for organizing, publishing, and accessing educational study materials.

The primary purpose of the website is to provide a centralized platform where:

* Students can browse and access study materials.
* Teachers can upload and manage educational content.
* Study materials can be provided in multiple formats, including rich text, YouTube videos, and Google Drive resources.
* Content can be organized clearly so students can easily find the materials they need.

The website should have a **modern, clean, educational, and user-friendly interface**, with a visual identity based on a **yellow-blue color palette**.

---

# 2. Project Objectives

The website should:

1. Provide a centralized repository of learning materials.
2. Make study materials easy to browse, search, and access.
3. Allow teachers to create and manage educational content.
4. Support multiple content types:

   * Rich-text educational content
   * YouTube videos
   * Google Drive resources
5. Provide a clear distinction between teacher/content-management functions and student/visitor functions.
6. Provide a responsive interface for desktop, tablet, and mobile devices.
7. Establish a consistent visual identity using the specified yellow-blue color palette.
8. Provide a **Vietnamese-first user experience** for the target audience.

---

# 3. Target Language

## 3.1 Primary Language

The primary language of the website shall be:

**Vietnamese (Tiếng Việt)**

All major user-facing interfaces should be presented in Vietnamese, including:

* Navigation
* Buttons
* Forms
* Error messages
* Notifications
* User account pages
* Teacher dashboard
* Administration interface
* Study-material metadata
* Help/instructional text

Examples:

* Home → **Trang chủ**
* Study Materials → **Tài liệu học tập**
* Teachers → **Giáo viên**
* Login → **Đăng nhập**
* Register → **Đăng ký**
* Create Material → **Tạo tài liệu**
* Edit → **Chỉnh sửa**
* Delete → **Xóa**
* Publish → **Đăng**
* Draft → **Bản nháp**

## 3.2 Content Language

Teachers should be able to create study materials primarily in Vietnamese.

The rich-text editor must properly support:

* Vietnamese Unicode characters.
* Vietnamese diacritics.
* Copy/paste of Vietnamese text.
* Vietnamese punctuation and typography.

The system should not impose English-only validation or formatting restrictions on educational content.

## 3.3 Future Multilingual Support

The system should preferably be designed so additional languages can be introduced in the future without requiring major architectural changes.

English may be considered as a future secondary language, but **Vietnamese is the required language for the initial release**.

---

# 4. Target Users

## 4.1 Students

Students are the primary consumers of educational content.

Students should be able to:

* Browse study materials.
* Search for materials.
* Filter materials by relevant categories.
* View material details.
* Read rich-text content.
* Watch embedded YouTube videos.
* Access Google Drive resources.
* View teacher/instructor information.

## 4.2 Teachers

Teachers are responsible for creating and managing study materials.

Teachers should be able to:

* Log in to the platform.
* Create new study materials.
* Edit existing materials.
* Delete materials when permitted.
* Upload/publish rich-text content.
* Add YouTube URLs.
* Add Google Drive URLs.
* Organize materials into categories/subjects.
* Manage their own published materials.

## 4.3 Administrator

The administrator manages the overall platform.

Administrators should be able to:

* Manage users.
* Manage teachers.
* Manage study materials.
* Manage categories/subjects.
* Review or remove content.
* Control which content is publicly available.

---

# 5. Core Functional Requirements

## FR-001 — Study Material Listing

The website shall provide a page displaying available study materials.

Each material card/list item should provide relevant information such as:

* Material title
* Short description
* Subject/category
* Teacher/author
* Date published or updated
* Content type
* Thumbnail/image where applicable

The interface should make it easy for students to scan and identify relevant materials.

---

## FR-002 — Study Material Categorization

Study materials shall be organized into categories.

Possible categories include:

* Subject
* Course
* Grade/level
* Topic
* Teacher

The exact classification structure should be configurable by the administrator.

---

## FR-003 — Study Material Search

Users shall be able to search for study materials using keywords.

Search should consider relevant fields such as:

* Material title
* Description
* Subject
* Topic
* Teacher name

Search results should update the displayed material list accordingly.

---

## FR-004 — Study Material Filtering

The website should provide filtering options, for example:

* Subject/category
* Teacher
* Content type
* Educational level

Filters should be easy to use on both desktop and mobile layouts.

---

# 6. Study Material Detail Page

Each study material shall have a dedicated detail page.

The page should support the following content structure:

### Basic Information

* Title
* Description
* Teacher/author
* Category/subject
* Publication/update date

### Main Content

The material may contain one or more of the following:

**Rich Text**

Teachers can create formatted educational content using a rich-text editor.

The editor should support common formatting such as:

* Headings
* Paragraphs
* Bold
* Italic
* Underline
* Ordered lists
* Unordered lists
* Links
* Images where required
* Tables where required

**YouTube Content**

Teachers can provide a YouTube URL.

The system should automatically render the URL as an embedded video when possible.

**Google Drive Content**

Teachers can provide a Google Drive URL.

The system should display the resource as an accessible link or embedded resource, depending on the supported Google Drive format.

---

# 7. Teacher Content Management

## FR-005 — Create Material

Teachers shall be able to create a new study material.

The create form should contain at minimum:

* Title
* Description
* Category/subject
* Rich-text content
* YouTube URL
* Google Drive URL
* Thumbnail/image where applicable
* Publication status

The teacher should be able to use one or multiple content types in the same material.

Example:

**Bài học: Giới thiệu về Giải tích**

→ Nội dung rich text
→ Video bài giảng YouTube
→ Tài liệu bài tập trên Google Drive

---

## FR-006 — Rich Text Editor

The content management interface shall provide a rich-text editor.

The editor should provide an intuitive WYSIWYG experience so teachers do not need to write HTML manually.

Minimum formatting capabilities:

* Heading levels
* Paragraphs
* Bold
* Italic
* Text alignment
* Lists
* Hyperlinks
* Block quotes
* Undo/redo

Optional capabilities:

* Image upload
* Table insertion
* Code blocks
* Mathematical formulas

The final content should be rendered consistently on the public study-material page.

---

## FR-007 — YouTube URL

Teachers shall be able to enter a YouTube URL.

The system should:

1. Validate the provided URL.
2. Extract the video identifier where applicable.
3. Embed the video in the study-material page.
4. Display an appropriate fallback link when embedding is unavailable.

The website should not require teachers to manually write embed HTML.

---

## FR-008 — Google Drive URL

Teachers shall be able to enter a Google Drive URL.

The system should:

1. Validate the URL format.
2. Store the resource URL.
3. Display the resource as a clearly identifiable link or supported embedded document.
4. Open the resource without compromising the user's account or browser security.

---

## FR-009 — Edit Material

Teachers shall be able to edit materials that they own or are authorized to manage.

Changes should update the published content while maintaining the material's basic metadata.

---

## FR-010 — Delete Material

Authorized teachers and administrators shall be able to delete materials.

The system should use confirmation before permanent deletion.

Where appropriate, a soft-delete mechanism may be implemented.

---

# 8. Publication Workflow

The system should support content states such as:

**Draft → Published → Unpublished**

### Draft

The material is being prepared and is not visible to students.

### Published

The material is publicly available to authorized users.

### Unpublished

The material remains stored in the system but is no longer publicly visible.

Administrators may optionally review teacher-created materials before publication:

**Draft → Pending Review → Published**

---

# 9. Teacher Dashboard

Teachers should have a dedicated dashboard.

The dashboard should provide:

* Number of materials created.
* Published materials.
* Draft materials.
* Recently updated materials.
* Quick action to create new material.
* List of owned materials.

Example primary actions:

**Tạo tài liệu | Tài liệu của tôi | Hồ sơ**

---

# 10. Student/User Interface

The student-facing interface should prioritize content discovery and readability.

### Main navigation

The navigation should provide access to:

* Trang chủ
* Tài liệu học tập
* Môn học / Danh mục
* Giáo viên
* Giới thiệu
* Đăng nhập

Authenticated users may additionally see:

* Tài khoản
* Tài liệu đã lưu, if implemented

---

# 11. Homepage

The homepage should provide a clear overview of the platform.

Recommended sections:

### Hero Section

* Main platform title/message in Vietnamese
* Short Vietnamese description
* Search bar
* Primary CTA such as **"Khám phá tài liệu"**

### Featured Materials

Highlight selected or recently published materials.

### Categories

Display major subjects/categories for quick navigation.

### Featured Teachers

Show selected teachers/instructors and their available materials.

### Platform Introduction

Briefly explain the purpose and benefits of the e-learning platform.

### Footer

Include:

* Navigation links
* Contact information
* Social links where applicable
* Copyright information

---

# 12. UI / UX Requirements

## 12.1 Design Style

The visual design should be:

* Modern
* Clean
* Friendly
* Educational
* Professional
* Easy to read
* Content-focused

The interface should avoid excessive decoration that interferes with learning content.

---

# 13. Color Palette

The primary visual identity shall use the client's specified **yellow-blue color palette**.

| Color            | Hex       | RGB                  | Suggested Usage                                 |
| ---------------- | --------- | -------------------- | ----------------------------------------------- |
| **Blue**         | `#006199` | `rgb(0, 97, 153)`    | Primary color, navigation, headings, buttons    |
| **Light Blue**   | `#8ACFF8` | `rgb(138, 207, 248)` | Secondary backgrounds, highlights, hover states |
| **Light Yellow** | `#F4EB6C` | `rgb(244, 235, 108)` | Supporting backgrounds, highlights              |
| **Yellow**       | `#FFD444` | `rgb(255, 212, 68)`  | Primary accents, CTA elements, attention areas  |

### Suggested Color Hierarchy

**Primary**
`#006199`

Use for:

* Main navigation
* Primary buttons
* Important headings
* Links
* Active states

**Secondary**
`#8ACFF8`

Use for:

* Secondary buttons
* Information panels
* Cards
* Background sections
* Hover states

**Accent**
`#FFD444`

Use for:

* Main CTA buttons
* Important highlights
* Notifications
* Selected states

**Supporting Accent**
`#F4EB6C`

Use for:

* Decorative backgrounds
* Highlight sections
* Educational callouts

Neutral colors such as white, dark gray, and light gray may be used alongside the primary palette for readability and visual balance.

---

# 14. Typography

The website should use a clean and highly readable font that has good Vietnamese Unicode support.

Recommended characteristics:

* Modern sans-serif
* Strong readability at small sizes
* Clear distinction between headings and body text
* Suitable for long educational content
* Full Vietnamese character support

Typography should maintain consistent hierarchy:

**H1 → H2 → H3 → Body → Caption**

The final font selection should be defined in the UI design system.

---

# 15. Responsive Design

The website shall support:

* Desktop
* Laptop
* Tablet
* Mobile

Responsive behavior should cover:

* Navigation
* Material cards
* Search/filter interface
* Rich-text content
* Embedded YouTube videos
* Google Drive resources
* Teacher dashboard
* Content management forms

Embedded videos should preserve an appropriate aspect ratio across screen sizes.

---

# 16. Technical Requirements

## 16.1 Frontend

The frontend should use a modern web technology stack such as:

* React / Next.js
* Vue / Nuxt

The final framework should be selected based on project requirements and maintainability.

## 16.2 Backend

The backend should provide APIs for:

* Authentication
* Users
* Teachers
* Study materials
* Categories
* Content management
* Publication status

Possible technologies include:

* Node.js / NestJS
* Python / FastAPI / Django
* Java / Spring Boot
* .NET

## 16.3 Database

A relational database such as:

* PostgreSQL
* MySQL

should be used to store:

* Users
* Teachers
* Study materials
* Categories
* Content metadata
* URLs
* Publication status
* Timestamps

---

# 17. Authentication & Authorization

The system shall support:

* User registration
* Login
* Logout
* Password reset
* Role-based access control

At minimum, the following permissions should exist:

| Function             | Student | Teacher | Admin |
| -------------------- | ------: | ------: | ----: |
| View materials       |       ✓ |       ✓ |     ✓ |
| Search materials     |       ✓ |       ✓ |     ✓ |
| Create material      |       ✗ |       ✓ |     ✓ |
| Edit own material    |       ✗ |       ✓ |     ✓ |
| Delete own material  |       ✗ |       ✓ |     ✓ |
| Manage all materials |       ✗ |       ✗ |     ✓ |
| Manage users         |       ✗ |       ✗ |     ✓ |
| Manage categories    |       ✗ |       ✗ |     ✓ |

---

# 18. Security Requirements

The implementation should include:

* Secure authentication.
* Password hashing.
* Role-based authorization.
* Server-side input validation.
* URL validation.
* Secure rich-text content handling.
* Protection against malicious HTML/script injection.
* Secure file handling if image/file upload is implemented.
* HTTPS in production.

Rich-text content must be sanitized before being rendered to users.

---

# 19. Performance Requirements

The website should:

* Load efficiently on normal internet connections.
* Optimize images.
* Lazy-load appropriate resources.
* Avoid unnecessary API requests.
* Use pagination or lazy loading for large material lists.
* Ensure embedded external resources do not unnecessarily block the page.

Because YouTube and Google Drive are external services, their loading behavior should be handled carefully to avoid degrading the overall user experience.

---

# 20. SEO Requirements

Public study-material pages should support:

* SEO-friendly URLs.
* Vietnamese page titles.
* Vietnamese meta descriptions.
* Proper heading hierarchy.
* Open Graph metadata.
* Sitemap.
* Robots.txt.

Example:

`/tai-lieu/toan-hoc/gioi-thieu-giai-tich`

rather than:

`/page?id=123`

---

# 21. Design Deliverables

The design phase should include:

### UX

* Sitemap
* User flows
* Wireframes

### UI

* Design system
* Color system
* Typography system
* Component library
* Responsive layouts
* High-fidelity mockups

### Main Screens

At minimum:

1. Trang chủ
2. Danh sách tài liệu học tập
3. Chi tiết tài liệu
4. Đăng nhập
5. Đăng ký
6. Dashboard giáo viên
7. Trang tạo tài liệu
8. Trang chỉnh sửa tài liệu
9. Dashboard quản trị
10. Quản lý người dùng

---

# 22. Implementation Deliverables

The implementation should deliver:

* Responsive frontend.
* Backend/API.
* Database.
* Authentication system.
* Teacher content-management functionality.
* Rich-text editor.
* YouTube integration.
* Google Drive integration.
* Study-material listing/search/filtering.
* Role-based access control.
* Admin management.
* Vietnamese user interface.
* Production deployment configuration.
* Basic technical documentation.

---

# 23. MVP Scope

The recommended **MVP** should focus on the client's core requirement.

### Student/User

**Trang chủ → Tài liệu học tập → Tìm kiếm/Lọc → Xem tài liệu**

### Teacher

**Đăng nhập → Dashboard giáo viên → Tạo tài liệu → Thêm Rich Text / YouTube / Google Drive → Đăng → Chỉnh sửa/Xóa**

### Administrator

**Đăng nhập → Quản lý người dùng → Quản lý giáo viên → Quản lý tài liệu → Quản lý danh mục**

The MVP does **not** require payment, certificates, quizzes, assignments, live classes, or advanced learning analytics unless the client adds these requirements later.

---

# 24. Future Enhancement

The architecture should allow future implementation of:

* User bookmarks/favorites.
* Comments and discussions.
* Course enrollment.
* Learning progress tracking.
* Quizzes and assessments.
* Certificates.
* Notifications.
* Online payment.
* Advanced analytics.
* AI-powered learning assistant.
* Recommendation system.
* Mobile application.
* English or additional language support.

---

# 25. Acceptance Criteria

The implementation should satisfy the following minimum criteria:

1. Users can browse a list of study materials.
2. Users can search and filter study materials.
3. Users can open a study-material detail page.
4. Teachers can create study materials.
5. Teachers can enter and format content using a rich-text editor.
6. The rich-text editor correctly supports Vietnamese Unicode and diacritics.
7. Teachers can attach YouTube URLs.
8. Teachers can attach Google Drive URLs.
9. YouTube content is displayed correctly when embedding is supported.
10. Google Drive resources are accessible from the material page.
11. Teachers can edit and manage their own materials.
12. Administrators can manage users, teachers, materials, and categories.
13. Role-based permissions prevent unauthorized content modification.
14. The website is responsive on desktop and mobile.
15. The yellow-blue brand palette is consistently applied throughout the interface.
16. The initial user-facing interface is available in Vietnamese.
17. Rich-text content is safely sanitized and rendered.
18. No critical functional or security issues remain before production deployment.

---

# 26. Open Items for Client Confirmation

The following details should be confirmed before the UI/implementation phase:

* Is the platform intended for internal use or public access?
* Are students required to create accounts, or can materials be viewed anonymously?
* Should teachers require administrator approval before publishing?
* Can a teacher edit/delete only their own content?
* Should Google Drive documents be embedded or opened as external links?
* Should YouTube videos be embedded directly?
* Are images/files allowed inside the rich-text editor?
* What categories/subjects are required?
* Does the client have an existing logo/brand guideline?
* Should the website support only Vietnamese in the first release?
* Does the client require English or multilingual support in a later phase?
* Is an administrator dashboard required for the first release?
* Is there a need for course enrollment and student progress tracking in the initial version?

---

# 27. Summary of Core Scope

The initial website can be summarized as:

**E-Learning Platform**

**Ngôn ngữ:**
→ Vietnamese (Tiếng Việt)

**Students**
→ Discover study materials
→ Search / Filter
→ Read content
→ Watch YouTube lessons
→ Access Google Drive resources

**Teachers**
→ Create materials
→ Rich-text content editor
→ Add YouTube URL
→ Add Google Drive URL
→ Publish / Edit / Delete materials

**Administrators**
→ Manage users
→ Manage teachers
→ Manage materials
→ Manage categories

**Visual Identity**
→ Primary Blue: `#006199`
→ Light Blue: `#8ACFF8`
→ Light Yellow: `#F4EB6C`
→ Yellow: `#FFD444`
