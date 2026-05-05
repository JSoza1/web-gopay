'use client';

import React, { useState, useRef } from "react";

const styles = {
  formCard: "bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl space-y-6",
  inputGroup: "space-y-2",
  label: "text-sm font-medium text-slate-300 ml-1",
  input: "w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-secondary transition-all",
  button: "w-full bg-secondary text-slate-950 font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 cursor-pointer"
};

import { submitVenta } from "@/app/empresa/webapp/ventas/actions";

export default function VentasForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [hasIne, setHasIne] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const lastPickerOpen = useRef(0);

  const handleOpenPicker = (e: React.MouseEvent<HTMLInputElement>) => {
    const now = Date.now();
    if (now - lastPickerOpen.current < 500) return;
    
    if ('showPicker' in HTMLInputElement.prototype) {
      try {
        lastPickerOpen.current = now;
        (e.currentTarget as any).showPicker();
      } catch (err) {
        lastPickerOpen.current = 0;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitVenta(formData);

    if (result.success) {
      setStatus({ type: 'success', message: '¡Venta registrada y enviada a Discord!' });
      formRef.current?.reset();
    } else {
      setStatus({ type: 'error', message: result.error || 'Error al procesar la venta.' });
    }
    setIsSubmitting(false);
  };

  return (
    <form ref={formRef} className={styles.formCard} onSubmit={handleSubmit}>
      {status && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 animate-peek ${
          status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          <span className="material-symbols-outlined">
            {status.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nombre de cliente</label>
          <input type="text" name="nombre_cliente" className={styles.input} required placeholder="Nombre completo" />
        </div>
        <div className={styles.inputGroup}>
          <div className="flex items-center justify-between mb-1">
            <label className={styles.label}>INE / RESIDENCIA (Fisica vigente)</label>
            <button 
              type="button" 
              onClick={() => setHasIne(!hasIne)}
              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg transition-all border ${
                hasIne 
                  ? 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20' 
                  : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
              }`}
            >
              {hasIne ? 'Tiene' : 'No tiene'}
            </button>
          </div>
          {hasIne ? (
            <input 
              type="text" 
              name="ine" 
              className={`${styles.input} animate-in fade-in slide-in-from-top-1 duration-200`} 
              required 
              placeholder="Número de identificación" 
            />
          ) : (
            <>
              <input type="hidden" name="ine" value="No" />
              <div className="w-full bg-red-500/5 border border-dashed border-red-500/20 rounded-xl px-4 py-3 text-red-400/60 text-xs italic flex items-center gap-2 animate-in zoom-in-95 duration-200">
                <span className="material-symbols-outlined text-sm">block</span>
                Se registrará como "No cuenta con identificación"
              </div>
            </>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Número de teléfono</label>
          <input type="tel" name="telefono" className={styles.input} required placeholder="Ej: +521234567890" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Dirección</label>
          <input type="text" name="direccion" className={styles.input} required placeholder="Ej: Calle falsa 123" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Enganche</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400 pointer-events-none">$</span>
            <input 
              type="number" 
              name="enganche" 
              className={`${styles.input} pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
              required 
              min="0"
              placeholder="0.00" 
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Celular</label>
          <input type="text" name="celular" className={styles.input} required placeholder="Modelo del equipo" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Color celular</label>
          <input type="text" name="color_celular" className={styles.input} required placeholder="Color del equipo" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Cuenta activa?</label>
          <select name="cuenta_activa" className={styles.input} required defaultValue="">
            <option value="" disabled>Seleccione una opción</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Fecha de entrega</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400 pointer-events-none material-symbols-outlined text-base">calendar_today</span>
            <input 
              type="date" 
              name="fecha_entrega" 
              className={`${styles.input} pl-10 [color-scheme:dark] cursor-pointer`} 
              required 
              onClick={handleOpenPicker}
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Hora de entrega</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400 pointer-events-none material-symbols-outlined text-base">schedule</span>
            <input 
              type="time" 
              name="hora_entrega" 
              className={`${styles.input} pl-10 [color-scheme:dark] cursor-pointer`} 
              required 
              onClick={handleOpenPicker}
            />
          </div>
        </div>
        
        <div className={`${styles.inputGroup} md:col-span-2`}>
          <label className={styles.label}>Comentarios (Opcional)</label>
          <textarea 
            name="comentarios" 
            className={`${styles.input} min-h-[100px] resize-none`} 
            placeholder="Notas adicionales sobre la venta o entrega..."
          />
        </div>
      </div>

      <button 
        type="submit" 
        className={`${styles.button} flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full" />
            Procesando...
          </>
        ) : (
          'Registrar Venta'
        )}
      </button>
    </form>

  );
}
