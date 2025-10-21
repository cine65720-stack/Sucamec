import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div id="contacto" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Información de Contacto
          </h2>
          <p className="text-lg text-gray-600">
            Oficina de Contrataciones SUCAMEC - Lima, Perú
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Dirección</h3>
                  <p className="text-gray-700">
                    Av. Javier Prado Este 2465<br />
                    San Borja, Lima 15036<br />
                    Perú
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Teléfonos</h3>
                  <p className="text-gray-700">
                    Central: (01) 475-2995<br />
                    Línea Directa: (01) 475-2996<br />
                    WhatsApp: +51 987 654 321
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Correo Electrónico</h3>
                  <p className="text-gray-700">
                    contrataciones@sucamec.gob.pe<br />
                    consultas@sucamec.gob.pe<br />
                    armamento@sucamec.gob.pe
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Horario de Atención</h3>
                  <p className="text-gray-700">
                    Lunes a Viernes<br />
                    8:00 AM - 5:00 PM<br />
                    <span className="text-sm text-gray-500">(Horario de oficina)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <h3 className="font-bold text-amber-900 mb-2">Importante</h3>
            <p className="text-amber-800">
              Para consultas sobre contrataciones específicas, por favor comuníquese con nosotros
              a través de los canales oficiales. Recuerde que todos los procesos de adquisición de
              armamento deben cumplir con las normativas vigentes de SUCAMEC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
