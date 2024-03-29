interface Book {
  author: string;
  created_date: string;
  id: number;
  isbn: number;
  price: number;
  pub_date: string;
  publisher: string;
  rating: number | null;
  rating_count: number | null;
  shorts_url: string | null;
  summary: string;
  thumbnail: string;
  title: string;
  translator: string | null;
  updated_date: string;
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
