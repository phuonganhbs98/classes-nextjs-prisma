import { PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    interface Global {
      prisma: any;
    }
  }
}

let prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
});


// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient({
//     log: [{ level: 'query', emit: 'event' }],
//   });
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient({
//       log: [{ level: 'query', emit: 'event' }],
//     });
//   }
//   prisma = global.prisma;
// }
prisma.$on("query", e => {
  console.log({query: e.query, params: e.params})
})
export default prisma;
