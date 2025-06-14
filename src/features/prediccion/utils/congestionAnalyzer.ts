import type { TransitoTorreControl } from '../../torre-control/types';
import type { CongestionAnalysis, CamionProyectado, ProyeccionPorHora, ConfiguracionPrediccion } from '../types';
import { CONFIGURACION_DEFAULT } from '../types';

export class CongestionAnalyzer {
  private config: ConfiguracionPrediccion;

  constructor(config: Partial<ConfiguracionPrediccion> = {}) {
    this.config = { ...CONFIGURACION_DEFAULT, ...config };
  }

  /**
   * Analiza los tránsitos activos y detecta posibles congestiones
   */
  analizarCongestion(transitos: TransitoTorreControl[]): CongestionAnalysis[] {
    const ahora = new Date();
    const transitosActivos = transitos.filter(t => 
      t.estado === 1 && 
      t.eta > ahora &&
      this.config.destinosMonitoreados.includes(t.destino)
    );

    // Agrupar por destino
    const porDestino = this.agruparPorDestino(transitosActivos);
    
    // Analizar cada destino
    const analisis: CongestionAnalysis[] = [];
    
    for (const [destino, camiones] of Object.entries(porDestino)) {
      const congestionesEnDestino = this.detectarCongestionesEnDestino(destino, camiones);
      analisis.push(...congestionesEnDestino);
    }

    return analisis.sort((a, b) => a.ventanaInicio.getTime() - b.ventanaInicio.getTime());
  }

  /**
   * Genera proyección por hora de llegadas
   */
  generarProyeccionPorHora(transitos: TransitoTorreControl[]): ProyeccionPorHora[] {
    const ahora = new Date();
    const finProyeccion = new Date(ahora.getTime() + this.config.horasProyeccion * 60 * 60 * 1000);
    
    const transitosActivos = transitos.filter(t => 
      t.estado === 1 && 
      t.eta > ahora && 
      t.eta <= finProyeccion &&
      this.config.destinosMonitoreados.includes(t.destino)
    );

    // Crear slots de hora
    const proyeccion: ProyeccionPorHora[] = [];
    const horaActual = new Date(ahora);
    horaActual.setMinutes(0, 0, 0);

    for (let i = 0; i <= this.config.horasProyeccion; i++) {
      const horaInicio = new Date(horaActual.getTime() + i * 60 * 60 * 1000);
      const horaFin = new Date(horaInicio.getTime() + 60 * 60 * 1000);
      
      const transitosEnHora = transitosActivos.filter(t => 
        t.eta >= horaInicio && t.eta < horaFin
      );

      const porDestino = this.agruparPorDestino(transitosEnHora);
      
      proyeccion.push({
        hora: horaInicio.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }),
        destinos: Object.entries(porDestino).map(([nombre, camiones]) => ({
          nombre,
          cantidad: camiones.length,
          camiones: camiones.map(t => this.transitoACamion(t))
        }))
      });
    }

    return proyeccion;
  }

  private agruparPorDestino(transitos: TransitoTorreControl[]): Record<string, TransitoTorreControl[]> {
    return transitos.reduce((acc, transito) => {
      if (!acc[transito.destino]) {
        acc[transito.destino] = [];
      }
      acc[transito.destino].push(transito);
      return acc;
    }, {} as Record<string, TransitoTorreControl[]>);
  }

  private detectarCongestionesEnDestino(destino: string, transitos: TransitoTorreControl[]): CongestionAnalysis[] {
    if (transitos.length < this.config.umbralBajo) {
      return [];
    }

    // Ordenar por ETA
    const ordenados = [...transitos].sort((a, b) => a.eta.getTime() - b.eta.getTime());
    const congestions: CongestionAnalysis[] = [];
    
    // Buscar grupos de camiones en ventanas de tiempo
    for (let i = 0; i < ordenados.length; i++) {
      const ventanaInicio = ordenados[i].eta;
      const ventanaFin = new Date(ventanaInicio.getTime() + this.config.ventanaTiempo * 60 * 1000);
      
      // Contar camiones en esta ventana
      const camionesEnVentana = ordenados.filter(t => 
        t.eta >= ventanaInicio && t.eta <= ventanaFin
      );

      if (camionesEnVentana.length >= this.config.umbralBajo) {
        // Evitar duplicados: verificar si ya existe una congestión que cubra esta ventana
        const yaRegistrada = congestions.some(c => 
          c.destino === destino &&
          ventanaInicio >= c.ventanaInicio &&
          ventanaInicio <= c.ventanaFin
        );

        if (!yaRegistrada) {
          congestions.push({
            destino,
            ventanaInicio,
            ventanaFin,
            camiones: camionesEnVentana.map(t => this.transitoACamion(t)),
            severidad: this.calcularSeveridad(camionesEnVentana.length),
            cantidadCamiones: camionesEnVentana.length
          });
        }
      }
    }

    return congestions;
  }

  private transitoACamion(transito: TransitoTorreControl): CamionProyectado {
    return {
      id: transito.id,
      matricula: transito.matricula,
      eta: transito.eta,
      origen: transito.origen,
      chofer: transito.chofer
    };
  }

  private calcularSeveridad(cantidad: number): CongestionAnalysis['severidad'] {
    if (cantidad >= this.config.umbralAlto) return 'critica';
    if (cantidad >= this.config.umbralMedio) return 'alta';
    if (cantidad >= this.config.umbralBajo) return 'media';
    return 'baja';
  }

  /**
   * Actualiza la configuración
   */
  actualizarConfiguracion(nuevaConfig: Partial<ConfiguracionPrediccion>) {
    this.config = { ...this.config, ...nuevaConfig };
  }
}

// Instancia singleton para uso global
export const congestionAnalyzer = new CongestionAnalyzer();