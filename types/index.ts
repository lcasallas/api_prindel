export interface DBConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

export interface AuthResponse {
  Token: string;
}

export type Guide = {
  id_guia: string;
  nro_guia: string;
  id_cliente: number;
  id_orden: number;
  orden: number;
  fecha_orden: string;
  id_gestion_detalle: number;
  gestion_detalle: string;
  fecha_gestion: string;
  ruta_imagen?: string;
  codigo_cliente?: string;
};

export type Param = {
  Barcode: string;
  UserID: string;
  DigitalID: string;
  FileBase64: string;
  Latitude: string;
  Longitude: string;
}

// export type NroGuide = {
//   nro_guia: string
// }

export type DataGuides = Guide[];

export interface AuthResponse {
  Token: string;
}
