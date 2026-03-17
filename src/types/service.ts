export interface ICategory {
  _id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IService {
  _id?: string;
  name: string;
  price: number;
  category: string | ICategory;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}
