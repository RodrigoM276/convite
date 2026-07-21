const weddingDate = new Date('2026-09-19T18:00:00-03:00');
// Troque pelo WhatsApp dos noivos no formato: 5511999999999
const whatsappNumber = '5511951167811';

const pad = value => String(value).padStart(2, '0');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function updateCountdown() {
  const distance = weddingDate.getTime() - Date.now();
  if (distance <= 0) {
    document.querySelector('.countdown').innerHTML = '<div style="grid-column:1/-1"><strong>É hoje!</strong><span>Esperamos você</span></div>';
    return;
  }
  document.getElementById('days').textContent = pad(Math.floor(distance / 86400000));
  document.getElementById('hours').textContent = pad(Math.floor(distance / 3600000) % 24);
  document.getElementById('minutes').textContent = pad(Math.floor(distance / 60000) % 60);
  document.getElementById('seconds').textContent = pad(Math.floor(distance / 1000) % 60);
}
updateCountdown();
setInterval(updateCountdown, 1000);

const modal = document.getElementById('rsvpModal');
document.getElementById('rsvpButton').addEventListener('click', () => modal.showModal());

// Fechamento genérico para todos os modais (botão × e clique fora)
document.querySelectorAll('dialog.modal').forEach(dlg => {
  dlg.addEventListener('click', event => { if (event.target === dlg) dlg.close(); });
});
document.querySelectorAll('[data-close]').forEach(button => {
  button.addEventListener('click', () => document.getElementById(button.dataset.close).close());
});
document.getElementById('closeModal').addEventListener('click', () => modal.close());

document.getElementById('rsvpForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const count = document.getElementById('guestCount').value;
  const message = document.getElementById('guestMessage').value.trim();
  const text = `Olá, Leide e Rodrigo! Confirmo minha presença no casamento.\n\nNome: ${name}\nNúmero de convidados: ${count}${message ? `\nMensagem: ${message}` : ''}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  modal.close();
});

document.getElementById('calendarButton').addEventListener('click', () => {
  const title = 'Casamento de Leide e Rodrigo';
  const details = 'Sob a bênção de Deus, convidamos você para celebrar conosco a nossa união.';
  const location = 'Paróquia São José, Parque Guarani, São Paulo - SP';
  const start = '20260919T210000Z';
  const end = '20260920T000000Z';

  const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIOS) {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    window.location.href = URL.createObjectURL(blob);
  } else {
    const params = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${start}/${end}`, details, location });
    window.open(`https://www.google.com/calendar/render?${params.toString()}`, '_blank', 'noopener');
  }
});

document.getElementById('shareButton').addEventListener('click', async () => {
  const shareData = {title:'Casamento de Leide & Rodrigo', text:'Você é nosso convidado para celebrar este momento especial!', url:location.href};
  try {
    if (navigator.share) await navigator.share(shareData);
    else { await navigator.clipboard.writeText(location.href); showToast('Link copiado!'); }
  } catch (error) {
    if (error.name !== 'AbortError') showToast('Não foi possível compartilhar.');
  }
});

document.getElementById('giftButton').addEventListener('click', () => document.getElementById('giftModal').showModal());

document.getElementById('copyPixButton').addEventListener('click', async () => {
  const key = document.getElementById('pixKey').textContent.trim();
  try {
    await navigator.clipboard.writeText(key);
    showToast('Chave Pix copiada!');
  } catch {
    showToast('Não foi possível copiar. Copie manualmente.');
  }
});

document.getElementById('galleryButton').addEventListener('click', () => document.getElementById('galleryModal').showModal());

document.getElementById('messageButton').addEventListener('click', () => document.getElementById('messageModal').showModal());

document.getElementById('messageForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('senderName').value.trim();
  const msg = document.getElementById('senderMessage').value.trim();
  const text = `Olá, Leide e Rodrigo! Deixando uma mensagem carinhosa para vocês. \n\nDe: ${name}\nMensagem: ${msg}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  document.getElementById('messageModal').close();
  event.target.reset();
});

const music = document.getElementById('backgroundMusic');
const soundButton = document.getElementById('soundButton');
const musicLink = document.getElementById('musicLink');

function setSoundButtonPlaying(isPlaying) {
  soundButton.classList.toggle('active', isPlaying);
  soundButton.textContent = isPlaying ? '♫' : '♪';
  musicLink.classList.toggle('active', isPlaying);
  musicLink.querySelector('.icon').textContent = isPlaying ? '♫' : '♪';
  musicLink.lastChild.textContent = isPlaying ? ' Pausar música' : ' Ouvir música';
}

async function tryPlayMusic() {
  try {
    await music.play();
    setSoundButtonPlaying(true);
    return true;
  } catch {
    return false;
  }
}

// Tenta tocar assim que a página carrega (funciona em alguns navegadores/configurações)
tryPlayMusic().then(started => {
  if (started) return;
  // Se o navegador bloquear o autoplay, toca assim que o visitante interagir
  // pela primeira vez com a página (clique, toque ou tecla), em qualquer lugar.
  const startOnFirstInteraction = async () => {
    const ok = await tryPlayMusic();
    if (ok) {
      ['click', 'touchstart', 'keydown'].forEach(evt =>
        document.removeEventListener(evt, startOnFirstInteraction)
      );
    }
  };
  ['click', 'touchstart', 'keydown'].forEach(evt =>
    document.addEventListener(evt, startOnFirstInteraction, { once: false })
  );
});

async function toggleMusic() {
  if (music.paused) {
    const ok = await tryPlayMusic();
    if (!ok) showToast('Toque na tela para ativar a música.');
  } else {
    music.pause();
    setSoundButtonPlaying(false);
  }
}

soundButton.addEventListener('click', toggleMusic);
musicLink.addEventListener('click', toggleMusic);
