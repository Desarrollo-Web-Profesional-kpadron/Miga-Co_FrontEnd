// Constantes (no son componentes React)
export const MOCK_USER = {
  nombre: "Valeria Mendoza",
  email: "valeria@gmail.com",
  fecha_registro: "2024-03-15",
  perfil: {
    direcciones: [
      { _id: "1", etiqueta: "Hogar", calle: "Av. Insurgentes 342, Col. Juárez", ciudad: "Ciudad de México", codigo_postal: "06600", referencias: "Edificio azul, dpto 4B", es_principal: true },
      { _id: "2", etiqueta: "Trabajo", calle: "Blvd. Manuel Ávila Camacho 88", ciudad: "Naucalpan", codigo_postal: "53370", referencias: "Torre empresarial piso 12", es_principal: false },
    ]
  }
};

export const EMPTY_ADDR = { 
  etiqueta: "Hogar", 
  calle: "", 
  ciudad: "", 
  codigo_postal: "", 
  referencias: "", 
  es_principal: false 
};