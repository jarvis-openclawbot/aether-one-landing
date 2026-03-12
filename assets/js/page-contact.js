const form = document.getElementById('demo-form');
const statusEl = document.getElementById('form-status');

if (form && statusEl) {
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    statusEl.className = 'form-status';

    const data = new FormData(form);
    const fields = ['nom', 'email', 'societe', 'offre', 'message'];
    const values = Object.fromEntries(fields.map((f) => [f, String(data.get(f) || '').trim()]));

    let error = '';
    if (Object.values(values).some((v) => !v)) error = 'Merci de compléter tous les champs.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) error = 'Adresse email invalide.';
    else if (values.message.length < 20) error = 'Merci de détailler votre besoin (20 caractères minimum).';

    const controls = [...form.querySelectorAll('input, select, textarea')];
    controls.forEach((el) => el.removeAttribute('aria-invalid'));

    if (error) {
      statusEl.textContent = error;
      statusEl.classList.add('err');
      if (!values.nom) form.nom?.setAttribute('aria-invalid', 'true');
      if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) form.email?.setAttribute('aria-invalid', 'true');
      if (!values.societe) form.societe?.setAttribute('aria-invalid', 'true');
      if (!values.offre) form.offre?.setAttribute('aria-invalid', 'true');
      if (values.message.length < 20) form.message?.setAttribute('aria-invalid', 'true');
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }

    setTimeout(() => {
      statusEl.textContent = `Merci ${values.nom}, votre demande de démo Jarvis est prête. Un conseiller vous recontactera sous 24 h (simulation front-end).`;
      statusEl.classList.add('ok');
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer la demande';
      }
    }, 280);
  });
}
