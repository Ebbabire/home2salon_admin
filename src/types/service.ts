export interface ICategory {
  _id?: string;
  name: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IService {
  _id?: string;
  name: string;
  price: number;
  category_id: string | ICategory;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
