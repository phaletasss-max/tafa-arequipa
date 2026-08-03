/**
 * Validador de Documentos de Identidad para Turistas Nacionales e Internacionales
 * - DNI Peruano (8 dígitos + Algoritmo de Dígito Verificador Módulo 11 de RENIEC)
 * - Pasaporte Internacional (Norma ICAO 9303)
 * - Carnet de Extranjería (CE Perú - 9 dígitos)
 */

export interface ValidationResult {
  isValid: boolean;
  type: 'DNI' | 'PASSPORT' | 'CE' | 'INVALID';
  message: string;
  digitoVerificadorCalculado?: string;
}

// Tabla de ponderación oficial RENIEC para DNI peruano
const DNI_WEIGHTS = [3, 2, 7, 6, 5, 4, 3, 2];
const VERIFIER_HASH_NUM = [6, 7, 8, 9, 0, 1, 2, 3, 4, 5];
const VERIFIER_HASH_LET = ['K', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

/**
 * Valida un DNI peruano de 8 dígitos y opcionalmente su dígito verificador.
 */
export function validateDNI(dni: string, checkChar?: string): ValidationResult {
  const cleanDNI = dni.trim();

  if (!/^\d{8}$/.test(cleanDNI)) {
    return {
      isValid: false,
      type: 'DNI',
      message: 'El DNI debe contener exactamente 8 dígitos numéricos.',
    };
  }

  // Calcular dígito verificador mediante Módulo 11
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(cleanDNI[i], 10) * DNI_WEIGHTS[i];
  }

  const remainder = sum % 11;
  const evaluationIndex = 11 - remainder;
  const finalIndex = evaluationIndex === 11 ? 0 : evaluationIndex === 10 ? 1 : evaluationIndex;

  const expectedDigit = VERIFIER_HASH_NUM[finalIndex].toString();
  const expectedLetter = VERIFIER_HASH_LET[finalIndex];

  if (checkChar) {
    const inputCheck = checkChar.trim().toUpperCase();
    const matches = inputCheck === expectedDigit || inputCheck === expectedLetter;

    if (!matches) {
      return {
        isValid: false,
        type: 'DNI',
        message: `El dígito verificador no coincide. (Esperado: ${expectedDigit} o ${expectedLetter})`,
        digitoVerificadorCalculado: expectedDigit,
      };
    }
  }

  return {
    isValid: true,
    type: 'DNI',
    message: 'DNI Peruano válido.',
    digitoVerificadorCalculado: expectedDigit,
  };
}

/**
 * Valida número de pasaporte internacional (ICAO 9303 standard: 6 a 9 caracteres alfanuméricos).
 */
export function validatePassport(passport: string): ValidationResult {
  const cleanPassport = passport.trim().toUpperCase();

  if (!/^[A-Z0-9]{6,12}$/.test(cleanPassport)) {
    return {
      isValid: false,
      type: 'PASSPORT',
      message: 'El pasaporte debe contener entre 6 y 12 caracteres alfanuméricos.',
    };
  }

  return {
    isValid: true,
    type: 'PASSPORT',
    message: 'Pasaporte Internacional válido.',
  };
}

/**
 * Valida Carnet de Extranjería (CE) en Perú (9 dígitos numéricos).
 */
export function validateCE(ce: string): ValidationResult {
  const cleanCE = ce.trim();

  if (!/^\d{9}$/.test(cleanCE)) {
    return {
      isValid: false,
      type: 'CE',
      message: 'El Carnet de Extranjería debe contener 9 dígitos.',
    };
  }

  return {
    isValid: true,
    type: 'CE',
    message: 'Carnet de Extranjería válido.',
  };
}

/**
 * Validador automático universal según tipo de documento.
 */
export function validateIdentityDocument(
  docType: 'DNI' | 'PASSPORT' | 'CE',
  docNumber: string,
  checkChar?: string
): ValidationResult {
  switch (docType) {
    case 'DNI':
      return validateDNI(docNumber, checkChar);
    case 'PASSPORT':
      return validatePassport(docNumber);
    case 'CE':
      return validateCE(docNumber);
    default:
      return { isValid: false, type: 'INVALID', message: 'Tipo de documento no reconocido.' };
  }
}
