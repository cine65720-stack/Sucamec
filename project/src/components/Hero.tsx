import { Shield } from 'lucide-react';

export default function Hero() {
  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90" />

      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-amber-500" />
            <h1 className="text-5xl font-bold text-white">
              SUCAMEC
            </h1>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">
            Contrataciones de Armamento Regulado
          </h2>

          <p className="text-xl text-gray-300 mb-6">
            Contrataciones menores a 4 UITs
          </p>

          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            Plataforma autorizada para la contratación de armamento de uso policial,
            militar y de seguridad privada. Cumplimos con todas las regulaciones de
            SUCAMEC para garantizar procesos seguros y transparentes.
          </p>

          <button
            onClick={scrollToCatalog}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Ver Catálogo de Armamento
          </button>
        </div>
      </div>
    </div>
  );
}
