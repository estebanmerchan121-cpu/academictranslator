
import React, { useState, useMemo } from 'react';
import { AcademicCategory, SubContext, Language } from '../types';

interface ContextSelectorProps {
  onComplete: (category: AcademicCategory, subContext: SubContext, language: Language) => void;
}

const CATEGORIES: AcademicCategory[] = [
  {
    id: 'eng',
    label: 'Ingeniería y Tecnología',
    icon: '🛠️',
    subContexts: [
      { id: 'eng-gen', label: 'Ingeniería (General)', description: 'Conceptos transversales a todas las ingenierías.', group: 'General' },
      { id: 'civ-est', label: 'Estructuras', description: 'Cálculo y diseño de sistemas resistentes.', group: 'Ingeniería Civil' },
      { id: 'civ-geo', label: 'Geotecnia', description: 'Mecánica de suelos y cimentaciones.', group: 'Ingeniería Civil' },
      { id: 'civ-hid', label: 'Hidráulica', description: 'Mecánica de fluidos y obras hidráulicas.', group: 'Ingeniería Civil' },
      { id: 'civ-amb', label: 'Ambiental y Sanitaria', description: 'Tratamiento de aguas, gestión de residuos y sostenibilidad en obras.', group: 'Ingeniería Civil' },
      { id: 'civ-via', label: 'Vías y Transporte', description: 'Infraestructura vial y movilidad.', group: 'Ingeniería Civil' },
      { id: 'civ-con', label: 'Construcción', description: 'Procesos constructivos y obra civil.', group: 'Ingeniería Civil' },
      { id: 'soft-web', label: 'Desarrollo Web', description: 'Frontend, backend y arquitectura cloud.', group: 'Software' },
      { id: 'soft-sec', label: 'Ciberseguridad', description: 'Protección de datos y redes.', group: 'Software' },
      { id: 'soft-ai', label: 'Inteligencia Artificial', description: 'Machine learning y redes neuronales.', group: 'Software' },
      { id: 'soft-net', label: 'Redes y Telecomunicaciones', description: 'Protocolos y conectividad física.', group: 'Software' },
      { id: 'soft-db', label: 'Bases de Datos', description: 'Sistemas SQL, NoSQL y big data.', group: 'Software' },
      { id: 'ind-log', label: 'Logística y Cadena de Suministro', description: 'Optimización de flujos y distribución.', group: 'Ingeniería Industrial' },
      { id: 'ind-ope', label: 'Gestión de Operaciones', description: 'Eficiencia en procesos industriales.', group: 'Ingeniería Industrial' },
      { id: 'ind-sec', label: 'Seguridad Industrial', description: 'Prevención de riesgos laborales.', group: 'Ingeniería Industrial' },
      { id: 'ind-erg', label: 'Ergonomía', description: 'Adaptación del trabajo al ser humano.', group: 'Ingeniería Industrial' },
      { id: 'elec-pot', label: 'Potencia', description: 'Generación y distribución eléctrica.', group: 'Eléctrica/Electrónica' },
      { id: 'elec-mic', label: 'Microelectrónica', description: 'Circuitos integrados y semiconductores.', group: 'Eléctrica/Electrónica' },
      { id: 'elec-aut', label: 'Automatización y Control', description: 'Sistemas inteligentes y PLC.', group: 'Eléctrica/Electrónica' },
      { id: 'elec-ren', label: 'Energías Renovables', description: 'Sistemas solares, eólicos y verdes.', group: 'Eléctrica/Electrónica' },
    ],
  },
  {
    id: 'health',
    label: 'Ciencias de la Salud',
    icon: '⚕️',
    subContexts: [
      { id: 'med-gen', label: 'Medicina (General)', description: 'Conceptos médicos generales.', group: 'Medicina' },
      { id: 'med-ana', label: 'Anatomía', description: 'Estructura macroscópica del cuerpo.', group: 'Medicina' },
      { id: 'med-pha', label: 'Farmacología', description: 'Acción y uso de medicamentos.', group: 'Medicina' },
      { id: 'med-pat', label: 'Patología', description: 'Estudio de las enfermedades.', group: 'Medicina' },
      { id: 'med-sur', label: 'Cirugía', description: 'Técnicas operatorias.', group: 'Medicina' },
      { id: 'med-int', label: 'Medicina Interna', description: 'Diagnóstico de enfermedades orgánicas.', group: 'Medicina' },
      { id: 'nur-icu', label: 'Cuidados Intensivos', description: 'Pacientes en estado crítico.', group: 'Enfermería' },
      { id: 'nur-ped', label: 'Pediatría', description: 'Salud infantil y juvenil.', group: 'Enfermería' },
      { id: 'nur-pub', label: 'Salud Pública', description: 'Epidemiología y prevención.', group: 'Enfermería' },
      { id: 'nur-ger', label: 'Geriatría', description: 'Atención al adulto mayor.', group: 'Enfermería' },
      { id: 'psy-ana', label: 'Psicoanálisis', description: 'Teoría del inconsciente.', group: 'Psicología' },
      { id: 'psy-cog', label: 'Cognitivo-Conductual', description: 'Modificación de conducta.', group: 'Psicología' },
      { id: 'psy-neu', label: 'Neuropsicología', description: 'Relación cerebro-conducta.', group: 'Psicología' },
      { id: 'psy-org', label: 'Psicología Organizacional', description: 'Entornos laborales.', group: 'Psicología' },
      { id: 'den-ort', label: 'Ortodoncia', description: 'Alineación dental.', group: 'Odontología' },
      { id: 'den-per', label: 'Periodoncia', description: 'Salud de las encías.', group: 'Odontología' },
      { id: 'den-end', label: 'Endodoncia', description: 'Tratamiento de conductos.', group: 'Odontología' },
      { id: 'den-sur', label: 'Cirugía Maxilofacial', description: 'Intervenciones en rostro y mandíbula.', group: 'Odontología' },
    ],
  },
  {
    id: 'eco',
    label: 'Económicas y Administrativas',
    icon: '💰',
    subContexts: [
      { id: 'bus-gen', label: 'Administración (General)', description: 'Gestión empresarial base.', group: 'Administración' },
      { id: 'bus-hr', label: 'Recursos Humanos', description: 'Gestión del talento.', group: 'Administración' },
      { id: 'bus-fin', label: 'Finanzas Corporativas', description: 'Capital y valoración de empresas.', group: 'Administración' },
      { id: 'bus-mar', label: 'Marketing Digital', description: 'Estrategia comercial online.', group: 'Administración' },
      { id: 'bus-pro', label: 'Gestión de Proyectos', description: 'Metodologías ágiles y cascada.', group: 'Administración' },
      { id: 'acc-aud', label: 'Auditoría', description: 'Verificación de estados financieros.', group: 'Contaduría' },
      { id: 'acc-tax', label: 'Tributación (Impuestos)', description: 'Normativa fiscal.', group: 'Contaduría' },
      { id: 'acc-cos', label: 'Contabilidad de Costos', description: 'Análisis de producción.', group: 'Contaduría' },
      { id: 'acc-nii', label: 'Normas NIIF', description: 'Estándares internacionales.', group: 'Contaduría' },
      { id: 'eco-mic', label: 'Microeconomía', description: 'Agentes individuales.', group: 'Economía' },
      { id: 'eco-mac', label: 'Macroeconomía', description: 'Agregados nacionales.', group: 'Economía' },
      { id: 'eco-met', label: 'Econometría', description: 'Modelos estadísticos.', group: 'Economía' },
      { id: 'eco-pol', label: 'Política Pública', description: 'Intervención estatal.', group: 'Economía' },
    ],
  },
  {
    id: 'law',
    label: 'Derecho y Ciencias Políticas',
    icon: '⚖️',
    subContexts: [
      { id: 'law-gen', label: 'Derecho (General)', description: 'Teoría del derecho base.', group: 'Derecho' },
      { id: 'law-civ', label: 'Derecho Civil', description: 'Personas, bienes y contratos.', group: 'Derecho' },
      { id: 'law-cri', label: 'Derecho Penal', description: 'Delitos y sanciones.', group: 'Derecho' },
      { id: 'law-lab', label: 'Derecho Laboral', description: 'Relaciones trabajador-patrono.', group: 'Derecho' },
      { id: 'law-mer', label: 'Derecho Mercantil', description: 'Actos de comercio.', group: 'Derecho' },
      { id: 'law-int', label: 'Derecho Internacional', description: 'Relaciones entre estados.', group: 'Derecho' },
      { id: 'rel-dip', label: 'Diplomacia', description: 'Negociación internacional.', group: 'Relaciones Internacionales' },
      { id: 'rel-com', label: 'Comercio Exterior', description: 'Importaciones y aduanas.', group: 'Relaciones Internacionales' },
      { id: 'rel-geo', label: 'Geopolítica', description: 'Poder y territorio.', group: 'Relaciones Internacionales' },
      { id: 'rel-org', label: 'Org. Internacionales', description: 'ONU, OEA y otros entes.', group: 'Relaciones Internacionales' },
    ],
  },
  {
    id: 'arch',
    label: 'Arquitectura y Diseño',
    icon: '🎨',
    subContexts: [
      { id: 'arc-des', label: 'Diseño Arquitectónico', description: 'Creación de espacios.', group: 'Arquitectura' },
      { id: 'arc-urb', label: 'Urbanismo', description: 'Planificación de ciudades.', group: 'Arquitectura' },
      { id: 'arc-pai', label: 'Paisajismo', description: 'Entornos naturales.', group: 'Arquitectura' },
      { id: 'arc-his', label: 'Historia del Arte', description: 'Evolución de estilos.', group: 'Arquitectura' },
      { id: 'arc-res', label: 'Restauración', description: 'Recuperación de patrimonio.', group: 'Arquitectura' },
      { id: 'gra-typ', label: 'Tipografía', description: 'Fuentes y legibilidad.', group: 'Diseño Gráfico' },
      { id: 'gra-bra', label: 'Branding', description: 'Identidad de marca.', group: 'Diseño Gráfico' },
      { id: 'gra-ill', label: 'Ilustración Digital', description: 'Dibujo vectorial y pintura.', group: 'Diseño Gráfico' },
      { id: 'gra-uxu', label: 'UX/UI', description: 'Experiencia e interfaz.', group: 'Diseño Gráfico' },
    ],
  },
];

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: 'Chino Mandarín', flag: '🇨🇳' },
  { code: 'ja', name: '日本語 (Japonés)', flag: '🇯🇵' },
];

const ContextSelector: React.FC<ContextSelectorProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCategory, setSelectedCategory] = useState<AcademicCategory | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubContext | null>(null);

  const handleCategorySelect = (cat: AcademicCategory) => {
    setSelectedCategory(cat);
    setStep(2);
  };

  const handleSubSelect = (sub: SubContext) => {
    setSelectedSub(sub);
    setStep(3);
  };

  const handleLanguageSelect = (lang: Language) => {
    if (selectedCategory && selectedSub) {
      onComplete(selectedCategory, selectedSub, lang);
    }
  };

  const groupedSubContexts = useMemo((): Record<string, SubContext[]> => {
    if (!selectedCategory) return {};
    return selectedCategory.subContexts.reduce((acc, sub) => {
      const groupName = sub.group || 'Otros';
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(sub);
      return acc;
    }, {} as Record<string, SubContext[]>);
  }, [selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
          {step === 1 && "Área de Conocimiento"}
          {step === 2 && `${selectedCategory?.label}`}
          {step === 3 && "Idioma de Destino"}
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">
          {step === 1 && "Selecciona el índice principal para contextualizar las traducciones."}
          {step === 2 && "Elige una especialidad para afinar la terminología académica."}
          {step === 3 && "¿A qué idioma quieres traducir y recibir las definiciones?"}
        </p>
      </div>

      <div className="relative">
        {step > 1 && (
          <button 
            onClick={() => setStep((s) => (s - 1) as any)}
            className="absolute -top-10 left-0 text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat)}
                className="flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
              >
                <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{cat.label}</h3>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">Explorar especialidades</p>
              </button>
            ))}
          </div>
        )}

        {step === 2 && selectedCategory && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {(Object.entries(groupedSubContexts) as [string, SubContext[]][]).map(([groupName, subs]) => (
              <div key={groupName} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1 border-l-2 border-blue-500 ml-1">
                  {groupName}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {subs.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubSelect(sub)}
                      className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left flex flex-col"
                    >
                      <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{sub.label}</h3>
                      <p className="text-[11px] text-slate-500 leading-snug flex-1">{sub.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 animate-in fade-in zoom-in-95 duration-300">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang)}
                className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{lang.flag}</span>
                <span className="font-semibold text-slate-700">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ContextSelector;
