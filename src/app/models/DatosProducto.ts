export interface Root {
    code: string
    product: Product
    status: number
    status_verbose: string
  }
  
  export interface Product {
    code: string
    image_front_url: string
    product_name: string
  }