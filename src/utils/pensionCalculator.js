export class PensionCalculator {
  constructor() {
    this.tasaAfiliacion = 0.10;
    this.tasaSeguroPromedio = 0.0127;
    this.tasaComisionPromedio = 0.0074;
  }

  calcularPension(params) {
    const {
      salarioMensual = 0,
      edadActual = 30,
      edadJubilacion = 65,
      saldoActual = 0,
      tasaRendimiento = 0.065,
      comisionAfp = 0.0074,
      tasaSeguro = 0.0127,
      aportesAdicionales = 0
    } = params;

    const añosCotizacion = edadJubilacion - edadActual;
    const aporteMensual = salarioMensual * this.tasaAfiliacion;

    let saldoCapital = saldoActual;
    const aportesRegimen = [];

    for (let año = 0; año < añosCotizacion; año++) {
      const comisionMensual = aporteMensual * comisionAfp;
      const seguroMensual = (saldoCapital / 12) * tasaSeguro;
      const rentaMensual = (saldoCapital / 12) * tasaRendimiento / 12;

      const capitalMensual = aporteMensual - comisionMensual - seguroMensual + rentaMensual;

      for (let mes = 0; mes < 12; mes++) {
        saldoCapital += capitalMensual + (aportesAdicionales / 12);
        const rentaDelMes = saldoCapital * (tasaRendimiento / 12);
        saldoCapital += rentaDelMes;
      }

      aportesRegimen.push({
        año: año + 1,
        saldoAcumulado: Math.round(saldoCapital)
      });
    }

    const pensionMensual = this.calcularPensionMensual(saldoCapital, edadJubilacion);
    const expectativaVidaJubilado = 80;
    const mesesJubilacion = (expectativaVidaJubilado - edadJubilacion) * 12;

    return {
      saldoFinal: Math.round(saldoCapital),
      pensionMensualEstimada: Math.round(pensionMensual),
      totalAportado: Math.round(aporteMensual * 12 * añosCotizacion),
      totalComisiones: Math.round(aporteMensual * comisionAfp * 12 * añosCotizacion),
      totalSeguros: Math.round((saldoCapital / 12) * tasaSeguro * 12 * 0.5),
      años: añosCotizacion,
      aportesRegimen,
      flujoJubilacion: {
        mesesEstimados: mesesJubilacion,
        pensionMensual: Math.round(pensionMensual),
        totalEstimado: Math.round(pensionMensual * mesesJubilacion)
      }
    };
  }

  calcularPensionMensual(saldoFinal, edadJubilacion) {
    const expectativaVida = 80;
    const mesesRestantes = (expectativaVida - edadJubilacion) * 12;
    const tasaDescuentoRetiro = 0.04;

    let pensionActuarial = 0;
    for (let mes = 1; mes <= mesesRestantes; mes++) {
      const descuento = Math.pow(1 + tasaDescuentoRetiro / 12, -mes);
      pensionActuarial += descuento;
    }

    return saldoFinal / pensionActuarial;
  }

  compararAFPs(saldoFinal, afps) {
    return afps.map(afp => ({
      ...afp,
      pensionEstimada: this.calcularPensionMensual(saldoFinal, 65),
      comisionAnual: Math.round(saldoFinal * afp.comisión / 100)
    }));
  }

  validarParametros(params) {
    const errores = [];

    if (params.edadActual < 18) errores.push('Edad mínima requerida: 18 años');
    if (params.edadJubilacion <= params.edadActual) errores.push('Edad de jubilación debe ser mayor que edad actual');
    if (params.salarioMensual < 0) errores.push('Salario no puede ser negativo');
    if (params.saldoActual < 0) errores.push('Saldo actual no puede ser negativo');

    return {
      valido: errores.length === 0,
      errores
    };
  }
}

export default PensionCalculator;
