/* =========================================================
   CONFIGURACIÓN SUPABASE
   =========================================================
   1) Crea la tabla usando el SQL que te dejo en la respuesta.
   2) Copia tu Project URL y tu publishable/anon key de Supabase.
   3) Pégalos aquí.

   IMPORTANTE:
   - La publishable/anon key puede estar en frontend si tus políticas RLS están bien definidas.
   - Si dejas políticas públicas de edición, cualquier persona con el link podría modificar el historial.
*/
const SUPABASE_URL = "https://zrnplnanihhfogerrtyx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xiNKNP6LpJkfbcoa9IG33w_yMbWRrNF";
const SUPABASE_TABLE = "historial_carga_opit";
const SUPABASE_LISTA_TABLE = "voladuras_autorizadas_opit";
const SUPABASE_LISTA_ID = "lista_principal";
const SUPABASE_FACTORES_TABLE = "factores_consumo_mezclas";

// Contraseña temporal para editar factores desde el dashboard.
// Más adelante se recomienda migrarla a una validación segura en Supabase/RPC.
const PASSWORD_FACTORES_CONSUMO = "Enaex2026";

let supabaseClient = null;

const panelRangosCarga = document.getElementById("panelRangosCarga");
const btnAplicarRangos = document.getElementById("btnAplicarRangos");
const btnLimpiarRangos = document.getElementById("btnLimpiarRangos");
const botonesFiltroRango = document.querySelectorAll(".btnFiltroRango");
const estadoFiltroRango = document.getElementById("estadoFiltroRango");

const rango1Inicio = document.getElementById("rango1Inicio");
const rango1Fin = document.getElementById("rango1Fin");
const rango2Inicio = document.getElementById("rango2Inicio");
const rango2Fin = document.getElementById("rango2Fin");
const rango3Inicio = document.getElementById("rango3Inicio");
const rango3Fin = document.getElementById("rango3Fin");
const rango4Inicio = document.getElementById("rango4Inicio");
const rango4Fin = document.getElementById("rango4Fin");

const btnAgregarRangoCarga = document.getElementById("btnAgregarRangoCarga");
const btnQuitarRangoCarga = document.getElementById("btnQuitarRangoCarga");
const filasRangoCarga = [1, 2, 3, 4].map(numero => document.getElementById(`filaRango${numero}`));
const botonesFiltroRangoDinamico = [2, 3, 4].map(numero => document.getElementById(`btnFiltroRango${numero}`));

const btnCargar = document.getElementById("btnCargar");
const btnGuardarLista = document.getElementById("btnGuardarLista");
const btnToggleLista = document.getElementById("btnToggleLista");
const contenidoListaVoladuras = document.getElementById("contenidoListaVoladuras");
const botonesVista = document.querySelectorAll(".btnVista[data-vista]");

const estado = document.getElementById("estado");
const head = document.getElementById("encabezadoTabla");
const body = document.getElementById("cuerpoTabla");
const btnLimpiarFiltrosTabla = document.getElementById("btnLimpiarFiltrosTabla");
const btnExportarExcelTabla = document.getElementById("btnExportarExcelTabla");

const selectMes = document.getElementById("selectMes");
const selectBlast = document.getElementById("selectBlast");
const txtVoladuras = document.getElementById("txtVoladuras");

const kpiTotal = document.getElementById("kpiTotal");
const kpiCargados = document.getElementById("kpiCargados");
const kpiPendientes = document.getElementById("kpiPendientes");
const kpiAyudas = document.getElementById("kpiAyudas");
const kpiCargaTotal = document.getElementById("kpiCargaTotal");

const tbodyResumenBulk = document.getElementById("tbodyResumenBulk");
const tbodyResumenLabel = document.getElementById("tbodyResumenLabel");
const tituloGrafico = document.getElementById("tituloGrafico");

const estadoSupabase = document.getElementById("estadoSupabase");
const loginDashboard = document.getElementById("loginDashboard");
const appDashboard = document.getElementById("appDashboard");
const formLoginDashboard = document.getElementById("formLoginDashboard");
const loginUsuario = document.getElementById("loginUsuario");
const loginPassword = document.getElementById("loginPassword");
const btnLoginDashboard = document.getElementById("btnLoginDashboard");
const estadoLoginDashboard = document.getElementById("estadoLoginDashboard");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const usuarioSesion = document.getElementById("usuarioSesion");
const usuarioIniciales = document.getElementById("usuarioIniciales");
const ultimaActualizacionMini = document.getElementById("ultimaActualizacionMini");
const estadoAutoRefresh = document.getElementById("estadoAutoRefresh");
const btnToggleSeguimientoCompacto = document.getElementById("btnToggleSeguimientoCompacto");
const panelSeguimientoCompacto = document.getElementById("panelSeguimientoCompacto");
const contadorSeguimientoCompacto = document.getElementById("contadorSeguimientoCompacto");
const listaSeguimientoProyectos = document.getElementById("listaSeguimientoProyectos");
const estadoSeguimientoGlobal = document.getElementById("estadoSeguimientoGlobal");
const btnSeleccionarTodosSeguimiento = document.getElementById("btnSeleccionarTodosSeguimiento");
const btnLimpiarSeguimiento = document.getElementById("btnLimpiarSeguimiento");
const btnIniciarSeguimientoGlobal = document.getElementById("btnIniciarSeguimientoGlobal");
const btnDetenerSeguimientoGlobal = document.getElementById("btnDetenerSeguimientoGlobal");
const btnRecargarHistorial = document.getElementById("btnRecargarHistorial");
const btnToggleHistorialAdmin = document.getElementById("btnToggleHistorialAdmin");
const panelHistorialAdminContenido = document.getElementById("panelHistorialAdminContenido");
const tbodyHistorialAdmin = document.getElementById("tbodyHistorialAdmin");
const estadoHistorialAdmin = document.getElementById("estadoHistorialAdmin");
const btnToggleConsumo = document.getElementById("btnToggleConsumo");
const panelConsumoInsumos = document.getElementById("panelConsumoInsumos");
const btnCerrarConsumo = document.getElementById("btnCerrarConsumo");
const btnActualizarConsumo = document.getElementById("btnActualizarConsumo");
const inputPorcentajeAceiteResidual = document.getElementById("inputPorcentajeAceiteResidual");
const resumenConsumoTexto = document.getElementById("resumenConsumoTexto");
const resumenTaladrosConsumo = document.getElementById("resumenTaladrosConsumo");
const tbodyConsumoMezcla = document.getElementById("tbodyConsumoMezcla");
const tbodyConsumoTotal = document.getElementById("tbodyConsumoTotal");
const panelFactoresConsumo = document.getElementById("panelFactoresConsumo");
const contenidoFactoresConsumo = document.getElementById("contenidoFactoresConsumo");
const btnToggleFactoresConsumo = document.getElementById("btnToggleFactoresConsumo");
const btnHabilitarEdicionFactores = document.getElementById("btnHabilitarEdicionFactores");
const btnAgregarMezclaFactor = document.getElementById("btnAgregarMezclaFactor");
const btnGuardarFactoresConsumo = document.getElementById("btnGuardarFactoresConsumo");
const btnCancelarEdicionFactores = document.getElementById("btnCancelarEdicionFactores");
const tbodyFactoresConsumo = document.getElementById("tbodyFactoresConsumo");
const estadoFactoresConsumo = document.getElementById("estadoFactoresConsumo");
const resumenFactoresActivos = document.getElementById("resumenFactoresActivos");
const consumoKpiEmulsion = document.getElementById("consumoKpiEmulsion");
const consumoKpiNitrato = document.getElementById("consumoKpiNitrato");
const consumoKpiDiesel = document.getElementById("consumoKpiDiesel");
const consumoKpiAceite = document.getElementById("consumoKpiAceite");
const consumoKpiGasificante = document.getElementById("consumoKpiGasificante");
const consumoKpiKallpex = document.getElementById("consumoKpiKallpex");


const COLUMNAS_TABLA_DETALLE = [
  { campo: "Estado", titulo: "Estado" },
  { campo: "Clasificacion", titulo: "Clasificación" },
  { campo: "Primas", titulo: "Primas" },
  { campo: "Tipo_Mezcla", titulo: "Tipo mezcla" },
  { campo: "Label", titulo: "Label" },
  { campo: "Pozo", titulo: "Proyecto" },
  { campo: "Carga_Total", titulo: "Carga (kg)", tipo: "numero" },
  { campo: "Stemming", titulo: "Stemming" },
  { campo: "Fecha_Cargado_Detectada", titulo: "Fecha cargado detectado" }
];

const COMPOSICION_MEZCLAS_BASE = {
  // Factores actualizados: todos se multiplican por kg de mezcla cargada, incluido gasificante.
  // Las mezclas sin factores confirmados deben cargarse/activarse desde Supabase cuando se tengan los valores reales.
  "EMG 55G": { emulsion: 0.498, nitrato: 0.46, combustible: 0.04, gasificante: 0.002, kallpex: 0 },
  "EMG 55G K10": { emulsion: 0.4482, nitrato: 0.414, combustible: 0.036, gasificante: 0.0018, kallpex: 0.1 },
  "EMG 73G": { emulsion: 0.6972, nitrato: 0.276, combustible: 0.024, gasificante: 0.0028, kallpex: 0 }
};

let composicionMezclasActual = clonarComposicionMezclas(COMPOSICION_MEZCLAS_BASE);
let factoresConsumoRegistros = crearRegistrosFactoresDesdeObjeto(COMPOSICION_MEZCLAS_BASE);
let edicionFactoresHabilitada = false;
let factoresConsumoCargadosDesdeSupabase = false;

const PORCENTAJE_ACEITE_RESIDUAL_DEFAULT = 0;
const AUTO_REFRESH_MS = 60 * 1000;

const user = "willian.varas@enaex.com";
const HISTORIAL_CARGA_KEY = "historialCargaTaladrosOPit";
const SEGUIMIENTO_PROYECTOS_KEY = "seguimientoProyectosOPit";

const listaInicial = `SG-MARZO | 09A_3188_008 | 71652
SG-ABRIL | 03.04.2026 09A_3172_003 | 72334
SG-ABRIL | 28.04.2026 09A_3156_001 | 74062
SG-MAYO | 01.05.2026 09A_3180_011 | 74307
SG-MAYO | 01.05.2026 09A_3172_007 | 74312`;

let proyectos = {};
let dataActual = [];
let vistaActual = "estado";
let labelSeleccionado = null;
let filtroRangoActivo = "TODO";
let historialActualSupabase = [];
let usandoSupabase = false;
let appInicializada = false;
let usuarioDashboardActual = null;
let filtrosTablaDetalle = {};
let ordenTablaDetalle = { campo: null, direccion: "asc" };
let dataTablaDetalleBase = [];
let timerAutoRefresh = null;
let timerCuentaRegresivaAutoRefresh = null;
let proximaActualizacionAutoRefresh = null;
let cargandoDatosEnCurso = false;
let actualizandoSeguimientoGlobal = false;
let ultimoResumenSeguimientoGlobal = { revisados: 0, errores: 0, actualizados: 0, nombres: [] };
let cantidadRangosVisibles = 1;

let rangoBaseGrafico = null;
let ultimoRangoGrafico = null;

btnAplicarRangos?.addEventListener("click", () => {
  if (vistaActual === "rangos" && dataActual.length > 0) {
    actualizarDashboardAnalitico();
    construirGrafico2D(dataActual, vistaActual, { mantenerRango: false });
  }
});

btnLimpiarRangos?.addEventListener("click", () => {
  limpiarInputsRangosCarga();
  cantidadRangosVisibles = 1;
  actualizarRangosVisibles();
  filtroRangoActivo = "TODO";
  actualizarBotonesFiltroRango();

  if (vistaActual === "rangos" && dataActual.length > 0) {
    actualizarDashboardAnalitico();
    construirGrafico2D(dataActual, vistaActual, { mantenerRango: false });
  }
});

[
  rango1Inicio, rango1Fin,
  rango2Inicio, rango2Fin,
  rango3Inicio, rango3Fin,
  rango4Inicio, rango4Fin
].forEach(input => {
  input?.addEventListener("change", () => {
    if (vistaActual === "rangos" && dataActual.length > 0) {
      actualizarDashboardAnalitico();
      construirGrafico2D(dataActual, vistaActual, { mantenerRango: true });
    }
  });
});

btnAgregarRangoCarga?.addEventListener("click", () => {
  if (cantidadRangosVisibles >= 4) return;
  cantidadRangosVisibles += 1;
  actualizarRangosVisibles();
});

btnQuitarRangoCarga?.addEventListener("click", () => {
  if (cantidadRangosVisibles <= 1) return;

  const rangoAQuitar = cantidadRangosVisibles;
  limpiarInputsRangoIndividual(rangoAQuitar);

  if (filtroRangoActivo === `Rango ${rangoAQuitar}`) {
    filtroRangoActivo = "TODO";
    actualizarBotonesFiltroRango();
  }

  cantidadRangosVisibles -= 1;
  actualizarRangosVisibles();

  if (vistaActual === "rangos" && dataActual.length > 0) {
    actualizarDashboardAnalitico();
    construirGrafico2D(dataActual, vistaActual, { mantenerRango: true });
  }
});

botonesFiltroRango.forEach(btn => {
  btn.addEventListener("click", () => {
    filtroRangoActivo = btn.dataset.filtroRango || "TODO";
    actualizarBotonesFiltroRango();

    if (dataActual.length > 0) {
      actualizarDashboardAnalitico();
      construirGrafico2D(dataActual, vistaActual, { mantenerRango: true });
    }
  });
});

btnGuardarLista.addEventListener("click", guardarLista);

btnToggleLista?.addEventListener("click", () => {
  const estaOculta = contenidoListaVoladuras?.classList.contains("oculto");
  contenidoListaVoladuras?.classList.toggle("oculto", !estaOculta);
  btnGuardarLista?.classList.toggle("btnGuardarListaOculto", !estaOculta);
  btnToggleLista.textContent = estaOculta ? "Ocultar lista" : "Mostrar / editar lista";
});
btnCargar.addEventListener("click", () => cargarDatos({ manual: true }));
selectMes.addEventListener("change", cargarVoladurasDelMes);
selectBlast?.addEventListener("change", () => {
  // El seguimiento global puede seguir activo aunque cambies la voladura visible.
  actualizarEstadoAutoRefresh();
});

btnToggleHistorialAdmin?.addEventListener("click", async () => {
  const estaOculto = panelHistorialAdminContenido?.classList.contains("oculto");

  panelHistorialAdminContenido?.classList.toggle("oculto", !estaOculto);
  btnRecargarHistorial?.classList.toggle("oculto", !estaOculto);

  btnToggleHistorialAdmin.textContent = estaOculto
    ? "Ocultar edición"
    : "Mostrar edición";

  if (estaOculto) {
    await cargarHistorialAdmin();
  }
});

btnRecargarHistorial?.addEventListener("click", async () => {
  await cargarHistorialAdmin();
});

btnLimpiarFiltrosTabla?.addEventListener("click", () => {
  filtrosTablaDetalle = {};
  construirTabla(dataTablaDetalleBase);
});

btnExportarExcelTabla?.addEventListener("click", () => {
  exportarTablaDetalleExcel();
});

btnToggleConsumo?.addEventListener("click", () => {
  const estabaOculto = panelConsumoInsumos?.classList.contains("oculto");

  if (estabaOculto) {
    activarVistaConsumoInsumos();
  } else {
    panelConsumoInsumos?.classList.add("oculto");
    btnToggleConsumo.classList.remove("activo");
  }
});

btnCerrarConsumo?.addEventListener("click", () => {
  panelConsumoInsumos?.classList.add("oculto");
  btnToggleConsumo?.classList.remove("activo");
});

btnActualizarConsumo?.addEventListener("click", () => {
  actualizarConsumoInsumos();
});

btnToggleFactoresConsumo?.addEventListener("click", () => {
  const estaOculto = contenidoFactoresConsumo?.classList.contains("oculto");
  contenidoFactoresConsumo?.classList.toggle("oculto", !estaOculto);
  panelFactoresConsumo?.classList.toggle("factores-cerrado", !estaOculto);
  btnToggleFactoresConsumo.textContent = estaOculto ? "Ocultar factores" : "Mostrar / editar factores";
  actualizarBotonesFactoresConsumo();
  renderFactoresConsumo();
});

btnHabilitarEdicionFactores?.addEventListener("click", () => {
  solicitarHabilitarEdicionFactores();
});

btnAgregarMezclaFactor?.addEventListener("click", () => {
  if (!edicionFactoresHabilitada && !solicitarHabilitarEdicionFactores()) return;
  agregarFilaFactorConsumo();
});

btnGuardarFactoresConsumo?.addEventListener("click", async () => {
  await guardarFactoresConsumoDesdeDashboard();
});

btnCancelarEdicionFactores?.addEventListener("click", async () => {
  edicionFactoresHabilitada = false;
  await cargarFactoresConsumoCentral();
  renderFactoresConsumo();
  actualizarConsumoInsumos();
});

inputPorcentajeAceiteResidual?.addEventListener("input", () => {
  actualizarConsumoInsumos();
});


btnToggleSeguimientoCompacto?.addEventListener("click", event => {
  event.stopPropagation();
  panelSeguimientoCompacto?.classList.toggle("oculto");
});

panelSeguimientoCompacto?.addEventListener("click", event => {
  event.stopPropagation();
});

document.addEventListener("click", event => {
  if (!panelSeguimientoCompacto || panelSeguimientoCompacto.classList.contains("oculto")) return;
  if (event.target === btnToggleSeguimientoCompacto || btnToggleSeguimientoCompacto?.contains(event.target)) return;
  if (panelSeguimientoCompacto.contains(event.target)) return;
  panelSeguimientoCompacto.classList.add("oculto");
});

btnSeleccionarTodosSeguimiento?.addEventListener("click", () => {
  const todos = obtenerTodosLosProyectosPlano().map(p => p.blastId);
  guardarProyectosSeguimientoSeleccionados(todos);
  renderSeguimientoProyectos();
  actualizarEstadoAutoRefresh();
});

btnLimpiarSeguimiento?.addEventListener("click", () => {
  guardarProyectosSeguimientoSeleccionados([]);
  renderSeguimientoProyectos();
  detenerAutoRefreshDatos("Seguimiento global: inactivo · sin proyectos seleccionados");
});

btnIniciarSeguimientoGlobal?.addEventListener("click", () => {
  iniciarAutoRefreshDatos();
});

btnDetenerSeguimientoGlobal?.addEventListener("click", () => {
  detenerAutoRefreshDatos("Seguimiento global: detenido manualmente");
});

inputPorcentajeAceiteResidual?.addEventListener("change", () => {
  normalizarInputPorcentajeAceiteResidual();
  actualizarConsumoInsumos();
});

botonesVista.forEach(btn => {
  btn.addEventListener("click", () => {
    vistaActual = btn.dataset.vista;

    botonesVista.forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");
    btnToggleConsumo?.classList.remove("activo");
    panelConsumoInsumos?.classList.add("oculto");

    actualizarVisibilidadPanelRangos();

    if (vistaActual !== "rangos") {
      filtroRangoActivo = "TODO";
      actualizarBotonesFiltroRango();
    }

    if (dataActual.length > 0) {
      actualizarDashboardAnalitico();
      construirGrafico2D(dataActual, vistaActual, {
        mantenerRango: true
      });
    }
  });
});

function activarVistaConsumoInsumos() {
  vistaActual = "rangos";

  botonesVista.forEach(b => b.classList.remove("activo"));
  btnToggleConsumo?.classList.add("activo");
  panelConsumoInsumos?.classList.remove("oculto");

  actualizarVisibilidadPanelRangos();

  if (dataActual.length > 0) {
    actualizarDashboardAnalitico();
    construirGrafico2D(dataActual, "rangos", {
      mantenerRango: true
    });
  }

  renderFactoresConsumo();
  actualizarConsumoInsumos();

  if (panelRangosCarga) {
    panelRangosCarga.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    panelConsumoInsumos?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

iniciarApp();

async function iniciarApp() {
  inicializarSupabase();
  configurarEventosAutenticacion();

  const sesionValida = await verificarSesionDashboard();
  if (!sesionValida) return;

  await iniciarDashboardPostLogin();
}

function configurarEventosAutenticacion() {
  formLoginDashboard?.addEventListener("submit", async event => {
    event.preventDefault();
    await iniciarSesionDashboard();
  });

  btnCerrarSesion?.addEventListener("click", async () => {
    await cerrarSesionDashboard();
  });
}

async function verificarSesionDashboard() {
  if (!usandoSupabase || !supabaseClient) {
    mostrarPantallaLogin("Supabase no está disponible. No se puede validar usuario y contraseña.", "error");
    return false;
  }

  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;

    if (data?.session?.user) {
      usuarioDashboardActual = data.session.user;
      mostrarDashboardAutenticado(usuarioDashboardActual.email || "Usuario autorizado");
      return true;
    }

    mostrarPantallaLogin("Ingresa tu usuario y contraseña para continuar.");
    return false;
  } catch (error) {
    console.error("Error verificando sesión:", error);
    mostrarPantallaLogin("No se pudo verificar la sesión. Intenta ingresar nuevamente.", "error");
    return false;
  }
}

async function iniciarSesionDashboard() {
  if (!supabaseClient) return;

  const email = (loginUsuario?.value || "").trim();
  const password = loginPassword?.value || "";

  if (!email || !password) {
    mostrarEstadoLogin("Completa usuario y contraseña.", "error");
    return;
  }

  try {
    if (btnLoginDashboard) {
      btnLoginDashboard.disabled = true;
      btnLoginDashboard.textContent = "Validando...";
    }

    mostrarEstadoLogin("Validando credenciales...");

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    usuarioDashboardActual = data?.user || null;
    mostrarEstadoLogin("Acceso correcto. Cargando dashboard...", "ok");
    mostrarDashboardAutenticado(email);
    await iniciarDashboardPostLogin();
  } catch (error) {
    console.error("Error de login:", error);
    mostrarEstadoLogin("Usuario o contraseña incorrectos, o usuario no autorizado.", "error");
  } finally {
    if (btnLoginDashboard) {
      btnLoginDashboard.disabled = false;
      btnLoginDashboard.textContent = "Ingresar";
    }
  }
}

async function cerrarSesionDashboard() {
  detenerAutoRefreshDatos("Autoactualización: inactiva");

  try {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
  } catch (error) {
    console.error("Error cerrando sesión:", error);
  }

  usuarioDashboardActual = null;
  appInicializada = false;
  dataActual = [];
  filtrosTablaDetalle = {};
  ordenTablaDetalle = { campo: null, direccion: "asc" };
  dataTablaDetalleBase = [];
  limpiarTabla();
  limpiarKpis();
  limpiarGrafico();
  limpiarResumenes();
  renderHistorialAdmin([]);
  mostrarPantallaLogin("Sesión cerrada correctamente.", "ok");
}

async function iniciarDashboardPostLogin() {
  if (appInicializada) return;

  appInicializada = true;

  await cargarListaVoladurasCentral();
  await cargarFactoresConsumoCentral();

  procesarLista();
  cargarMeses();
  renderSeguimientoProyectos();
  limpiarKpis();
  actualizarVisibilidadPanelRangos();
  actualizarBotonesFiltroRango();
  actualizarEstadoAutoRefresh("Autoactualización: inactiva");
  renderHistorialAdmin([]);
}

function mostrarPantallaLogin(mensaje = "Sesión requerida.", tipo = "") {
  loginDashboard?.classList.remove("oculto");
  appDashboard?.classList.add("oculto");
  if (usuarioSesion) {
    usuarioSesion.title = "Usuario";
    usuarioSesion.setAttribute("aria-label", "Usuario");
  }
  if (usuarioIniciales) usuarioIniciales.textContent = "--";
  mostrarEstadoLogin(mensaje, tipo);
}

function mostrarDashboardAutenticado(usuario) {
  loginDashboard?.classList.add("oculto");
  appDashboard?.classList.remove("oculto");

  if (usuarioSesion) {
    usuarioSesion.title = usuario;
    usuarioSesion.setAttribute("aria-label", `Usuario: ${usuario}`);
  }

  if (usuarioIniciales) {
    usuarioIniciales.textContent = obtenerInicialesUsuario(usuario);
  }

  if (estado) {
    estado.textContent = "Sesión activa. Selecciona una voladura y carga datos.";
  }
}

function obtenerInicialesUsuario(usuario) {
  const texto = String(usuario || "").trim();
  if (!texto) return "--";

  const nombreCorreo = texto.split("@")[0] || texto;
  const partes = nombreCorreo
    .replace(/[._-]+/g, " ")
    .split(" ")
    .map(p => p.trim())
    .filter(Boolean);

  if (partes.length >= 2) {
    return `${partes[0][0] || ""}${partes[1][0] || ""}`.toUpperCase();
  }

  return nombreCorreo.slice(0, 2).toUpperCase();
}

function mostrarEstadoLogin(mensaje, tipo = "") {
  if (!estadoLoginDashboard) return;

  estadoLoginDashboard.textContent = mensaje;
  estadoLoginDashboard.className = "estado-login";

  if (tipo) {
    estadoLoginDashboard.classList.add(tipo);
  }
}

function inicializarSupabase() {
  const urlValida = SUPABASE_URL && !SUPABASE_URL.includes("PEGA_AQUI") && SUPABASE_URL.startsWith("https://");
  const keyValida = SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("PEGA_AQUI");

  if (!urlValida || !keyValida || !window.supabase) {
    usandoSupabase = false;
    supabaseClient = null;
    if (estadoSupabase) {
      estadoSupabase.textContent = "Supabase no configurado · usando respaldo local";
      estadoSupabase.className = "estado-supabase advertencia";
    }
    return;
  }

  const { createClient } = window.supabase;
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  usandoSupabase = true;

  if (estadoSupabase) {
    estadoSupabase.textContent = "Supabase configurado · historial y lista compartidos activos";
    estadoSupabase.className = "estado-supabase ok";
  }
}

async function cargarListaVoladurasCentral() {
  const listaLocal = localStorage.getItem("voladurasOPit");

  if (!usandoSupabase || !supabaseClient) {
    txtVoladuras.value = listaLocal && listaLocal.trim() !== "" ? listaLocal : listaInicial;
    localStorage.setItem("voladurasOPit", txtVoladuras.value);
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from(SUPABASE_LISTA_TABLE)
      .select("contenido")
      .eq("id", SUPABASE_LISTA_ID)
      .maybeSingle();

    if (error) throw error;

    if (data?.contenido && String(data.contenido).trim() !== "") {
      txtVoladuras.value = data.contenido;
      localStorage.setItem("voladurasOPit", data.contenido);
      return;
    }

    txtVoladuras.value = listaLocal && listaLocal.trim() !== "" ? listaLocal : listaInicial;
    localStorage.setItem("voladurasOPit", txtVoladuras.value);

    await supabaseClient
      .from(SUPABASE_LISTA_TABLE)
      .upsert({
        id: SUPABASE_LISTA_ID,
        contenido: txtVoladuras.value,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });

  } catch (error) {
    console.error("Error cargando lista central desde Supabase:", error);
    txtVoladuras.value = listaLocal && listaLocal.trim() !== "" ? listaLocal : listaInicial;
    localStorage.setItem("voladurasOPit", txtVoladuras.value);

    if (estadoSupabase) {
      estadoSupabase.textContent = "Supabase activo · historial compartido · lista usando respaldo local";
      estadoSupabase.className = "estado-supabase advertencia";
    }
  }
}

async function guardarLista() {
  detenerAutoRefreshDatos("Autoactualización: inactiva · lista actualizada");
  filtrosTablaDetalle = {};
  ordenTablaDetalle = { campo: null, direccion: "asc" };
  dataTablaDetalleBase = [];

  const contenido = txtVoladuras.value || "";
  localStorage.setItem("voladurasOPit", contenido);

  if (usandoSupabase && supabaseClient) {
    estado.textContent = "Guardando lista autorizada en Supabase...";

    const { error } = await supabaseClient
      .from(SUPABASE_LISTA_TABLE)
      .upsert({
        id: SUPABASE_LISTA_ID,
        contenido: contenido,
        updated_at: new Date().toISOString()
      }, { onConflict: "id" });

    if (error) {
      console.error("Error guardando lista en Supabase:", error);
      estado.textContent = "No se pudo guardar la lista en Supabase. Se guardó solo en este navegador.";
    } else {
      estado.textContent = "Lista guardada correctamente en Supabase. Todos verán la misma lista.";
    }
  } else {
    estado.textContent = "Lista guardada localmente. Supabase no está disponible.";
  }

  procesarLista();
  cargarMeses();
  renderSeguimientoProyectos();
  limpiarTabla();
  limpiarKpis();
  limpiarGrafico();
  limpiarResumenes();
  renderHistorialAdmin([]);
}

function procesarLista() {
  proyectos = {};

  const lineas = txtVoladuras.value
    .split("\n")
    .map(linea => linea.trim())
    .filter(linea => linea !== "");

  lineas.forEach(linea => {
    const partes = linea.split("|").map(p => p.trim());

    if (partes.length < 3) return;

    const mes = partes[0];
    const nombre = partes[1];
    const blastId = partes[2];

    if (!proyectos[mes]) proyectos[mes] = [];

    proyectos[mes].push({ nombre, blastId });
  });
}

function obtenerTodosLosProyectosPlano() {
  const salida = [];
  Object.entries(proyectos).forEach(([mes, voladuras]) => {
    (voladuras || []).forEach(voladura => {
      if (!voladura?.blastId) return;
      salida.push({
        mes,
        nombre: voladura.nombre,
        blastId: String(voladura.blastId)
      });
    });
  });
  return salida;
}

function leerProyectosSeguimientoSeleccionados() {
  try {
    const raw = JSON.parse(localStorage.getItem(SEGUIMIENTO_PROYECTOS_KEY) || "[]");
    return new Set(Array.isArray(raw) ? raw.map(String) : []);
  } catch {
    return new Set();
  }
}

function guardarProyectosSeguimientoSeleccionados(blastIds) {
  const idsUnicos = [...new Set((blastIds || []).map(String).filter(Boolean))];
  localStorage.setItem(SEGUIMIENTO_PROYECTOS_KEY, JSON.stringify(idsUnicos));
}

function obtenerProyectosSeguimientoSeleccionados() {
  const seleccionados = leerProyectosSeguimientoSeleccionados();
  return obtenerTodosLosProyectosPlano().filter(p => seleccionados.has(String(p.blastId)));
}

function renderSeguimientoProyectos() {
  if (!listaSeguimientoProyectos) return;

  const proyectosPlano = obtenerTodosLosProyectosPlano();
  const seleccionados = leerProyectosSeguimientoSeleccionados();
  const idsValidos = new Set(proyectosPlano.map(p => String(p.blastId)));
  const seleccionDepurada = [...seleccionados].filter(id => idsValidos.has(id));

  if (seleccionDepurada.length !== seleccionados.size) {
    guardarProyectosSeguimientoSeleccionados(seleccionDepurada);
  }

  actualizarContadorSeguimientoCompacto(seleccionDepurada.length);

  if (proyectosPlano.length === 0) {
    listaSeguimientoProyectos.innerHTML = `<div class="seguimiento-vacio">No hay voladuras en la lista autorizada.</div>`;
    actualizarEstadoSeguimientoGlobal("Seguimiento global: inactivo · sin proyectos disponibles");
    return;
  }

  listaSeguimientoProyectos.innerHTML = proyectosPlano.map(proyecto => {
    const checked = seleccionDepurada.includes(String(proyecto.blastId)) ? "checked" : "";
    return `
      <label class="seguimiento-item seguimiento-item-compacto">
        <input type="checkbox" class="chkSeguimientoProyecto" value="${escapeHtmlAttr(proyecto.blastId)}" ${checked}>
        <span>
          <strong>${escapeHtmlAttr(proyecto.nombre)}</strong>
          <small>${escapeHtmlAttr(proyecto.mes)} · Blast ID ${escapeHtmlAttr(proyecto.blastId)}</small>
        </span>
      </label>
    `;
  }).join("");

  listaSeguimientoProyectos.querySelectorAll(".chkSeguimientoProyecto").forEach(chk => {
    chk.addEventListener("change", () => {
      const marcados = Array.from(listaSeguimientoProyectos.querySelectorAll(".chkSeguimientoProyecto:checked"))
        .map(input => input.value);
      guardarProyectosSeguimientoSeleccionados(marcados);
      actualizarContadorSeguimientoCompacto(marcados.length);
      actualizarEstadoAutoRefresh();
    });
  });

  actualizarEstadoAutoRefresh();
}

function actualizarContadorSeguimientoCompacto(cantidad = null) {
  if (!contadorSeguimientoCompacto) return;

  const total = cantidad === null
    ? obtenerProyectosSeguimientoSeleccionados().length
    : Number(cantidad || 0);

  contadorSeguimientoCompacto.textContent = total === 1
    ? "1 seleccionado"
    : `${total} seleccionados`;
}

function construirTextoProyectosSeguimiento(proyectosSeleccionados) {
  if (!proyectosSeleccionados || proyectosSeleccionados.length === 0) return "sin proyectos seleccionados";

  const nombres = proyectosSeleccionados.map(p => p.nombre || p.blastId);
  if (nombres.length <= 3) return nombres.join(", ");

  return `${nombres.slice(0, 3).join(", ")} +${nombres.length - 3} más`;
}

function cargarMeses() {
  selectMes.innerHTML = "";

  Object.keys(proyectos).forEach(mes => {
    const option = document.createElement("option");
    option.value = mes;
    option.textContent = mes;
    selectMes.appendChild(option);
  });

  cargarVoladurasDelMes();
}

function cargarVoladurasDelMes() {
  selectBlast.innerHTML = "";

  const mesSeleccionado = selectMes.value;
  const voladuras = proyectos[mesSeleccionado] || [];

  voladuras.forEach(voladura => {
    const option = document.createElement("option");
    option.value = voladura.blastId;
    option.textContent = voladura.nombre;
    selectBlast.appendChild(option);
  });

  renderHistorialAdmin([]);
}

async function cargarDatos(opciones = {}) {
  const config = typeof opciones === "object" && opciones !== null ? opciones : {};
  const silencioso = !!config.silencioso;
  const manual = config.manual !== false && !silencioso;
  const reiniciarAutoRefresh = config.reiniciarAutoRefresh !== false;

  if (cargandoDatosEnCurso) {
    actualizarEstadoAutoRefresh("Autoactualización: esperando fin de carga actual");
    return;
  }

  cargandoDatosEnCurso = true;

  if (!silencioso) {
    estado.textContent = "Cargando datos desde OPitBlast...";
    limpiarTabla();
    limpiarKpis();
    limpiarGrafico();
    limpiarResumenes();
    renderHistorialAdmin([]);
    filtrosTablaDetalle = {};
    dataTablaDetalleBase = [];

    labelSeleccionado = null;
    rangoBaseGrafico = null;
    ultimoRangoGrafico = null;
    filtroRangoActivo = "TODO";
    actualizarBotonesFiltroRango();
  }

  const blastId = selectBlast.value;

  if (!blastId) {
    estado.textContent = "Selecciona una voladura válida.";
    detenerAutoRefreshDatos("Autoactualización: inactiva · sin voladura seleccionada");
    cargandoDatosEnCurso = false;
    return;
  }

  const apiUrl = `https://o-pitblast.com/myserver/APIBlasts.php?p=getBoreholesAppJson&blast=${blastId}&user=${user}`;

  try {
    if (silencioso) {
      actualizarEstadoAutoRefresh("Autoactualización: actualizando datos...");
    }

    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error("Error HTTP: " + response.status);

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      estado.textContent = "No se encontraron datos.";
      detenerAutoRefreshDatos("Autoactualización: inactiva · sin datos");
      return;
    }

    dataActual = transformarDatosApiOPit(data);

    if (usandoSupabase) {
      dataActual = await aplicarHistorialCargaSupabase(dataActual, blastId);
      if (historialAdminVisible()) {
        await cargarHistorialAdmin();
      }
    } else {
      dataActual = aplicarHistorialCargaLocal(dataActual, blastId);
    }

    actualizarDashboardAnalitico();
    construirGrafico2D(dataActual, vistaActual, {
      mantenerRango: silencioso
    });

    const origenHistorial = usandoSupabase ? "Supabase" : "localStorage temporal";
    const ahoraTexto = formatearFechaHora(new Date());

    if (!silencioso) {
      estado.textContent = `Datos cargados: ${dataActual.length} taladros · Historial: ${origenHistorial}`;
    }
    actualizarUltimaActualizacionMini(new Date());

    if (reiniciarAutoRefresh || manual) {
      iniciarAutoRefreshDatos();
    } else {
      proximaActualizacionAutoRefresh = Date.now() + AUTO_REFRESH_MS;
      actualizarEstadoAutoRefresh();
    }

  } catch (error) {
    console.error("ERROR:", error);
    estado.textContent = silencioso
      ? "Error en autoactualización: " + error.message
      : "Error: " + error.message;

    if (silencioso) {
      proximaActualizacionAutoRefresh = Date.now() + AUTO_REFRESH_MS;
      actualizarEstadoAutoRefresh("Autoactualización: activa · último intento con error");
    }
  } finally {
    cargandoDatosEnCurso = false;
  }
}

function iniciarAutoRefreshDatos() {
  detenerAutoRefreshDatos(null, false);

  const proyectosSeleccionados = obtenerProyectosSeguimientoSeleccionados();

  if (proyectosSeleccionados.length === 0) {
    actualizarEstadoAutoRefresh("Seguimiento global: inactivo · selecciona al menos un proyecto");
    return;
  }

  proximaActualizacionAutoRefresh = Date.now() + AUTO_REFRESH_MS;

  timerAutoRefresh = setInterval(() => {
    ejecutarAutoRefreshDatos();
  }, AUTO_REFRESH_MS);

  timerCuentaRegresivaAutoRefresh = setInterval(() => {
    actualizarEstadoAutoRefresh();
  }, 1000);

  actualizarEstadoAutoRefresh();
}

async function ejecutarAutoRefreshDatos() {
  if (appDashboard?.classList.contains("oculto")) {
    detenerAutoRefreshDatos("Seguimiento global: inactivo");
    return;
  }

  await actualizarProyectosSeleccionadosSeguimiento();
}

async function actualizarProyectosSeleccionadosSeguimiento() {
  if (actualizandoSeguimientoGlobal) {
    actualizarEstadoAutoRefresh("Seguimiento global: esperando fin de revisión actual");
    return;
  }

  const proyectosSeleccionados = obtenerProyectosSeguimientoSeleccionados();

  if (proyectosSeleccionados.length === 0) {
    detenerAutoRefreshDatos("Seguimiento global: inactivo · sin proyectos seleccionados");
    return;
  }

  actualizandoSeguimientoGlobal = true;
  actualizarEstadoAutoRefresh(`Seguimiento global: revisando ${proyectosSeleccionados.length} proyecto(s)...`);

  let revisados = 0;
  let errores = 0;
  let actualizados = 0;
  const nombresActualizados = [];
  const blastVisible = String(selectBlast?.value || "");

  for (const proyecto of proyectosSeleccionados) {
    try {
      const dataProyecto = await consultarYAplicarHistorialProyecto(proyecto.blastId);
      revisados += 1;

      if (String(proyecto.blastId) === blastVisible) {
        dataActual = dataProyecto;
        actualizados += 1;
        nombresActualizados.push(proyecto.nombre || proyecto.blastId);

        if (historialAdminVisible()) {
          await cargarHistorialAdmin();
        }

        actualizarDashboardAnalitico();
        construirGrafico2D(dataActual, vistaActual, { mantenerRango: true });
      }
    } catch (error) {
      errores += 1;
      console.error(`Error en seguimiento global para Blast ID ${proyecto.blastId}:`, error);
    }
  }

  ultimoResumenSeguimientoGlobal = {
    revisados,
    errores,
    actualizados,
    nombres: nombresActualizados
  };

  const ahoraTexto = formatearFechaHora(new Date());
  const textoProyectos = construirTextoProyectosSeguimiento(proyectosSeleccionados);

  if (errores > 0) {
    estado.textContent = `Seguimiento global: ${revisados} revisado(s), ${errores} con error.`;
  } else if (estado && !estado.textContent.includes("Cargando datos")) {
    estado.textContent = "Seguimiento global activo.";
  }

  actualizarUltimaActualizacionMini(new Date());
  proximaActualizacionAutoRefresh = Date.now() + AUTO_REFRESH_MS;
  actualizarEstadoAutoRefresh();
  actualizandoSeguimientoGlobal = false;
}

async function consultarYAplicarHistorialProyecto(blastId) {
  const apiUrl = `https://o-pitblast.com/myserver/APIBlasts.php?p=getBoreholesAppJson&blast=${blastId}&user=${user}`;
  const response = await fetch(apiUrl);

  if (!response.ok) throw new Error("Error HTTP: " + response.status);

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Sin datos desde OPitBlast");
  }

  let dataTransformada = transformarDatosApiOPit(data);

  if (usandoSupabase) {
    dataTransformada = await aplicarHistorialCargaSupabase(dataTransformada, blastId);
  } else {
    dataTransformada = aplicarHistorialCargaLocal(dataTransformada, blastId);
  }

  return dataTransformada;
}

function detenerAutoRefreshDatos(mensaje = "Seguimiento global: inactivo", actualizarTexto = true) {
  if (timerAutoRefresh) {
    clearInterval(timerAutoRefresh);
    timerAutoRefresh = null;
  }

  if (timerCuentaRegresivaAutoRefresh) {
    clearInterval(timerCuentaRegresivaAutoRefresh);
    timerCuentaRegresivaAutoRefresh = null;
  }

  proximaActualizacionAutoRefresh = null;

  if (actualizarTexto && mensaje !== null) {
    actualizarEstadoAutoRefresh(mensaje);
  }
}

function actualizarEstadoSeguimientoGlobal(texto, tipo = "") {
  if (!estadoSeguimientoGlobal) return;

  estadoSeguimientoGlobal.className = "estado-seguimiento-global";
  if (tipo) estadoSeguimientoGlobal.classList.add(tipo);
  estadoSeguimientoGlobal.textContent = texto;
}

function actualizarEstadoAutoRefresh(mensaje = null) {
  const proyectosSeleccionados = obtenerProyectosSeguimientoSeleccionados();
  actualizarContadorSeguimientoCompacto(proyectosSeleccionados.length);

  if (estadoAutoRefresh) {
    estadoAutoRefresh.className = "estado-auto-refresh oculto";
  }

  if (mensaje) {
    const textoCompacto = mensaje.includes("error")
      ? "Seguimiento con alerta. Revisa la conexión o vuelve a intentar."
      : mensaje.includes("revisando")
        ? `Revisando ${proyectosSeleccionados.length} proyecto(s)...`
        : proyectosSeleccionados.length > 0
          ? `${proyectosSeleccionados.length} proyecto(s) seleccionado(s)`
          : "Seguimiento inactivo";

    if (estadoAutoRefresh) estadoAutoRefresh.textContent = textoCompacto;
    actualizarEstadoSeguimientoGlobal(textoCompacto, mensaje.includes("error") ? "advertencia" : "activo");
    return;
  }

  if (!timerAutoRefresh || !proximaActualizacionAutoRefresh) {
    const texto = proyectosSeleccionados.length > 0
      ? `Listo · ${proyectosSeleccionados.length} proyecto(s) seleccionado(s)`
      : "Seguimiento inactivo";

    if (estadoAutoRefresh) estadoAutoRefresh.textContent = texto;
    actualizarEstadoSeguimientoGlobal(texto, proyectosSeleccionados.length > 0 ? "listo" : "");
    return;
  }

  const segundos = Math.max(0, Math.ceil((proximaActualizacionAutoRefresh - Date.now()) / 1000));
  const texto = `Activo · ${proyectosSeleccionados.length} proyecto(s) · próxima revisión en ${segundos}s`;

  if (estadoAutoRefresh) {
    estadoAutoRefresh.textContent = texto;
    estadoAutoRefresh.classList.add("activo");
  }
  actualizarEstadoSeguimientoGlobal(texto, "activo");
}

function actualizarUltimaActualizacionMini(fecha = new Date()) {
  if (!ultimaActualizacionMini) return;

  const hora = fecha.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  ultimaActualizacionMini.textContent = `Última actualización: ${hora}`;
}

function esTaladroAyuda(labelRaw) {
  const label = String(labelRaw || "").trim().toUpperCase();

  if (!label) return false;

  if (label.startsWith("HP")) return true;
  if (label.startsWith("AY") || label.includes("AYUDA")) return true;
  if (/^\d+$/.test(label)) return true;
  if (/^H[-_ ]/.test(label)) return true;

  return false;
}

function obtenerCoordenadaValida(valorPrincipal, valorRespaldo = null) {
  // En OPitBlast, 0 puede ser una coordenada válida. No se debe descartar por ser 0.
  // Solo se considera inválido cuando viene vacío, null, undefined o no numérico.
  const principalTexto = String(valorPrincipal ?? "").trim();

  if (principalTexto !== "") {
    const principal = Number(principalTexto);
    if (Number.isFinite(principal)) return principal;
  }

  const respaldoTexto = String(valorRespaldo ?? "").trim();

  if (respaldoTexto !== "") {
    const respaldo = Number(respaldoTexto);
    if (Number.isFinite(respaldo)) return respaldo;
  }

  return null;
}

function transformarFila(fila) {
  let explosivos = [];
  let pozo = "";

  try {
    explosivos = JSON.parse(fila.EaQ || "[]");
  } catch {
    explosivos = [];
  }

  try {
    pozo = JSON.parse(fila.Po || "[]")[0] || "";
  } catch {
    pozo = fila.Po || "";
  }

  const bulks = explosivos.filter(e =>
    e.mytype === "bulk" && Number(e.qty) > 0
  );

  const boosters = explosivos.filter(e =>
    e.mytype === "booster" && Number(e.qty) > 0
  );

  const bulkPrincipal = bulks.length > 0 ? bulks[0] : null;
  const totalBulk = bulks.reduce((sum, e) => sum + Number(e.qty || 0), 0);
  const totalBoosters = boosters.reduce((sum, e) => sum + Number(e.qty || 0), 0);
  const nombresBulk = bulks.map(e => e.name).join(" + " );

  const chApi = Number(fila.Ch || 0);
  const elApi = Number(fila.El || 0);
  const eliminadoOPit = elApi === 1;

  // Regla importante:
  // Si OPitBlast manda El = 1, el taladro fue eliminado/corregido en OPitBlast.
  // Aunque Ch venga como 1, para el dashboard debe tratarse como POR CARGAR
  // para que no sume en KPIs, mezcla, primas, carga total ni rangos de carguío.
  const cargado = chApi === 1 && !eliminadoOPit;

  const label = String(fila.La || "").trim().toUpperCase();
  const esAyuda = esTaladroAyuda(label);

  // PX/PY pueden ser 0 y seguir siendo coordenadas válidas.
  // Si PX/PY vienen vacíos o inválidos, usamos PBX/PBY como respaldo.
  const px = obtenerCoordenadaValida(fila.PX, fila.PBX);
  const py = obtenerCoordenadaValida(fila.PY, fila.PBY);

  return {
    Estado: cargado ? "CARGADO" : "POR CARGAR",
    Estado_API: chApi === 1 ? "CARGADO" : "POR CARGAR",
    Eliminado_OPit: eliminadoOPit ? "Sí" : "No",
    Clasificacion: esAyuda ? "AYUDA" : "DISEÑO",
    Vista_Ayudas: cargado ? (esAyuda ? "AUXILIAR" : "DISEÑO") : "POR CARGAR",
    Primas: cargado ? totalBoosters : "POR CARGAR",
    Tipo_Mezcla: cargado ? (nombresBulk || "SIN MEZCLA") : "POR CARGAR",
    Ch: cargado ? 1 : 0,
    Ch_API: chApi,
    El: elApi,
    ID: fila.Id,
    BlastID: fila.BId,
    Taladro: fila.Nu,
    Label: label,
    Pozo: pozo,
    PX: px,
    PY: py,
    Longitud: Number(fila.Le || 0),
    Diametro: fila.DiN,
    Carga_Total: cargado ? Number(fila.TE || 0) : 0,
    Bulk: cargado && bulkPrincipal ? bulkPrincipal.name : "",
    Cantidad_Bulk: cargado ? totalBulk : 0,
    _BulksDetalle: cargado ? bulks.map(e => ({
      name: e.name,
      qty: Number(e.qty || 0)
    })) : [],
    Booster: cargado ? boosters.map(e => e.name).join(" + ") : "",
    Cantidad_Booster: cargado ? totalBoosters : 0,
    Tipo: fila.Ty,
    Stemming: fila.STy
  };
}

function transformarDatosApiOPit(data) {
  return (Array.isArray(data) ? data : [])
    .map(fila => transformarFila(fila))
    .filter(fila => !debeExcluirTaladroAuxiliarEliminado(fila));
}

function debeExcluirTaladroAuxiliarEliminado(fila) {
  // Regla operativa:
  // Si una ayuda / taladro no de diseño fue eliminada en OPitBlast (El = 1),
  // se retira completamente del dashboard.
  // No debe aparecer como por cargar, no debe entrar a KPIs, gráficos, resúmenes,
  // tabla detalle, consumo ni seguimiento visual.
  // Para taladros de diseño eliminados se mantiene la lógica anterior:
  // se muestran como POR CARGAR y no suman consumo.
  return Number(fila?.El || 0) === 1 && fila?.Clasificacion === "AYUDA";
}

function crearClaveTaladroConsumo(fila) {
  const id = limpiarParteClave(fila?.ID);
  const label = limpiarParteClave(fila?.Label);
  const taladro = limpiarParteClave(fila?.Taladro);

  const pxValor = obtenerCoordenadaValida(fila?.PX);
  const pyValor = obtenerCoordenadaValida(fila?.PY);

  const px = Number.isFinite(pxValor) ? `PX${pxValor.toFixed(3)}` : "PXNA";
  const py = Number.isFinite(pyValor) ? `PY${pyValor.toFixed(3)}` : "PYNA";

  return [
    id || "NOID",
    label || "NOLABEL",
    taladro || "NOTALADRO",
    px,
    py
  ].join("_");
}

function actualizarDashboardAnalitico() {
  const dataAnalitica = obtenerDataAnaliticaActual();

  construirTabla(dataAnalitica);
  actualizarKpis(dataAnalitica);
  construirResumenes(dataAnalitica);
  actualizarTextoFiltroAnalitico(dataAnalitica);
  actualizarConsumoSiVisible();
}

function obtenerDataAnaliticaActual() {
  if (vistaActual !== "rangos" || filtroRangoActivo === "TODO") {
    return dataActual;
  }

  const dataConRangos = enriquecerDataVistaRangosCarga(dataActual);

  return dataConRangos.filter(fila =>
    fila.Estado === "CARGADO" &&
    fila.Vista_Rangos_Carga === filtroRangoActivo
  );
}

function actualizarTextoFiltroAnalitico(dataAnalitica) {
  if (!estadoFiltroRango) return;

  if (vistaActual !== "rangos" || filtroRangoActivo === "TODO") {
    estadoFiltroRango.textContent = "Filtro activo: Todo el proyecto";
    return;
  }

  const total = dataAnalitica.length;
  const auxiliares = dataAnalitica.filter(f => f.Clasificacion === "AYUDA").length;
  const carga = dataAnalitica.reduce((sum, f) => sum + Number(f.Carga_Total || 0), 0);

  estadoFiltroRango.textContent =
    `Filtro activo: ${filtroRangoActivo} · ${total} taladros cargados · ${auxiliares} auxiliares · ${carga.toLocaleString("es-PE", { maximumFractionDigits: 2 })} kg`;
}

function actualizarBotonesFiltroRango() {
  botonesFiltroRango.forEach(btn => {
    btn.classList.toggle("activo", btn.dataset.filtroRango === filtroRangoActivo);
  });

  if (estadoFiltroRango) {
    estadoFiltroRango.textContent =
      filtroRangoActivo === "TODO"
        ? "Filtro activo: Todo el proyecto"
        : `Filtro activo: ${filtroRangoActivo}`;
  }
}

function construirGrafico2D(data, vista, opciones = {}) {
  limpiarGrafico();

  const { mantenerRango = true, zoomToLabel = null } = opciones;

  let campo;
  let titulo;
  let dataFuente = [...data];

  if (vista === "estado") {
    campo = "Estado";
    titulo = "Estado de carguío";
  } else if (vista === "primas") {
    campo = "Primas";
    titulo = "Cantidad de primas / boosters";
  } else if (vista === "ayudas") {
    campo = "Vista_Ayudas";
    titulo = "Ayudas";
  } else if (vista === "rangos") {
    dataFuente = enriquecerDataVistaRangosCarga(dataFuente);
    campo = "Vista_Rangos_Carga";
    titulo = "Rangos manuales de carguío";
  } else {
    campo = "Tipo_Mezcla";
    titulo = "Tipo de mezcla";
  }

  tituloGrafico.textContent = titulo;

  const dataLimpia = dataFuente.filter(d =>
    Number.isFinite(d.PX) &&
    Number.isFinite(d.PY)
  );

  if (dataLimpia.length === 0) return;

  const dataOrdenada = ordenarCategoriasParaGrafico(dataLimpia, campo);
  const categorias = obtenerCategoriasSegunVista(dataOrdenada, campo, vista);

  const coloresPorVista = {
    estado: {
      "POR CARGAR": "#cfcfcf",
      "CARGADO": "#ff7f0e"
    },
    ayudas: {
      "POR CARGAR": "#cfcfcf",
      "AUXILIAR": "#e30613",
      "DISEÑO": "#1f77b4"
    },
    rangos: {
      "POR CARGAR": "#cfcfcf",
      "Rango 1": "#ef4444",
      "Rango 2": "#3b82f6",
      "Rango 3": "#22c55e",
      "Rango 4": "#8b5cf6",
      "FUERA DE RANGO": "#f59e0b",
      "CARGADO SIN FECHA": "#94a3b8"
    }
  };

  const paleta = [
    "#ff7f0e",
    "#2ca02c",
    "#9467bd",
    "#1f77b4",
    "#8c564b",
    "#17becf",
    "#bcbd22",
    "#d62728",
    "#7f7f7f"
  ];

  const trazas = [];

  categorias.forEach((categoria, index) => {
    const puntos = dataOrdenada.filter(d => String(d[campo] ?? "SIN DATO") === categoria);
    const esPorCargar = categoria === "POR CARGAR";

    let colorCategoria = paleta[index % paleta.length];

    if (vista === "estado" && coloresPorVista.estado[categoria]) {
      colorCategoria = coloresPorVista.estado[categoria];
    }

    if (vista === "ayudas" && coloresPorVista.ayudas[categoria]) {
      colorCategoria = coloresPorVista.ayudas[categoria];
    }

    if (vista === "rangos" && coloresPorVista.rangos[categoria]) {
      colorCategoria = coloresPorVista.rangos[categoria];
    }

    if ((vista === "primas" || vista === "mezcla") && esPorCargar) {
      colorCategoria = "#cfcfcf";
    }

    trazas.push({
      type: "scattergl",
      mode: "markers",
      name: categoria,
      x: puntos.map(d => d.PX),
      y: puntos.map(d => d.PY),
      customdata: puntos.map(d => [
        d.Label,
        d.Estado,
        d.Clasificacion,
        d.Primas,
        d.Tipo_Mezcla,
        d.Bulk,
        d.Carga_Total,
        d.Fecha_Cargado_Detectada || "",
        d[campo] || ""
      ]),
      marker: {
        size: esPorCargar ? 7 : 8,
        opacity: esPorCargar ? 0.65 : 0.92,
        color: colorCategoria,
        line: {
          width: esPorCargar ? 1 : 1.2,
          color: esPorCargar ? "#8a8a8a" : "#ffffff"
        }
      },
      hovertemplate:
        "Estado: %{customdata[1]}<br>" +
        "Clasificación: %{customdata[2]}<br>" +
        "Primas: %{customdata[3]}<br>" +
        "Mezcla: %{customdata[4]}<br>" +
        "Carga: %{customdata[6]:,.2f} kg<br>" +
        "Fecha de carga: %{customdata[7]}" +
        "<extra></extra>"
    });
  });

  const xs = dataOrdenada.map(d => d.PX);
  const ys = dataOrdenada.map(d => d.PY);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const rangoX = maxX - minX || 1;
  const rangoY = maxY - minY || 1;

  const padX = rangoX * 0.08;
  const padY = rangoY * 0.08;

  rangoBaseGrafico = {
    x: [minX - padX, maxX + padX],
    y: [minY - padY, maxY + padY]
  };

  const indiceTraceLabels = trazas.length;

  trazas.push({
    type: "scatter",
    mode: "text",
    name: "Labels",
    x: dataOrdenada.map(d => d.PX),
    y: dataOrdenada.map(d => d.PY),
    text: construirTextosLabels(dataOrdenada),
    customdata: dataOrdenada.map(d => d.Label),
    textposition: "top center",
    textfont: {
      size: 9,
      color: "#111111",
      family: "Arial, sans-serif"
    },
    hoverinfo: "skip",
    showlegend: false
  });

  if (labelSeleccionado) {
    const seleccionado = dataOrdenada.find(d => d.Label === labelSeleccionado);

    if (seleccionado) {
      trazas.push({
        type: "scatter",
        mode: "markers",
        name: "Seleccionado",
        x: [seleccionado.PX],
        y: [seleccionado.PY],
        customdata: [seleccionado.Label],
        marker: {
          size: 22,
          color: "rgba(227, 6, 19, 0.10)",
          line: {
            width: 4,
            color: "#e30613"
          },
          symbol: "circle-open"
        },
        hovertemplate:
          "<b>%{customdata}</b><br>" +
          "Taladro seleccionado<extra></extra>",
        showlegend: false
      });
    }
  }

  let rangoInicial = rangoBaseGrafico;

  if (zoomToLabel) {
    rangoInicial = obtenerRangoZoomLabel(zoomToLabel, dataOrdenada) || rangoBaseGrafico;
  } else if (mantenerRango && ultimoRangoGrafico) {
    rangoInicial = ultimoRangoGrafico;
  }

  const layout = {
    margin: { l: 40, r: 20, b: 35, t: 20 },
    showlegend: true,
    legend: {
      orientation: "h",
      x: 0,
      y: 1.08,
      font: {
        size: 11,
        color: "#10233f"
      }
    },
    xaxis: {
      visible: true,
      showgrid: true,
      gridcolor: "#e5e7eb",
      zeroline: false,
      showticklabels: false,
      range: [...rangoInicial.x],
      scaleanchor: "y",
      scaleratio: 1
    },
    yaxis: {
      visible: true,
      showgrid: true,
      gridcolor: "#e5e7eb",
      zeroline: false,
      showticklabels: false,
      range: [...rangoInicial.y]
    },
    dragmode: "pan",
    hovermode: "closest",
    plot_bgcolor: "white",
    paper_bgcolor: "white"
  };

  const config = {
    responsive: true,
    displaylogo: false,
    scrollZoom: true,
    modeBarButtonsToRemove: [
      "select2d",
      "lasso2d",
      "autoScale2d",
      "toggleSpikelines"
    ]
  };

  Plotly.newPlot("grafico2D", trazas, layout, config).then(grafico => {
    ultimoRangoGrafico = leerRangosActualesGrafico(grafico);

    if (typeof grafico.removeAllListeners === "function") {
      grafico.removeAllListeners("plotly_click");
      grafico.removeAllListeners("plotly_relayout");
      grafico.removeAllListeners("plotly_doubleclick");
    }

    actualizarEtiquetasPorZoom(grafico, dataOrdenada, indiceTraceLabels);

    grafico.on("plotly_click", function(eventData) {
      const punto = eventData.points[0];

      let label = null;

      if (Array.isArray(punto.customdata)) {
        label = punto.customdata[0];
      } else {
        label = punto.customdata || punto.text;
      }

      if (label) {
        seleccionarLabel(label, {
          autoScroll: true,
          zoomGrafico: false
        });
      }
    });

    grafico.on("plotly_relayout", function() {
      ultimoRangoGrafico = leerRangosActualesGrafico(grafico);
      actualizarEtiquetasPorZoom(grafico, dataOrdenada, indiceTraceLabels);
    });
  });
}

function construirTextosLabels(data) {
  return data.map(d => {
    if (d.Label === labelSeleccionado) {
      return `<b>${d.Label}</b>`;
    }
    return d.Label;
  });
}

function leerRangosActualesGrafico(grafico) {
  if (!grafico?.layout?.xaxis?.range || !grafico?.layout?.yaxis?.range) return null;

  return {
    x: [
      Number(grafico.layout.xaxis.range[0]),
      Number(grafico.layout.xaxis.range[1])
    ],
    y: [
      Number(grafico.layout.yaxis.range[0]),
      Number(grafico.layout.yaxis.range[1])
    ]
  };
}

function calcularFactorZoom(grafico) {
  if (!rangoBaseGrafico) return 1;

  const rangosActuales = leerRangosActualesGrafico(grafico);
  if (!rangosActuales) return 1;

  const anchoBase = Math.abs(rangoBaseGrafico.x[1] - rangoBaseGrafico.x[0]) || 1;
  const altoBase = Math.abs(rangoBaseGrafico.y[1] - rangoBaseGrafico.y[0]) || 1;

  const anchoActual = Math.abs(rangosActuales.x[1] - rangosActuales.x[0]) || 1;
  const altoActual = Math.abs(rangosActuales.y[1] - rangosActuales.y[0]) || 1;

  const factorX = anchoBase / anchoActual;
  const factorY = altoBase / altoActual;

  return Math.max(factorX, factorY, 1);
}

function actualizarEtiquetasPorZoom(grafico, dataOrdenada, indiceTraceLabels) {
  const factorZoom = calcularFactorZoom(grafico);

  const incremento = factorZoom <= 1
    ? 0
    : Math.min(7, Math.log2(factorZoom) * 1.4);

  const tamanoBase = 8.5 + incremento;

  const tamanos = dataOrdenada.map(d => {
    if (d.Label === labelSeleccionado) {
      return Math.min(tamanoBase + 2, 20);
    }
    return Math.min(tamanoBase, 18);
  });

  Plotly.restyle(
    grafico,
    {
      text: [construirTextosLabels(dataOrdenada)],
      "textfont.size": [tamanos]
    },
    [indiceTraceLabels]
  );
}

function obtenerRangoZoomLabel(label, dataOrdenada) {
  const punto = dataOrdenada.find(d => d.Label === label);
  if (!punto || !rangoBaseGrafico) return null;

  const anchoBase = Math.abs(rangoBaseGrafico.x[1] - rangoBaseGrafico.x[0]) || 1;
  const altoBase = Math.abs(rangoBaseGrafico.y[1] - rangoBaseGrafico.y[0]) || 1;

  const anchoZoom = anchoBase * 0.18;
  const altoZoom = altoBase * 0.18;

  return {
    x: [punto.PX - anchoZoom / 2, punto.PX + anchoZoom / 2],
    y: [punto.PY - altoZoom / 2, punto.PY + altoZoom / 2]
  };
}

function ordenarCategoriasParaGrafico(data, campo) {
  return [...data].sort((a, b) => {
    const av = String(a[campo] ?? "");
    const bv = String(b[campo] ?? "");

    if (av === "POR CARGAR") return -1;
    if (bv === "POR CARGAR") return 1;

    return av.localeCompare(bv, "es", { numeric: true });
  });
}

function construirResumenes(data) {
  const resumenBulk = {};

  data
    .filter(fila => fila.Estado === "CARGADO")
    .forEach(fila => {
      const nombre = fila.Tipo_Mezcla || "SIN MEZCLA";
      resumenBulk[nombre] = (resumenBulk[nombre] || 0) + Number(fila.Cantidad_Bulk || 0);
    });

  tbodyResumenBulk.innerHTML = "";

  Object.entries(resumenBulk).forEach(([nombre, cantidad]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nombre}</td>
      <td>${cantidad.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    `;
    tbodyResumenBulk.appendChild(tr);
  });

  const resumenLabel = {};

  data.forEach(fila => {
    const label = fila.Label || "SIN LABEL";
    resumenLabel[label] = (resumenLabel[label] || 0) + Number(fila.Carga_Total || 0);
  });

  tbodyResumenLabel.innerHTML = "";

  Object.entries(resumenLabel)
    .sort((a, b) => String(a[0]).localeCompare(String(b[0]), "es", { numeric: true }))
    .forEach(([label, carga]) => {
      const tr = document.createElement("tr");
      tr.dataset.label = label;
      tr.innerHTML = `
        <td>${label}</td>
        <td>${carga.toLocaleString("es-PE", { maximumFractionDigits: 2 })}</td>
      `;
      tr.addEventListener("click", () => {
        seleccionarLabel(label, {
          autoScroll: true,
          zoomGrafico: true
        });
      });
      tbodyResumenLabel.appendChild(tr);
    });
}

function construirTabla(data) {
  limpiarTabla();

  dataTablaDetalleBase = Array.isArray(data) ? [...data] : [];
  const columnasVisibles = COLUMNAS_TABLA_DETALLE;

  sanitizarFiltrosTablaDetalle(dataTablaDetalleBase, columnasVisibles);
  construirEncabezadoTablaConFiltros(dataTablaDetalleBase, columnasVisibles);

  const dataFiltrada = aplicarFiltrosTablaDetalle(dataTablaDetalleBase, columnasVisibles);
  const dataOrdenada = ordenarDataTablaDetalle(dataFiltrada, columnasVisibles);
  actualizarBotonLimpiarFiltrosTabla();

  if (!dataOrdenada || dataOrdenada.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.textContent = dataTablaDetalleBase.length === 0
      ? "Sin datos para el filtro seleccionado"
      : "Sin resultados con los filtros aplicados";
    td.colSpan = columnasVisibles.length;
    td.classList.add("celda-sin-datos");
    tr.appendChild(td);
    body.appendChild(tr);
    return;
  }

  dataOrdenada.forEach(fila => {
    const tr = document.createElement("tr");
    tr.dataset.label = fila.Label;

    if (fila.Clasificacion === "AYUDA") {
      tr.classList.add("fila-ayuda");
    } else if (fila.Estado === "CARGADO") {
      tr.classList.add("fila-cargado");
    } else {
      tr.classList.add("fila-pendiente");
    }

    tr.addEventListener("click", () => {
      seleccionarLabel(fila.Label, {
        autoScroll: true,
        zoomGrafico: true
      });
    });

    columnasVisibles.forEach(col => {
      const td = document.createElement("td");
      td.textContent = formatearValorTabla(fila[col.campo], col);

      if (col.tipo === "numero") {
        td.classList.add("td-numero");
      }

      tr.appendChild(td);
    });

    body.appendChild(tr);
  });
}

function sanitizarFiltrosTablaDetalle(data, columnas) {
  const camposValidos = new Set(columnas.map(col => col.campo));

  Object.keys(filtrosTablaDetalle).forEach(campo => {
    if (!camposValidos.has(campo)) {
      delete filtrosTablaDetalle[campo];
      return;
    }

    const col = columnas.find(c => c.campo === campo) || { campo };
    const valoresValidos = new Set(data.map(fila => normalizarValorFiltro(fila[campo], col)));

    if (!valoresValidos.has(filtrosTablaDetalle[campo])) {
      delete filtrosTablaDetalle[campo];
    }
  });
}


function cambiarOrdenTablaDetalle(campo) {
  if (ordenTablaDetalle.campo === campo) {
    ordenTablaDetalle.direccion = ordenTablaDetalle.direccion === "asc" ? "desc" : "asc";
  } else {
    ordenTablaDetalle.campo = campo;
    ordenTablaDetalle.direccion = "asc";
  }

  construirTabla(dataTablaDetalleBase);
}

function ordenarDataTablaDetalle(data, columnas) {
  if (!ordenTablaDetalle.campo) return data;

  const col = columnas.find(c => c.campo === ordenTablaDetalle.campo) || { campo: ordenTablaDetalle.campo };
  const direccion = ordenTablaDetalle.direccion === "desc" ? -1 : 1;

  return [...data].sort((a, b) => compararValoresTabla(a[col.campo], b[col.campo], col) * direccion);
}

function compararValoresTabla(a, b, col = {}) {
  const av = a ?? "";
  const bv = b ?? "";

  if (col.tipo === "numero") {
    const an = Number(av || 0);
    const bn = Number(bv || 0);
    return an - bn;
  }

  if (col.campo === "Fecha_Cargado_Detectada") {
    const ad = parsearFechaTablaDetalle(av);
    const bd = parsearFechaTablaDetalle(bv);

    if (ad && bd) return ad - bd;
    if (ad && !bd) return -1;
    if (!ad && bd) return 1;
  }

  return String(av).localeCompare(String(bv), "es", { numeric: true, sensitivity: "base" });
}

function parsearFechaTablaDetalle(valor) {
  if (!valor) return null;

  const texto = String(valor).trim()
    .replace("a. m.", "AM")
    .replace("p. m.", "PM")
    .replace("a.m.", "AM")
    .replace("p.m.", "PM");

  const match = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) {
    const fechaDirecta = new Date(texto);
    return isNaN(fechaDirecta) ? null : fechaDirecta;
  }

  let [, dd, mm, yyyy, hh, min, ss, ampm] = match;
  let hora = Number(hh);

  if (ampm) {
    const periodo = ampm.toUpperCase();
    if (periodo === "PM" && hora < 12) hora += 12;
    if (periodo === "AM" && hora === 12) hora = 0;
  }

  const fecha = new Date(Number(yyyy), Number(mm) - 1, Number(dd), hora, Number(min), Number(ss || 0));
  return isNaN(fecha) ? null : fecha;
}

function obtenerDataTablaDetalleExportable() {
  const columnasVisibles = COLUMNAS_TABLA_DETALLE;
  const dataFiltrada = aplicarFiltrosTablaDetalle(dataTablaDetalleBase, columnasVisibles);
  return ordenarDataTablaDetalle(dataFiltrada, columnasVisibles);
}

function exportarTablaDetalleExcel() {
  const columnasVisibles = COLUMNAS_TABLA_DETALLE;
  const dataExportar = obtenerDataTablaDetalleExportable();

  if (!dataExportar || dataExportar.length === 0) {
    alert("No hay datos para exportar con los filtros actuales.");
    return;
  }

  const filasHtml = dataExportar.map(fila => {
    const celdas = columnasVisibles.map(col => {
      const valor = formatearValorTabla(fila[col.campo], col);
      return `<td>${escapeHtmlExcel(valor)}</td>`;
    }).join("");
    return `<tr>${celdas}</tr>`;
  }).join("");

  const encabezados = columnasVisibles
    .map(col => `<th>${escapeHtmlExcel(col.titulo)}</th>`)
    .join("");

  const html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; }
          th { background: #f1f5f9; font-weight: bold; }
          th, td { border: 1px solid #d9e0ea; padding: 6px 8px; }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>${encabezados}</tr></thead>
          <tbody>${filasHtml}</tbody>
        </table>
      </body>
    </html>`;

  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  const fecha = new Date().toISOString().slice(0, 10);

  enlace.href = url;
  enlace.download = `detalle_taladros_${fecha}.xls`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}

function escapeHtmlExcel(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function construirEncabezadoTablaConFiltros(data, columnas) {
  const filaTitulos = document.createElement("tr");
  const filaFiltros = document.createElement("tr");
  filaFiltros.classList.add("fila-filtros-tabla");

  columnas.forEach(col => {
    const thTitulo = document.createElement("th");
    thTitulo.className = "th-ordenable";
    thTitulo.title = "Ordenar columna";

    const btnOrden = document.createElement("button");
    btnOrden.type = "button";
    btnOrden.className = "btnOrdenColumna";
    btnOrden.dataset.campo = col.campo;

    const indicador = ordenTablaDetalle.campo === col.campo
      ? (ordenTablaDetalle.direccion === "asc" ? " ▲" : " ▼")
      : " ↕";

    btnOrden.textContent = `${col.titulo}${indicador}`;
    btnOrden.addEventListener("click", event => {
      event.stopPropagation();
      cambiarOrdenTablaDetalle(col.campo);
    });

    thTitulo.appendChild(btnOrden);
    filaTitulos.appendChild(thTitulo);

    const thFiltro = document.createElement("th");
    const select = document.createElement("select");
    select.className = "filtro-tabla";
    select.dataset.campo = col.campo;

    const optionTodos = document.createElement("option");
    optionTodos.value = "";
    optionTodos.textContent = "Todos";
    select.appendChild(optionTodos);

    obtenerValoresUnicosFiltro(data, col).forEach(valor => {
      const option = document.createElement("option");
      option.value = valor.valorFiltro;
      option.textContent = valor.texto;
      select.appendChild(option);
    });

    select.value = filtrosTablaDetalle[col.campo] || "";
    select.addEventListener("click", event => event.stopPropagation());
    select.addEventListener("change", () => {
      const valor = select.value;

      if (valor) {
        filtrosTablaDetalle[col.campo] = valor;
      } else {
        delete filtrosTablaDetalle[col.campo];
      }

      construirTabla(dataTablaDetalleBase);
    });

    thFiltro.appendChild(select);
    filaFiltros.appendChild(thFiltro);
  });

  head.appendChild(filaTitulos);
  head.appendChild(filaFiltros);
}

function obtenerValoresUnicosFiltro(data, col) {
  const mapa = new Map();

  data.forEach(fila => {
    const valorFiltro = normalizarValorFiltro(fila[col.campo], col);
    const texto = formatearValorTabla(fila[col.campo], col) || "(Vacío)";

    if (!mapa.has(valorFiltro)) {
      mapa.set(valorFiltro, texto);
    }
  });

  return [...mapa.entries()]
    .map(([valorFiltro, texto]) => ({ valorFiltro, texto }))
    .sort((a, b) => a.texto.localeCompare(b.texto, "es", { numeric: true }));
}

function aplicarFiltrosTablaDetalle(data, columnas) {
  const filtrosActivos = Object.entries(filtrosTablaDetalle).filter(([, valor]) => valor !== "");

  if (filtrosActivos.length === 0) return data;

  return data.filter(fila =>
    filtrosActivos.every(([campo, valorFiltro]) => {
      const col = columnas.find(c => c.campo === campo) || { campo };
      return normalizarValorFiltro(fila[campo], col) === valorFiltro;
    })
  );
}

function normalizarValorFiltro(valor, col = {}) {
  if (valor === null || valor === undefined || valor === "") return "__VACIO__";

  if (col.tipo === "numero") {
    const numero = Number(valor || 0);
    return Number.isFinite(numero) ? String(Number(numero.toFixed(4))) : String(valor);
  }

  return String(valor);
}

function formatearValorTabla(valor, col = {}) {
  if (valor === null || valor === undefined || valor === "") return "";

  if (col.tipo === "numero") {
    return Number(valor || 0).toLocaleString("es-PE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  return String(valor);
}

function actualizarBotonLimpiarFiltrosTabla() {
  if (!btnLimpiarFiltrosTabla) return;

  const cantidadFiltros = Object.keys(filtrosTablaDetalle).length;
  btnLimpiarFiltrosTabla.textContent = cantidadFiltros > 0
    ? `Limpiar filtros (${cantidadFiltros})`
    : "Limpiar filtros";
  btnLimpiarFiltrosTabla.disabled = cantidadFiltros === 0;
  btnLimpiarFiltrosTabla.classList.toggle("sin-filtros", cantidadFiltros === 0);
}

function aplicarResaltadoTablas(label) {
  document.querySelectorAll("[data-label]").forEach(el => {
    el.classList.toggle("fila-seleccionada", el.dataset.label === label);
  });
}

function desplazarTablasASeleccion(label) {
  const filaResumen = Array.from(tbodyResumenLabel.querySelectorAll("tr[data-label]"))
    .find(el => el.dataset.label === label);

  const filaDetalle = Array.from(body.querySelectorAll("tr[data-label]"))
    .find(el => el.dataset.label === label);

  if (filaResumen) {
    moverScrollInterno(filaResumen, ".scroll-tabla");
  }

  if (filaDetalle) {
    moverScrollInterno(filaDetalle, ".tabla-detalle");
  }
}

function moverScrollInterno(fila, selectorContenedor) {
  const contenedor = fila.closest(selectorContenedor);

  if (!contenedor) return;

  const topFila = fila.offsetTop;
  const altoFila = fila.offsetHeight;
  const altoContenedor = contenedor.clientHeight;

  const nuevaPosicion = topFila - altoContenedor / 2 + altoFila / 2;

  contenedor.scrollTo({
    top: Math.max(nuevaPosicion, 0),
    behavior: "smooth"
  });
}

function seleccionarLabel(label, opciones = {}) {
  const {
    autoScroll = true,
    zoomGrafico = false
  } = opciones;

  labelSeleccionado = label;

  aplicarResaltadoTablas(label);

  if (autoScroll) {
    desplazarTablasASeleccion(label);
  }

  construirGrafico2D(dataActual, vistaActual, {
    mantenerRango: !zoomGrafico,
    zoomToLabel: zoomGrafico ? label : null
  });
}

function actualizarKpis(data) {
  const total = data.length;
  const cargados = data.filter(fila => fila.Estado === "CARGADO").length;
  const pendientes = data.filter(fila => fila.Estado === "POR CARGAR").length;
  const ayudas = data.filter(fila => fila.Clasificacion === "AYUDA").length;

  const cargaTotal = data
    .filter(fila => fila.Estado === "CARGADO")
    .reduce((sum, fila) => sum + Number(fila.Carga_Total || 0), 0);

  kpiTotal.textContent = total;
  kpiCargados.textContent = cargados;
  kpiPendientes.textContent = pendientes;
  kpiAyudas.textContent = ayudas;
  kpiCargaTotal.textContent = `${cargaTotal.toLocaleString("es-PE", { maximumFractionDigits: 2 })} kg`;
}

function limpiarTabla() {
  head.innerHTML = "";
  body.innerHTML = "";
}

function limpiarKpis() {
  kpiTotal.textContent = "0";
  kpiCargados.textContent = "0";
  kpiPendientes.textContent = "0";
  kpiAyudas.textContent = "0";
  kpiCargaTotal.textContent = "0 kg";
}

function limpiarGrafico() {
  const grafico = document.getElementById("grafico2D");
  if (grafico) {
    Plotly.purge("grafico2D");
  }
}

function limpiarResumenes() {
  tbodyResumenBulk.innerHTML = "";
  tbodyResumenLabel.innerHTML = "";
}

/* =========================================================
   HISTORIAL LOCAL: respaldo temporal si Supabase no está configurado
   ========================================================= */
function cargarHistorialCargaLocal() {
  try {
    return JSON.parse(localStorage.getItem(HISTORIAL_CARGA_KEY) || "{}");
  } catch {
    return {};
  }
}

function guardarHistorialCargaLocal(historial) {
  localStorage.setItem(HISTORIAL_CARGA_KEY, JSON.stringify(historial));
}

function aplicarHistorialCargaLocal(data, blastId) {
  const historial = cargarHistorialCargaLocal();
  const ahora = new Date();
  const ahoraISO = ahora.toISOString();
  const ahoraTexto = formatearFechaHora(ahora);

  const dataConHistorial = data.map(fila => {
    const clave = crearClaveTaladro(fila, blastId);
    const chActual = Number(fila.Ch);
    const estaCargado = chActual === 1;

    if (!historial[clave]) {
      historial[clave] = {
        blastId: blastId,
        id: fila.ID,
        label: fila.Label,
        taladro: fila.Taladro,
        ultimoCh: chActual,
        fechaInicioSeguimientoISO: ahoraISO,
        fechaInicioSeguimientoTexto: ahoraTexto,
        fechaCargaDetectadaISO: estaCargado ? ahoraISO : null,
        fechaCargaDetectadaTexto: estaCargado ? ahoraTexto : "",
        metodoFechaCarga: estaCargado
          ? "Ya cargado al iniciar seguimiento"
          : "Pendiente"
      };
    } else {
      const registro = historial[clave];
      const chAnterior = Number(registro.ultimoCh);

      if (chAnterior !== 1 && chActual === 1 && !registro.fechaCargaDetectadaISO) {
        registro.fechaCargaDetectadaISO = ahoraISO;
        registro.fechaCargaDetectadaTexto = ahoraTexto;
        registro.metodoFechaCarga = "Cambio detectado de Ch=0 a Ch=1";
      }

      registro.ultimoCh = chActual;
      registro.ultimaRevisionISO = ahoraISO;
      registro.ultimaRevisionTexto = ahoraTexto;
      registro.label = fila.Label;
      registro.taladro = fila.Taladro;
      registro.id = fila.ID;
    }

    const registroFinal = historial[clave];

    return {
      ...fila,
      Fecha_Cargado_Detectada: estaCargado
        ? registroFinal.fechaCargaDetectadaTexto || ""
        : "",
      _Fecha_Cargado_Detectada_ISO: estaCargado
        ? registroFinal.fechaCargaDetectadaISO || ""
        : "",
      Metodo_Fecha_Carga: estaCargado
        ? registroFinal.metodoFechaCarga || ""
        : "Pendiente",
      Ultima_Revision_Dashboard: ahoraTexto
    };
  });

  guardarHistorialCargaLocal(historial);

  return dataConHistorial;
}

/* =========================================================
   HISTORIAL SUPABASE: fuente central compartida
   ========================================================= */
function limpiarParteClave(valor) {
  return String(valor ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9_.-]/g, "");
}

function crearClaveTaladro(fila, blastId) {
  const id = limpiarParteClave(fila.ID);
  const label = limpiarParteClave(fila.Label);
  const taladro = limpiarParteClave(fila.Taladro);

  const pxValor = obtenerCoordenadaValida(fila.PX);
  const pyValor = obtenerCoordenadaValida(fila.PY);

  const px = Number.isFinite(pxValor)
    ? `PX${pxValor.toFixed(3)}`
    : "PXNA";

  const py = Number.isFinite(pyValor)
    ? `PY${pyValor.toFixed(3)}`
    : "PYNA";

  const partes = [
    limpiarParteClave(blastId),
    id || "NOID",
    label || "NOLABEL",
    taladro || "NOTALADRO",
    px,
    py
  ];

  return partes.join("_");
}

function formatearFechaHora(fecha) {
  return fecha.toLocaleString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function formatearFechaHoraDesdeISO(iso) {
  if (!iso) return "";
  const fecha = new Date(iso);
  if (!(fecha instanceof Date) || isNaN(fecha)) return "";
  return formatearFechaHora(fecha);
}

function convertirISOAInputDatetimeLocal(iso) {
  if (!iso) return "";
  const fecha = new Date(iso);
  if (!(fecha instanceof Date) || isNaN(fecha)) return "";

  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  const hh = String(fecha.getHours()).padStart(2, "0");
  const mi = String(fecha.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function convertirInputDatetimeLocalAISO(valor) {
  if (!valor) return null;
  const fecha = new Date(valor);
  if (!(fecha instanceof Date) || isNaN(fecha)) return null;
  return fecha.toISOString();
}

async function obtenerHistorialSupabase(blastId) {
  if (!supabaseClient) return [];

  const { data, error } = await supabaseClient
    .from(SUPABASE_TABLE)
    .select("*")
    .eq("blast_id", String(blastId));

  if (error) throw new Error("Supabase select: " + error.message);

  return Array.isArray(data) ? data : [];
}

async function upsertHistorialSupabase(registros) {
  if (!supabaseClient || registros.length === 0) return;

  const { error } = await supabaseClient
    .from(SUPABASE_TABLE)
    .upsert(registros, { onConflict: "clave" });

  if (error) throw new Error("Supabase upsert: " + error.message);
}

function crearRegistroSupabaseDesdeFila(fila, blastId, ahoraISO, ahoraTexto) {
  const chActual = Number(fila.Ch);
  const estaCargado = chActual === 1;
  const fechaCargaISO = estaCargado ? ahoraISO : null;
  const fechaCargaTexto = estaCargado ? ahoraTexto : "";

  return {
    clave: crearClaveTaladro(fila, blastId),
    blast_id: String(blastId),
    taladro_id: fila.ID ? String(fila.ID) : null,
    label: fila.Label || "",
    taladro: fila.Taladro ? String(fila.Taladro) : "",
    ultimo_ch: chActual,
    fecha_inicio_seguimiento: ahoraISO,
    fecha_inicio_seguimiento_texto: ahoraTexto,
    fecha_carga_detectada: fechaCargaISO,
    fecha_carga_detectada_texto: fechaCargaTexto,
    metodo_fecha_carga: estaCargado ? "Ya cargado al iniciar seguimiento" : "Pendiente",
    ultima_revision: ahoraISO,
    ultima_revision_texto: ahoraTexto,
    editado_manualmente: false,
    comentario_edicion: "",
    updated_at: ahoraISO
  };
}

function actualizarRegistroSupabaseDesdeFila(registro, fila, ahoraISO, ahoraTexto) {
  const chAnterior = Number(registro.ultimo_ch);
  const chActual = Number(fila.Ch);
  const estaCargado = chActual === 1;

  const salida = {
    ...registro,
    taladro_id: fila.ID ? String(fila.ID) : registro.taladro_id,
    label: fila.Label || registro.label || "",
    taladro: fila.Taladro ? String(fila.Taladro) : registro.taladro || "",
    ultimo_ch: chActual,
    ultima_revision: ahoraISO,
    ultima_revision_texto: ahoraTexto,
    updated_at: ahoraISO
  };

  if (chAnterior !== 1 && estaCargado && !registro.fecha_carga_detectada) {
    salida.fecha_carga_detectada = ahoraISO;
    salida.fecha_carga_detectada_texto = ahoraTexto;
    salida.metodo_fecha_carga = "Cambio detectado de Ch=0 a Ch=1";
  }

  if (!estaCargado && !salida.metodo_fecha_carga) {
    salida.metodo_fecha_carga = "Pendiente";
  }

  return salida;
}

async function aplicarHistorialCargaSupabase(data, blastId) {
  const historial = await obtenerHistorialSupabase(blastId);
  const historialPorClave = new Map(historial.map(registro => [registro.clave, registro]));

  const ahora = new Date();
  const ahoraISO = ahora.toISOString();
  const ahoraTexto = formatearFechaHora(ahora);

  const registrosPorClaveParaGuardar = new Map();
  const registrosFinalesPorClave = new Map();

  data.forEach(fila => {
    const clave = crearClaveTaladro(fila, blastId);
    const registroExistente = historialPorClave.get(clave) || registrosPorClaveParaGuardar.get(clave);

    const registroFinal = registroExistente
      ? actualizarRegistroSupabaseDesdeFila(registroExistente, fila, ahoraISO, ahoraTexto)
      : crearRegistroSupabaseDesdeFila(fila, blastId, ahoraISO, ahoraTexto);

    registrosPorClaveParaGuardar.set(clave, registroFinal);
    registrosFinalesPorClave.set(clave, registroFinal);
  });

  await upsertHistorialSupabase(Array.from(registrosPorClaveParaGuardar.values()));

  historialActualSupabase = Array.from(registrosFinalesPorClave.values());

  return data.map(fila => {
    const clave = crearClaveTaladro(fila, blastId);
    const registro = registrosFinalesPorClave.get(clave);
    const estaCargado = Number(fila.Ch) === 1;

    const fechaISO = registro?.fecha_carga_detectada || "";
    const fechaTexto = registro?.fecha_carga_detectada_texto || formatearFechaHoraDesdeISO(fechaISO);

    return {
      ...fila,
      Fecha_Cargado_Detectada: estaCargado ? fechaTexto : "",
      _Fecha_Cargado_Detectada_ISO: estaCargado ? fechaISO : "",
      Metodo_Fecha_Carga: estaCargado ? (registro?.metodo_fecha_carga || "") : "Pendiente",
      Ultima_Revision_Dashboard: ahoraTexto,
      Editado_Manualmente: registro?.editado_manualmente ? "Sí" : "No",
      Comentario_Edicion: registro?.comentario_edicion || ""
    };
  });
}

function historialAdminVisible() {
  return !!panelHistorialAdminContenido && !panelHistorialAdminContenido.classList.contains("oculto");
}

async function cargarHistorialAdmin() {
  const blastId = selectBlast.value;

  if (!blastId) {
    renderHistorialAdmin([]);
    return;
  }

  if (!usandoSupabase || !supabaseClient) {
    if (estadoHistorialAdmin) {
      estadoHistorialAdmin.textContent = "Supabase no está configurado. No hay historial central para editar.";
    }
    renderHistorialAdmin([]);
    return;
  }

  try {
    const historial = await obtenerHistorialSupabase(blastId);
    historialActualSupabase = historial;
    renderHistorialAdmin(historial);
  } catch (error) {
    console.error(error);
    if (estadoHistorialAdmin) {
      estadoHistorialAdmin.textContent = "Error al cargar historial: " + error.message;
    }
  }
}

function renderHistorialAdmin(historial) {
  if (!tbodyHistorialAdmin) return;

  tbodyHistorialAdmin.innerHTML = "";

  if (!historial || historial.length === 0) {
    if (estadoHistorialAdmin) {
      estadoHistorialAdmin.textContent = usandoSupabase
        ? "Sin historial para mostrar. Primero carga datos de una voladura."
        : "Supabase no configurado. Se usará localStorage temporal.";
    }
    return;
  }

  if (estadoHistorialAdmin) {
    estadoHistorialAdmin.textContent = `Historial cargado: ${historial.length} registros. Puedes corregir la fecha y guardar por fila.`;
  }

  [...historial]
    .sort((a, b) => String(a.label || "").localeCompare(String(b.label || ""), "es", { numeric: true }))
    .forEach(registro => {
      const tr = document.createElement("tr");
      tr.dataset.clave = registro.clave;
      tr.dataset.label = registro.label || "";

      const fechaInput = convertirISOAInputDatetimeLocal(registro.fecha_carga_detectada);
      const metodo = registro.metodo_fecha_carga || "";
      const comentario = registro.comentario_edicion || "";

      tr.innerHTML = `
        <td>${registro.label || ""}</td>
        <td>${registro.taladro || ""}</td>
        <td>${registro.ultimo_ch ?? ""}</td>
        <td><input type="datetime-local" class="inputFechaHistorial" value="${fechaInput}"></td>
        <td><input type="text" class="inputMetodoHistorial" value="${escapeHtmlAttr(metodo)}"></td>
        <td><input type="text" class="inputComentarioHistorial" value="${escapeHtmlAttr(comentario)}" placeholder="Opcional"></td>
        <td>
          <button type="button" class="btnGuardarHistorialFila">Guardar</button>
          <button type="button" class="btnLimpiarFechaFila">Limpiar fecha</button>
        </td>
      `;

      tr.querySelector(".btnGuardarHistorialFila")?.addEventListener("click", async () => {
        await guardarEdicionHistorialFila(registro.clave, tr, false);
      });

      tr.querySelector(".btnLimpiarFechaFila")?.addEventListener("click", async () => {
        tr.querySelector(".inputFechaHistorial").value = "";
        await guardarEdicionHistorialFila(registro.clave, tr, true);
      });

      tbodyHistorialAdmin.appendChild(tr);
    });
}

function escapeHtmlAttr(valor) {
  return String(valor || "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function guardarEdicionHistorialFila(clave, filaHtml, limpiarFecha) {
  if (!supabaseClient) return;

  const inputFecha = filaHtml.querySelector(".inputFechaHistorial");
  const inputMetodo = filaHtml.querySelector(".inputMetodoHistorial");
  const inputComentario = filaHtml.querySelector(".inputComentarioHistorial");

  const fechaISO = limpiarFecha ? null : convertirInputDatetimeLocalAISO(inputFecha?.value || "");
  const fechaTexto = fechaISO ? formatearFechaHoraDesdeISO(fechaISO) : "";
  const ahoraISO = new Date().toISOString();

  const payload = {
    fecha_carga_detectada: fechaISO,
    fecha_carga_detectada_texto: fechaTexto,
    metodo_fecha_carga: inputMetodo?.value?.trim() || (fechaISO ? "Editado manualmente" : "Pendiente"),
    comentario_edicion: inputComentario?.value?.trim() || "",
    editado_manualmente: true,
    updated_at: ahoraISO
  };

  try {
    const { error } = await supabaseClient
      .from(SUPABASE_TABLE)
      .update(payload)
      .eq("clave", clave);

    if (error) throw new Error(error.message);

    if (estadoHistorialAdmin) {
      estadoHistorialAdmin.textContent = "Edición guardada correctamente. Actualizando dashboard...";
    }

    await cargarDatos();
  } catch (error) {
    console.error(error);
    if (estadoHistorialAdmin) {
      estadoHistorialAdmin.textContent = "Error al guardar edición: " + error.message;
    }
  }
}

function actualizarRangosVisibles() {
  filasRangoCarga.forEach((fila, index) => {
    const numero = index + 1;
    fila?.classList.toggle("oculto", numero > cantidadRangosVisibles);
  });

  botonesFiltroRangoDinamico.forEach((btn, index) => {
    const numero = index + 2;
    btn?.classList.toggle("oculto", numero > cantidadRangosVisibles);
  });

  if (btnAgregarRangoCarga) {
    btnAgregarRangoCarga.classList.toggle("oculto", cantidadRangosVisibles >= 4);
    btnAgregarRangoCarga.textContent = cantidadRangosVisibles >= 4 ? "Máximo 4 rangos" : "+ Agregar rango";
  }

  if (btnQuitarRangoCarga) {
    btnQuitarRangoCarga.classList.toggle("oculto", cantidadRangosVisibles <= 1);
  }
}

function limpiarInputsRangoIndividual(numeroRango) {
  const mapaInputs = {
    1: [rango1Inicio, rango1Fin],
    2: [rango2Inicio, rango2Fin],
    3: [rango3Inicio, rango3Fin],
    4: [rango4Inicio, rango4Fin]
  };

  (mapaInputs[numeroRango] || []).forEach(input => {
    if (input) input.value = "";
  });
}

function actualizarVisibilidadPanelRangos() {
  if (!panelRangosCarga) return;
  panelRangosCarga.classList.toggle("oculto", vistaActual !== "rangos");
  if (vistaActual === "rangos") actualizarRangosVisibles();
}

function limpiarInputsRangosCarga() {
  [
    rango1Inicio, rango1Fin,
    rango2Inicio, rango2Fin,
    rango3Inicio, rango3Fin,
    rango4Inicio, rango4Fin
  ].forEach(input => {
    if (input) input.value = "";
  });
}

function obtenerRangosCargaUsuario() {
  const rangos = [
    {
      nombre: "Rango 1",
      color: "#ef4444",
      inicio: rango1Inicio?.value ? new Date(rango1Inicio.value) : null,
      fin: rango1Fin?.value ? new Date(rango1Fin.value) : null
    },
    {
      nombre: "Rango 2",
      color: "#3b82f6",
      inicio: rango2Inicio?.value ? new Date(rango2Inicio.value) : null,
      fin: rango2Fin?.value ? new Date(rango2Fin.value) : null
    },
    {
      nombre: "Rango 3",
      color: "#22c55e",
      inicio: rango3Inicio?.value ? new Date(rango3Inicio.value) : null,
      fin: rango3Fin?.value ? new Date(rango3Fin.value) : null
    },
    {
      nombre: "Rango 4",
      color: "#8b5cf6",
      inicio: rango4Inicio?.value ? new Date(rango4Inicio.value) : null,
      fin: rango4Fin?.value ? new Date(rango4Fin.value) : null
    }
  ];

  return rangos
    .filter((_, index) => index < cantidadRangosVisibles)
    .filter(r =>
      r.inicio instanceof Date &&
      !isNaN(r.inicio) &&
      r.fin instanceof Date &&
      !isNaN(r.fin) &&
      r.fin >= r.inicio
    );
}

function clasificarPorRangoCarga(fila) {
  if (fila.Estado !== "CARGADO") {
    return {
      categoria: "POR CARGAR",
      color: "#cfcfcf"
    };
  }

  const fechaISO = fila._Fecha_Cargado_Detectada_ISO;

  if (!fechaISO) {
    return {
      categoria: "CARGADO SIN FECHA",
      color: "#94a3b8"
    };
  }

  const fechaCarga = new Date(fechaISO);

  if (!(fechaCarga instanceof Date) || isNaN(fechaCarga)) {
    return {
      categoria: "CARGADO SIN FECHA",
      color: "#94a3b8"
    };
  }

  const rangos = obtenerRangosCargaUsuario();

  const rangoEncontrado = rangos.find(r =>
    fechaCarga >= r.inicio && fechaCarga <= r.fin
  );

  if (rangoEncontrado) {
    return {
      categoria: rangoEncontrado.nombre,
      color: rangoEncontrado.color
    };
  }

  return {
    categoria: "FUERA DE RANGO",
    color: "#f59e0b"
  };
}

function enriquecerDataVistaRangosCarga(data) {
  return data.map(fila => {
    const clasificacion = clasificarPorRangoCarga(fila);

    return {
      ...fila,
      Vista_Rangos_Carga: clasificacion.categoria,
      Color_Rango_Carga: clasificacion.color
    };
  });
}


function clonarComposicionMezclas(origen) {
  const salida = {};

  Object.entries(origen || {}).forEach(([mezcla, factores]) => {
    salida[normalizarClaveMezcla(mezcla)] = {
      emulsion: Number(factores?.emulsion || 0),
      nitrato: Number(factores?.nitrato || 0),
      combustible: Number(factores?.combustible || 0),
      gasificante: Number(factores?.gasificante || 0),
      kallpex: Number(factores?.kallpex || 0)
    };
  });

  return salida;
}

function crearRegistrosFactoresDesdeObjeto(objeto) {
  return Object.entries(objeto || {}).map(([mezcla, factores]) => ({
    mezcla: normalizarClaveMezcla(mezcla),
    emulsion: Number(factores?.emulsion || 0),
    nitrato: Number(factores?.nitrato || 0),
    combustible: Number(factores?.combustible || 0),
    gasificante: Number(factores?.gasificante || 0),
    kallpex: Number(factores?.kallpex || 0),
    activo: true
  })).sort((a, b) => a.mezcla.localeCompare(b.mezcla, "es", { numeric: true }));
}

function normalizarClaveMezcla(nombre) {
  return String(nombre || "").trim().toUpperCase().replace(/\s+/g, " ");
}

function construirComposicionDesdeRegistros(registros) {
  const salida = {};

  (registros || []).forEach(registro => {
    const mezcla = normalizarClaveMezcla(registro.mezcla);
    if (!mezcla || registro.activo === false) return;

    salida[mezcla] = {
      emulsion: Number(registro.emulsion || 0),
      nitrato: Number(registro.nitrato || 0),
      combustible: Number(registro.combustible || 0),
      gasificante: Number(registro.gasificante || 0),
      kallpex: Number(registro.kallpex || 0)
    };
  });

  return salida;
}

function normalizarRegistroFactorSupabase(registro) {
  return {
    id: registro?.id ?? null,
    mezcla: normalizarClaveMezcla(registro?.mezcla),
    emulsion: Number(registro?.emulsion || 0),
    nitrato: Number(registro?.nitrato || 0),
    combustible: Number(registro?.combustible || 0),
    gasificante: Number(registro?.gasificante || 0),
    kallpex: Number(registro?.kallpex || 0),
    activo: registro?.activo !== false
  };
}

async function cargarFactoresConsumoCentral() {
  factoresConsumoCargadosDesdeSupabase = false;

  if (!usandoSupabase || !supabaseClient) {
    factoresConsumoRegistros = crearRegistrosFactoresDesdeObjeto(COMPOSICION_MEZCLAS_BASE);
    composicionMezclasActual = clonarComposicionMezclas(COMPOSICION_MEZCLAS_BASE);
    actualizarResumenFactoresConsumo("Factores base del código · Supabase no disponible");
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from(SUPABASE_FACTORES_TABLE)
      .select("id, mezcla, emulsion, nitrato, combustible, gasificante, kallpex, activo, updated_at")
      .order("mezcla", { ascending: true });

    if (error) throw error;

    const registros = Array.isArray(data) && data.length > 0
      ? data.map(normalizarRegistroFactorSupabase).filter(r => r.mezcla)
      : crearRegistrosFactoresDesdeObjeto(COMPOSICION_MEZCLAS_BASE);

    factoresConsumoRegistros = registros;
    composicionMezclasActual = construirComposicionDesdeRegistros(registros);
    factoresConsumoCargadosDesdeSupabase = Array.isArray(data) && data.length > 0;

    if (Object.keys(composicionMezclasActual).length === 0) {
      composicionMezclasActual = clonarComposicionMezclas(COMPOSICION_MEZCLAS_BASE);
    }

    actualizarResumenFactoresConsumo();
  } catch (error) {
    console.error("Error cargando factores de consumo:", error);
    factoresConsumoRegistros = crearRegistrosFactoresDesdeObjeto(COMPOSICION_MEZCLAS_BASE);
    composicionMezclasActual = clonarComposicionMezclas(COMPOSICION_MEZCLAS_BASE);
    actualizarResumenFactoresConsumo("No se pudieron cargar factores desde Supabase · usando respaldo del código");

    if (estadoFactoresConsumo) {
      estadoFactoresConsumo.textContent = "Error cargando factores: " + error.message;
      estadoFactoresConsumo.className = "estado-factores-consumo advertencia";
    }
  }
}

function actualizarResumenFactoresConsumo(textoManual = null) {
  if (!resumenFactoresActivos) return;

  if (textoManual) {
    resumenFactoresActivos.textContent = textoManual;
    return;
  }

  const activos = factoresConsumoRegistros.filter(r => r.activo !== false).length;
  const origen = factoresConsumoCargadosDesdeSupabase ? "Supabase" : "valores base del código";
  resumenFactoresActivos.textContent = `${activos} mezcla(s) activa(s) · fuente: ${origen}`;
}

function actualizarBotonesFactoresConsumo() {
  const abierto = contenidoFactoresConsumo && !contenidoFactoresConsumo.classList.contains("oculto");

  btnHabilitarEdicionFactores?.classList.toggle("oculto", !abierto || edicionFactoresHabilitada);
  btnAgregarMezclaFactor?.classList.toggle("oculto", !abierto || !edicionFactoresHabilitada);
  btnGuardarFactoresConsumo?.classList.toggle("oculto", !abierto || !edicionFactoresHabilitada);
  btnCancelarEdicionFactores?.classList.toggle("oculto", !abierto || !edicionFactoresHabilitada);
}

function solicitarHabilitarEdicionFactores() {
  const password = window.prompt("Ingrese la contraseña especial para editar factores de consumo:");

  if (password === null) return false;

  if (password !== PASSWORD_FACTORES_CONSUMO) {
    alert("Contraseña incorrecta. No se habilitó la edición.");
    return false;
  }

  edicionFactoresHabilitada = true;
  renderFactoresConsumo();
  return true;
}

function renderFactoresConsumo() {
  if (!tbodyFactoresConsumo) return;

  actualizarResumenFactoresConsumo();
  actualizarBotonesFactoresConsumo();

  const registros = factoresConsumoRegistros.length > 0
    ? factoresConsumoRegistros
    : crearRegistrosFactoresDesdeObjeto(COMPOSICION_MEZCLAS_BASE);

  tbodyFactoresConsumo.innerHTML = "";

  registros
    .sort((a, b) => String(a.mezcla || "").localeCompare(String(b.mezcla || ""), "es", { numeric: true }))
    .forEach(registro => {
      const tr = document.createElement("tr");
      tr.dataset.id = registro.id ?? "";
      tr.innerHTML = construirFilaFactorConsumoHtml(registro);
      tbodyFactoresConsumo.appendChild(tr);
    });

  if (estadoFactoresConsumo) {
    estadoFactoresConsumo.textContent = edicionFactoresHabilitada
      ? "Edición habilitada. Puedes modificar factores, activar/desactivar mezclas o agregar una mezcla nueva."
      : "Solo lectura. Para modificar factores o agregar mezclas, habilita edición con contraseña.";
    estadoFactoresConsumo.className = edicionFactoresHabilitada
      ? "estado-factores-consumo ok"
      : "estado-factores-consumo";
  }

  tbodyFactoresConsumo.querySelectorAll(".btnQuitarFilaFactor").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!edicionFactoresHabilitada) return;
      const fila = btn.closest("tr");
      fila?.remove();
    });
  });
}

function construirFilaFactorConsumoHtml(registro) {
  const disabled = edicionFactoresHabilitada ? "" : "disabled";
  const checked = registro.activo !== false ? "checked" : "";

  return `
    <td><input class="inputFactor inputFactorMezcla" type="text" value="${escapeHtmlAttr(registro.mezcla || "")}" ${disabled}></td>
    <td><input class="inputFactor inputFactorNumero" data-campo="emulsion" type="number" step="0.001" value="${Number(registro.emulsion || 0)}" ${disabled}></td>
    <td><input class="inputFactor inputFactorNumero" data-campo="nitrato" type="number" step="0.001" value="${Number(registro.nitrato || 0)}" ${disabled}></td>
    <td><input class="inputFactor inputFactorNumero" data-campo="combustible" type="number" step="0.001" value="${Number(registro.combustible || 0)}" ${disabled}></td>
    <td><input class="inputFactor inputFactorNumero" data-campo="gasificante" type="number" step="0.001" value="${Number(registro.gasificante || 0)}" ${disabled}></td>
    <td><input class="inputFactor inputFactorNumero" data-campo="kallpex" type="number" step="0.001" value="${Number(registro.kallpex || 0)}" ${disabled}></td>
    <td class="td-centro"><input class="chkFactorActivo" type="checkbox" ${checked} ${disabled}></td>
    <td><button type="button" class="btnQuitarFilaFactor btnSecundario" ${disabled}>Quitar fila</button></td>
  `;
}

function agregarFilaFactorConsumo() {
  if (!tbodyFactoresConsumo) return;

  const tr = document.createElement("tr");
  tr.dataset.id = "";
  tr.innerHTML = construirFilaFactorConsumoHtml({
    mezcla: "",
    emulsion: 0,
    nitrato: 0,
    combustible: 0,
    gasificante: 0,
    kallpex: 0,
    activo: true
  });

  tbodyFactoresConsumo.appendChild(tr);

  tr.querySelector(".btnQuitarFilaFactor")?.addEventListener("click", () => tr.remove());
  tr.querySelector(".inputFactorMezcla")?.focus();
}

function leerFactoresConsumoDesdeTabla() {
  if (!tbodyFactoresConsumo) return [];

  const registros = [];
  const mezclasVistas = new Set();

  tbodyFactoresConsumo.querySelectorAll("tr").forEach(tr => {
    const mezcla = normalizarClaveMezcla(tr.querySelector(".inputFactorMezcla")?.value || "");
    if (!mezcla) return;

    if (mezclasVistas.has(mezcla)) {
      throw new Error(`La mezcla ${mezcla} está duplicada. Deja solo una fila por mezcla.`);
    }

    mezclasVistas.add(mezcla);

    const leerNumero = campo => {
      const input = tr.querySelector(`.inputFactorNumero[data-campo="${campo}"]`);
      const valor = Number(input?.value ?? 0);
      if (!Number.isFinite(valor) || valor < 0) {
        throw new Error(`El factor ${campo} de ${mezcla} debe ser un número mayor o igual a 0.`);
      }
      return valor;
    };

    registros.push({
      mezcla,
      emulsion: leerNumero("emulsion"),
      nitrato: leerNumero("nitrato"),
      combustible: leerNumero("combustible"),
      gasificante: leerNumero("gasificante"),
      kallpex: leerNumero("kallpex"),
      activo: tr.querySelector(".chkFactorActivo")?.checked !== false
    });
  });

  if (registros.length === 0) {
    throw new Error("Debe existir al menos una mezcla configurada.");
  }

  return registros;
}

async function guardarFactoresConsumoDesdeDashboard() {
  if (!edicionFactoresHabilitada) {
    if (!solicitarHabilitarEdicionFactores()) return;
  }

  if (!usandoSupabase || !supabaseClient) {
    alert("Supabase no está disponible. No se pueden guardar factores centralizados.");
    return;
  }

  try {
    const registros = leerFactoresConsumoDesdeTabla();
    const ahora = new Date().toISOString();

    const payload = registros.map(registro => ({
      mezcla: registro.mezcla,
      emulsion: registro.emulsion,
      nitrato: registro.nitrato,
      combustible: registro.combustible,
      gasificante: registro.gasificante,
      kallpex: registro.kallpex,
      activo: registro.activo,
      updated_at: ahora
    }));

    if (estadoFactoresConsumo) {
      estadoFactoresConsumo.textContent = "Guardando factores en Supabase...";
      estadoFactoresConsumo.className = "estado-factores-consumo";
    }

    const { error } = await supabaseClient
      .from(SUPABASE_FACTORES_TABLE)
      .upsert(payload, { onConflict: "mezcla" });

    if (error) throw error;

    edicionFactoresHabilitada = false;
    await cargarFactoresConsumoCentral();
    renderFactoresConsumo();
    actualizarConsumoInsumos();

    if (estadoFactoresConsumo) {
      estadoFactoresConsumo.textContent = "Factores guardados correctamente en Supabase. El cálculo fue actualizado.";
      estadoFactoresConsumo.className = "estado-factores-consumo ok";
    }
  } catch (error) {
    console.error("Error guardando factores:", error);
    if (estadoFactoresConsumo) {
      estadoFactoresConsumo.textContent = "Error: " + error.message;
      estadoFactoresConsumo.className = "estado-factores-consumo advertencia";
    }
    alert("No se pudieron guardar los factores: " + error.message);
  }
}

function actualizarConsumoSiVisible() {
  if (panelConsumoInsumos && !panelConsumoInsumos.classList.contains("oculto")) {
    actualizarConsumoInsumos();
  }
}

function obtenerPorcentajeAceiteResidual() {
  const valor = Number(inputPorcentajeAceiteResidual?.value ?? PORCENTAJE_ACEITE_RESIDUAL_DEFAULT);

  if (!Number.isFinite(valor)) return 0;

  return Math.min(Math.max(valor, 0), 100) / 100;
}

function normalizarInputPorcentajeAceiteResidual() {
  if (!inputPorcentajeAceiteResidual) return;

  const valor = Number(inputPorcentajeAceiteResidual.value);

  if (!Number.isFinite(valor)) {
    inputPorcentajeAceiteResidual.value = "0";
    return;
  }

  const valorNormalizado = Math.min(Math.max(valor, 0), 100);
  inputPorcentajeAceiteResidual.value = String(valorNormalizado);
}

function obtenerTextoDistribucionCombustible(porcentajeAceiteResidual) {
  const fraccionAceite = Math.min(Math.max(Number(porcentajeAceiteResidual || 0), 0), 1);
  const fraccionDiesel = 1 - fraccionAceite;

  if (fraccionAceite <= 0) return "100% diesel";

  return `${formatearPorcentajeConsumo(fraccionDiesel)} diesel / ${formatearPorcentajeConsumo(fraccionAceite)} aceite residual`;
}

function formatearPorcentajeConsumo(fraccion) {
  return `${(Number(fraccion || 0) * 100).toLocaleString("es-PE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}%`;
}

function actualizarConsumoInsumos() {
  if (!tbodyConsumoMezcla || !tbodyConsumoTotal || !resumenConsumoTexto) return;

  const dataAnalisis = obtenerDataAnaliticaActual()
    .filter(fila => fila.Estado === "CARGADO");

  const porcentajeAceiteResidual = obtenerPorcentajeAceiteResidual();
  const resultado = calcularConsumoInsumos(dataAnalisis, porcentajeAceiteResidual);

  renderResumenTaladrosConsumo(dataAnalisis);
  renderConsumoInsumos(resultado, porcentajeAceiteResidual);
}

function esBufferPorLabel(label) {
  return String(label || "").trim().toUpperCase().startsWith("BF");
}

function obtenerCantidadPrimas(fila) {
  const primas = Number(fila?.Primas);
  return Number.isFinite(primas) ? primas : 0;
}

function calcularResumenTaladrosConsumo(data) {
  const cargados = Array.isArray(data) ? data : [];

  const buffers = cargados.filter(fila => esBufferPorLabel(fila.Label));
  const produccion = cargados.filter(fila => !esBufferPorLabel(fila.Label));

  const produccionDoblePrima = produccion.filter(fila => obtenerCantidadPrimas(fila) === 2);
  const bufferDoblePrima = buffers.filter(fila => obtenerCantidadPrimas(fila) === 2);
  const casosRaros = cargados.filter(fila => obtenerCantidadPrimas(fila) >= 3);

  return {
    totalCargados: cargados.length,
    buffersCargados: buffers.length,
    produccionCargados: produccion.length,
    produccionDoblePrima: produccionDoblePrima.length,
    bufferDoblePrima: bufferDoblePrima.length,
    casosRaros
  };
}

function renderResumenTaladrosConsumo(data) {
  if (!resumenTaladrosConsumo) return;

  const resumen = calcularResumenTaladrosConsumo(data);
  const nf = new Intl.NumberFormat("es-PE");

  const tarjetas = [
    { titulo: "Taladros cargados", valor: resumen.totalCargados },
    { titulo: "Buffers cargados", valor: resumen.buffersCargados },
    { titulo: "Producción cargados", valor: resumen.produccionCargados },
    { titulo: "Producción doble prima", valor: resumen.produccionDoblePrima },
    { titulo: "Buffer doble prima", valor: resumen.bufferDoblePrima }
  ];

  const tarjetasHtml = tarjetas.map(item => `
    <div class="tarjeta-resumen-taladro">
      <span>${item.titulo}</span>
      <strong>${nf.format(item.valor)}</strong>
    </div>
  `).join("");

  const casosRarosHtml = resumen.casosRaros.length > 0
    ? `
      <div class="alerta-primas-raras">
        <div class="alerta-primas-raras-titulo">Casos raros detectados: ${nf.format(resumen.casosRaros.length)} taladro(s) con triple prima o más</div>
        <div class="chips-primas-raras">
          ${resumen.casosRaros.map(fila => `
            <span>${fila.Label || fila.Taladro || "SIN LABEL"} · ${obtenerCantidadPrimas(fila)} primas</span>
          `).join("")}
        </div>
      </div>
    `
    : "";

  resumenTaladrosConsumo.innerHTML = `
    <div class="resumen-taladros-header">
      <h3>Resumen de taladros cargados</h3>
    </div>
    <div class="resumen-taladros-grid">
      ${tarjetasHtml}
    </div>
    ${casosRarosHtml}
  `;
}

function calcularConsumoInsumos(data, porcentajeAceiteResidual) {
  const porMezcla = {};

  data.forEach(fila => {
    const bulksDetalle = Array.isArray(fila._BulksDetalle) && fila._BulksDetalle.length > 0
      ? fila._BulksDetalle
      : (fila.Bulk ? [{ name: fila.Bulk, qty: Number(fila.Cantidad_Bulk || fila.Carga_Total || 0) }] : []);

    bulksDetalle.forEach(bulk => {
      const mezcla = normalizarNombreMezcla(bulk.name);
      if (!mezcla) return;

      if (!porMezcla[mezcla]) {
        porMezcla[mezcla] = {
          mezcla,
          taladrosSet: new Set(),
          kgCargados: 0,
          emulsion: 0,
          nitrato: 0,
          combustibleTotal: 0,
          diesel: 0,
          aceiteResidual: 0,
          gasificante: 0,
          kallpex: 0,
          sinComposicion: false
        };
      }

      porMezcla[mezcla].kgCargados += Number(bulk.qty || 0);
      porMezcla[mezcla].taladrosSet.add(crearClaveTaladroConsumo(fila));
    });
  });

  Object.values(porMezcla).forEach(item => {
    const composicion = composicionMezclasActual[item.mezcla];

    if (!composicion) {
      item.sinComposicion = true;
      return;
    }

    const kg = item.kgCargados;

    item.emulsion = kg * composicion.emulsion;
    item.nitrato = kg * composicion.nitrato;
    item.combustibleTotal = kg * composicion.combustible;
    item.kallpex = kg * composicion.kallpex;
    item.gasificante = kg * composicion.gasificante;

    const fraccionAceiteResidual = Math.min(Math.max(Number(porcentajeAceiteResidual || 0), 0), 1);
    const fraccionDiesel = 1 - fraccionAceiteResidual;

    item.aceiteResidual = item.combustibleTotal * fraccionAceiteResidual;
    item.diesel = item.combustibleTotal * fraccionDiesel;
  });

  const filas = Object.values(porMezcla)
    .sort((a, b) => a.mezcla.localeCompare(b.mezcla, "es", { numeric: true }));

  const totales = filas.reduce((acc, item) => {
    acc.taladros += item.taladrosSet.size;
    acc.kgCargados += item.kgCargados;
    acc.emulsion += item.emulsion;
    acc.nitrato += item.nitrato;
    acc.diesel += item.diesel;
    acc.aceiteResidual += item.aceiteResidual;
    acc.gasificante += item.gasificante;
    acc.kallpex += item.kallpex;
    return acc;
  }, {
    taladros: 0,
    kgCargados: 0,
    emulsion: 0,
    nitrato: 0,
    diesel: 0,
    aceiteResidual: 0,
    gasificante: 0,
    kallpex: 0
  });

  return { filas, totales };
}

function normalizarNombreMezcla(nombre) {
  if (!nombre) return "";

  const limpio = String(nombre).trim().toUpperCase();

  if (composicionMezclasActual[limpio]) return limpio;

  const encontrado = Object.keys(composicionMezclasActual).find(nombreMezcla =>
    limpio === nombreMezcla.toUpperCase()
  );

  return encontrado || limpio;
}

function renderConsumoInsumos(resultado, porcentajeAceiteResidual) {
  const { filas, totales } = resultado;
  const descripcion = obtenerDescripcionAnalisisConsumo();

  resumenConsumoTexto.innerHTML = `
    <strong>${descripcion}</strong> ·
    ${totales.taladros.toLocaleString("es-PE")} taladros cargados ·
    ${formatearKgConsumo(totales.kgCargados)} kg de mezcla cargada ·
    Combustible: ${obtenerTextoDistribucionCombustible(porcentajeAceiteResidual)}
  `;

  actualizarCardsConsumo(totales);

  tbodyConsumoMezcla.innerHTML = "";
  tbodyConsumoTotal.innerHTML = "";

  if (filas.length === 0) {
    tbodyConsumoMezcla.innerHTML = `
      <tr><td colspan="9" class="celda-sin-datos">No hay taladros cargados para el filtro/rango seleccionado.</td></tr>
    `;
    tbodyConsumoTotal.innerHTML = `
      <tr><td colspan="2" class="celda-sin-datos">Sin consumo calculado.</td></tr>
    `;
    return;
  }

  filas.forEach(item => {
    const tr = document.createElement("tr");
    const nota = item.sinComposicion ? " ⚠" : "";

    tr.innerHTML = `
      <td>${item.mezcla}${nota}</td>
      <td class="td-numero">${item.taladrosSet.size.toLocaleString("es-PE")}</td>
      <td class="td-numero">${formatearKgConsumo(item.kgCargados)}</td>
      <td class="td-numero">${formatearKgConsumo(item.emulsion)}</td>
      <td class="td-numero">${formatearKgConsumo(item.nitrato)}</td>
      <td class="td-numero">${formatearKgConsumo(item.diesel)}</td>
      <td class="td-numero">${formatearKgConsumo(item.aceiteResidual)}</td>
      <td class="td-numero">${formatearKgConsumo(item.gasificante)}</td>
      <td class="td-numero">${formatearKgConsumo(item.kallpex)}</td>
    `;

    tbodyConsumoMezcla.appendChild(tr);
  });

  const filasTotales = [
    ["Emulsión", totales.emulsion],
    ["Nitrato", totales.nitrato],
    ["Diesel", totales.diesel],
    ["Aceite residual", totales.aceiteResidual],
    ["Gasificante", totales.gasificante],
    ["Kallpex", totales.kallpex]
  ];

  filasTotales.forEach(([insumo, valor]) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${insumo}</td>
      <td class="td-numero">${formatearKgConsumo(valor)} kg</td>
    `;
    tbodyConsumoTotal.appendChild(tr);
  });
}

function actualizarCardsConsumo(totales) {
  if (consumoKpiEmulsion) consumoKpiEmulsion.textContent = `${formatearKgConsumo(totales.emulsion)} kg`;
  if (consumoKpiNitrato) consumoKpiNitrato.textContent = `${formatearKgConsumo(totales.nitrato)} kg`;
  if (consumoKpiDiesel) consumoKpiDiesel.textContent = `${formatearKgConsumo(totales.diesel)} kg`;
  if (consumoKpiAceite) consumoKpiAceite.textContent = `${formatearKgConsumo(totales.aceiteResidual)} kg`;
  if (consumoKpiGasificante) consumoKpiGasificante.textContent = `${formatearKgConsumo(totales.gasificante)} kg`;
  if (consumoKpiKallpex) consumoKpiKallpex.textContent = `${formatearKgConsumo(totales.kallpex)} kg`;
}

function obtenerDescripcionAnalisisConsumo() {
  if (vistaActual === "rangos" && filtroRangoActivo !== "TODO") {
    return `Análisis: ${filtroRangoActivo}`;
  }

  if (vistaActual === "rangos") {
    return "Análisis: todo el proyecto con rangos configurados";
  }

  return "Análisis: todo el proyecto";
}

function formatearKgConsumo(valor) {
  return Number(valor || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function obtenerCategoriasSegunVista(data, campo, vista) {
  const categoriasExistentes = [...new Set(data.map(d => String(d[campo] ?? "SIN DATO")))];

  if (vista === "rangos") {
    const orden = [
      "POR CARGAR",
      "Rango 1",
      "Rango 2",
      "Rango 3",
      "Rango 4",
      "FUERA DE RANGO",
      "CARGADO SIN FECHA"
    ];
    return orden.filter(cat => categoriasExistentes.includes(cat));
  }

  if (vista === "ayudas") {
    const orden = ["POR CARGAR", "AUXILIAR", "DISEÑO"];
    return orden.filter(cat => categoriasExistentes.includes(cat));
  }

  if (vista === "estado") {
    const orden = ["POR CARGAR", "CARGADO"];
    return orden.filter(cat => categoriasExistentes.includes(cat));
  }

  return categoriasExistentes;
}
