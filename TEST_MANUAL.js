// 🧪 Test Manual para detectInterest() - Copiar en Browser Console
// Abrir la app y ejecutar estos tests en la consola del navegador

const testCases = [
  {
    input: "quiero arreglar tractores Caterpillar",
    expected: "heavyEquipment",
    description: "Maquinaria Pesada - DEBE ser Tier 1"
  },
  {
    input: "me gusta programar apps y webs",
    expected: "software",
    description: "Software - DEBE bloquear robots/mecatrónica"
  },
  {
    input: "me interesa los autos y motos",
    expected: "automotive",
    description: "Automotriz - Tier 2"
  },
  {
    input: "quiero programar y hacer robots",
    expected: "software",
    description: "Software BLOQUEADOR - NO debe ser mechatronics"
  },
  {
    input: "excavadoras y programación",
    expected: "heavyEquipment",
    description: "Heavy Equipment BLOQUEA Software - Tier 1 > Tier 3"
  },
  {
    input: "me interesa la electricidad y PLC",
    expected: "electricity",
    description: "Electricidad - Tier 4"
  },
  {
    input: "robots y automatización",
    expected: "mechatronics",
    description: "Mecatrónica - Tier 5 (sin Software keywords)"
  },
  {
    input: "me gusta el marketing y los negocios",
    expected: "business",
    description: "Gestión/Negocios - Tier 6"
  },
  {
    input: "me vacila diseñar cosas",
    expected: "design",
    description: "Diseño - Tier 7"
  },
  {
    input: "me encanta hablar y crear contenido",
    expected: "communication",
    description: "Comunicación - Tier 8"
  },
  {
    input: "números y datos me fascinan",
    expected: "mathematics",
    description: "Matemáticas - Tier 9"
  },
  {
    input: "xyz abc 123",
    expected: null,
    description: "NO MATCH - fallback"
  }
];

console.log("🧪 TEST SUITE: detectInterest() - 9 Grupos de Interés\n");
console.log("=" .repeat(80));

let passed = 0;
let failed = 0;

testCases.forEach((test, idx) => {
  // Este test necesita que ejecutes desde la app con importado assistantService
  // Para ahora, este es el TEMPLATE que deberías ejecutar
  console.log(`\n📋 Test ${idx + 1}: ${test.description}`);
  console.log(`   Input: "${test.input}"`);
  console.log(`   Expected: ${test.expected}`);
  console.log(`   ⏳ (Ejecutar detectInterest("${test.input}") para ver resultado)`);
});

console.log("\n" + "=".repeat(80));
console.log("📝 Para ejecutar los tests, usa en browser console:\n");
console.log("import assistantService from '@/services/assistantService'");
console.log("await assistantService.askVocationalAssistant('quiero arreglar tractores')");
console.log("\nVerifica los console.logs para ver detectInterest() results");
