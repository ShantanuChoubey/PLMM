export const RESOURCE_TYPES = ['PDF', 'Article', 'Video', 'Link', 'Notes']

export const RESOURCE_CATEGORIES = ['Frontend', 'Backend', 'Career', 'Interview', 'General']

export const MENTOR_RESOURCES = [
  { id: 'res1', title: 'React Architecture Guide', type: 'PDF', category: 'Frontend', uploadedAt: '2026-05-20', downloads: 48, description: 'Component patterns and state management best practices.' },
  { id: 'res2', title: 'System Design Primer', type: 'Article', category: 'Backend', uploadedAt: '2026-05-15', downloads: 62, description: 'Scalable system design fundamentals for beginners.' },
  { id: 'res3', title: 'Interview Prep Checklist', type: 'Notes', category: 'Interview', uploadedAt: '2026-05-10', downloads: 35, description: 'Step-by-step technical interview preparation guide.' },
  { id: 'res4', title: 'TypeScript Deep Dive', type: 'Video', category: 'Frontend', uploadedAt: '2026-04-28', downloads: 29, description: '45-minute walkthrough of advanced TypeScript patterns.' },
  { id: 'res5', title: 'Portfolio Review Template', type: 'Link', category: 'Career', uploadedAt: '2026-04-15', downloads: 41, description: 'Notion template for structuring developer portfolios.' },
]

export const HUB_RESOURCES = [
  { id: 'hub-1', title: 'React Hooks Complete Guide', description: 'Everything you need to know about React hooks with examples.', type: 'PDF', category: 'Frontend Development', uploader: 'Sarah Chen', views: 420, downloads: 156, rating: 4.8, tags: ['React', 'Hooks'], uploadedAt: '2026-06-05', recentlyViewed: true },
  { id: 'hub-2', title: 'Binary Search Patterns', description: 'Common binary search variations and problem-solving templates.', type: 'Notes', category: 'DSA', uploader: 'Elena Rodriguez', views: 310, downloads: 98, rating: 4.6, tags: ['Algorithms', 'Binary Search'], uploadedAt: '2026-06-03', recentlyViewed: true },
  { id: 'hub-3', title: 'Microservices Architecture', description: 'Design patterns for building microservices at scale.', type: 'Article', category: 'System Design', uploader: 'James Wilson', views: 580, downloads: 210, rating: 4.9, tags: ['Microservices', 'Architecture'], uploadedAt: '2026-05-30', recentlyViewed: false },
  { id: 'hub-4', title: 'Python Data Analysis Crash Course', description: 'Pandas and numpy essentials for data analysis.', type: 'Video', category: 'Machine Learning', uploader: 'Marcus Johnson', views: 245, downloads: 72, rating: 4.5, tags: ['Python', 'Pandas'], uploadedAt: '2026-05-28', recentlyViewed: true },
  { id: 'hub-5', title: 'STAR Method Interview Guide', description: 'Master behavioral interviews with the STAR framework.', type: 'PDF', category: 'Interview Preparation', uploader: 'Aisha Patel', views: 390, downloads: 145, rating: 4.7, tags: ['Interviews', 'Behavioral'], uploadedAt: '2026-05-25', recentlyViewed: false },
  { id: 'hub-6', title: 'AWS Fundamentals Playlist', description: 'Curated YouTube playlist for AWS certification prep.', type: 'YouTube', category: 'Cloud Computing', uploader: 'David Kim', views: 198, downloads: 0, rating: 4.4, tags: ['AWS', 'Cloud'], uploadedAt: '2026-05-22', recentlyViewed: true, externalUrl: 'https://youtube.com' },
  { id: 'hub-7', title: 'Spring Boot Documentation', description: 'Official Spring Boot reference documentation links.', type: 'Documentation', category: 'Backend Development', uploader: 'Chris Morgan', views: 167, downloads: 34, rating: 4.3, tags: ['Java', 'Spring'], uploadedAt: '2026-05-20', recentlyViewed: false },
  { id: 'hub-8', title: 'Full Stack Developer Roadmap', description: 'Complete learning path for full-stack development.', type: 'Course', category: 'Career', uploader: 'Sarah Chen', views: 650, downloads: 280, rating: 4.9, tags: ['Career', 'Roadmap'], uploadedAt: '2026-05-18', recentlyViewed: false },
  { id: 'hub-9', title: 'Database Indexing Strategies', description: 'Deep dive into database indexing and query optimization.', type: 'Presentation', category: 'DBMS', uploader: 'Priya Sharma', views: 134, downloads: 45, rating: 4.5, tags: ['SQL', 'Database'], uploadedAt: '2026-05-15', recentlyViewed: false },
  { id: 'hub-10', title: 'Neural Networks Explained', description: 'Beginner-friendly introduction to neural networks.', type: 'Article', category: 'Machine Learning', uploader: 'Marcus Johnson', views: 289, downloads: 67, rating: 4.6, tags: ['ML', 'Neural Networks'], uploadedAt: '2026-05-10', recentlyViewed: false },
]

export const RESOURCE_USAGE_CHART = [
  { month: 'Jan', views: 120, downloads: 45 },
  { month: 'Feb', views: 180, downloads: 62 },
  { month: 'Mar', views: 240, downloads: 88 },
  { month: 'Apr', views: 310, downloads: 110 },
  { month: 'May', views: 380, downloads: 142 },
  { month: 'Jun', views: 420, downloads: 156 },
]

export function getHubResourceById(id) {
  return HUB_RESOURCES.find((r) => r.id === id) ?? null
}

export const FACULTY_RESOURCES = [
  { id: 'fres1', title: 'Academic Research Methods', type: 'PDF', category: 'General', uploadedAt: '2026-05-18', downloads: 72, description: 'Guide to conducting academic research projects.' },
  { id: 'fres2', title: 'Capstone Project Rubric', type: 'Notes', category: 'Career', uploadedAt: '2026-05-12', downloads: 56, description: 'Evaluation criteria for senior capstone submissions.' },
  { id: 'fres3', title: 'Faculty Mentorship Framework', type: 'Article', category: 'General', uploadedAt: '2026-04-30', downloads: 38, description: 'Structured approach to faculty-led mentorship programs.' },
  { id: 'fres4', title: 'Graduate School Prep', type: 'Video', category: 'Career', uploadedAt: '2026-04-20', downloads: 45, description: 'Overview of graduate school application process.' },
]
