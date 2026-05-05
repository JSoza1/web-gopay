'use server';

/**
 * Acción de servidor para enviar los datos de la venta a Discord mediante un Webhook.
 */
export async function submitVenta(formData: FormData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL no está configurada en las variables de entorno.");
    return { success: false, error: "Error de configuración en el servidor." };
  }

  // Extraemos los datos del formulario
  const data = {
    nombre: formData.get("nombre_cliente") as string,
    identificacion: formData.get("identificacion_fisica") as string,
    curp: formData.get("curp") as string,
    telefono: formData.get("telefono") as string,
    direccion: formData.get("direccion") as string,
    enganche: formData.get("enganche") as string,
    celular: formData.get("celular") as string,
    color: formData.get("color_celular") as string,
    cuenta: formData.get("cuenta_activa") as string,
    fecha: formData.get("fecha_entrega") as string,
    hora: formData.get("hora_entrega") as string,
    comentarios: formData.get("comentarios") as string,
  };

  // Formateamos el mensaje para Discord usando "Embeds" para que se vea prolijo
  const fields = [
    { name: "👤 Cliente", value: `**${data.nombre}**`, inline: false },
    { name: "🪪 CURP", value: `\`${data.curp}\``, inline: false },
    { name: "📄 Identificación Física", value: data.identificacion, inline: false },
    { name: "📞 Teléfono", value: data.telefono, inline: false },
    { name: "📍 Dirección", value: data.direccion, inline: false },
    { name: "📱 Equipo", value: `**${data.celular}** (${data.color})`, inline: false },
    { name: "💰 Enganche", value: `**$${data.enganche}**`, inline: false },
    { name: "✅ Cuenta Activa", value: data.cuenta.toUpperCase(), inline: false },
    { name: "📅 Fecha de Entrega", value: data.fecha, inline: false },
    { name: "⏰ Hora de Entrega", value: data.hora, inline: false },
  ];


  // Agregamos comentarios solo si existen
  if (data.comentarios && data.comentarios.trim() !== "") {
    fields.push({ name: "💬 Comentarios", value: data.comentarios, inline: false });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gopay.mx';

  const embed = {
    title: "NUEVA VENTA REGISTRADA 🚀",
    description: `Registrado a través de la app web.`,
    color: 0xa2e7ff, // Color celeste secundario de GoPay
    fields: fields,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "GoPay Ventas",
        avatar_url: `${siteUrl}/brands/gopaylogo.webp`,
        embeds: [embed]
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord API responded with status ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error enviando a Discord:", error);
    return { success: false, error: "No se pudo enviar la notificación a Discord." };
  }
}
