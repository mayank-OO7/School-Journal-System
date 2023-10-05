declare module "knex/types/tables" {
  export interface Student {
    id: number;
    username: string;
    name: string;
    hash: string;
    salt: string;
    journals: string[];
  }

  export interface Journal {
    id: number;
    desc: string;
    title: string;
    publishedBy: string;
    publishedfor: [string];
    timestamp: string;
    videoPath?: string;
    imagepath?: string;
    pdfPath?: string;
    url?: string;
  }

  interface Table {
    students: Student;
  }
}
