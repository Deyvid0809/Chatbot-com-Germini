import { GoogleGenerativeAI, FunctionDeclarationSchemaType} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const funcoes = {
  taxaJurosParcelamento: ({ meses }) => {
    const value = typeof meses === "string" ? parseInt(meses) : meses;
    if (value <= 6){
      return 3;
    } else if (value <= 12){
      return 5;
    } else if (value <= 24){
      return 7;
    }
  }
};

const tools = [
  {
    functionDeclarations:[
      {
        name: "taxaJurosParcelamento",
        description: "Retorna a taxa de juros para parcelamento baseado na quantidade de meses",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            meses: {type: FunctionDeclarationSchemaType.NUMBER},
          },
          required: ["meses"],
        }
      }
    ]
  }
];


const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", tools},
  { apiVersion: "v1beta"});

let chat;

function inicializaChat(){
     chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Sempre se apresentar com seu nome você é Victor, um chatbot amigável que representa a empresa jornada viagens que deve perguntar o nome do usuario e endereço de e-mail. Você pode responder mensagens referentes a esses assuntos: pacotes turisticos, viagens e destinos diversos. Sempre confirma a quantidade de vezes que vai ser parcelado e fazer o calculo do juros encima da quantidade de parcelas" }],
          },
          {
            role: "model",
            parts: [{ text: "Obrigado pelo seu contato, antes de começcar o seu atendimento preciso do seu nome e endereço de e-mail." }],  
          },
        ],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
}

export {chat, funcoes, inicializaChat}