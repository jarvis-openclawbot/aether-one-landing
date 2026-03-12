const form = document.getElementById('demo-form');
const statusEl = document.getElementById('form-status');

if (form && statusEl) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const controls = [...form.querySelectorAll('input, select, textarea')];

  const setFieldError = (name, message) => {
    const input = form.elements[name];
    const err = document.getElementById(`${name}-error`);
    if (!input || !err) return;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', `${name}-error`);
      err.textContent = message;
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      err.textContent = '';
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    statusEl.className = 'form-status';

    const data = new FormData(form);
    const values = {
      nom: String(data.get('nom') || '').trim(),
      email: String(data.get('email') || '').trim(),
      societe: String(data.get('societe') || '').trim(),
      offre: String(data.get('offre') || '').trim(),
      message: String(data.get('message') || '').trim()
    };

    const errors = {
      nom: values.nom ? '' : 'Merci d’indiquer votre nom.',
      email: !values.email ? 'Merci d’indiquer un email professionnel.' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? 'Adresse email invalide.' : ''),
      societe: values.societe ? '' : 'Merci d’indiquer votre société.',
      offre: values.offre ? '' : 'Merci de sélectionner une offre.',
      message: values.message.length >= 20 ? '' : 'Merci de détailler votre besoin (20 caractères minimum).'
    };

    controls.forEach((el) => {
      setFieldError(el.name, errors[el.name] || '');
    });

    const hasError = Object.values(errors).some(Boolean);
    if (hasError) {
      statusEl.textContent = 'Certaines informations sont à corriger avant l’envoi.';
      statusEl.classList.add('err');
      statusEl.setAttribute('role', 'alert');
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid?.focus();
      return;
    }

    statusEl.removeAttribute('role');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
    }

    setTimeout(() => {
      statusEl.textContent = `Merci ${values.nom}, votre demande de démo Jarvis est prête. Un conseiller vous recontactera sous 4 h ouvrées.`;
      statusEl.classList.add('ok');
      form.reset();
      controls.forEach((el) => setFieldError(el.name, ''));
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer la demande';
      }
    }, 280);
  });
}
