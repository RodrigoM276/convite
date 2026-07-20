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
document.getElementById('closeModal').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });

document.getElementById('rsvpForm').addEventListener('submit', async event => {
  event.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const count = document.getElementById('guestCount').value;
  const message = document.getElementById('guestMessage').value.trim();
  const submitButton = event.submitter;
  if (submitButton) submitButton.disabled = true;

  try {
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, guestCount: Number(count), message }),
    });
    if (!response.ok) throw new Error('Falha ao confirmar presença.');

    const text = `Olá, Leide e Rodrigo! Confirmo minha presença no casamento.\n\nNome: ${name}\nNúmero de convidados: ${count}${message ? `\nMensagem: ${message}` : ''}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    showToast('Presença confirmada! Obrigado 💚');
    modal.close();
    event.target.reset();
  } catch (error) {
    showToast('Não foi possível confirmar sua presença. Tente novamente.');
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

document.getElementById('calendarButton').addEventListener('click', () => {
  const ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Leide e Rodrigo//Casamento//PT-BR','BEGIN:VEVENT',
    'UID:casamento-leide-rodrigo-20260919@example.com',
    'DTSTAMP:20260720T170000Z','DTSTART:20260919T210000Z','DTEND:20260920T000000Z',
    'SUMMARY:Casamento de Leide e Rodrigo',
    'LOCATION:Paróquia São José, Parque Guarani, São Paulo - SP',
    'DESCRIPTION:Sob a bênção de Deus, convidamos você para celebrar conosco a nossa união.',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  const blob = new Blob([ics], {type:'text/calendar;charset=utf-8'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'casamento-leide-e-rodrigo.ics';
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('Evento adicionado para download.');
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

const music = document.getElementById('backgroundMusic');
const soundButton = document.getElementById('soundButton');
soundButton.addEventListener('click', async () => {
  try {
    if (music.paused) { await music.play(); soundButton.classList.add('active'); soundButton.textContent = '♫'; }
    else { music.pause(); soundButton.classList.remove('active'); soundButton.textContent = '♪'; }
  } catch { showToast('Adicione o arquivo musica.mp3 para ativar a música.'); }
});
