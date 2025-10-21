import { FileCheck, AlertCircle } from 'lucide-react';

export default function Requirements() {
  const requirements = {
    general: [
      'DNI vigente (original y copia)',
      'Certificado de antecedentes policiales (no mayor a 3 meses)',
      'Certificado de antecedentes penales (no mayor a 3 meses)',
      'Certificado de antecedentes judiciales (no mayor a 3 meses)',
      'Certificado psicológico (emitido por profesional autorizado)',
      'Certificado médico (emitido por centro de salud autorizado)',
      'Declaración jurada de domicilio',
      'Recibo de servicios (luz, agua o teléfono)',
      'Fotografías tamaño pasaporte (4 unidades)',
    ],
    tipoA: [
      'Licencia SUCAMEC Tipo A (Uso Policial)',
      'Constancia de pertenencia a institución policial',
      'Autorización de la jefatura policial',
    ],
    tipoB: [
      'Licencia SUCAMEC Tipo B (Uso Militar)',
      'Constancia de pertenencia a fuerzas armadas',
      'Autorización del comando militar',
      'Certificado de capacitación en armamento',
    ],
    tipoC: [
      'Licencia SUCAMEC Tipo C (Seguridad Privada)',
      'Certificado de empresa de seguridad registrada en SUCAMEC',
      'Contrato de trabajo vigente con empresa de seguridad',
      'Certificado de capacitación en seguridad privada',
    ],
  };

  return (
    <div id="requisitos" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Requisitos para Adquisición de Armamento
          </h2>
          <p className="text-lg text-gray-600">
            Documentación necesaria según el tipo de licencia SUCAMEC
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Información Importante</h3>
                <p className="text-amber-800">
                  Todos los documentos deben ser presentados en original y copia.
                  Los certificados tienen una vigencia máxima de 3 meses desde su emisión.
                  La información debe ser veraz y estar actualizada.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900">Requisitos Generales</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Documentación básica requerida para todos los tipos de licencia
              </p>
              <ul className="space-y-2">
                {requirements.general.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-slate-900">Tipo A - Uso Policial</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Requisitos adicionales para personal policial
              </p>
              <ul className="space-y-2">
                {requirements.tipoA.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-slate-900">Tipo B - Uso Militar</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Requisitos adicionales para personal militar
              </p>
              <ul className="space-y-2">
                {requirements.tipoB.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-bold text-slate-900">Tipo C - Seguridad Privada</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Requisitos adicionales para empresas de seguridad
              </p>
              <ul className="space-y-2">
                {requirements.tipoC.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
