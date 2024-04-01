interface Book {
  author: string;
  createdDate: string|null;
  id: number;
  isbn: number;
  price: number;
  pub_date: string;
  publisher: string;
  rating: number | null;
  ratingCount: number | null;
  shortsUrl: string | null;
  summary: string;
  thumbnail: string;
  title: string;
  translator: string | null;
  updatedDate: string | null;
}

interface MainBook {
  author: string;
  created_date: string|null;
  id: number;
  isbn: number;
  price: number;
  pub_date: string;
  publisher: string;
  rating: number | null;
  ratingCount: number | null;
  shorts_url: string | null;
  summary: string;
  thumbnail: string;
  title: string;
  translator: string | null;
  updated_date: string | null;
}


interface AddBook {
  author: string;
  isbn: number;
  price: number;
  pubDate: string;
  publisher: string;
  summary: string;
  thumbnail: string;
  title: string;
}

interface MappingBook {
  bookId: number;
  type: string;
}

interface NaverBook {
  title: string;
  image: string;
  author: string;
  discount: number;
  publisher: string;
  pubdate: string;
  isbn: number;
  description: string;
}

interface BookShorts {
  title: string;
  author: string;
  image: string;
  publisher: string;
  isbn: number;
  src: string;
}
