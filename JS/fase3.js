const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const audio = document.getElementById("audio");
const pontuacaoElement = document.getElementById('pontuacao');

let pontos = 20; // Começa com 20 pontos para evitar reset instantâneo
let tempoFase = 120; // 2 minutos
let intervaloTempo;

const tempoElement = document.createElement('div');
tempoElement.id = 'tempo';
tempoElement.style.position = 'absolute';
tempoElement.style.top = '60px';
tempoElement.style.left = '20px';
tempoElement.style.color = 'white';
tempoElement.style.fontSize = '24px';
tempoElement.innerText = `Tempo: ${tempoFase}s`;
document.body.appendChild(tempoElement);

// Caixa de pontuação estilizada
pontuacaoElement.style.position = 'absolute';
pontuacaoElement.style.top = '20px';
pontuacaoElement.style.right = '40px';
pontuacaoElement.style.background = 'rgba(0,0,0,0.7)';
pontuacaoElement.style.color = 'white';
pontuacaoElement.style.padding = '16px 32px';
pontuacaoElement.style.fontSize = '28px';
pontuacaoElement.style.borderRadius = '16px';
pontuacaoElement.style.fontWeight = 'bold';
pontuacaoElement.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)';
pontuacaoElement.style.zIndex = '15';

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
instrucao.innerText = 'Clique nas lighsticks para ganhar pontos!';
document.body.appendChild(instrucao);

let jogoPodeComecar = false;

setTimeout(() => {
    instrucao.remove();
    jogoPodeComecar = true;
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

        // Quadro de comemoração
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
        fimFase.innerHTML = `Parabéns! Você terminou o jogo!<br><br>Prepare-se para ver sua pontuação final.`;
        document.body.appendChild(fimFase);

        setTimeout(() => {
            fimFase.remove();

            // Quadro de pontuação final (soma das 3 fases)
            const pontosFase1 = Number(localStorage.getItem('pontosFase1')) || 0;
            const pontosFase2 = Number(localStorage.getItem('pontosFase2')) || 0;
            const pontosFase3 = pontos;

            localStorage.setItem('pontosFase3', pontosFase3);

            const total = pontosFase1 + pontosFase2 + pontosFase3;

            const quadroFinal = document.createElement('div');
            quadroFinal.id = 'quadroFinal';
            quadroFinal.style.position = 'absolute';
            quadroFinal.style.top = '40%';
            quadroFinal.style.left = '50%';
            quadroFinal.style.transform = 'translate(-50%, -50%)';
            quadroFinal.style.background = 'rgba(0,0,0,0.92)';
            quadroFinal.style.color = 'white';
            quadroFinal.style.padding = '40px 60px';
            quadroFinal.style.fontSize = '34px';
            quadroFinal.style.borderRadius = '20px';
            quadroFinal.style.textAlign = 'center';
            quadroFinal.style.zIndex = '30';
            quadroFinal.innerHTML = `
                <b>Pontuação Final</b><br><br>
                Fase 1: <b>${pontosFase1}</b><br>
                Fase 2: <b>${pontosFase2}</b><br>
                Fase 3: <b>${pontosFase3}</b><br><br>
                <span style="font-size:40px;color:gold;">Total: <b>${total}</b></span><br><br>
                <button id="btn-voltar-inicio" style="
                    margin-top: 24px;
                    padding: 16px 40px;
                    font-size: 28px;
                    border-radius: 12px;
                    border: none;
                    background: #7b2ff2;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
                ">Voltar para o início</button>
            `;
            document.body.appendChild(quadroFinal);

            // Evento do botão
            document.getElementById('btn-voltar-inicio').onclick = function() {
                window.location.href = "index.html";
            };
        }, 2500); // Mostra o quadro final após 2,5 segundos
    }
}

function iniciarAudio() {
    audio.volume = 0.5;
    audio.play().catch(error => {
        console.error("Erro ao tentar reproduzir o áudio:", error);
    });
}

const backgroundImage = new Image();
backgroundImage.src = './IMG/cenario3jogo.jpg';

const personagem = new Image();
personagem.src = './IMG/personagem.png';

// Elementos: 1 certo, 2 errados
const elementoCerto = new Image();
elementoCerto.src = './IMG/lightstick.png';
const elementoErrado1 = new Image();
elementoErrado1.src = './IMG/prêmio.png';
const elementoErrado2 = new Image();
elementoErrado2.src = './IMG/câmera.png';

const elementos = [];
const errados = [elementoErrado1, elementoErrado2];

function criarElemento() {
    if (!jogoPodeComecar) return;
    const tipo = Math.random() < 0.4 ? 'certo' : 'errado';
    elementos.push({
        x: Math.random() * (canvas.width - 70),
        y: -90,
        largura: 70,
        altura: 70,
        tipo: tipo,
        imagem: tipo === 'certo' ? elementoCerto : errados[Math.floor(Math.random() * errados.length)],
        clicado: false,
        brilho: false,
        brilhoTempo: 0,
        luzVermelha: false // só para errados e só quando clicado
    });
}

function atualizarElementos() {
    for (let i = elementos.length - 1; i >= 0; i--) {
        elementos[i].y += 3; // Agora cai mais devagar
        // Remove certos após o brilho
        if (elementos[i].tipo === 'certo' && elementos[i].brilho && elementos[i].brilhoTempo > 10) {
            elementos.splice(i, 1);
        }
        // Remove elementos que saíram da tela
        else if (elementos[i].y > canvas.height) {
            elementos.splice(i, 1);
        }
    }
}

canvas.addEventListener('click', function (e) {
    if (!jogoPodeComecar) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let i = elementos.length - 1; i >= 0; i--) {
        const el = elementos[i];
        // Espaço clicável padrão para todos
        const tolerancia = 15;

        if (
            clickX >= el.x - tolerancia && clickX <= el.x + el.largura + tolerancia &&
            clickY >= el.y - tolerancia && clickY <= el.y + el.altura + tolerancia
        ) {
            if (el.tipo === 'certo' && !el.brilho) {
                pontos += 10;
                pontuacaoElement.innerText = `Pontos: ${pontos}`;
                el.brilho = true;
                el.brilhoTempo = 0;
            } else if (el.tipo === 'errado') {
                pontos = Math.max(0, pontos - 5);
                pontuacaoElement.innerText = `Pontos: ${pontos}`;

                // Ativa luz vermelha atrás do elemento errado clicado
                el.luzVermelha = true;

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

                // Se zerar os pontos, reinicia a fase e mostra aviso
                if (pontos === 0) {
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
                    aviso.innerText = 'Você ficou sem pontos!\nA fase será reiniciada.';
                    document.body.appendChild(aviso);

                    setTimeout(() => {
                        window.location.reload();
                    }, 1800);
                }
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

    atualizarElementos();

    elementos.forEach(el => {
        if (el.tipo === 'errado' && el.luzVermelha) {
            // Luz vermelha atrás do elemento errado apenas se clicado
            ctx.save();
            ctx.shadowColor = 'red';
            ctx.shadowBlur = 40;
            ctx.drawImage(el.imagem, el.x, el.y, el.largura, el.altura);
            ctx.restore();
        } else if (el.tipo === 'certo' && el.brilho) {
            ctx.save();
            ctx.shadowColor = 'yellow';
            ctx.shadowBlur = 30;
            ctx.drawImage(el.imagem, el.x, el.y, el.largura, el.altura);
            ctx.restore();
            el.brilhoTempo++;
        } else {
            ctx.drawImage(el.imagem, el.x, el.y, el.largura, el.altura);
        }
    });

    requestAnimationFrame(desenhar);
}

setInterval(criarElemento, 250); // Muitos elementos caindo

let imagensCarregadas = 0;
const totalImagens = 1 + 1 + 1 + 2; // fundo + personagem + certo + errados

function verificarCarregamento() {
    imagensCarregadas++;
    if (imagensCarregadas === totalImagens && jogoPodeComecar) {
        desenhar();
        intervaloTempo = setInterval(atualizarTempo, 1000);
    }
}

backgroundImage.onload = verificarCarregamento;
personagem.onload = verificarCarregamento;
elementoCerto.onload = verificarCarregamento;
elementoErrado1.onload = verificarCarregamento;
elementoErrado2.onload = verificarCarregamento;