export interface Product {
    id: string;
    name: string;
    price: string;
    img: string;
    link: string;
  }
  
  export interface ScrapeResult {
    name: string;
    products: Product[];
    logo: string;
  }
  