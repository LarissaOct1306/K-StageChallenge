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
instrucao.innerText = 'Clique apenas nos microfones com estrelas para ganhar pontos!';
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
        fimFase.innerHTML = `Primeira fase concluída, parabéns!<br><br>Total de pontos: <b>${pontos}</b>`;
        document.body.appendChild(fimFase);
        localStorage.setItem('pontosFase1', pontos);

        setTimeout(() => {
            window.location.href = "fase2.html"; // Altere para o nome correto da próxima fase
        }, 2000);
    }
}

function iniciarAudio() {
    audio.volume = 0.5;
    audio.play().catch(error => {
        console.error("Erro ao tentar reproduzir o áudio:", error);
    });
}

const backgroundImage = new Image();
backgroundImage.src = './IMG/cenario1jogo.jpg';

const personagem = new Image();
personagem.src = './IMG/personagem.png';

const microfoneCorreto = new Image();
microfoneCorreto.src = './IMG/microfonecerto.png';

const microfoneErrado1 = new Image();
microfoneErrado1.src = './IMG/microfone1.png';

const microfoneErrado2 = new Image();
microfoneErrado2.src = './IMG/microfone2.png';

const microfoneErrado3 = new Image();
microfoneErrado3.src = './IMG/microfone3.png';

const microfones = [];
const errados = [microfoneErrado1, microfoneErrado2, microfoneErrado3];

function criarMicrofone() {
    if (!jogoPodeComecar) return;
    const tipo = Math.random() < 0.4 ? 'correto' : 'errado';
    microfones.push({
        x: Math.random() * (canvas.width - 40),
        y: -50,
        largura: 40,
        altura: 40,
        tipo: tipo,
        imagem: tipo === 'correto' ? microfoneCorreto : errados[Math.floor(Math.random() * errados.length)],
        clicado: false,
        brilho: false,
        brilhoTempo: 0 // tempo de brilho em frames
    });
}

function atualizarMicrofones() {
    for (let i = microfones.length - 1; i >= 0; i--) {
        microfones[i].y += 3;
        // Remove microfones corretos após o brilho
        if (microfones[i].tipo === 'correto' && microfones[i].brilho && microfones[i].brilhoTempo > 10) {
            microfones.splice(i, 1);
        }
        // Remove microfones que saíram da tela
        else if (microfones[i].y > canvas.height) {
            microfones.splice(i, 1);
        }
    }
}

// Clique mais sensível
canvas.addEventListener('click', function (e) {
    if (!jogoPodeComecar) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const tolerancia = 15; // Aumenta a área sensível ao redor do microfone

    for (let i = microfones.length - 1; i >= 0; i--) {
        const m = microfones[i];
        if (
            clickX >= m.x - tolerancia && clickX <= m.x + m.largura + tolerancia &&
            clickY >= m.y - tolerancia && clickY <= m.y + m.altura + tolerancia
        ) {
            if (m.tipo === 'correto' && !m.brilho) {
                pontos += 10;
                pontuacaoElement.innerText = `Pontos: ${pontos}`;
                m.brilho = true;
                m.brilhoTempo = 0;
            } else if (m.tipo === 'errado') {
                // Perde 5 pontos e mostra aviso
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

    atualizarMicrofones();

    microfones.forEach(m => {
        if (m.tipo === 'correto' && m.brilho) {
            ctx.save();
            ctx.shadowColor = 'yellow';
            ctx.shadowBlur = 30;
            ctx.drawImage(m.imagem, m.x, m.y, m.largura, m.altura);
            ctx.restore();
            m.brilhoTempo++;
        } else {
            ctx.drawImage(m.imagem, m.x, m.y, m.largura, m.altura);
        }
    });

    requestAnimationFrame(desenhar);
}

setInterval(criarMicrofone, 800);

let imagensCarregadas = 0;
const totalImagens = 6;

function verificarCarregamento() {
    imagensCarregadas++;
    if (imagensCarregadas === totalImagens && jogoPodeComecar) {
        desenhar();
        intervaloTempo = setInterval(atualizarTempo, 1000);
    }
}

backgroundImage.onload = verificarCarregamento;
personagem.onload = verificarCarregamento;
microfoneCorreto.onload = verificarCarregamento;
microfoneErrado1.onload = verificarCarregamento;
microfoneErrado2.onload = verificarCarregamento;
microfoneErrado3.onload = verificarCarregamento;