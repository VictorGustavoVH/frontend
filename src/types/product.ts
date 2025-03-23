export type Product = {
  _id?: string; // <- opcional, para referenciar el documento de Mongo
  name: string;
  description: string;
  category: string;
  image: string;
  brand?: string;
  price?: number;
  stock?: number;
};
