const $=selector=>document.querySelector(selector);
const params=new URLSearchParams(location.search);
const whatsapp=params.get('whatsapp');
const answers={audience:'',age:'',goal:'',concerns:[],style:'',motivation:'',temperament:'',parentGoal:'',parentPriority:''};
const audienceQuestion={key:'audience',label:'Seu percurso',title:'Quem vai começar no judô?',hint:'A gente muda as próximas perguntas para combinar com a pessoa que vai treinar.',options:[['self','Quero começar para mim','Monte um caminho com meus objetivos e preferências.'],['parent','Sou pai/mãe e quero para meu filho ou filha','Vamos pensar no jeito e nos interesses da criança.']]};
const selfQuestions=[
  {key:'age',label:'Seu momento',title:'Qual é a sua fase de vida?',hint:'A aula pode ser ajustada para diferentes idades e experiências.',options:[['crianca','Até 11 anos','O primeiro contato deve ser acompanhado por um responsável.'],['adolescente','De 12 a 17 anos','Aprendizado, movimento e convivência.'],['adulto','De 18 a 49 anos','Não precisa já ter experiência ou condicionamento.'],['cinquenta','50 anos ou mais','Seu ritmo e seus objetivos vêm primeiro.']]},
  {key:'goal',label:'O que você busca',title:'O que mais gostaria de ganhar com o judô?',hint:'Escolha o que importa mais para você neste momento.',options:[['confianca','Mais confiança','Avançar em desafios e reconhecer minha evolução.'],['movimento','Mais movimento','Condicionamento, mobilidade e disposição.'],['disciplina','Foco e constância','Criar uma rotina e praticar autocontrole.'],['convivio','Convivência','Aprender em grupo e conhecer gente nova.']]},
  {key:'concerns',label:'O que te deixaria à vontade',title:'O que pode tornar o começo mais difícil?',hint:'Marque tudo que se aplica. Isso ajuda o sensei a receber você melhor.',multi:true,options:[['iniciante','Nunca pratiquei','Quero entender o básico sem pressão.'],['condicionamento','Estou sem condicionamento','Prefiro construir o ritmo aos poucos.'],['vergonha','Fico nervoso em lugar novo','Quero chegar sabendo o que esperar.'],['quedas','Tenho receio de cair','Quero começar pela segurança.'],['limitacao','Tenho uma limitação física','Prefiro combinar adaptações diretamente com o sensei.'],['nenhuma','Nada específico','Quero experimentar e descobrir.']]},
  {key:'style',label:'Sua preferência',title:'Como você gosta de aprender algo novo?',hint:'Vamos usar sua preferência para sugerir um jeito de começar.',options:[['explicacao','Entendendo cada etapa','Gosto de explicações claras antes de tentar.'],['demonstracao','Vendo e depois praticando','Uma demonstração me ajuda a ganhar confiança.'],['pratica','Aprendendo em movimento','Prefiro experimentar com orientação.'],['conversa','Conversando primeiro','Quero alinhar minhas expectativas com o professor.']]}
];
const parentQuestions=[
  {key:'age',label:'Fase da criança',title:'Qual é a idade do seu filho ou da sua filha?',hint:'As atividades e a comunicação mudam conforme a fase de desenvolvimento.',options:[['crianca_pequena','3 a 6 anos','Descobertas, movimento e instruções simples.'],['crianca','7 a 11 anos','Coordenação, confiança e fundamentos.'],['adolescente','12 a 17 anos','Autonomia, técnica e convivência.']]},
  {key:'motivation',label:'O que desperta interesse',title:'O que costuma animar seu filho ou sua filha?',hint:'Pense no que faz a criança se envolver e querer continuar.',options:[['brincar','Brincar e se movimentar','Atividades variadas, dinâmicas e com propósito.'],['habilidade','Aprender uma habilidade','Perceber que está evoluindo e conquistando etapas.'],['amizades','Estar com outras crianças','Fazer parte de um grupo e aprender junto.'],['desafio','Ter um desafio novo','Experimentar algo diferente com apoio.']]},
  {key:'temperament',label:'Jeito de chegar',title:'Em uma atividade nova, como ele ou ela costuma reagir?',hint:'Não é um rótulo; é só uma pista para tornar a chegada mais confortável.',options:[['observa','Observa antes de participar','Prefere conhecer o espaço primeiro.'],['entusiasmado','Quer experimentar logo','Gosta de começar fazendo.'],['acolhimento','Precisa de um pouco de acolhimento','Se sente melhor com apresentação e incentivo.'],['estrutura','Gosta de saber o que vai acontecer','Instruções e rotina ajudam a se sentir seguro.']]},
  {key:'parentGoal',label:'O que você valoriza',title:'O que você gostaria que o judô ajudasse a desenvolver?',hint:'Escolha a prioridade que faz mais sentido para sua família.',options:[['confianca','Confiança e autonomia','Sentir orgulho do que consegue aprender.'],['coordenacao','Coordenação e movimento','Conhecer melhor o corpo e ganhar habilidade.'],['disciplina','Foco e responsabilidade','Praticar respeito, atenção e constância.'],['convivio','Convivência e amizades','Aprender a fazer parte de um grupo.']]},
  {key:'parentPriority',label:'Prioridade da família',title:'O que é mais importante para você na primeira aula?',hint:'A resposta ajuda a preparar uma conversa mais útil com o sensei.',options:[['seguranca','Segurança e progressão','Quero saber como os movimentos são ensinados.'],['diversao','Que seja uma experiência gostosa','Quero que a criança se sinta bem-vinda.'],['evolucao','Respeitar o tempo da criança','Sem comparação e sem cobrança por desempenho.'],['adaptacao','Conversar sobre uma necessidade específica','Prefiro alinhar isso diretamente com o professor.']]}
];
let currentStep=0;
function questionList(){return answers.audience?[audienceQuestion,...(answers.audience==='parent'?parentQuestions:selfQuestions)]:[audienceQuestion]}

function readTheme(){
  let saved='';
  try{const preferences=JSON.parse(localStorage.getItem('judo-academia-preferences')||'{}');saved=preferences.theme||localStorage.getItem('judo-theme')||''}catch{}
  const theme=saved==='light'||saved==='dark'?saved:matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  document.documentElement.dataset.theme=theme;
  $('meta[name="theme-color"]').content=theme==='dark'?'#0b0b0f':'#f5f1e8';
}
readTheme();
$('#journeyTheme').addEventListener('click',()=>{
  const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=theme;
  $('meta[name="theme-color"]').content=theme==='dark'?'#0b0b0f':'#f5f1e8';
  try{const preferences=JSON.parse(localStorage.getItem('judo-academia-preferences')||'{}');preferences.theme=theme;localStorage.setItem('judo-academia-preferences',JSON.stringify(preferences));localStorage.setItem('judo-theme',theme)}catch{}
});

function selectedValues(question){return question.multi?answers[question.key]:[answers[question.key]]}
function renderQuestion(){
  const questions=questionList(),question=questions[currentStep]||audienceQuestion,progress=currentStep+1;
  $('#stepCount').textContent=answers.audience?'PASSO '+progress+' DE '+questions.length:'ESCOLHA SEU CAMINHO';
  $('#stepLabel').textContent=question.label;
  $('#questionTitle').textContent=question.title;
  $('#questionHint').textContent=question.hint;
  $('.journey-progress').setAttribute('aria-valuemax',String(answers.audience?questions.length:6));
  $('.journey-progress').setAttribute('aria-valuenow',String(progress));
  $('#progressFill').style.width=(progress/(answers.audience?questions.length:6)*100)+'%';
  $('#previousStep').disabled=currentStep===0;
  $('#nextStep').disabled=selectedValues(question).filter(Boolean).length===0;
  const options=$('#answerOptions');options.replaceChildren();
  question.options.forEach(([value,title,detail],index)=>{
    const button=document.createElement('button');button.type='button';button.className='journey-option';
    const selected=selectedValues(question).includes(value);
    button.setAttribute('aria-pressed',String(selected));
    const number=document.createElement('span');number.className='journey-option__index';number.textContent=String(index+1).padStart(2,'0');
    const copy=document.createElement('span');copy.className='journey-option__copy';
    const heading=document.createElement('strong');heading.textContent=title;
    const description=document.createElement('small');description.textContent=detail;
    copy.append(heading,description);
    const check=document.createElement('span');check.className='journey-option__check';check.setAttribute('aria-hidden','true');check.textContent='✓';
    button.append(number,copy,check);
    button.addEventListener('click',()=>selectAnswer(question,value));
    options.append(button);
  });
}
function selectAnswer(question,value){
  if(question.multi){
    const selected=answers[question.key];
    if(value==='nenhuma'){answers[question.key]=selected.includes(value)?[]:[value]}
    else{answers[question.key]=selected.filter(item=>item!=='nenhuma');answers[question.key]=answers[question.key].includes(value)?answers[question.key].filter(item=>item!==value):[...answers[question.key],value]}
  }else{
    if(question.key==='audience'&&answers.audience!==value){
      Object.keys(answers).forEach(key=>{if(key!=='audience')answers[key]=Array.isArray(answers[key])?[]:''});
    }
    answers[question.key]=value;
  }
  renderQuestion();
}
function next(){const questions=questionList();if(currentStep<questions.length-1){currentStep++;renderQuestion()}else renderResult()}
function previous(){if(currentStep>0){currentStep--;renderQuestion()}}
$('#nextStep').addEventListener('click',next);
$('#previousStep').addEventListener('click',previous);

const selfAgeCopy={crianca:'Como a pessoa que vai treinar tem até 11 anos, um responsável deve acompanhar o primeiro contato. O professor pode explicar a dinâmica de forma simples e acolhedora.',adolescente:'Para adolescentes, o treino pode equilibrar autonomia, técnica e convivência, sempre com orientação e progressão.',adulto:'Não é preciso chegar com experiência ou preparo físico. O ritmo e as pausas podem ser combinados com o professor.',cinquenta:'A idade não define sozinha o que você pode fazer. Vale conversar com o professor sobre seu ritmo, seus objetivos e qualquer adaptação.'};
const selfGoalCopy={confianca:'Um começo baseado em pequenas conquistas pode ajudar você a perceber sua evolução sem se comparar com os outros.',movimento:'O condicionamento é construído gradualmente. Ajuste a intensidade e faça pausas conforme precisar.',disciplina:'Fundamentos simples e repetição ajudam a transformar o treino em uma rotina sustentável.',convivio:'Aprender em dupla e conhecer a dinâmica do grupo pode tornar o primeiro treino mais natural.'};
const selfConcernCopy={iniciante:'Você não precisa conhecer regras ou golpes. O primeiro treino começa pelo básico, com demonstração e orientação.',condicionamento:'Comece com o que é confortável e avise se precisar reduzir o ritmo ou descansar.',vergonha:'É normal ficar nervoso. Você pode avisar o professor ao chegar; ninguém espera que um iniciante saiba o que fazer.',quedas:'A segurança vem primeiro: ukemi, a prática de cair, é ensinado com progressão e supervisão.',limitacao:'Converse diretamente com o sensei antes do treino para combinar adaptações. Não precisa compartilhar detalhes médicos neste questionário.',nenhuma:'Você pode conhecer a aula experimental e descobrir aos poucos o que funciona para você.'};
const selfStyleCopy={explicacao:'Peça ao professor para explicar cada etapa antes de você tentar. Entender o objetivo do movimento pode deixar a experiência mais confortável.',demonstracao:'Uma demonstração antes da prática combina com sua preferência. Você pode observar e depois experimentar com orientação.',pratica:'A aula pode priorizar movimentos simples para você aprender fazendo, sempre com acompanhamento.',conversa:'Comece conversando com o sensei sobre o que espera da aula; esse alinhamento já faz parte do seu primeiro passo.'};
const childAgeCopy={crianca_pequena:'Para 3 a 6 anos, uma chegada acolhedora, instruções simples e atividades lúdicas ajudam a criança a conhecer o espaço.',crianca:'Para 7 a 11 anos, coordenação, fundamentos e pequenas conquistas podem manter o aprendizado interessante.',adolescente:'Para adolescentes, combinar autonomia, desafio e convivência pode ajudar a construir vínculo com a prática.'};
const childMotivationCopy={brincar:'Use o interesse por movimento como porta de entrada: atividades variadas, com regras simples e orientação.',habilidade:'Mostre que cada fundamento é uma conquista. A evolução aparece com prática, sem pressa para comparar resultados.',amizades:'A convivência pode ser parte importante do começo. O professor pode ajudar a criança a conhecer o grupo gradualmente.',desafio:'Apresente o judô como algo novo para explorar, com desafios pequenos e apoio a cada etapa.'};
const childTemperamentCopy={observa:'Dê espaço para observar o ambiente e fazer perguntas antes de participar. Essa pausa também pode fazer parte da adaptação.',entusiasmado:'A vontade de experimentar pode ser canalizada em movimentos simples, com combinados claros e supervisão.',acolhimento:'Uma apresentação tranquila do espaço e do professor pode ajudar a criança a se sentir segura para participar.',estrutura:'Explique a sequência da aula em passos curtos. Saber o que vem depois pode facilitar a chegada.'};
const parentGoalCopy={confianca:'Valorize a tentativa e a autonomia, não só o resultado. Pequenos avanços são parte importante do aprendizado.',coordenacao:'Os fundamentos do judô oferecem oportunidades de explorar equilíbrio, coordenação e movimento com orientação.',disciplina:'Respeito, atenção e constância são praticados no convívio e nos combinados do treino.',convivio:'O treino em grupo pode abrir espaço para cooperação e novas amizades, respeitando o tempo de cada criança.'};
const parentPriorityCopy={seguranca:'Pergunte ao sensei como a turma começa pelo ukemi e como a intensidade progride para iniciantes.',diversao:'Uma primeira experiência positiva importa. Conte ao professor o que costuma deixar a criança curiosa e à vontade.',evolucao:'Alinhe que o foco é aprender e participar, sem comparação ou cobrança por desempenho.',adaptacao:'Converse diretamente com o sensei antes da aula sobre a necessidade de adaptação. Não inclua informações médicas no questionário.'};
const optionLabel=(questions,key,value)=>questions.flatMap(question=>question.options).find(option=>option[0]===value)?.[1]||'';
function addAdaptation(container,text){const row=document.createElement('div');row.className='journey-adaptation';const marker=document.createElement('span');marker.textContent='↗';marker.setAttribute('aria-hidden','true');const paragraph=document.createElement('p');paragraph.textContent=text;row.append(marker,paragraph);container.append(row)}
function renderResult(){
  const questions=questionList();
  $('#questionArea').hidden=true;$('#journeyControls').hidden=true;$('#journeyResult').hidden=false;
  $('#stepCount').textContent='JORNADA CONCLUÍDA';$('#stepLabel').textContent='Seu plano de chegada';
  $('.journey-progress').setAttribute('aria-valuemax',String(questions.length));$('.journey-progress').setAttribute('aria-valuenow',String(questions.length));$('#progressFill').style.width='100%';
  const adaptations=$('#resultAdaptations');adaptations.replaceChildren();
  let message='';
  if(answers.audience==='parent'){
    const childAges={crianca_pequena:'3 a 6 anos',crianca:'7 a 11 anos',adolescente:'12 a 17 anos'};
    const titleByAge={crianca_pequena:'Um começo lúdico, no tempo da criança.',crianca:'Pequenas conquistas, confiança de verdade.',adolescente:'Um espaço para aprender e fazer parte.'};
    $('#resultTitle').textContent=titleByAge[answers.age];
    $('#resultLead').textContent='Plano pensado para '+childAges[answers.age]+', a partir do que costuma despertar o interesse do seu filho ou da sua filha: '+optionLabel(questions,'motivation',answers.motivation).toLowerCase()+'.';
    addAdaptation(adaptations,childAgeCopy[answers.age]);
    addAdaptation(adaptations,childMotivationCopy[answers.motivation]);
    addAdaptation(adaptations,childTemperamentCopy[answers.temperament]);
    addAdaptation(adaptations,parentGoalCopy[answers.parentGoal]);
    addAdaptation(adaptations,parentPriorityCopy[answers.parentPriority]);
    const welcomeByStyle={observa:'Uma chegada tranquila: conhecer o espaço, observar a aula e participar quando se sentir pronta ou pronto.',entusiasmado:'Uma conversa breve, aquecimento e movimentos básicos com orientação para canalizar a vontade de experimentar.',acolhimento:'Apresentação do professor e do espaço, seguida de movimentos simples, sem pressionar a criança a acompanhar o grupo.',estrutura:'Explicar o que vai acontecer, fazer um aquecimento leve e aprender uma técnica simples com o professor.'};
    $('#firstClassPlan').textContent=welcomeByStyle[answers.temperament]+' Você pode acompanhar e conversar com o sensei antes de começar.';
    message='Olá, Sensei! Sou pai/mãe ou responsável e estou buscando uma aula experimental para meu filho ou minha filha ('+childAges[answers.age]+'). O que mais desperta o interesse dele(a): '+optionLabel(questions,'motivation',answers.motivation)+'. Em atividades novas, costuma: '+optionLabel(questions,'temperament',answers.temperament)+'. Gostaria de apoiar: '+optionLabel(questions,'parentGoal',answers.parentGoal)+'. Minha prioridade como responsável: '+optionLabel(questions,'parentPriority',answers.parentPriority)+'. Como podemos preparar esse primeiro contato?';
  }else{
    const titles={crianca:'Um começo acompanhado, no seu tempo.',adolescente:'Energia, aprendizado e um lugar para pertencer.',adulto:'Uma hora para você. Um passo de cada vez.',cinquenta:'Movimento e confiança no seu ritmo.'};
    $('#resultTitle').textContent=titles[answers.age];
    $('#resultLead').textContent='Seu ponto de partida: '+optionLabel(questions,'goal',answers.goal).toLowerCase()+'. A experiência considera o que te deixa à vontade e o jeito que você prefere aprender.';
    addAdaptation(adaptations,selfAgeCopy[answers.age]);addAdaptation(adaptations,selfGoalCopy[answers.goal]);
    answers.concerns.forEach(concern=>addAdaptation(adaptations,selfConcernCopy[concern]));
    addAdaptation(adaptations,selfStyleCopy[answers.style]);
    const firstStepByStyle={explicacao:'Peça ao professor para explicar a sequência; depois, experimente um movimento básico com orientação.',demonstracao:'Observe uma demonstração, pratique movimentos de segurança e experimente uma técnica simples com orientação.',pratica:'Comece com aquecimento, movimentos de segurança e uma técnica simples para aprender fazendo.',conversa:'Converse com o sensei sobre seus objetivos antes do aquecimento e combine como começar.'};
    $('#firstClassPlan').textContent=firstStepByStyle[answers.style]+' Você pode avisar quando precisar de uma pausa.';
    const concerns=answers.concerns.map(value=>optionLabel(questions,'concerns',value)).join(', ')||'nenhuma preocupação específica';
    message='Olá, Sensei! Quero conversar sobre uma aula experimental para mim. Minha fase: '+optionLabel(questions,'age',answers.age)+'. O que busco: '+optionLabel(questions,'goal',answers.goal)+'. O que pode me deixar mais à vontade: '+concerns+'. Gosto de aprender assim: '+optionLabel(questions,'style',answers.style)+'.';
  }
  const contact=$('#journeyWhatsapp');
  if(whatsapp&&/^\d{10,15}$/.test(whatsapp)){contact.href='https://wa.me/'+whatsapp+'?text='+encodeURIComponent(message);contact.target='_blank'}
  else{contact.href='./judo-academia.html#aula';contact.removeAttribute('target');contact.textContent='Voltar ao site para conversar'}
  $('#journeyResult').focus({preventScroll:true});
}
$('#restartJourney').addEventListener('click',()=>{
  Object.keys(answers).forEach(key=>{answers[key]=Array.isArray(answers[key])?[]:''});currentStep=0;
  $('#journeyResult').hidden=true;$('#questionArea').hidden=false;$('#journeyControls').hidden=false;renderQuestion();
});
renderQuestion();