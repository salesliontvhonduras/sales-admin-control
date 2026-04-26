const IMPORTANT_MATCH_TEMPLATE_HTML = `<div style="margin:0;padding:0;background:#000000;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
  <div style="max-width:620px;margin:0 auto;background:#000000;padding:32px 12px;">
    <div style="background:#111111;border:1px solid #232323;border-radius:18px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.45);">
      <div style="padding:30px 28px 22px;border-bottom:1px solid #232323;background:linear-gradient(180deg,#141414 0%,#0f0f0f 100%);text-align:center;">
        <div style="font-size:28px;font-weight:800;letter-spacing:1px;color:#e50914;">Lion TV Premium</div>
        <div style="margin-top:10px;font-size:14px;color:#b3b3b3;letter-spacing:0.3px;">Partido importante</div>
      </div>

      <div style="padding:34px 28px 16px;">
        <h1 style="margin:0 0 14px;font-size:30px;line-height:1.2;color:#ffffff;font-weight:800;text-align:center;">
          {{homeTeam}} vs {{awayTeam}}
        </h1>
        <p style="margin:0 auto 22px;font-size:15px;line-height:1.7;color:#b3b3b3;text-align:center;max-width:520px;">
          <strong style="color:#ffffff;">Hola {{customerName}},</strong> se viene un partido que no querrás perderte. Activa tu acceso hoy y prepárate para vivirlo con la mejor experiencia en Lion TV Premium.
        </p>
      </div>

      <div style="padding:0 28px 30px;">
        <div style="background:#0b0b0b;border:1px solid #232323;border-radius:12px;padding:18px 16px;margin-bottom:14px;">
          <div style="font-size:14px;font-weight:700;color:#ffffff;margin-bottom:8px;">Detalles del partido</div>
          <div style="font-size:14px;line-height:1.9;color:#b3b3b3;">
            <strong style="color:#ffffff;">Competencia:</strong> {{competitionName}}<br/>
            <strong style="color:#ffffff;">Fecha:</strong> {{matchDateText}}<br/>
            <strong style="color:#ffffff;">Hora:</strong> {{matchTimeText}}
          </div>
        </div>

        <div style="background:#0b0b0b;border:1px solid #232323;border-radius:12px;padding:18px 16px;margin-bottom:18px;">
          <div style="font-size:14px;font-weight:700;color:#ffffff;margin-bottom:8px;">Activa tu plan y disfruta</div>
          <div style="font-size:14px;line-height:1.9;color:#b3b3b3;">
            {{offerCopy}}<br/><br/>
            ⚽ Acceso a partidos y deportes en vivo<br/>
            🎬 Canales, películas y series en un solo lugar<br/>
            💬 Soporte directo si necesitas ayuda con tu activación
          </div>
        </div>

        <div style="text-align:center;margin-top:28px;">
          <a href="{{ctaUrl}}"
             style="display:inline-block;background:#e50914;color:#ffffff;padding:16px 30px;border-radius:8px;font-size:16px;font-weight:800;text-decoration:none;box-shadow:0 14px 34px rgba(229,9,20,0.35);">
            {{ctaLabel}}
          </a>
        </div>

        <div style="text-align:center;margin-top:18px;">
          <a href="{{supportWhatsappUrl}}"
             style="color:#b3b3b3;text-decoration:none;font-size:14px;">
            ¿Necesitas ayuda? Escríbenos por WhatsApp
          </a>
        </div>
      </div>

      <div style="padding:22px 28px;border-top:1px solid #232323;background:#0a0a0a;text-align:center;">
        <div style="font-size:13px;font-weight:700;color:#ffffff;">Lion TV Premium</div>
        <div style="margin-top:6px;font-size:12px;color:#7a7a7a;">www.liontvpremium.com</div>
      </div>
    </div>
  </div>
</div>`;

export function buildImportantMatchTemplatePreset() {
  return {
    code: 'IMPORTANT_MATCH_ACTIVATION',
    name: 'Notificación de partido importante',
    subjectTemplate: '⚽ {{homeTeam}} vs {{awayTeam}} está por comenzar | Activa hoy en Lion TV Premium',
    htmlTemplate: IMPORTANT_MATCH_TEMPLATE_HTML,
    description: 'Template reutilizable para campañas de activación comercial previas a un partido importante.',
    category: 'SPORTS_MARKETING',
    active: true,
    variables: [
      {
        variableName: 'customerName',
        label: 'Nombre del cliente',
        inputType: 'text',
        valueSource: 'RECIPIENT',
        bindingKey: 'customerName',
        required: false,
        defaultValue: 'fanático',
        helpText: 'Nombre mostrado en el saludo. Si no existe en el destinatario, usa el default.',
        sortOrder: 1
      },
      {
        variableName: 'homeTeam',
        label: 'Equipo local',
        inputType: 'text',
        valueSource: 'MANUAL',
        bindingKey: '',
        required: true,
        defaultValue: '',
        helpText: 'Equipo que aparecerá primero en el titular principal.',
        sortOrder: 2
      },
      {
        variableName: 'awayTeam',
        label: 'Equipo visitante',
        inputType: 'text',
        valueSource: 'MANUAL',
        bindingKey: '',
        required: true,
        defaultValue: '',
        helpText: 'Equipo rival o visitante del partido.',
        sortOrder: 3
      },
      {
        variableName: 'competitionName',
        label: 'Competencia',
        inputType: 'text',
        valueSource: 'MANUAL',
        bindingKey: '',
        required: true,
        defaultValue: '',
        helpText: 'Liga, copa o torneo del partido.',
        sortOrder: 4
      },
      {
        variableName: 'matchDateText',
        label: 'Fecha del partido',
        inputType: 'text',
        valueSource: 'MANUAL',
        bindingKey: '',
        required: true,
        defaultValue: '',
        helpText: 'Texto amigable de fecha, por ejemplo: Domingo 20 de abril.',
        sortOrder: 5
      },
      {
        variableName: 'matchTimeText',
        label: 'Hora del partido',
        inputType: 'text',
        valueSource: 'MANUAL',
        bindingKey: '',
        required: true,
        defaultValue: '',
        helpText: 'Texto amigable de hora y zona horaria, por ejemplo: 2:00 PM hora Honduras.',
        sortOrder: 6
      },
      {
        variableName: 'offerCopy',
        label: 'Mensaje comercial',
        inputType: 'textarea',
        valueSource: 'MANUAL',
        bindingKey: '',
        required: true,
        defaultValue: 'Activa hoy tu plan y prepárate para disfrutar el partido en vivo, canales premium y más contenido sin interrupciones.',
        helpText: 'Mensaje comercial principal. No insertes HTML aquí; el sistema lo renderiza como texto.',
        sortOrder: 7
      },
      {
        variableName: 'ctaUrl',
        label: 'URL de activación',
        inputType: 'url',
        valueSource: 'MANUAL',
        bindingKey: '',
        required: true,
        defaultValue: '',
        helpText: 'URL real de checkout, landing o activación.',
        sortOrder: 8
      },
      {
        variableName: 'supportWhatsappUrl',
        label: 'WhatsApp de soporte',
        inputType: 'url',
        valueSource: 'RECIPIENT',
        bindingKey: 'supportWhatsappUrl',
        required: false,
        defaultValue: 'https://wa.me/50488204404',
        helpText: 'Se resuelve automáticamente según el reseller dueño del envío o del cliente.',
        sortOrder: 10
      },
      {
        variableName: 'ctaLabel',
        label: 'Texto del botón',
        inputType: 'text',
        valueSource: 'MANUAL',
        bindingKey: '',
        required: true,
        defaultValue: 'ACTIVAR AHORA',
        helpText: 'Texto visible del CTA principal.',
        sortOrder: 11
      }
    ]
  };
}
