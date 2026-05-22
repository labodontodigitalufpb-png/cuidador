const STORAGE_KEY = "cuidador-sus-draft";
const SEND_ENDPOINT = "https://script.google.com/macros/s/AKfycbwjnRhj4RZyRhilMfVuEPPLo3kIzEmHaNgws8WwTSwQZ-3hs-4dCM0Srl2XKj6PQr6v7w/exec";

let briefQuestions = [
  { id: "sq1", text: "SQ1. Você já teve dor na mandíbula, têmpora, no ouvido ou na frente do ouvido?", type: "yesno", required: true },
  { id: "sq2", text: "SQ2. Há quanto tempo começou pela primeira vez essa dor?", type: "duration" },
  { id: "sq3", text: "SQ3. Nos últimos 30 dias, qual opção descreve melhor essa dor?", type: "single", options: [["sem", "Sem dor"], ["intermitente", "A dor vai e volta"], ["constante", "A dor está sempre presente"]] },
  { id: "sq4", text: "SQ4. Nos últimos 30 dias, essas atividades alteraram a dor na mandíbula ou têmpora?", type: "multiYesNo", items: ["Mastigar alimento duro ou resistente", "Abrir a boca ou mover a mandíbula", "Manter dentes encostados, apertar, ranger ou mascar chiclete", "Falar, beijar ou bocejar"] },
  { id: "sq5", text: "SQ5. Nos últimos 30 dias, você teve dor de cabeça que incluísse a região da têmpora?", type: "yesno", required: true },
  { id: "sq6", text: "SQ6. Há quanto tempo começou pela primeira vez essa dor de cabeça na têmpora?", type: "duration" },
  { id: "sq7", text: "SQ7. Nos últimos 30 dias, atividades mandibulares alteraram essa dor de cabeça?", type: "multiYesNo", items: ["Mastigar alimento duro ou resistente", "Abrir a boca ou mover a mandíbula", "Manter dentes encostados, apertar, ranger ou mascar chiclete", "Falar, beijar ou bocejar"] },
  { id: "sq8", text: "SQ8. Nos últimos 30 dias, houve ruído na ATM ao mover ou usar a mandíbula?", type: "yesno", required: true },
  { id: "sq9", text: "SQ9. A mandíbula já travou ou prendeu, mesmo por um momento, de modo que não abrisse totalmente?", type: "yesno", required: true },
  { id: "sq10", text: "SQ10. O travamento foi grave o suficiente para limitar abertura bucal e interferir na alimentação?", type: "yesno" },
  { id: "sq11", text: "SQ11. Nos últimos 30 dias, a mandíbula travou sem abrir totalmente e depois destravou?", type: "yesno", required: true },
  { id: "sq12", text: "SQ12. Atualmente a mandíbula está travada ou limitada de modo que não abre totalmente?", type: "yesno" },
  { id: "sq13", text: "SQ13. Nos últimos 30 dias, ao abrir bem a boca, a mandíbula travou aberta de modo que você não conseguiu fechar?", type: "yesno", required: true },
  { id: "sq14", text: "SQ14. Quando travou aberta, foi necessário descansar, mover, empurrar ou manobrar a mandíbula para fechar?", type: "yesno" }
];

let ohipItems = [
  "Você sentiu dificuldade para mastigar alguma comida devido a problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você teve dificuldade para abrir ou fechar a boca?",
  "Você sentiu que sua boca, rosto ou ouvidos estavam doloridos?",
  "Você teve dor na maxila ou mandíbula?",
  "Você teve dores de cabeça por causa de problemas nos ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você sentiu desconforto ao comer devido a problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você sentiu dor enquanto falava devido a problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você se sentiu preocupado(a) com problemas nos ossos da face (maxila e mandíbula) ou dentes?",
  "Você se sentiu inseguro(a) por causa de seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Problemas com os ossos da face (maxila e mandíbula) ou dentes fizeram você infeliz?",
  "Você se sentiu tenso(a) por causa de problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você teve que evitar comer alguma coisa devido a problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você teve que interromper suas refeições devido a problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Seu sono foi interrompido devido a problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você se sentiu perturbado(a) por problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você sentiu dificuldade em relaxar devido a problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você se sentiu deprimido(a) devido a problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Sua concentração foi afetada por problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você esteve um pouco irritado(a) com outras pessoas devido a problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você sentiu dificuldade em suas tarefas habituais devido a problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você sentiu que a vida em geral foi menos prazerosa devido a problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?",
  "Você foi incapaz de trabalhar com pleno rendimento por causa de problemas com seus ossos da face (maxila e mandíbula), dentes ou boca?"
];

let gcpsItems = [
  "Dor facial agora",
  "Pior dor facial nos últimos 30 dias",
  "Dor facial média nos últimos 30 dias",
  "Interferência nas atividades diárias",
  "Interferencia nas atividades recreativas, sociais e familiares",
  "Interferência na capacidade de trabalhar, incluindo tarefas domésticas"
];

let phqItems = [
  "Sentir-se nervoso(a), ansioso(a) ou no limite",
  "Não conseguir parar ou controlar a preocupação",
  "Sentir-se para baixo, deprimido(a) ou sem esperança",
  "Pouco interesse ou prazer em fazer as coisas"
];

let palpationItems = [
  ["palpTemporalD", "Temporal anterior direito"],
  ["palpTemporalE", "Temporal anterior esquerdo"],
  ["palpMasseterD", "Masseter direito"],
  ["palpMasseterE", "Masseter esquerdo"],
  ["palpAtmD", "ATM direita"],
  ["palpAtmE", "ATM esquerda"]
];

const BASE_PT = {
  briefQuestions: JSON.parse(JSON.stringify(briefQuestions)),
  ohipItems: [...ohipItems],
  gcpsItems: [...gcpsItems],
  phqItems: [...phqItems],
  palpationItems: JSON.parse(JSON.stringify(palpationItems))
};

const I18N = {
  pt: {
    lang: "pt-BR",
    ui: {
      tagline: "Identificação de Disfunção Temporomandibular no SUS",
      steps: ["1. Identificação", "2. Brief DC/TMD", "3. Exame", "4. OHIP-TMD", "5. Eixo 2", "6. Resultado"],
      initialModule: "Módulo inicial",
      identification: "Identificação",
      required: "Obrigatório",
      optional: "Opcional",
      selfReport: "Brief DC/TMD - Autorrelato",
      clinicalExam: "Exame clínico",
      movements: "1. Movimentos de abertura",
      painlessOpening: "Abertura sem dor (mm)",
      maxOpening: "Abertura máxima não assistida (mm)",
      assistedOpening: "Abertura máxima assistida (mm)",
      familiarJawPain: "Dor familiar na mandíbula durante abertura",
      familiarTemplePain: "Dor familiar na têmpora durante abertura",
      familiarAtmPain: "Dor familiar na ATM durante abertura",
      jointSounds: "2. Ruídos articulares",
      clickRight: "Clique/estalido direito em abertura ou fechamento",
      clickLeft: "Clique/estalido esquerdo em abertura ou fechamento",
      crepRight: "Crepitação direita",
      crepLeft: "Crepitação esquerda",
      locking: "3. Travamento articular",
      observedLock: "Travamento observado no exame",
      openingLimitation: "Limitação de abertura presente",
      openLock: "Travamento em boca aberta observado",
      palpation: "4. Palpação muscular e ATM",
      axis2: "Eixo 2 psicossocial",
      gcpsTitle: "Escala Graduada de Dor Crônica (GCPS) - 30 dias",
      phqDifficulty: "Dificuldade causada pelos problemas",
      resultTitle: "Resultado e conduta",
      synthesis: "Síntese",
      sendTitle: "Envio dos dados",
      back: "Voltar",
      next: "Avançar",
      submit: "Salvar e enviar",
      name: "Nome",
      age: "Idade",
      sex: "Sexo",
      select: "Selecione",
      female: "Feminino",
      male: "Masculino",
      intersex: "Intersexo",
      preferNo: "Prefere não informar",
      civilStatus: "Estado civil",
      phone: "Telefone",
      healthUnit: "Unidade de Saúde",
      address: "Endereço",
      city: "Cidade",
      state: "Estado",
      country: "País",
      examiner: "Examinador (Cirurgião Dentista)",
      specialty: "Especialidade do examinador",
      yes: "Sim",
      no: "Não",
      years: "Anos",
      months: "Meses",
      noPain: "Sem dor",
      pain: "Dor",
      familiarPain: "Dor familiar",
      never: "Nunca",
      rarely: "Raramente",
      sometimes: "Às vezes",
      repeatedly: "Repetidamente",
      always: "Sempre",
      none: "Nenhuma",
      severalDays: "Vários dias",
      halfDays: "Metade+",
      nearlyEveryDay: "Quase todos",
      noneApply: "Não se aplica",
      notDifficult: "Nada difícil",
      somewhatDifficult: "Um pouco difícil",
      veryDifficult: "Muito difícil",
      extremelyDifficult: "Extremamente difícil",
      sent: "Registro enviado.",
      missingEndpoint: "Não foi possível registrar os dados.",
      clinicalDiagnosis: "Diagnóstico clínico",
      priorityLabel: "Prioridade",
      axis2Label: "Eixo 2",
      notFilled: "Não preenchido",
      careStrategies: "Estratégias de tratamento e manejo",
      ohipLow: "Baixo impacto",
      ohipModerate: "Impacto moderado",
      ohipHigh: "Alto impacto",
      cpiLabel: "CPI",
      disabilityLabel: "Incapacidade",
      diagnoses: {
        myalgia: "Mialgia relacionada a DTM",
        arthralgia: "Artralgia da ATM",
        headache: "Cefaleia atribuída a DTM",
        discReduction: "Deslocamento de disco com redução",
        discLimited: "Deslocamento de disco sem redução com limitação de abertura",
        subluxation: "Subluxação",
        degenerative: "Doença articular degenerativa suspeita",
        none: "Sem diagnóstico clínico de DTM pelo algoritmo breve"
      },
      priorities: {
        veryHigh: "Prioridade muito alta",
        high: "Prioridade alta",
        moderate: "Prioridade moderada",
        low: "Prioridade baixa"
      },
      management: {
        selfCare: "Educar sobre DTM, autocuidado, dieta macia temporária se dor, evitar abertura máxima repetida e orientar retorno programado.",
        myalgia: "Para mialgia: calor local, alongamentos leves, orientação sobre hábitos mandibulares e analgesia conforme protocolo local.",
        jointPain: "Para dor articular: reduzir carga articular, avaliar anti-inflamatório/analgésico conforme condições clínicas e monitorar ruídos/função.",
        disc: "Para deslocamento de disco: orientar movimentos controlados, acompanhar abertura bucal e encaminhar se limitação persistente ou progressiva.",
        subluxation: "Para subluxação: evitar abertura extrema, orientar apoio mandibular ao bocejar e encaminhar se recorrente/incapacitante.",
        psychosocial: "Eixo psicossocial elevado: considerar cuidado compartilhado, acolhimento em saúde mental e abordagem de dor crônica."
      }
    },
    briefQuestions: BASE_PT.briefQuestions,
    ohipItems: BASE_PT.ohipItems,
    gcpsItems: BASE_PT.gcpsItems,
    phqItems: BASE_PT.phqItems,
    palpationItems: BASE_PT.palpationItems
  },
  en: {
    lang: "en",
    ui: {
      tagline: "Temporomandibular Disorder Identification in the SUS",
      steps: ["1. Identification", "2. Brief DC/TMD", "3. Exam", "4. OHIP-TMD", "5. Axis 2", "6. Results"],
      initialModule: "Initial module",
      identification: "Identification",
      required: "Required",
      optional: "Optional",
      selfReport: "Brief DC/TMD - Self-report",
      clinicalExam: "Clinical exam",
      movements: "1. Opening movements",
      painlessOpening: "Pain-free opening (mm)",
      maxOpening: "Maximum unassisted opening (mm)",
      assistedOpening: "Maximum assisted opening (mm)",
      familiarJawPain: "Familiar jaw pain during opening",
      familiarTemplePain: "Familiar temple pain during opening",
      familiarAtmPain: "Familiar TMJ pain during opening",
      jointSounds: "2. Joint sounds",
      clickRight: "Right click/pop during opening or closing",
      clickLeft: "Left click/pop during opening or closing",
      crepRight: "Right crepitus",
      crepLeft: "Left crepitus",
      locking: "3. Joint locking",
      observedLock: "Locking observed during exam",
      openingLimitation: "Opening limitation present",
      openLock: "Open-mouth locking observed",
      palpation: "4. Muscle and TMJ palpation",
      axis2: "Psychosocial Axis 2",
      gcpsTitle: "Graded Chronic Pain Scale (GCPS) - 30 days",
      phqDifficulty: "Difficulty caused by these problems",
      resultTitle: "Results and management",
      synthesis: "Summary",
      sendTitle: "Data submission",
      back: "Back",
      next: "Next",
      submit: "Save and send",
      name: "Name",
      age: "Age",
      sex: "Sex",
      select: "Select",
      female: "Female",
      male: "Male",
      intersex: "Intersex",
      preferNo: "Prefer not to say",
      civilStatus: "Marital status",
      phone: "Phone",
      healthUnit: "Health unit",
      address: "Address",
      city: "City",
      state: "State",
      country: "Country",
      examiner: "Examiner (Dentist)",
      specialty: "Examiner specialty",
      yes: "Yes",
      no: "No",
      years: "Years",
      months: "Months",
      noPain: "No pain",
      pain: "Pain",
      familiarPain: "Familiar pain",
      never: "Never",
      rarely: "Rarely",
      sometimes: "Sometimes",
      repeatedly: "Repeatedly",
      always: "Always",
      none: "None",
      severalDays: "Several days",
      halfDays: "More than half",
      nearlyEveryDay: "Nearly every day",
      noneApply: "Not applicable",
      notDifficult: "Not difficult",
      somewhatDifficult: "Somewhat difficult",
      veryDifficult: "Very difficult",
      extremelyDifficult: "Extremely difficult",
      sent: "Record sent.",
      missingEndpoint: "Unable to register the data.",
      clinicalDiagnosis: "Clinical diagnosis",
      priorityLabel: "Priority",
      axis2Label: "Axis 2",
      notFilled: "Not completed",
      careStrategies: "Treatment and management strategies",
      ohipLow: "Low impact",
      ohipModerate: "Moderate impact",
      ohipHigh: "High impact",
      cpiLabel: "CPI",
      disabilityLabel: "Disability",
      diagnoses: {
        myalgia: "TMD-related myalgia",
        arthralgia: "TMJ arthralgia",
        headache: "Headache attributed to TMD",
        discReduction: "Disc displacement with reduction",
        discLimited: "Disc displacement without reduction with limited opening",
        subluxation: "Subluxation",
        degenerative: "Suspected degenerative joint disease",
        none: "No clinical TMD diagnosis by the brief algorithm"
      },
      priorities: {
        veryHigh: "Very high priority",
        high: "High priority",
        moderate: "Moderate priority",
        low: "Low priority"
      },
      management: {
        selfCare: "Provide TMD education, self-care guidance, temporary soft diet if painful, avoid repeated maximum opening, and schedule follow-up.",
        myalgia: "For myalgia: local heat, gentle stretching, guidance on jaw habits, and analgesia according to local protocol.",
        jointPain: "For joint pain: reduce joint load, consider anti-inflammatory/analgesic medication according to clinical conditions, and monitor sounds/function.",
        disc: "For disc displacement: guide controlled movements, monitor mouth opening, and refer if limitation is persistent or progressive.",
        subluxation: "For subluxation: avoid extreme opening, support the jaw when yawning, and refer if recurrent or disabling.",
        psychosocial: "Elevated psychosocial axis: consider shared care, mental health support, and a chronic pain approach."
      }
    },
    briefQuestions: [
      { id: "sq1", text: "SQ1. Have you ever had pain in your jaw, temple, in the ear, or in front of the ear?", type: "yesno", required: true },
      { id: "sq2", text: "SQ2. How long ago did this pain first begin?", type: "duration" },
      { id: "sq3", text: "SQ3. In the last 30 days, which option best describes this pain?", type: "single", options: [["sem", "No pain"], ["intermitente", "Pain comes and goes"], ["constante", "Pain is always present"]] },
      { id: "sq4", text: "SQ4. In the last 30 days, did these activities change jaw or temple pain?", type: "multiYesNo", items: ["Chewing hard or tough food", "Opening the mouth or moving the jaw", "Keeping teeth together, clenching, grinding, or chewing gum", "Talking, kissing, or yawning"] },
      { id: "sq5", text: "SQ5. In the last 30 days, have you had a headache that included the temple area?", type: "yesno", required: true },
      { id: "sq6", text: "SQ6. How long ago did this temple headache first begin?", type: "duration" },
      { id: "sq7", text: "SQ7. In the last 30 days, did jaw activities change this headache?", type: "multiYesNo", items: ["Chewing hard or tough food", "Opening the mouth or moving the jaw", "Keeping teeth together, clenching, grinding, or chewing gum", "Talking, kissing, or yawning"] },
      { id: "sq8", text: "SQ8. In the last 30 days, did you have any TMJ noise when moving or using your jaw?", type: "yesno", required: true },
      { id: "sq9", text: "SQ9. Has your jaw ever locked or caught, even briefly, so it would not open all the way?", type: "yesno", required: true },
      { id: "sq10", text: "SQ10. Was the locking severe enough to limit mouth opening and interfere with eating?", type: "yesno" },
      { id: "sq11", text: "SQ11. In the last 30 days, did your jaw lock so it would not open fully and then unlock?", type: "yesno", required: true },
      { id: "sq12", text: "SQ12. Is your jaw currently locked or limited so it does not open fully?", type: "yesno" },
      { id: "sq13", text: "SQ13. In the last 30 days, when opening wide, did your jaw lock open so you could not close?", type: "yesno", required: true },
      { id: "sq14", text: "SQ14. When it locked open, did you have to rest, move, push, or maneuver the jaw to close?", type: "yesno" }
    ],
    ohipItems: [
      "Have you had difficulty chewing any food because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you had difficulty opening or closing your mouth?",
      "Have you felt that your mouth, face, or ears were sore?",
      "Have you had pain in your maxilla or mandible?",
      "Have you had headaches because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you felt discomfort while eating because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you felt pain while speaking because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you felt worried about problems with your facial bones (maxilla and mandible) or teeth?",
      "Have you felt insecure because of your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have problems with your facial bones (maxilla and mandible) or teeth made you unhappy?",
      "Have you felt tense because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you had to avoid eating anything because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you had to interrupt meals because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Has your sleep been interrupted because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you felt upset because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you had difficulty relaxing because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you felt depressed because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Has your concentration been affected by problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you been a little irritable with other people because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you had difficulty doing your usual tasks because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you felt that life in general was less enjoyable because of problems with your facial bones (maxilla and mandible), teeth, or mouth?",
      "Have you been unable to work at full capacity because of problems with your facial bones (maxilla and mandible), teeth, or mouth?"
    ],
    gcpsItems: ["Facial pain right now", "Worst facial pain in the last 30 days", "Average facial pain in the last 30 days", "Interference with daily activities", "Interference with recreational, social, and family activities", "Interference with ability to work, including household tasks"],
    phqItems: ["Feeling nervous, anxious, or on edge", "Not being able to stop or control worrying", "Feeling down, depressed, or hopeless", "Little interest or pleasure in doing things"],
    palpationItems: [["palpTemporalD", "Right anterior temporalis"], ["palpTemporalE", "Left anterior temporalis"], ["palpMasseterD", "Right masseter"], ["palpMasseterE", "Left masseter"], ["palpAtmD", "Right TMJ"], ["palpAtmE", "Left TMJ"]]
  },
  es: {
    lang: "es",
    ui: {
      tagline: "Identificación de Trastorno Temporomandibular en el SUS",
      steps: ["1. Identificación", "2. Brief DC/TMD", "3. Examen", "4. OHIP-TMD", "5. Eje 2", "6. Resultado"],
      initialModule: "Módulo inicial",
      identification: "Identificación",
      required: "Obligatorio",
      optional: "Opcional",
      selfReport: "Brief DC/TMD - Autorreporte",
      clinicalExam: "Examen clínico",
      movements: "1. Movimientos de apertura",
      painlessOpening: "Apertura sin dolor (mm)",
      maxOpening: "Apertura máxima no asistida (mm)",
      assistedOpening: "Apertura máxima asistida (mm)",
      familiarJawPain: "Dolor familiar en la mandíbula durante la apertura",
      familiarTemplePain: "Dolor familiar en la sien durante la apertura",
      familiarAtmPain: "Dolor familiar en la ATM durante la apertura",
      jointSounds: "2. Ruidos articulares",
      clickRight: "Clic/chasquido derecho al abrir o cerrar",
      clickLeft: "Clic/chasquido izquierdo al abrir o cerrar",
      crepRight: "Crepitación derecha",
      crepLeft: "Crepitación izquierda",
      locking: "3. Bloqueo articular",
      observedLock: "Bloqueo observado en el examen",
      openingLimitation: "Limitación de apertura presente",
      openLock: "Bloqueo con boca abierta observado",
      palpation: "4. Palpación muscular y ATM",
      axis2: "Eje 2 psicosocial",
      gcpsTitle: "Escala Graduada de Dolor Crónico (GCPS) - 30 días",
      phqDifficulty: "Dificultad causada por estos problemas",
      resultTitle: "Resultado y manejo",
      synthesis: "Síntesis",
      sendTitle: "Envío de datos",
      back: "Volver",
      next: "Avanzar",
      submit: "Guardar y enviar",
      name: "Nombre",
      age: "Edad",
      sex: "Sexo",
      select: "Seleccione",
      female: "Femenino",
      male: "Masculino",
      intersex: "Intersexo",
      preferNo: "Prefiere no informar",
      civilStatus: "Estado civil",
      phone: "Teléfono",
      healthUnit: "Unidad de salud",
      address: "Dirección",
      city: "Ciudad",
      state: "Estado",
      country: "País",
      examiner: "Examinador (Cirujano Dentista)",
      specialty: "Especialidad del examinador",
      yes: "Sí",
      no: "No",
      years: "Años",
      months: "Meses",
      noPain: "Sin dolor",
      pain: "Dolor",
      familiarPain: "Dolor familiar",
      never: "Nunca",
      rarely: "Raramente",
      sometimes: "A veces",
      repeatedly: "Repetidamente",
      always: "Siempre",
      none: "Ninguna",
      severalDays: "Varios días",
      halfDays: "Más de la mitad",
      nearlyEveryDay: "Casi todos",
      noneApply: "No se aplica",
      notDifficult: "Nada difícil",
      somewhatDifficult: "Un poco difícil",
      veryDifficult: "Muy difícil",
      extremelyDifficult: "Extremadamente difícil",
      sent: "Registro enviado.",
      missingEndpoint: "No fue posible registrar los datos.",
      clinicalDiagnosis: "Diagnóstico clínico",
      priorityLabel: "Prioridad",
      axis2Label: "Eje 2",
      notFilled: "No completado",
      careStrategies: "Estrategias de tratamiento y manejo",
      ohipLow: "Bajo impacto",
      ohipModerate: "Impacto moderado",
      ohipHigh: "Alto impacto",
      cpiLabel: "CPI",
      disabilityLabel: "Discapacidad",
      diagnoses: {
        myalgia: "Mialgia relacionada con TTM",
        arthralgia: "Artralgia de la ATM",
        headache: "Cefalea atribuida a TTM",
        discReduction: "Desplazamiento de disco con reducción",
        discLimited: "Desplazamiento de disco sin reducción con limitación de apertura",
        subluxation: "Subluxación",
        degenerative: "Sospecha de enfermedad articular degenerativa",
        none: "Sin diagnóstico clínico de TTM por el algoritmo breve"
      },
      priorities: {
        veryHigh: "Prioridad muy alta",
        high: "Prioridad alta",
        moderate: "Prioridad moderada",
        low: "Prioridad baja"
      },
      management: {
        selfCare: "Educar sobre TTM, autocuidado, dieta blanda temporal si hay dolor, evitar apertura máxima repetida y programar seguimiento.",
        myalgia: "Para mialgia: calor local, estiramientos suaves, orientación sobre hábitos mandibulares y analgesia según protocolo local.",
        jointPain: "Para dolor articular: reducir la carga articular, evaluar antiinflamatorio/analgésico según condiciones clínicas y monitorear ruidos/función.",
        disc: "Para desplazamiento de disco: orientar movimientos controlados, acompañar la apertura bucal y derivar si la limitación persiste o progresa.",
        subluxation: "Para subluxación: evitar apertura extrema, orientar apoyo mandibular al bostezar y derivar si es recurrente o incapacitante.",
        psychosocial: "Eje psicosocial elevado: considerar cuidado compartido, apoyo en salud mental y abordaje de dolor crónico."
      }
    },
    briefQuestions: [
      { id: "sq1", text: "SQ1. ¿Alguna vez tuvo dolor en la mandíbula, sien, oído o delante del oído?", type: "yesno", required: true },
      { id: "sq2", text: "SQ2. ¿Hace cuánto tiempo comenzó ese dolor por primera vez?", type: "duration" },
      { id: "sq3", text: "SQ3. En los últimos 30 días, ¿qué opción describe mejor ese dolor?", type: "single", options: [["sem", "Sin dolor"], ["intermitente", "El dolor va y viene"], ["constante", "El dolor está siempre presente"]] },
      { id: "sq4", text: "SQ4. En los últimos 30 días, ¿estas actividades modificaron el dolor en mandíbula o sien?", type: "multiYesNo", items: ["Masticar alimento duro o resistente", "Abrir la boca o mover la mandíbula", "Mantener dientes juntos, apretar, rechinar o mascar chicle", "Hablar, besar o bostezar"] },
      { id: "sq5", text: "SQ5. En los últimos 30 días, ¿tuvo dolor de cabeza que incluyera la región de la sien?", type: "yesno", required: true },
      { id: "sq6", text: "SQ6. ¿Hace cuánto tiempo comenzó ese dolor de cabeza en la sien?", type: "duration" },
      { id: "sq7", text: "SQ7. En los últimos 30 días, ¿actividades mandibulares modificaron ese dolor de cabeza?", type: "multiYesNo", items: ["Masticar alimento duro o resistente", "Abrir la boca o mover la mandíbula", "Mantener dientes juntos, apretar, rechinar o mascar chicle", "Hablar, besar o bostezar"] },
      { id: "sq8", text: "SQ8. En los últimos 30 días, ¿tuvo algún ruido en la ATM al mover o usar la mandíbula?", type: "yesno", required: true },
      { id: "sq9", text: "SQ9. ¿La mandíbula alguna vez se bloqueó o quedó trabada, aunque fuera por un momento, sin abrir totalmente?", type: "yesno", required: true },
      { id: "sq10", text: "SQ10. ¿El bloqueo fue suficientemente grave para limitar la apertura e interferir con la alimentación?", type: "yesno" },
      { id: "sq11", text: "SQ11. En los últimos 30 días, ¿la mandíbula se bloqueó sin abrir totalmente y luego se desbloqueó?", type: "yesno", required: true },
      { id: "sq12", text: "SQ12. ¿Actualmente la mandíbula está bloqueada o limitada de modo que no abre totalmente?", type: "yesno" },
      { id: "sq13", text: "SQ13. En los últimos 30 días, al abrir mucho la boca, ¿la mandíbula quedó trabada abierta sin poder cerrar?", type: "yesno", required: true },
      { id: "sq14", text: "SQ14. Cuando quedó trabada abierta, ¿tuvo que descansar, mover, empujar o maniobrar la mandíbula para cerrar?", type: "yesno" }
    ],
    ohipItems: [
      "¿Sintió dificultad para masticar algún alimento debido a problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Tuvo dificultad para abrir o cerrar la boca?",
      "¿Sintió que su boca, rostro u oídos estaban doloridos?",
      "¿Tuvo dolor en el maxilar o la mandíbula?",
      "¿Tuvo dolores de cabeza por problemas en los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Sintió molestia al comer debido a problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Sintió dolor al hablar debido a problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Se sintió preocupado(a) por problemas en los huesos de la cara (maxilar y mandíbula) o dientes?",
      "¿Se sintió inseguro(a) por causa de los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Los problemas con los huesos de la cara (maxilar y mandíbula) o dientes le hicieron sentirse infeliz?",
      "¿Se sintió tenso(a) por problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Tuvo que evitar comer algo debido a problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Tuvo que interrumpir sus comidas debido a problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Su sueño fue interrumpido debido a problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Se sintió perturbado(a) por problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Sintió dificultad para relajarse debido a problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Se sintió deprimido(a) debido a problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Su concentración fue afectada por problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Estuvo un poco irritado(a) con otras personas debido a problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Sintió dificultad en sus tareas habituales debido a problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Sintió que la vida en general fue menos placentera debido a problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?",
      "¿Fue incapaz de trabajar con pleno rendimiento por causa de problemas con los huesos de la cara (maxilar y mandíbula), dientes o boca?"
    ],
    gcpsItems: ["Dolor facial ahora", "Peor dolor facial en los últimos 30 días", "Dolor facial promedio en los últimos 30 días", "Interferencia en actividades diarias", "Interferencia en actividades recreativas, sociales y familiares", "Interferencia en la capacidad de trabajar, incluidas tareas domésticas"],
    phqItems: ["Sentirse nervioso(a), ansioso(a) o al límite", "No poder parar o controlar la preocupación", "Sentirse decaído(a), deprimido(a) o sin esperanza", "Poco interés o placer en hacer las cosas"],
    palpationItems: [["palpTemporalD", "Temporal anterior derecho"], ["palpTemporalE", "Temporal anterior izquierdo"], ["palpMasseterD", "Masetero derecho"], ["palpMasseterE", "Masetero izquierdo"], ["palpAtmD", "ATM derecha"], ["palpAtmE", "ATM izquierda"]]
  }
};

let currentLang = localStorage.getItem("cuidador-sus-lang") || "pt";

const form = document.querySelector("#dtmForm");
const steps = [...document.querySelectorAll(".step")];
const views = [...document.querySelectorAll(".view")];
let currentStep = 0;

function copyItems(items) {
  return JSON.parse(JSON.stringify(items));
}

function language() {
  return I18N[currentLang] || I18N.pt;
}

function makeRadio(name, value, label, required = false) {
  return `<label class="choice-button"><input type="radio" name="${name}" value="${value}" ${required ? "required" : ""}> <span>${label}</span></label>`;
}

function renderBriefDc() {
  const ui = language().ui;
  document.querySelector("#briefDc").innerHTML = briefQuestions.map((q) => {
    let body = "";
    if (q.type === "yesno") {
      body = `<div class="yesno-buttons">${makeRadio(q.id, "nao", ui.no, q.required)}${makeRadio(q.id, "sim", ui.yes, q.required)}</div>`;
    }
    if (q.type === "duration") {
      body = `<div class="inline-grid"><label>${ui.years}<input name="${q.id}Anos" type="number" min="0"></label><label>${ui.months}<input name="${q.id}Meses" type="number" min="0" max="11"></label></div>`;
    }
    if (q.type === "single") {
      body = `<div class="choice-grid">${q.options.map(([value, label]) => makeRadio(q.id, value, label)).join("")}</div>`;
    }
    if (q.type === "multiYesNo") {
      body = `<div class="subitems">${q.items.map((item, index) => `
        <div class="yesno-row"><span>${item}</span><div class="yesno-buttons compact">
          ${makeRadio(`${q.id}_${index}`, "0", ui.no)}
          ${makeRadio(`${q.id}_${index}`, "1", ui.yes)}
        </div></div>
      `).join("")}</div>`;
    }
    return `<div class="question"><p>${q.text}</p>${body}</div>`;
  }).join("");
}

function renderScales() {
  const ui = language().ui;
  document.querySelector("#ohipItems").innerHTML = ohipItems.map((item, index) => `
    <div class="ruler-row">
      <div>
        <strong>${index + 1}. ${item}</strong>
        <div class="ruler-labels"><span>${ui.never}</span><span>${ui.rarely}</span><span>${ui.sometimes}</span><span>${ui.repeatedly}</span><span>${ui.always}</span></div>
      </div>
      <div class="ruler-control">
        <input class="ruler ohip-ruler" name="ohip_${index}" type="range" min="0" max="4" step="1" value="0" data-labels="${ui.never},${ui.rarely},${ui.sometimes},${ui.repeatedly},${ui.always}">
        <output>${ui.never}</output>
      </div>
    </div>`).join("");

  document.querySelector("#gcpsItems").innerHTML = gcpsItems.map((item, index) => `
    <div class="ruler-row">
      <div>
        <strong>${index + 1}. ${item}</strong>
        <div class="ruler-labels"><span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span></div>
      </div>
      <div class="ruler-control">
        <input class="ruler pain-ruler" name="gcps_${index}" type="range" min="0" max="10" step="1" value="0">
        <output>0</output>
      </div>
    </div>
  `).join("");

  document.querySelector("#phqItems").innerHTML = phqItems.map((item, index) => `
    <div class="ruler-row">
      <div>
        <strong>${index + 1}. ${item}</strong>
        <div class="ruler-labels"><span>${ui.none}</span><span>${ui.severalDays}</span><span>${ui.halfDays}</span><span>${ui.nearlyEveryDay}</span></div>
      </div>
      <div class="ruler-control">
        <input class="ruler phq-ruler" name="phq_${index}" type="range" min="0" max="3" step="1" value="0" data-labels="${ui.none},${ui.severalDays},${ui.halfDays},${ui.nearlyEveryDay}">
        <output>${ui.none}</output>
      </div>
    </div>
  `).join("");
}

function renderPalpationButtons() {
  const ui = language().ui;
  document.querySelector("#palpationButtons").innerHTML = palpationItems.map(([name, label]) => `
    <div class="palpation-card" data-palpation="${name}">
      <h3>${label}</h3>
      <div class="multi-buttons">
        <label class="check-button none-option"><input type="checkbox" name="${name}_semDor" data-palpation-none="${name}" checked> <span>${ui.noPain}</span></label>
        <label class="check-button"><input type="checkbox" name="${name}_dor" data-palpation-option="${name}"> <span>${ui.pain}</span></label>
        <label class="check-button"><input type="checkbox" name="${name}_dorFamiliar" data-palpation-option="${name}"> <span>${ui.familiarPain}</span></label>
      </div>
      <input type="hidden" name="${name}" value="0">
    </div>
  `).join("");
}

function data() {
  const fd = new FormData(form);
  const obj = {};
  fd.forEach((value, key) => {
    if (obj[key] !== undefined) obj[key] = [].concat(obj[key], value);
    else obj[key] = value;
  });
  form.querySelectorAll("input[type=checkbox]").forEach((input) => obj[input.name] = input.checked);
  palpationItems.forEach(([name]) => {
    const pain = form.querySelector(`[name="${name}_dor"]`)?.checked;
    const familiar = form.querySelector(`[name="${name}_dorFamiliar"]`)?.checked;
    obj[name] = familiar ? "2" : pain ? "1" : "0";
  });
  return obj;
}

function yes(value) {
  return value === "sim" || value === true;
}

function anyPrefix(obj, prefix) {
  return Object.keys(obj).some((key) => key.startsWith(prefix) && obj[key] === "1");
}

function calcScores(obj) {
  const ui = language().ui;
  const ohipValues = ohipItems.map((_, i) => Number(obj[`ohip_${i}`] ?? 0)).filter((n) => !Number.isNaN(n));
  const ohipWasFilled = ohipValues.some((n) => n > 0);
  const ohipTotal = ohipWasFilled ? ohipValues.reduce((sum, n) => sum + n, 0) : null;
  const ohipLevel = ohipTotal === null ? ui.notFilled : ohipTotal <= 22 ? ui.ohipLow : ohipTotal <= 44 ? ui.ohipModerate : ui.ohipHigh;

  const gcps = gcpsItems.map((_, i) => Number(obj[`gcps_${i}`] || 0));
  const phq = phqItems.map((_, i) => Number(obj[`phq_${i}`] || 0));
  const eixo2WasFilled = gcps.some((n) => n > 0) || phq.some((n) => n > 0) || Boolean(obj.phqDificuldade);
  const cpi = eixo2WasFilled ? ((gcps[0] + gcps[1] + gcps[2]) / 3) * 10 : null;
  const disability = eixo2WasFilled ? ((gcps[3] + gcps[4] + gcps[5]) / 3) * 10 : null;
  const phqAnxiety = eixo2WasFilled ? phq[0] + phq[1] : null;
  const phqDepression = eixo2WasFilled ? phq[2] + phq[3] : null;
  const phqTotal = eixo2WasFilled ? phqAnxiety + phqDepression : null;

  return { ohipTotal, ohipLevel, cpi, disability, phqAnxiety, phqDepression, phqTotal };
}

function diagnose(obj) {
  const labels = language().ui.diagnoses;
  const diagnoses = [];
  const musclePain = ["palpTemporalD", "palpTemporalE", "palpMasseterD", "palpMasseterE"].some((k) => obj[k] === "2") || yes(obj.dorAberturaMandibula) || yes(obj.dorAberturaTemporal);
  const atmPain = ["palpAtmD", "palpAtmE"].some((k) => obj[k] === "2") || yes(obj.dorAberturaAtm);
  const modifiedJawPain = anyPrefix(obj, "sq4_");
  const modifiedHeadache = anyPrefix(obj, "sq7_");
  const click = yes(obj.clickDireito) || yes(obj.clickEsquerdo);
  const crepitus = yes(obj.crepitacaoDireita) || yes(obj.crepitacaoEsquerda);
  const opening = Number(obj.aberturaMaxima || 0);

  if (yes(obj.sq1) && obj.sq3 !== "sem" && modifiedJawPain && musclePain) diagnoses.push({ key: "myalgia", label: labels.myalgia });
  if (yes(obj.sq1) && obj.sq3 !== "sem" && modifiedJawPain && atmPain) diagnoses.push({ key: "arthralgia", label: labels.arthralgia });
  if (yes(obj.sq5) && modifiedHeadache && (yes(obj.dorAberturaTemporal) || obj.palpTemporalD === "2" || obj.palpTemporalE === "2")) diagnoses.push({ key: "headache", label: labels.headache });
  if (yes(obj.sq8) && click) diagnoses.push({ key: "discReduction", label: labels.discReduction });
  if ((yes(obj.sq9) || yes(obj.sq11)) && (yes(obj.sq10) || yes(obj.sq12) || opening < 40 || yes(obj.limitacaoAbertura))) diagnoses.push({ key: "discLimited", label: labels.discLimited });
  if (yes(obj.sq13) && yes(obj.sq14)) diagnoses.push({ key: "subluxation", label: labels.subluxation });
  if (crepitus) diagnoses.push({ key: "degenerative", label: labels.degenerative });
  if (!diagnoses.length) diagnoses.push({ key: "none", label: labels.none });

  return diagnoses;
}

function priority(obj, scores, diagnoses) {
  const labels = language().ui.priorities;
  let points = 0;
  if (diagnoses[0]?.key !== "none") points += 18;
  if (diagnoses.some((d) => d.key === "discLimited" || d.key === "subluxation")) points += 24;
  if (Number(obj.aberturaMaxima || 99) < 35) points += 18;
  if (scores.ohipTotal !== null) points += Math.min(18, scores.ohipTotal / 88 * 18);
  if (scores.cpi !== null) points += Math.min(16, scores.cpi / 100 * 16);
  if (scores.disability !== null) points += Math.min(16, scores.disability / 100 * 16);
  if (scores.phqTotal !== null) points += Math.min(10, scores.phqTotal / 12 * 10);

  if (points >= 70) return { label: labels.veryHigh, className: "urgent", points: Math.round(points) };
  if (points >= 45) return { label: labels.high, className: "high", points: Math.round(points) };
  if (points >= 25) return { label: labels.moderate, className: "", points: Math.round(points) };
  return { label: labels.low, className: "low", points: Math.round(points) };
}

function management(diagnoses, scores) {
  const labels = language().ui.management;
  const items = [labels.selfCare];
  if (diagnoses.some((d) => d.key === "myalgia")) items.push(labels.myalgia);
  if (diagnoses.some((d) => d.key === "arthralgia" || d.key === "degenerative")) items.push(labels.jointPain);
  if (diagnoses.some((d) => d.key === "discReduction" || d.key === "discLimited")) items.push(labels.disc);
  if (diagnoses.some((d) => d.key === "subluxation")) items.push(labels.subluxation);
  if ((scores.phqTotal ?? 0) >= 6 || (scores.disability ?? 0) >= 50) items.push(labels.psychosocial);
  return items;
}

function renderResults() {
  const ui = language().ui;
  const obj = data();
  const scores = calcScores(obj);
  const diagnoses = diagnose(obj);
  const prio = priority(obj, scores, diagnoses);
  const care = management(diagnoses, scores);
  const html = `
    <article class="result-card">
      <h2>${ui.clinicalDiagnosis}</h2>
      <ul>${diagnoses.map((d) => `<li>${d.label}</li>`).join("")}</ul>
    </article>
    <article class="result-card">
      <h2>${ui.priorityLabel}</h2>
      <span class="badge ${prio.className}">${prio.label} (${prio.points}/100)</span>
    </article>
    <article class="result-card">
      <h2>OHIP-TMD</h2>
      <p>${scores.ohipTotal === null ? ui.notFilled : `${scores.ohipTotal}/88 - ${scores.ohipLevel}`}</p>
    </article>
    <article class="result-card">
      <h2>${ui.axis2Label}</h2>
      <p>${scores.cpi === null ? ui.notFilled : `${ui.cpiLabel} ${scores.cpi.toFixed(1)} | ${ui.disabilityLabel} ${scores.disability.toFixed(1)} | PHQ-4 ${scores.phqTotal}/12`}</p>
    </article>
    <article class="result-card full">
      <h2>${ui.careStrategies}</h2>
      <ul>${care.map((d) => `<li>${d}</li>`).join("")}</ul>
    </article>`;
  document.querySelector("#results").innerHTML = html;
  return { ...obj, ...scores, diagnosticos: diagnoses.map((d) => d.label).join("; "), prioridade: prio.label, prioridadePontos: prio.points, manejo: care.join("; ") };
}

function go(step) {
  currentStep = Math.max(0, Math.min(step, views.length - 1));
  steps.forEach((button, index) => button.classList.toggle("is-active", index === currentStep));
  views.forEach((view, index) => view.classList.toggle("is-active", index === currentStep));
  if (currentStep === 5) renderResults();
}

function saveDraft() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data()));
}

function restoreDraft() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  restoreDraftFromObject(JSON.parse(raw));
}

function restoreDraftFromObject(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    const fields = [...form.querySelectorAll(`[name="${CSS.escape(key)}"]`)];
    fields.forEach((field) => {
      if (field.type === "checkbox") field.checked = Boolean(value);
      else if (field.type === "radio") field.checked = field.value === value;
      else field.value = value;
    });
  });
  palpationItems.forEach(([name]) => {
    const value = obj[name];
    if (value === "1") form.querySelector(`[name="${name}_dor"]`).checked = true;
    if (value === "2") form.querySelector(`[name="${name}_dorFamiliar"]`).checked = true;
  });
  syncAllPalpation();
  updateAllRulers();
}

function updateRuler(input) {
  const output = input.parentElement.querySelector("output");
  if (!output) return;
  const labels = input.dataset.labels?.split(",");
  output.textContent = labels ? labels[Number(input.value)] : input.value;
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const percent = ((Number(input.value) - min) / (max - min)) * 100;
  input.style.setProperty("--value", `${percent}%`);
}

function updateAllRulers() {
  form.querySelectorAll(".ruler").forEach(updateRuler);
}

function syncPalpation(name) {
  const none = form.querySelector(`[name="${name}_semDor"]`);
  const pain = form.querySelector(`[name="${name}_dor"]`);
  const familiar = form.querySelector(`[name="${name}_dorFamiliar"]`);
  const hidden = form.querySelector(`[name="${name}"]`);
  if (!none || !pain || !familiar || !hidden) return;
  none.checked = !pain.checked && !familiar.checked;
  hidden.value = familiar.checked ? "2" : pain.checked ? "1" : "0";
}

function syncAllPalpation() {
  palpationItems.forEach(([name]) => syncPalpation(name));
}

function setLabelText(name, text) {
  const field = form.elements[name];
  const element = field && typeof field.length === "number" && !field.closest ? field[0] : field;
  const label = element?.closest("label");
  if (!label) return;
  const node = [...label.childNodes].find((child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim());
  if (node) node.textContent = text;
}

function setOptionText(selectName, labels) {
  const select = form.elements[selectName];
  if (!select) return;
  [...select.options].forEach((option, index) => {
    if (labels[index] !== undefined) option.textContent = labels[index];
  });
}

function applyStaticLanguage() {
  const ui = language().ui;
  document.documentElement.lang = language().lang;
  document.querySelector(".brand span").textContent = ui.tagline;
  steps.forEach((step, index) => step.textContent = ui.steps[index]);

  const sectionTitles = document.querySelectorAll(".section-title");
  sectionTitles[0].querySelector("p").textContent = ui.initialModule;
  sectionTitles[0].querySelector("h1").textContent = ui.identification;
  sectionTitles[1].querySelector("p").textContent = ui.required;
  sectionTitles[1].querySelector("h1").textContent = ui.selfReport;
  sectionTitles[2].querySelector("p").textContent = ui.required;
  sectionTitles[2].querySelector("h1").textContent = ui.clinicalExam;
  sectionTitles[3].querySelector("p").textContent = ui.optional;
  sectionTitles[4].querySelector("p").textContent = ui.optional;
  sectionTitles[4].querySelector("h1").textContent = ui.axis2;
  sectionTitles[5].querySelector("p").textContent = ui.synthesis;
  sectionTitles[5].querySelector("h1").textContent = ui.resultTitle;

  const examHeadings = document.querySelectorAll('[data-view="2"] .exam-block h2');
  examHeadings[0].textContent = ui.movements;
  examHeadings[1].textContent = ui.jointSounds;
  examHeadings[2].textContent = ui.locking;
  examHeadings[3].textContent = ui.palpation;

  const axis2Headings = document.querySelectorAll('[data-view="4"] h2');
  axis2Headings[0].textContent = ui.gcpsTitle;
  axis2Headings[1].textContent = "PHQ-4";
  document.querySelector("#prevBtn").textContent = ui.back;
  document.querySelector("#nextBtn").textContent = ui.next;
  document.querySelector('button[type="submit"]').textContent = ui.submit;

  setLabelText("nome", ui.name);
  setLabelText("idade", ui.age);
  setLabelText("sexo", ui.sex);
  setLabelText("estadoCivil", ui.civilStatus);
  setLabelText("telefone", ui.phone);
  setLabelText("unidadeSaude", ui.healthUnit);
  setLabelText("endereco", ui.address);
  setLabelText("cidade", ui.city);
  setLabelText("estado", ui.state);
  setLabelText("pais", ui.country);
  setLabelText("examinador", ui.examiner);
  setLabelText("especialidade", ui.specialty);
  setLabelText("aberturaSemDor", ui.painlessOpening);
  setLabelText("aberturaMaxima", ui.maxOpening);
  setLabelText("aberturaAssistida", ui.assistedOpening);
  setLabelText("phqDificuldade", ui.phqDifficulty);
  setOptionText("sexo", [ui.select, ui.female, ui.male, ui.intersex, ui.preferNo]);
  setOptionText("phqDificuldade", [ui.noneApply, ui.notDifficult, ui.somewhatDifficult, ui.veryDifficult, ui.extremelyDifficult]);

  const checkLabels = {
    dorAberturaMandibula: ui.familiarJawPain,
    dorAberturaTemporal: ui.familiarTemplePain,
    dorAberturaAtm: ui.familiarAtmPain,
    clickDireito: ui.clickRight,
    clickEsquerdo: ui.clickLeft,
    crepitacaoDireita: ui.crepRight,
    crepitacaoEsquerda: ui.crepLeft,
    travamentoObservado: ui.observedLock,
    limitacaoAbertura: ui.openingLimitation,
    travamentoAberta: ui.openLock
  };
  Object.entries(checkLabels).forEach(([name, text]) => {
    const span = form.elements[name]?.closest("label")?.querySelector("span");
    if (span) span.textContent = text;
  });

  document.querySelectorAll(".lang-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === currentLang);
  });
}

function setLanguage(lang, rerender = true) {
  currentLang = I18N[lang] ? lang : "pt";
  localStorage.setItem("cuidador-sus-lang", currentLang);
  const pack = language();
  briefQuestions = copyItems(pack.briefQuestions);
  ohipItems = [...pack.ohipItems];
  gcpsItems = [...pack.gcpsItems];
  phqItems = [...pack.phqItems];
  palpationItems = copyItems(pack.palpationItems);
  if (!rerender) {
    return;
  }
  const snapshot = data();
  renderBriefDc();
  renderScales();
  renderPalpationButtons();
  applyStaticLanguage();
  restoreDraftFromObject(snapshot);
  updateAllRulers();
  if (currentStep === 5) renderResults();
}

async function sendPayload(payload) {
  const endpoint = SEND_ENDPOINT;
  if (!endpoint) return { ok: false, message: language().ui.missingEndpoint };
  const body = new URLSearchParams();
  body.set("payload", JSON.stringify(payload));
  const response = await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body
  });
  return { ok: true, message: language().ui.sent };
}

setLanguage(currentLang, false);
renderBriefDc();
renderScales();
renderPalpationButtons();
applyStaticLanguage();
restoreDraft();
updateAllRulers();
go(0);

steps.forEach((button) => button.addEventListener("click", () => go(Number(button.dataset.step))));
document.querySelectorAll(".lang-button").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});
document.querySelector("#prevBtn").addEventListener("click", () => go(currentStep - 1));
document.querySelector("#nextBtn").addEventListener("click", () => {
  go(currentStep + 1);
});
form.addEventListener("input", saveDraft);
form.addEventListener("input", (event) => {
  if (event.target.classList.contains("ruler")) updateRuler(event.target);
});
form.addEventListener("change", saveDraft);
form.addEventListener("change", (event) => {
  if (event.target.classList.contains("ruler")) updateRuler(event.target);
  if (event.target.dataset.palpationNone) {
    const name = event.target.dataset.palpationNone;
    if (event.target.checked) {
      form.querySelector(`[name="${name}_dor"]`).checked = false;
      form.querySelector(`[name="${name}_dorFamiliar"]`).checked = false;
    }
    syncPalpation(name);
  }
  if (event.target.dataset.palpationOption) {
    syncPalpation(event.target.dataset.palpationOption);
  }
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const submitButton = event.submitter || form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  const payload = { enviadoEm: new Date().toISOString(), ...renderResults() };
  saveDraft();
  try {
    const result = await sendPayload(payload);
    alert(result.message);
  } catch (error) {
    alert(language().ui.missingEndpoint);
  } finally {
    submitButton.disabled = false;
  }
});
