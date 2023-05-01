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
    selected_images: SelectedImages
  }
  
  export interface SelectedImages {
    front: Front
  }
  
  export interface Front {
    display: Display
  }
  
  export interface Display {
    es: string
    fr: string
  }