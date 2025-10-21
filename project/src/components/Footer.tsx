import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-lg">SUCAMEC</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              Superintendencia Nacional de Control de Servicios de Seguridad, Armas, Municiones y Explosivos de Uso Civil
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2025 SUCAMEC - Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
