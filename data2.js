// v2: contenido agregado. Todo lo de las sociedades es FICTICIO.
(function () {
  const A = window.ALTA;
  const R = (label, value, err) => (err ? { label, value, err } : { label, value });

  // ---- Módulos nuevos (se insertan en orden lógico) ----
  const riesgo = {
    id: "riesgo", num: "02b", title: "Enfoque basado en riesgo y matriz", minutes: 9,
    lead: "No todos los clientes reciben la misma diligencia. La intensidad sale de una matriz, no del humor del día.",
    blocks: [
      { type: "p", text: "El enfoque basado en riesgo (EBR) es el principio del GAFI (Recomendación 1) que la UIF adoptó para los sujetos obligados: medidas proporcionales al riesgo identificado. El sujeto obligado hace una autoevaluación de riesgos por línea de negocio y, con eso, arma una matriz para clasificar a cada cliente." },
      { type: "h", text: "Los cuatro factores clásicos" },
      { type: "ul", items: [
        "Cliente: tipo societario, antigüedad, estructura (¿hay capas o sociedades extranjeras?), PEP, actividad (efectivo intensivo, activos virtuales, juego, inmobiliaria).",
        "Producto o servicio: una cuenta sueldo no pesa igual que comercio exterior o custodia de valores.",
        "Canal: presencial, digital sin contacto, por gestor o intermediario.",
        "Zona geográfica: jurisdicciones de alto riesgo o no cooperantes según GAFI, zonas de frontera, paraísos fiscales.",
      ] },
      { type: "h", text: "Cómo se ve una matriz (ejemplo didáctico)" },
      { type: "p", text: "Cada factor suma puntos (por ejemplo 1 bajo, 2 medio, 3 alto) con un peso. El total cae en una banda: bajo → diligencia simplificada; medio → diligencia media; alto → diligencia reforzada. Hay disparadores que llevan a alto sin importar el puntaje: PEP, beneficiario final no identificable, jurisdicción de alto riesgo, hit en listas. Los pesos y bandas los define cada entidad en su manual; esto es un ejemplo, no una norma." },
      { type: "call", title: "Ejemplo", text: "SRL panadería, 10 años, presencial, local, sin comex: 1+1+1+1 → bajo. SAS de 20 días, por gestor, con socio uruguayo y giros al exterior: 3+3+3+2 → alto, y además disparador de BF opaco." },
      { type: "h", text: "Simplificada, media, reforzada" },
      { type: "ul", items: [
        "Simplificada: menos documentación o menos frecuencia de actualización, solo si el riesgo es bajo y la norma sectorial lo permite. Nunca si hay sospecha.",
        "Media (estándar): identificación completa, BF, perfil transaccional, screening.",
        "Reforzada: además, origen de fondos y patrimonio documentado, aprobación de un nivel superior (Oficial o comité), monitoreo más intenso, actualización más frecuente.",
      ] },
      { type: "p", text: "La actualización del legajo también depende del riesgo: los alto se revisan más seguido que los bajo. Los plazos exactos los fija la resolución sectorial y el manual: decí el principio, no un número del que no estés seguro." },
    ],
    quiz: [
      { id: "rie-1", prompt: "Un cliente da puntaje bajo en la matriz pero su presidente es PEP. ¿Qué diligencia aplica?", options: ["Simplificada: manda el puntaje.", "Reforzada: la condición de PEP es un disparador que eleva el riesgo sin importar la suma.", "Ninguna: los PEP no pueden ser clientes."], correct: 1, why: "Los disparadores (PEP, BF opaco, hit, jurisdicción de alto riesgo) pisan la suma. Un PEP puede ser cliente, con reforzada." },
      { id: "rie-2", prompt: "¿Cuáles son los cuatro factores clásicos de riesgo?", options: ["Cliente, producto, canal y geografía.", "Capital, objeto, sede y plazo.", "Edad, profesión, ingresos y estado civil."], correct: 0, why: "Son los ejes de la autoevaluación de riesgos que exige la normativa UIF y que propone el GAFI." },
      { id: "rie-3", prompt: "¿Cuándo NO podés aplicar diligencia simplificada?", options: ["Cuando el cliente es una SRL.", "Cuando hay sospecha de LA/FT o algún factor de riesgo alto.", "Cuando la cuenta es en pesos."], correct: 1, why: "La simplificada exige riesgo bajo comprobado y nunca aplica con sospecha." },
    ],
  };

  const comp = {
    id: "comp", num: "03b", title: "Compliance, oficial de cumplimiento y listas", minutes: 9,
    lead: "Compliance no es el área del «no». Es quien define las reglas de la mesa y se hace cargo de los grises.",
    blocks: [
      { type: "h", text: "El Oficial de Cumplimiento" },
      { type: "p", text: "La Ley 25.246 (art. 21 inc. f) exige que el sujeto obligado persona jurídica designe un Oficial de Cumplimiento que integre el órgano de administración (por ejemplo, un director). Para bancos, la Res. UIF 14/2023 (art. 11) pide un titular y un suplente, registrados ante la UIF y con autonomía. Es responsable de formular y comunicar los ROS, de que el sistema de prevención funcione y de ser el interlocutor con la UIF. Responde personalmente: las sanciones de la Ley 25.246 alcanzan también al oficial." },
      { type: "h", text: "El sistema de prevención" },
      { type: "ul", items: [
        "Manual de procedimientos aprobado por el directorio: la ley de la mesa.",
        "Autoevaluación de riesgos y matriz de clientes.",
        "Capacitación anual del personal.",
        "Revisión externa independiente (Res. UIF 67-E/2017 y modificatorias para ciertos sectores) y auditoría interna.",
        "Conservación de registros y legajos: diez años como mínimo (art. 21 inc. n de la Ley 25.246, texto según Ley 27.739). Para bancos, la Res. UIF 14/2023 (art. 17) dice desde cuándo se cuentan: desde la operación, o desde la desvinculación o la última transacción, lo que ocurra último.",
        "Código de conducta y canal de denuncias.",
      ] },
      { type: "h", text: "Listas que se consultan" },
      { type: "ul", items: [
        "RePET: Registro Público de Personas y Entidades vinculadas a actos de Terrorismo y su Financiamiento (Argentina). Incluye las listas del Consejo de Seguridad de la ONU. Un hit positivo implica congelamiento «sin demora e inaudita parte», aviso inmediato a la UIF y ROS de FT sin demora, con 24 horas como máximo (Res. UIF 207/2025, B.O. 4/11/2025, que derogó la 29/2013; para proliferación, Res. UIF 3/2026). Se escala ya.",
        "Listas del Consejo de Seguridad de la ONU (terrorismo y proliferación).",
        "OFAC (EE.UU.), UE, Reino Unido: no son ley argentina, pero casi todas las entidades las consultan por política propia y por corresponsalía bancaria en dólares.",
        "Bases de PEP, noticias negativas (adverse media), deudores del BCRA, cheques rechazados, juicios.",
      ] },
      { type: "call", title: "Homonimia", text: "Un hit no es una sospecha: es una coincidencia a despejar con fecha de nacimiento, nacionalidad, documento. Lo despeja quien el manual diga (casi siempre Compliance). Nunca le contás al cliente que dio un hit." },
      { type: "h", text: "Políticas que tenés que nombrar" },
      { type: "p", text: "Conozca a su cliente (KYC), aceptación de clientes (quién no entra: bancos pantalla, anónimos, BF no identificable), PEP, monitoreo y alertas, ROS, sanciones financieras dirigidas, y conservación. Mencioná también conocé a tu empleado (KYE) y a tu proveedor." },
    ],
    quiz: [
      { id: "comp-1", prompt: "El screening da coincidencia exacta con una persona del RePET. ¿Qué pasa?", options: ["El analista le pide al cliente que aclare.", "Se escala inmediatamente a Compliance: si se confirma, hay congelamiento administrativo y aviso a la UIF sin demora.", "Se rechaza y se archiva sin más."], correct: 1, why: "Hit RePET = financiamiento del terrorismo: urgencia máxima, no se avisa al cliente, decide Compliance." },
      { id: "comp-2", prompt: "¿Quién formula y envía el ROS?", options: ["El analista de onboarding.", "El Oficial de Cumplimiento.", "El gerente comercial."], correct: 1, why: "El analista detecta y reporta internamente; el ROS a la UIF lo firma el Oficial." },
      { id: "comp-3", prompt: "OFAC en Argentina…", options: ["Es obligatoria por ley argentina.", "No es norma argentina, pero se consulta por política interna y por corresponsalía en dólares.", "Reemplaza al RePET."], correct: 1, why: "Las listas locales obligatorias son RePET (que incorpora ONU). OFAC es política de la entidad." },
    ],
  };

  const insertAfter = (id, l) => { const i = A.lessons.findIndex((x) => x.id === id); A.lessons.splice(i + 1, 0, l); };
  insertAfter("kyc", riesgo);
  insertAfter("aml", comp);

  // Bloque extra de normativa vigente para entidades financieras, en el módulo AML
  const aml = A.lessons.find((l) => l.id === "aml");
  aml.blocks.push(
    { type: "h", text: "Entidades financieras: qué norma rige hoy" },
    { type: "p", text: "Para entidades financieras y cambiarias (art. 20 incs. 1 y 2 Ley 25.246) la base es la Res. UIF 14/2023, que reemplazó a la vieja Res. UIF 30/2017 y rige desde el 1/4/2023. Fue modificada por las Res. UIF 56/2024 y 199/2024, y la Res. UIF 78/2025 actualizó umbrales. Así lo lista hoy la propia UIF en «Resoluciones aplicables a cada sujeto obligado». Para PSP (billeteras, inc. 5) rige la Res. UIF 200/2024; para ALyCs y agentes CNV, la Res. UIF 78/2023; para proveedores de activos virtuales, la Res. UIF 49/2024." },
    { type: "h", text: "Etapas del lavado, con ejemplos" },
    { type: "ul", items: [
      "Colocación: meter el efectivo al sistema. Ej.: depósitos fraccionados en varias cuentas para no superar umbrales.",
      "Estratificación (o ensombrecimiento): alejar el dinero de su origen con muchas operaciones. Ej.: transferencias entre sociedades vinculadas, compra-venta de activos, giros al exterior.",
      "Integración: el dinero vuelve con apariencia lícita. Ej.: préstamos de una sociedad propia del exterior, facturas por servicios inexistentes, compra de inmuebles.",
    ] },
    { type: "h", text: "Sanciones" },
    { type: "p", text: "El lavado es delito penal (art. 303 del Código Penal). Además, la Ley 25.246 prevé multas administrativas para el sujeto obligado y para el Oficial de Cumplimiento por incumplir los deberes de prevención (identificar, reportar, conservar), y castiga revelar al cliente que se hizo un ROS (tipping-off)." },
    { type: "h", text: "GAFI y la evaluación de Argentina" },
    { type: "p", text: "Argentina es miembro del GAFI/FATF y de GAFILAT. En 2024 se discutió la evaluación mutua del país (aprobada en el plenario de octubre de 2024 y publicada el 18/12/2024): Argentina no fue incluida en la lista gris y quedó en seguimiento intensificado («enhanced follow-up»). Antes de esa evaluación se sancionó la Ley 27.739 (marzo 2024), que actualizó la Ley 25.246: amplió sujetos obligados (por ejemplo, proveedores de activos virtuales) y creó el registro de beneficiarios finales." },
  );

  // ---- Casos nuevos con errores marcables en el documento (err: id del hallazgo) ----
  A.cases.push(
    {
      id: "vientos", code: "LG-1344", company: "Vientos del Sur Logística SA", kind: "SA · firmas y fechas", place: "CABA", product: "Cuenta corriente y transferencias inmediatas",
      briefing: "Nuevo: en este caso podés tocar las filas de los documentos que te parezcan mal para marcarlas. Logística mediana, papeles aparentemente completos. Leé las fechas y los números con lupa.",
      docs: [
        { id: "ficha", title: "Pedido de alta", meta: "Mesa · ficha interna", rows: [R("Razón social", "Vientos del Sur Logística SA"), R("CUIT", "30-71234567-1"), R("Perfil", "$300 millones al año, fletes nacionales."), R("Firma", "Rocío Ferraro, presidenta")] },
        { id: "cuit", title: "Constancia de inscripción ARCA", meta: "Emitida hace 10 días", rows: [R("Denominación", "VIENTOS DEL SUR LOGISTICA S.A."), R("CUIT", "30-71234576-0", "cuit"), R("Actividad", "Servicios de transporte automotor de cargas"), R("Domicilio fiscal", "Av. Belgrano 1500, CABA")] },
        { id: "acta", title: "Acta de asamblea · designación de directorio", meta: "Libro de actas rubricado", rows: [R("Fecha", "15/04/2025"), R("Designa", "Rocío Ferraro presidenta, por tres ejercicios"), R("Inscripción IGJ", "Inscripta el 02/06/2025"), R("Firma de la presidenta", "Firma ológrafa, coincide con DNI")] },
        { id: "estatuto", title: "Estatuto", meta: "IGJ · 2012", rows: [R("Objeto", "Transporte y logística de cargas"), R("Accionistas", "Rocío Ferraro 55%, Martín Ferraro 45%"), R("Directorio", "Uno a tres titulares, mandato de tres ejercicios")] },
        { id: "bal", title: "Estados contables", meta: "Ejercicio cerrado 31/12/2025", rows: [R("Ventas", "$290 millones"), R("Informe del auditor", "Sin salvedades, contador público"), R("Legalización", "Firma del contador sin legalizar por el Consejo Profesional", "legal"), R("Fecha del informe", "10/03/2026")] },
        { id: "bf", title: "DDJJ beneficiario final", meta: "Firmada por la presidenta", rows: [R("Declarados", "Rocío Ferraro 55%, Martín Ferraro 45%"), R("PEP", "Ninguno")] },
      ],
      findings: [
        { id: "cuit", text: "El CUIT de la constancia no coincide con el de la ficha (dígitos invertidos).", correct: true, why: "30-71234567-1 vs 30-71234576-0. Puede ser error de carga o una constancia de otra sociedad: se pide constancia correcta y se corrige la ficha." },
        { id: "legal", text: "El informe del auditor no tiene legalización del Consejo Profesional.", correct: true, why: "La firma del contador en estados contables se legaliza ante el Consejo Profesional de Ciencias Económicas de su jurisdicción. Sin eso, el balance no es evidencia confiable." },
        { id: "mandato", text: "El mandato de la presidenta está vencido.", correct: false, why: "Designada en 2025 por tres ejercicios: está vigente." },
        { id: "bfmal", text: "Martín no debería figurar como BF porque no es director.", correct: false, why: "45% supera ampliamente el 10%: es BF aunque no administre." },
      ],
      decision: "observar",
      debrief: ["Dos defectos subsanables, ninguno con olor a lavado: un CUIT mal transcripto y un balance sin legalizar.", "Se observa: pedido concreto, plazo, y la cuenta no opera hasta que lleguen. Si la constancia correcta fuera de otra sociedad, cambia todo y se escala."],
      phrase: "Observo por dos puntos formales: constancia de ARCA con el CUIT correcto y balance legalizado. El resto cierra.",
      nextStep: "Mail al cliente con los dos pedidos y plazo de 10 días hábiles (según manual).",
    },
    {
      id: "aurora", code: "LG-1390", company: "Fundación Aurora Educativa", kind: "Fundación · donaciones del exterior", place: "Córdoba", product: "Cuenta en pesos y en dólares para recibir donaciones",
      briefing: "Fundación educativa chica que de golpe espera donaciones grandes del exterior. Tocá las filas que no cierren. Pensá en origen de fondos y en el riesgo de las ONG que señala el GAFI (Recomendación 8).",
      docs: [
        { id: "ficha", title: "Pedido de alta", meta: "Mesa · ficha interna", rows: [R("Producto", "Cuenta en pesos y en USD"), R("Perfil declarado", "USD 900.000 anuales en donaciones desde el exterior"), R("Historia", "Ingresos 2025: $12 millones, todo cuotas locales", "perfil")] },
        { id: "est", title: "Estatuto y autorización", meta: "Inspección de Personas Jurídicas de Córdoba", rows: [R("Tipo", "Fundación, personería otorgada en 2018"), R("Objeto", "Becas y apoyo escolar"), R("Consejo de administración", "Presidente: Tomás Quiroga, designado 2024, mandato 3 años")] },
        { id: "don", title: "Carta del donante", meta: "Sin firma certificada", rows: [R("Donante", "Blue Lagoon Trust Ltd., Islas Vírgenes Británicas", "donante"), R("Beneficiarios del trust", "«Confidenciales»", "donante"), R("Destino", "«Proyectos educativos a definir»")] },
        { id: "bf", title: "DDJJ beneficiario final", meta: "Firmada por el presidente", rows: [R("Declara", "Como no tiene socios, declara a los integrantes del consejo de administración (criterio residual)")] },
        { id: "list", title: "Screening", meta: "Corrido hoy", rows: [R("Fundación y consejo", "Sin coincidencias"), R("Donante", "No se pudo correr: no hay personas humanas identificadas", "donante")] },
      ],
      findings: [
        { id: "perfil", text: "El perfil declarado multiplica muchas veces la historia de ingresos sin explicación.", correct: true, why: "De $12 millones a USD 900.000 sin un convenio o proyecto que lo justifique. Es una señal de alerta clásica." },
        { id: "donante", text: "El donante es un trust en una jurisdicción opaca con beneficiarios no identificados.", correct: true, why: "No se puede conocer el origen de los fondos ni correr listas. El GAFI (R.8) advierte el uso abusivo de ONG." },
        { id: "bfres", text: "La DDJJ de BF está mal porque una fundación no puede declarar a su consejo.", correct: false, why: "Cuando no hay persona humana con 10% o control, la Res. UIF 112/2021 manda identificar a quienes ejercen la administración. Está bien." },
      ],
      decision: "escalar",
      debrief: ["No es un defecto de papeles: es riesgo alto con origen de fondos opaco. Va a Compliance con diligencia reforzada.", "Compliance puede pedir identificación del settlor y beneficiarios del trust, convenio de donación, plan de uso. Si no llegan, la relación no se inicia y se evalúa un ROS (eso lo decide el Oficial)."],
      phrase: "Escalo: perfil incoherente con la historia y un donante offshore sin beneficiarios identificados. No puedo hacer diligencia sobre el origen de los fondos.",
      nextStep: "Informe interno a Compliance con los hallazgos. Sin comentar al cliente la posibilidad de reporte.",
    },
    {
      id: "patagonia", code: "LG-1433", company: "Patagonia Agro Inversiones SRL", kind: "SRL · cadena societaria y poder", place: "Neuquén", product: "Cuenta corriente y cobro de exportaciones",
      briefing: "El más difícil. Todo parece en regla hasta que reconstruís quién controla. Tocá las filas sospechosas.",
      docs: [
        { id: "ficha", title: "Pedido de alta", meta: "Mesa · ficha interna", rows: [R("Producto", "Cuenta corriente y cobros de exportación"), R("Perfil", "Exportación de fruta fina, USD 2 millones anuales"), R("Operará", "Federico Lanz, apoderado")] },
        { id: "contrato", title: "Contrato social", meta: "Registro Público de Neuquén · 2021", rows: [R("Socios", "Inversora Comahue SA 95%, Federico Lanz 5%"), R("Gerente", "Federico Lanz"), R("Objeto", "Producción y comercialización agrícola")] },
        { id: "socio", title: "Estatuto de Inversora Comahue SA", meta: "Copia simple", rows: [R("Certificación", "Copia simple sin certificar", "copia"), R("Accionistas", "Lucía Bermúdez 50%, Atlantic Seeds LLC (Delaware) 50%", "capas"), R("Beneficiarios de Atlantic Seeds", "No informados", "capas")] },
        { id: "bf", title: "DDJJ beneficiario final", meta: "Firmada por Federico Lanz", rows: [R("Declara", "Federico Lanz, por ejercer el control como gerente", "bfmal"), R("PEP", "No")] },
        { id: "poder", title: "Poder general", meta: "Escritura 2023", rows: [R("Otorgante", "Patagonia Agro Inversiones SRL"), R("Apoderado", "Federico Lanz"), R("Facultades", "Abrir y operar cuentas bancarias, firmar cheques, operar comercio exterior")] },
        { id: "arca", title: "Constancia ARCA", meta: "Hace 5 días", rows: [R("Actividad", "Cultivo de frutas de carozo y pepita"), R("Estado", "Activo")] },
      ],
      findings: [
        { id: "capas", text: "La socia controlante tiene un 50% en manos de una LLC de Delaware sin beneficiarios identificados.", correct: true, why: "Hay que seguir la cadena hasta personas humanas. Lucía tiene 50%×95% ≈ 47,5% indirecto (BF). La LLC puede esconder otro BF ≥10%." },
        { id: "bfmal", text: "La DDJJ de BF declara al gerente y omite a los controlantes indirectos.", correct: true, why: "El criterio residual (administración) solo aplica si no se puede identificar a nadie con 10% o control. Acá Lucía Bermúdez es identificable y no está declarada." },
        { id: "copia", text: "El estatuto de la socia controlante es copia simple sin certificar.", correct: true, why: "Un documento clave para reconstruir el control no puede ir en copia simple: se pide copia certificada (escribano o registro). Suma al pedido que acompaña la escalada." },
        { id: "poderno", text: "El poder no alcanza para abrir cuentas.", correct: false, why: "El poder sí incluye apertura y operación de cuentas. Ojo: mirar siempre facultades, no solo que exista." },
      ],
      decision: "escalar",
      debrief: ["La DDJJ de BF está mal y la estructura tiene una capa extranjera opaca: no se puede aprobar ni basta con observar, porque el problema es de control y opacidad, no de un papel faltante.", "Se escala con diligencia reforzada: pedir nómina de socios de Atlantic Seeds LLC hasta personas humanas, estatuto certificado de Inversora Comahue, DDJJ BF corregida."],
      phrase: "Recalculo el control indirecto: Lucía Bermúdez tiene 47,5% y no está declarada, y hay una LLC sin dueños identificados. Escalo con reforzada.",
      nextStep: "Informe a Compliance con el organigrama de control dibujado.",
    }
  );

  // ---- Examen final: se arma con preguntas de todos los módulos + estas ----
  A.examExtra = [
    { prompt: "¿Qué umbral define al beneficiario final en Argentina según la Res. UIF 112/2021?", options: ["25% del capital", "10% del capital o de los derechos de voto, o control por otros medios", "5% del capital"], correct: 1, why: "Res. UIF 112/2021: persona humana con al menos 10% de capital o votos, o que ejerza el control final por otros medios." },
    { prompt: "¿Dónde se inscribe una SA con sede en CABA?", options: ["IGJ", "DPPJ de Provincia de Buenos Aires", "CNV"], correct: 0, why: "En CABA el registro público es la Inspección General de Justicia." },
    { prompt: "¿Cuál es la ley de prevención de lavado de activos en Argentina?", options: ["Ley 19.550", "Ley 25.246 (modificada por la Ley 27.739)", "Ley 27.349"], correct: 1, why: "19.550 es la Ley General de Sociedades; 27.349 creó las SAS." },
    { prompt: "¿Qué es tipping-off?", options: ["Avisar al cliente que fue reportado", "Un tipo de ROS urgente", "Una lista de sanciones"], correct: 0, why: "Revelar un ROS al cliente está prohibido y sancionado." },
    { prompt: "Un poder que solo faculta a «administrar y firmar contratos de locación», ¿permite abrir una cuenta?", options: ["Sí, administrar incluye todo", "No: hay que verificar que las facultades incluyan expresamente operar con bancos", "Depende del monto"], correct: 1, why: "Las facultades se leen literalmente. Si no menciona cuentas bancarias, se observa y se pide poder suficiente." },
    { prompt: "Las tres etapas del lavado son:", options: ["Colocación, estratificación, integración", "Identificación, verificación, monitoreo", "Alta, perfil, baja"], correct: 0, why: "Es el modelo clásico." },
    { prompt: "Un balance firmado por contador pero sin legalización del Consejo Profesional…", options: ["Se acepta igual", "Se observa: se pide la legalización", "Se escala como sospecha"], correct: 1, why: "Es un defecto formal subsanable." },
    { prompt: "¿Qué organismo regula y supervisa a los bancos en materia prudencial?", options: ["CNV", "BCRA", "IGJ"], correct: 1, why: "BCRA para entidades financieras; la UIF en materia de LA/FT (con colaboración del BCRA)." },
  ];

  A.glossary = [
    ["ARCA", "Agencia de Recaudación y Control Aduanero, ex AFIP (Decreto 953/2024). Emite la constancia de CUIT."],
    ["Beneficiario final (BF)", "Persona humana con ≥10% del capital o votos, o que controla por otros medios. Res. UIF 112/2021."],
    ["BCRA", "Banco Central de la República Argentina. Regula y supervisa entidades financieras."],
    ["CNV", "Comisión Nacional de Valores. Regula el mercado de capitales (ALyCs, fondos, etc.)."],
    ["DDC / Debida diligencia", "Conjunto de medidas para conocer al cliente: identificación, BF, perfil, monitoreo."],
    ["DPPJ", "Dirección Provincial de Personas Jurídicas (Provincia de Buenos Aires)."],
    ["EBR", "Enfoque basado en riesgo: medidas proporcionales al riesgo."],
    ["EDD / Reforzada", "Diligencia reforzada para clientes de alto riesgo: más evidencia y aprobación superior."],
    ["GAFI / FATF", "Grupo de Acción Financiera Internacional. Fija las 40 Recomendaciones."],
    ["GAFILAT", "Grupo de Acción Financiera de Latinoamérica: organismo regional al estilo GAFI (FSRB), miembro asociado del GAFI. Argentina es miembro."],
    ["IGJ", "Inspección General de Justicia: registro público de sociedades con sede en CABA."],
    ["KYC", "Know Your Customer: conocé a tu cliente."],
    ["LA/FT/FP", "Lavado de activos, financiación del terrorismo y de la proliferación de armas de destrucción masiva."],
    ["Oficial de Cumplimiento", "Responsable del sistema de prevención ante la UIF; firma los ROS."],
    ["OFAC", "Oficina de Control de Activos Extranjeros de EE.UU. Lista SDN."],
    ["PEP", "Persona expuesta políticamente. Lista de la Res. UIF 35/2023, texto según la 192/2024."],
    ["Perfil transaccional", "Lo que se espera que opere el cliente: montos, monedas, contrapartes, países."],
    ["RePET", "Registro Público de Personas y Entidades vinculadas a actos de Terrorismo y su Financiamiento."],
    ["ROS", "Reporte de Operación Sospechosa a la UIF (lavado o financiamiento del terrorismo)."],
    ["SA / SRL / SAS", "Sociedad anónima / de responsabilidad limitada (Ley 19.550) / por acciones simplificada (Ley 27.349)."],
    ["Sujeto obligado", "Quien debe aplicar medidas de prevención: listado en el art. 20 de la Ley 25.246."],
    ["Tipping-off", "Revelar al cliente que se lo reportó. Prohibido."],
    ["UIF", "Unidad de Información Financiera: recibe ROS y regula la prevención."],
  ];

  A.sources = [
    ["Ley 25.246 (Encubrimiento y lavado de activos) y modificatorias", "https://www.argentina.gob.ar/normativa/nacional/ley-25246-62977"],
    ["Ley 27.739 (2024), modificatoria del régimen de prevención", "https://www.argentina.gob.ar/normativa/nacional/ley-27739-2024-397355/texto"],
    ["UIF · Resoluciones aplicables a cada sujeto obligado", "https://www.argentina.gob.ar/uif/normativa-uif/resoluciones-aplicables-cada-sujeto-obligado"],
    ["Res. UIF 14/2023 (entidades financieras y cambiarias)", "https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-14-2023-379085"],
    ["Res. UIF 199/2024 (modifica la 14/2023)", "https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-199-2024-407428"],
    ["Res. UIF 78/2025 (actualización de umbrales)", "https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-78-2025-413643"],
    ["Res. UIF 112/2021 (beneficiario final)", "https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-112-2021-355684/texto"],
    ["Res. UIF 35/2023 (PEP) y Res. UIF 192/2024", "https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-192-2024-407011/texto"],
    ["RePET · Ministerio de Justicia", "https://repet.jus.gob.ar/"],
    ["IGJ · Inspección General de Justicia", "https://www.argentina.gob.ar/justicia/igj"],
    ["ARCA · Constancia de inscripción", "https://www.arca.gob.ar/"],
    ["BCRA · Prevención de LA/FT", "https://www.bcra.gob.ar/"],
    ["CNV", "https://www.argentina.gob.ar/cnv"],
    ["GAFI · Recomendaciones", "https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html"],
    ["GAFI · Evaluación mutua de Argentina (2024)", "https://www.fatf-gafi.org/en/countries/detail/Argentina.html"],
    ["OFAC · Sanctions List Search", "https://sanctionssearch.ofac.treas.gov/"],
  ];

  A.star = [
    { q: "Contame una vez que detectaste un error que otros no vieron.", s: "En mi trabajo anterior revisaba facturas de proveedores antes del pago.", t: "Tenía que validar 200 comprobantes por semana.", a: "Noté que un CUIT de proveedor tenía dos dígitos invertidos respecto del alta; lo frené, pedí la constancia y armé un control de cruce automático en la planilla.", r: "Se evitó un pago a un tercero y el control quedó como procedimiento del equipo." },
    { q: "Contame una situación de presión para hacer algo rápido.", s: "Un vendedor necesitaba cerrar un cliente antes de fin de mes.", t: "Faltaba un documento obligatorio.", a: "Le expliqué el riesgo, ofrecí revisar todo lo demás en el día para que solo faltara ese papel, y lo pedí directo al cliente con un checklist claro.", r: "Llegó en 48 horas y el alta salió sin excepciones." },
    { q: "Contame cómo aprendiste algo nuevo rápido.", s: "Tuve que ponerme al día con una normativa nueva.", t: "Aplicarla en una semana.", a: "Leí la norma oficial, armé un resumen de una página con los cambios y lo validé con un referente.", r: "Lo usó el equipo como guía." },
  ];

  A.simulacro = [
    "Presentate en un minuto y contame por qué onboarding.",
    "¿Qué es KYC y por qué importa para un banco?",
    "Diferencia entre debida diligencia simplificada, media y reforzada.",
    "¿Qué es un beneficiario final y cómo lo identificás en una SA con un accionista que es otra sociedad?",
    "¿Qué documentos pedís para dar de alta una SRL?",
    "¿Cómo verificás que quien firma tiene facultades?",
    "Un cliente es PEP. ¿Lo rechazás?",
    "El screening da un hit. ¿Qué hacés?",
    "¿Qué es un ROS? ¿Lo podés comentar con el cliente?",
    "Comercial te presiona para abrir hoy. ¿Qué hacés?",
    "Nombrá tres señales de alerta en un alta de persona jurídica.",
    "¿Qué mirás en unos estados contables?",
    "¿Qué es la UIF y qué es un sujeto obligado?",
    "Contame una situación en la que trabajaste con mucho volumen sin perder calidad (STAR).",
    "¿Qué preguntas tenés para nosotros?",
  ];
})();
window.ALTA.lessons.forEach((l,i)=>{l.num=String(i+1).padStart(2,"0")});

// v3: filas marcables (err) para los 6 casos originales, así los 9 casos se corrigen igual.
(function () {
  const A = window.ALTA;
  const map = {
    norte: { "acta:Ejercicios cubiertos": "acta" },
    horizonte: {
      "bf:Beneficiario final declarado": "bf-soc", "bf:Persona humana detrás": "bf-soc",
      "instrumento:Capital": "art123", "ficha:Perfil declarado": "perfil", "ficha:Antigüedad": "perfil", "instrumento:Objeto": "perfil", "bf:Origen de fondos": "perfil",
    },
    puente: { "ddjj:PEP": "pep", "boletin:Vínculo": "pep" },
    riodulce: { "hit:Lista de sanciones del proveedor": "hit" },
    bruma: { "poder:Facultades": "poder", "poder:Plazo": "poder", "luz:Factura": "luz" },
  };
  Object.keys(map).forEach((cid) => {
    const c = A.cases.find((x) => x.id === cid);
    if (!c) return;
    Object.keys(map[cid]).forEach((k) => {
      const [d, l] = k.split(":");
      const doc = c.docs.find((x) => x.id === d);
      const row = doc && doc.rows.find((r) => r.label === l);
      if (row) row.err = map[cid][k];
      else console.warn("ALTA: fila no encontrada", cid, k);
    });
  });
})();
