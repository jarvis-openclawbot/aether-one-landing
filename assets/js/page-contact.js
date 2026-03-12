const form = document.getElementById('demo-form');
const statusEl = document.getElementById('form-status');

if (form && statusEl) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    statusEl.className = 'form-status';
    const data = new FormData(form);
    const fields = ['nom', 'email', 'societe', 'offre', 'message'];
    const values = Object.fromEntries(fields.map((f) => [f, String(data.get(f) || '').trim()]));

    let error = '';
    if (Object.values(values).some((v) => !v)) error = 'Merci de compléter tous les champs.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) error = 'Adresse email invalide.';
    else if (values.message.length < 15) error = 'Merci de détailler votre besoin (15 caractères minimum).';

    if (error) {
      statusEl.textContent = error;
      statusEl.classList.add('err');
      return;
    }

    statusEl.textContent = `Merci ${values.nom}, votre demande de démo Jarvis a bien été enregistrée (simulation).`;
    statusEl.classList.add('ok');
    form.reset();
  });
}
