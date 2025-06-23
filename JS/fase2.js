const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const audio = document.getElementById("audio");
const pontuacaoElement = document.getElementById('pontuacao');

let pontos = 0;

// Timer de 2 minutos (120 segundos)
let tempoFase = 120;
let intervaloTempo;

// Exibe o tempo na tela
const tempoElement = document.createElement('div');
tempoElement.id = 'tempo';
tempoElement.style.position = 'absolute';
tempoElement.style.top = '60px';
tempoElement.style.left = '20px';
tempoElement.style.color = 'white';
tempoElement.style.fontSize = '24px';
tempoElement.innerText = `Tempo: ${tempoFase}s`;
document.body.appendChild(tempoElement);

// Exibe instrução antes do jogo começar
const instrucao = document.createElement('div');
instrucao.id = 'instrucao';
instrucao.style.position = 'absolute';
instrucao.style.top = '40%';
instrucao.style.left = '50%';
instrucao.style.transform = 'translate(-50%, -50%)';
instrucao.style.background = 'rgba(0,0,0,0.8)';
instrucao.style.color = 'white';
instrucao.style.padding = '30px 50px';
instrucao.style.fontSize = '32px';
instrucao.style.borderRadius = '16px';
instrucao.style.textAlign = 'center';
instrucao.style.zIndex = '10';
instrucao.innerText = 'Clique apenas nos confetes de estrelas (qualquer cor) para ganhar pontos!';
document.body.appendChild(instrucao);

let jogoPodeComecar = false;

setTimeout(() => {
    instrucao.remove();
    jogoPodeComecar = true;
    // Inicia o timer e o jogo se as imagens já estiverem carregadas
    if (imagensCarregadas === totalImagens) {
        desenhar();
        intervaloTempo = setInterval(atualizarTempo, 1000);
    }
}, 3000);

function atualizarTempo() {
    tempoFase--;
    tempoElement.innerText = `Tempo: ${tempoFase}s`;
    if (tempoFase <= 0) {
        clearInterval(intervaloTempo);

        // Exibe mensagem de conclusão antes de ir para a próxima fase
        const fimFase = document.createElement('div');
        fimFase.id = 'fimFase';
        fimFase.style.position = 'absolute';
        fimFase.style.top = '40%';
        fimFase.style.left = '50%';
        fimFase.style.transform = 'translate(-50%, -50%)';
        fimFase.style.background = 'rgba(0,0,0,0.85)';
        fimFase.style.color = 'white';
        fimFase.style.padding = '30px 50px';
        fimFase.style.fontSize = '32px';
        fimFase.style.borderRadius = '16px';
        fimFase.style.textAlign = 'center';
        fimFase.style.zIndex = '20';
        fimFase.innerHTML = `Segunda fase concluída, parabéns!<br><br>Total de pontos: <b>${pontos}</b>`;
        document.body.appendChild(fimFase);
        localStorage.setItem('pontosFase2', pontos);

        // Animação de pulo do personagem (5 vezes)
        let puloAltura = 0;
        let pulando = true;
        let pulosRestantes = 5;
        function animarPulo() {
            if (pulando) {
                puloAltura += 8;
                if (puloAltura >= 80) pulando = false;
            } else {
                puloAltura -= 8;
                if (puloAltura <= 0) {
                    puloAltura = 0;
                    pulosRestantes--;
                    if (pulosRestantes > 0) {
                        pulando = true;
                    } else {
                        desenharPersonagemComPulo(0);
                        setTimeout(() => {
                            window.location.href = "fase3.html";
                        }, 500);
                        return;
                    }
                }
            }
            desenharPersonagemComPulo(puloAltura);
            requestAnimationFrame(animarPulo);
        }

        function desenharPersonagemComPulo(offsetY) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            const personagemLargura = 236;
            const personagemAltura = 236;
            const posX = (canvas.width - personagemLargura) / 2;
            const posY = (canvas.height - personagemAltura) / 2 - offsetY;
            ctx.drawImage(personagem, 0, 0, personagemLargura, personagemAltura, posX, posY, personagemLargura, personagemAltura);

            // Desenha os confetes parados no final
            confetes.forEach(c => {
                ctx.drawImage(c.imagem, c.x, c.y, c.largura, c.altura);
            });
        }

        animarPulo();
    }
}

function iniciarAudio() {
    audio.volume = 0.5;
    audio.play().catch(error => {
        console.error("Erro ao tentar reproduzir o áudio:", error);
    });
}

const backgroundImage = new Image();
backgroundImage.src = './IMG/cenario2jogo.jpg';

const personagem = new Image();
personagem.src = './IMG/personagem.png';

// Confetes de estrela (certos) - 8 imagens diferentes
const confeteEstrela1 = new Image();
confeteEstrela1.src = './IMG/estrelaamarela.png';
const confeteEstrela2 = new Image();
confeteEstrela2.src = './IMG/estrelaazul.png';
const confeteEstrela3 = new Image();
confeteEstrela3.src = './IMG/estrelalaranja.png';
const confeteEstrela4 = new Image();
confeteEstrela4.src = './IMG/estrelapink.png';
const confeteEstrela5 = new Image();
confeteEstrela5.src = './IMG/estrelarosa.png';
const confeteEstrela6 = new Image();
confeteEstrela6.src = './IMG/estrelaroxa.png';
const confeteEstrela7 = new Image();
confeteEstrela7.src = './IMG/estrelaverde.png';
const confeteEstrela8 = new Image();
confeteEstrela8.src = './IMG/estrelavermelha.png';

// Confetes errados - 13 imagens diferentes
const confeteErrado1 = new Image();
confeteErrado1.src = './IMG/coraçãoazul.png';
const confeteErrado2 = new Image();
confeteErrado2.src = './IMG/coraçãoclaro.png';
const confeteErrado3 = new Image();
confeteErrado3.src = './IMG/coraçãorosa.png';
const confeteErrado4 = new Image();
confeteErrado4.src = './IMG/coraçãoroxo.png';
const confeteErrado5 = new Image();
confeteErrado5.src = './IMG/coraçãoverde.png';
const confeteErrado6 = new Image();
confeteErrado6.src = './IMG/coraçãovermelho.png';
const confeteErrado7 = new Image();
confeteErrado7.src = './IMG/azul.png';
const confeteErrado8 = new Image();
confeteErrado8.src = './IMG/azulclaro.png';
const confeteErrado9 = new Image();
confeteErrado9.src = './IMG/laranja.png';
const confeteErrado10 = new Image();
confeteErrado10.src = './IMG/rosa.png';
const confeteErrado11 = new Image();
confeteErrado11.src = './IMG/roxo.png';
const confeteErrado12 = new Image();
confeteErrado12.src = './IMG/verde.png';
const confeteErrado13 = new Image();
confeteErrado13.src = './IMG/vermelho.png';

const confetesCertos = [
    confeteEstrela1, confeteEstrela2, confeteEstrela3, confeteEstrela4,
    confeteEstrela5, confeteEstrela6, confeteEstrela7, confeteEstrela8
];
const confetesErrados = [
    confeteErrado1, confeteErrado2, confeteErrado3, confeteErrado4, confeteErrado5,
    confeteErrado6, confeteErrado7, confeteErrado8, confeteErrado9, confeteErrado10,
    confeteErrado11, confeteErrado12, confeteErrado13
];

const confetes = [];

function criarConfete() {
    if (!jogoPodeComecar) return;
    // 8 certos para cada 13 errados (aprox. 38% certos)
    const tipo = Math.random() < (8 / (8 + 13)) ? 'certo' : 'errado';

    // Espaçamento horizontal maior entre confetes
    const espacamento = 120; // aumente para mais espaçamento
    const maxColunas = Math.floor((canvas.width - 80) / espacamento);
    const coluna = Math.floor(Math.random() * maxColunas);
    const x = coluna * espacamento + 20; // 20px de margem lateral

    confetes.push({
        x: x,
        y: -90,
        largura: 80,
        altura: 80,
        tipo: tipo,
        imagem: tipo === 'certo'
            ? confetesCertos[Math.floor(Math.random() * confetesCertos.length)]
            : confetesErrados[Math.floor(Math.random() * confetesErrados.length)],
        clicado: false,
        brilho: false,
        brilhoTempo: 0
    });
}

function atualizarConfetes() {
    for (let i = confetes.length - 1; i >= 0; i--) {
        confetes[i].y += 3;
        // Remove confetes certos após o brilho
        if (confetes[i].tipo === 'certo' && confetes[i].brilho && confetes[i].brilhoTempo > 10) {
            confetes.splice(i, 1);
        }
        // Se um confete de estrela sair da tela, perde 5 pontos e mostra aviso
        else if (confetes[i].tipo === 'certo' && confetes[i].y > canvas.height) {
            pontos = Math.max(0, pontos - 5);
            pontuacaoElement.innerText = `Pontos: ${pontos}`;

            // Aviso -5 pequeno na tela
            const avisoMenos5 = document.createElement('div');
            avisoMenos5.innerText = '-5';
            avisoMenos5.style.position = 'fixed';
            avisoMenos5.style.top = '20px';
            avisoMenos5.style.left = '50%';
            avisoMenos5.style.transform = 'translateX(-50%)';
            avisoMenos5.style.color = 'red';
            avisoMenos5.style.fontSize = '32px';
            avisoMenos5.style.fontWeight = 'bold';
            avisoMenos5.style.zIndex = '100';
            avisoMenos5.style.pointerEvents = 'none';
            avisoMenos5.style.transition = 'opacity 0.7s';
            document.body.appendChild(avisoMenos5);

            setTimeout(() => {
                avisoMenos5.style.opacity = '0';
                setTimeout(() => avisoMenos5.remove(), 700);
            }, 500);

            confetes.splice(i, 1);
        }
        // Remove confetes errados que saíram da tela normalmente
        else if (confetes[i].y > canvas.height) {
            confetes.splice(i, 1);
        }
    }
}

// Clique mais sensível
canvas.addEventListener('click', function (e) {
    if (!jogoPodeComecar) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const tolerancia = 35; // Aumenta a área sensível ao redor do confete

    for (let i = confetes.length - 1; i >= 0; i--) {
        const c = confetes[i];
        if (
            clickX >= c.x - tolerancia && clickX <= c.x + c.largura + tolerancia &&
            clickY >= c.y - tolerancia && clickY <= c.y + c.altura + tolerancia
        ) {
            if (c.tipo === 'certo' && !c.brilho) {
                pontos += 10;
                pontuacaoElement.innerText = `Pontos: ${pontos}`;
                c.brilho = true;
                c.brilhoTempo = 0;
            } else if (c.tipo === 'errado') {
                // Aviso de erro
                const aviso = document.createElement('div');
                aviso.id = 'avisoErro';
                aviso.style.position = 'absolute';
                aviso.style.top = '45%';
                aviso.style.left = '50%';
                aviso.style.transform = 'translate(-50%, -50%)';
                aviso.style.background = 'rgba(255,0,0,0.85)';
                aviso.style.color = 'white';
                aviso.style.padding = '30px 50px';
                aviso.style.fontSize = '32px';
                aviso.style.borderRadius = '16px';
                aviso.style.textAlign = 'center';
                aviso.style.zIndex = '30';
                aviso.innerText = 'Você clicou no confete errado!\nA fase será reiniciada.';
                document.body.appendChild(aviso);

                setTimeout(() => {
                    window.location.reload();
                }, 1800);
            }
            break;
        }
    }
});

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    const personagemLargura = 236;
    const personagemAltura = 236;
    const posX = (canvas.width - personagemLargura) / 2;
    const posY = (canvas.height - personagemAltura) / 2;
    ctx.drawImage(personagem, 0, 0, personagemLargura, personagemAltura, posX, posY, personagemLargura, personagemAltura);

    atualizarConfetes();

    confetes.forEach(c => {
        if (c.tipo === 'certo' && c.brilho) {
            ctx.save();
            ctx.shadowColor = 'yellow';
            ctx.shadowBlur = 30;
            ctx.drawImage(c.imagem, c.x, c.y, c.largura, c.altura);
            ctx.restore();
            c.brilhoTempo++;
        } else {
            ctx.drawImage(c.imagem, c.x, c.y, c.largura, c.altura);
        }
    });

    requestAnimationFrame(desenhar);
}

setInterval(criarConfete, 300);

let imagensCarregadas = 0;
const totalImagens = 1 + 1 + 8 + 13; // fundo + personagem + certos + errados

function verificarCarregamento() {
    imagensCarregadas++;
    if (imagensCarregadas === totalImagens && jogoPodeComecar) {
        desenhar();
        intervaloTempo = setInterval(atualizarTempo, 1000);
    }
}

backgroundImage.onload = verificarCarregamento;
personagem.onload = verificarCarregamento;
confetesCertos.forEach(img => img.onload = verificarCarregamento);
confetesErrados.forEach(img => img.onload = verificarCarregamento);
