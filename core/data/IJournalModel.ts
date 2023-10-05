export interface IJournalModel {
  description: string;
  publishedBy: string;
  publishedFor: [string];
  imagePath?: string;
  videoPath?: string;
  pdfPath?: string;
  url?: string;
  publishedAt?: string;
  title: string;
}
