# Billify

---

## Table of Contents

- [Overview](#overview-pencil)
- [Demo](#demo-link)
- [Technologies Used](#technologies-used)
  - [Core Technologies](#core-technologies-computer)
  - [Tools](#tools-hammer_and_wrench)
  - [Additional Dependencies](#additional-dependencies-package)
- [Features](#features-sparkles)
- [Prerequisites](#prerequisites-gear)
- [Getting Started](#getting-started-rocket)

---

## Overview :pencil:

Billify is a billing system designed to help small businesses manage their invoicing, customers, and products efficiently. It provides a user-friendly interface for creating invoices, tracking payments, and generating reports.

## Demo :link:

Check out a live demo of Billify [here](https://example.com).

## Technologies Used

This project utilizes a range of modern frameworks, languages, and tools:

### Core Technologies :computer:

- [Typescript](https://www.typescriptlang.org/): Programming Language
- [NextJS](https://nextjs.org/): Web Framework
- [Tailwind](https://tailwindcss.com/): CSS Framework
- [Prisma](https://www.prisma.io/): ORM
- [PostgreSQL](https://www.postgresql.org/): Database

### Tools :hammer_and_wrench:

- [ESLint](https://eslint.org/): Linting Tool
- [Docker](https://www.docker.com/): Containerization

### Additional Dependencies :package:

- [NextAuth](https://next-auth.js.org/): Authentication
- [Shadcn](https://ui.shadcn.com/): UI Library
- [ReactQuery](https://react-query.tanstack.com/): Data Fetching
- [Zod](https://zod.dev/): Typescript schema validation
- [html-to-image](https://www.npmjs.com/package/html-to-image) and [jsPDF](https://www.npmjs.com/package/jspdf): PDF Generation

## Features :sparkles:

- [x] **User Management**: Allows business owners to register accounts and manage user roles.
- [x] **Customer Management**: Enables users to create, view, update, and delete customer information.
- [x] **Product Management**: Provides tools for managing products or services offered by the business.
- [x] **Invoicing**: Allows users to generate invoices, add line items, calculate totals, and specify payment terms.
- [x] **PDF Generation**: Generates PDF invoices from bill details for easy sharing and printing.
- [x] **Security**: Ensures secure authentication and authorization mechanisms to protect sensitive data.
- [x] **Responsive Design**: Offers a responsive and accessible interface for managing bills on various devices.
- [ ] **Email Notifications**: Sends automated email notifications for invoice generation, updates, and payment reminders.
- [ ] **Dashboard**: Displays a summary of total sales and revenue on the dashboard.

## Prerequisites :gear:

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/)

- npm or yarn

- [Docker](https://www.docker.com/) (For Development)

## Getting Started :rocket:

1. **Installation**: Clone the repository and install dependencies using `npm install`.

    ```bash
    git clone https://github.com/uttam-li/billify.git
    cd billify
    npm install 
    ```

2. **Database Setup**: Set up your database and configure the connection in the `.env` file.

    As an example, you can use [Docker](https://www.docker.com/) to run a PostgreSQL database:

    ```bash
    docker run --name PostgreSQL_DB -e POSTGRES_PASSWORD=password -e POSTGRES_DB=billify -d -p 5432:5432 docker.io/postgres
    ```

    This command will start a PostgreSQL database with the following credentials:

    - Username: `postgres`
    - Password: `password`

    Then, specify the database URL in your `.env` file:

    ```properties
    DATABASE_URL="postgresql://postgres:password@localhost:5432/billify"
    ```

3. **Environment Setup**: Define all the necessary variables in your `.env` file.

    ```properties
    # For development
    NEXTAUTH_URL="http://localhost:3000"

    # For production (replace 'your-hosted-url' with your actual hosted URL)
    NEXTAUTH_URL="your-hosted-url"
    
    # Obtain all the secrets from the respective providers
    GOOGLE_ID="<Your Google ID>"
    GOOGLE_SECRET="<Your Google Secret>"
    GITHUB_ID="<Your GitHub ID>"
    GITHUB_SECRET="<Your GitHub Secret>"
    ```

4. **Launch the Application**: Start the development server using the following command:

    ```bash
    # Ensure you are in the root directory of the project
    npm run dev
    ```

5. **Access the Application**: Once the server is running, you can access the Billify application in your web browser.

    Visit [http://localhost:3000](http://localhost:3000) to view your local instance of the application.
