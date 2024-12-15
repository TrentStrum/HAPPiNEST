export interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  // Add other blog post fields
}

export interface BlogPostFormData {
  title: string;
  content: string;
  // Add other form fields
} 