export type ContentWithRelations = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  coverImage: string;
  status: string;
  publishDate: Date | null;
  isTrending: boolean;
  rating: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  tags: { id: string; name: string; slug: string }[];
};

export type SponsorBlockType = {
  id: string;
  title: string;
  image: string;
  link: string;
  position: string;
  isActive: boolean;
};

export type FilterState = {
  search: string;
  category: string;
  status: string;
  timeRange: string;
  trending: boolean;
};
