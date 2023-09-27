// used to connect to to a prisma db
import { PrismaClient } from "@prisma/client";

// all this from prisma docs on using prisma with nextjs

// this declares a global variable prisma that can hold a reference to a
// PrismaClient instance or be undefined. This pattern allows you to access
// the same database connection throughout your application.
declare global {
  // var prisma is type PrismaClient or undefined
  var prisma: PrismaClient | undefined;
}

// Create Prisma Client Instance:
// This line creates a prismadb variable, which either takes the existing
// globalThis.prisma if it exists or creates a new PrismaClient instance if
// it doesn't. This is a way to ensure that you have a single instance of
// PrismaClient throughout your application.
const prisma = globalThis.prisma || new PrismaClient();
// Assign Prisma Client to Global Variable (Development Only):
// NODE_ENV is an environment variable in Node.js used to determine the
// runtime environment in which your Node.js application is running. It is a
// string that typically takes one of the following values: dev, prod, test etc
// node can auto detect if we are in dev, but for prod we should but in .env
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
