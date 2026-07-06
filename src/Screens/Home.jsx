import { useEffect, useState, useRef, use } from "react"
import logo from "../../src/assets/images/kayser_logo.png"
import fondo from "../../src/assets/images/banner.jpg"
import requested from "../assets/gif/requested.gif"
import change from "../assets/gif/change.gif"
import user from "../assets/gif/user.gif"
import gif from "../assets/gif/password.gif"
import Swal from "sweetalert2"
import LineChanges from "../Widgets/LineChanges"
import Material from "../Widgets/Material"

const url = import.meta.env.VITE_API_URL

const enviarData = async (url, data) => {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!resp.ok) {
      throw new Error('Error en la respuesta de la API')
    }
    return await resp.json();
  } catch (error) {
    console.error("Error en la solicitud:", error)
    throw error
  }
}
function Home() {

    const [hora, setHora] = useState(new Date())
      const [fecha, setFecha] = useState(new Date())
      const [ShowNotification, setshowNotification] = useState(false)
      const [pendingCount, setPendingCount] = useState(0)
      const [updateTrigger, setUpdateTrigger] = useState(0)
      const [showSettings, setShowSettings] = useState(false)
      const [refreshInterval, setRefreshInterval] = useState(10)
      const [soundEnabled, setSoundEnabled] = useState(true)
      const [notificationsEnabled, setNotificationsEnabled] = useState(true)
      const [isDarkMode, setIsDarkMode] = useState(false)
      const [activeTab, setActiveTab] = useState("cambios")
      
      // Estados para modales globales
      const [showLoginModal, setShowLoginModal] = useState(false)
      const [showDetailsModal, setShowDetailsModal] = useState(false)
      const [showAddModal, setShowAddModal] = useState(false)
      
      // Datos para modales
      const [loginData, setLoginData] = useState(null)
      const [detailsData, setDetailsData] = useState(null)
      const [Usuario, setUsuario] = useState('')
      const [Password, setPassword] = useState('')
      const [isLoading, setIsLoading] = useState(false)
      const [mostrarNotificacion, setMostrarNotificacion] = useState(false)
    
      const checkPendingStatus = async () => {
        if (!notificationsEnabled) return
        
        const info = { aksi: "Pending" }
        try {
          const response = await enviarData(url, info)
          if (response.pending > 0) {
            setPendingCount(response.pending)
            showNotification()
          }
        } catch (error) {
          console.error('Error fetching pending status:', error)
        }
      }
    
      const showNotification = () => {
        setshowNotification(true)
        setTimeout(() => {
          setshowNotification(false)
        }, 7000)
      }
    
      useEffect(() => {
        const actualizarHora = () => {
          setHora(new Date())
          setFecha(new Date())
        }
    
        const intervalId = setInterval(checkPendingStatus, 5000)
        const intervalo = setInterval(actualizarHora, 1000)
    
        const updateInterval = setInterval(() => {
          setUpdateTrigger(prev => prev + 1)
        }, refreshInterval * 1000)
    
        return () => {
          clearInterval(intervalo)
          clearInterval(intervalId)
          clearInterval(updateInterval)
        }
      }, [refreshInterval, notificationsEnabled])
    
      useEffect(() => {
        if (isDarkMode) {
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.setAttribute('data-theme', 'light')
        }
      }, [isDarkMode])
    
      // Cargar configuraciones guardadas al inicio
      useEffect(() => {
        const savedSettings = localStorage.getItem('dashboardSettings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          setRefreshInterval(settings.refreshInterval || 10)
          setSoundEnabled(settings.soundEnabled !== undefined ? settings.soundEnabled : true)
          setNotificationsEnabled(settings.notificationsEnabled !== undefined ? settings.notificationsEnabled : true)
          setIsDarkMode(settings.isDarkMode || false)
        }
      }, [])
    
      const formatearHora = (date) => {
        return date.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      }
    
      const formatearFecha = (date) => {
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long'
        })
      }
    
      // Funciones para manejar modales desde componentes hijos
      const handleOpenLogin = (data) => {
        setLoginData(data)
        setShowLoginModal(true)
      }
    
      const handleOpenDetails = (data) => {
        setDetailsData(data)
        setShowDetailsModal(true)
      }
    
      const handleOpenAdd = () => {
        setShowAddModal(true)
      }
    
     const handleLogin = async () => {
      if(Usuario.trim() === '' || Password.trim() === '') {
        setMostrarNotificacion(true);
        setTimeout(() => setMostrarNotificacion(false), 3000);
        return
      }
    
      const info = {
        aksi: "login",
        username: Usuario,
        password: Password,
        id: loginData?.id,
        estatus: loginData?.estatus,
        tipo: loginData?.tipo || "Cambio"
      }
    
      setIsLoading(true);
      try {
        const response = await enviarData(url, info);
        if (response.status === 'error') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message,
          });
        } else if (response.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: response.message,
          });
          setShowLoginModal(false);
          setUsuario('');
          setPassword('');
          setUpdateTrigger(prev => prev + 1); // Forzar actualización
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al procesar la solicitud',
        });
      } finally {
        setIsLoading(false);
      }
     }

     const handleOpenConfiguration = () => {
      // Verificación de seguridad
      if (typeof window === 'undefined' || !window.location) {
        console.warn('window no disponible');
        return;
      }
      
      try {
        // Obtén la URL base actual
        const currentHref = window.location.href;
        console.log('URL actual:', currentHref);
        
        // Para HashRouter, necesitamos manejar el hash
        let baseUrl;
        
        // Si hay un hash en la URL actual, quítalo para obtener la base
        if (currentHref.includes('#')) {
          baseUrl = currentHref.split('#')[0];
        } else {
          baseUrl = currentHref;
        }
        
        // Limpia la URL base
        baseUrl = baseUrl.replace(/index\.html$/, '').replace(/\/$/, '');
        
        // Construye la URL final con hash
        const configUrl = `${baseUrl}#/configuration`;
        
        console.log('Abriendo configuración:', configUrl);
        
        // Abre en nueva ventana
        const newWindow = window.open(configUrl, '_blank');
        
        if (!newWindow) {
          Swal.fire({
            icon: 'warning',
            title: 'Ventana bloqueada',
            text: 'Por favor permite ventanas emergentes',
            timer: 3000
          });
        }
        
      } catch (error) {
        console.error('Error al abrir configuración:', error);
        
        // Fallback extremo
        const fallbackUrl = window.location.origin + '/#/configuration';
        window.open(fallbackUrl, '_blank');
      }
    }

  return (
      <div className={`h-screen flex flex-col overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-gray-100'}`}>
        {/* Fondo con imagen y overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
          style={{ backgroundImage: `url(${fondo})` }}
        />
  
        {/* Header con controles */}
        <div className="w-full bg-base-100/90 backdrop-blur-sm shadow-lg py-2 md:py-3 px-3 md:px-6 z-40 sticky top-0 flex-shrink-0">
          <div className="flex justify-between items-center">
            {/* Sección izquierda: Botones */}
            <div className="flex items-center space-x-2 md:space-x-3">
                <button
                  className="btn btn-circle btn-primary btn-outline hover:scale-105 transition-transform btn-xs md:btn-sm"
                  onClick={handleOpenConfiguration}
                  aria-label="Configuraciones"
                  title="Configuraciones"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              <button
                className="btn btn-circle btn-ghost hover:scale-105 transition-transform btn-xs md:btn-sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
            </div>
            
            {/* Sección central: Hora y fecha */}
            <div className="flex flex-col items-center flex-grow mx-2">
              <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary leading-tight">
                {formatearHora(hora)}
              </div>
              <div className="text-xs md:text-sm opacity-80 truncate max-w-[200px] md:max-w-none text-center">
                {formatearFecha(fecha)}
              </div>
            </div>
            
            {/* Sección derecha: Logo */}
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Kayser Logo" 
                className="h-8 md:h-10 lg:h-12 w-auto" 
              />
            </div>
          </div>
        </div>
  
        {/* Contenido principal */}
        <div className="flex-1 overflow-hidden px-2 md:px-4 py-2 md:py-4 w-full">
          {/* Tarjeta de bienvenida */}
          <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/20 shadow-xl rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-4">
            <div className="card-body p-3 md:p-4">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-2 md:mb-0">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
                    KanBan System
                  </h1>
                  <p className="text-sm md:text-base mt-1 opacity-90">Gestión de Materiales</p>
                </div>
                
                <div className="stats stats-vertical md:stats-horizontal shadow-md bg-base-100/80 text-xs md:text-sm">
                  <div className="stat p-2 md:p-3">
                    <div className="stat-title">Notificaciones</div>
                    <div className="stat-value text-secondary text-lg md:text-xl">{pendingCount}</div>
                    <div className="stat-desc">Pendientes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Tabs principales */}
          <div className="bg-base-100/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-white/20 h-full flex flex-col">
            {/* Tabs Header */}
            <div className="tabs tabs-boxed bg-base-200/50 p-1 m-2 md:m-3 rounded-xl flex-shrink-0">
              <button 
                className={`tab flex-1 transition-all duration-300 ${activeTab === "cambios" ? "tab-active bg-gradient-to-r from-black to-red-400 text-white shadow-lg scale-105" : "hover:bg-base-300"}`}
                onClick={() => setActiveTab("cambios")}
              >
                <div className="flex items-center justify-center space-x-1 md:space-x-2">
                  <img src={change} alt="Cambios" className="w-5 h-5 md:w-6 md:h-6" />
                  <div className="text-left">
                    <div className="font-bold text-xs md:text-sm lg:text-base whitespace-nowrap">Cambios de Línea</div>
                  </div>
                </div>
              </button>
              
              <button 
                className={`tab flex-1 transition-all duration-300 ${activeTab === "material" ? "tab-active bg-gradient-to-r from-black to-red-400 text-white shadow-lg scale-105" : "hover:bg-base-300"}`}
                onClick={() => setActiveTab("material")}
              >
                <div className="flex items-center justify-center space-x-1 md:space-x-2">
                  <img src={requested} alt="Material" className="w-5 h-5 md:w-6 md:h-6" />
                  <div className="text-left">
                    <div className="font-bold text-xs md:text-sm lg:text-base whitespace-nowrap">Material Solicitado</div>
                  </div>
                </div>
              </button>
            </div>
  
            {/* Tab Content */}
            <div className="flex-1 overflow-hidden p-2 md:p-3 lg:p-4">
              <div className={`tab-content h-full overflow-auto ${activeTab === "cambios" ? 'block' : 'hidden'}`}>
                <LineChanges 
                  updateTrigger={updateTrigger} 
                  onOpenLogin={handleOpenLogin}
                  onOpenModal={handleOpenDetails}
                  onOpenAdd={handleOpenAdd}
                />
              </div>
              
              <div className={`tab-content h-full overflow-auto ${activeTab === "material" ? 'block' : 'hidden'}`}>
                <Material 
                  updateTrigger={updateTrigger} 
                  onOpenLogin={handleOpenLogin}
                  onOpenModal={handleOpenDetails}
                  onOpenAdd={handleOpenAdd}
                />
              </div>
            </div>
          </div>
        </div>
  
        {/* Modal de Login - GLOBAL */}
        {showLoginModal && (
          <div className="fixed inset-0 z-[10001]">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowLoginModal(false)} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative bg-gradient-to-br from-base-100 to-base-200 border border-white/20 shadow-2xl rounded-xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <button 
                  className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 hover:scale-110 transition-transform z-10"
                  onClick={() => {
                    setShowLoginModal(false)
                    setUsuario('')
                    setPassword('')
                  }}
                >
                  ✕
                </button>
                
                <div className="p-6">
                  <h3 className="font-bold text-2xl mb-6 text-center text-primary">Inicio de Sesión</h3>
                  <p className="text-center mb-6 text-gray-600">Por favor ingresa tus credenciales para confirmar</p>
                  
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Usuario</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3">
                          <img src={user} alt="" width={20} height={20} />
                        </div>
                        <input
                          type="text"
                          className="input input-bordered w-full pl-12"
                          placeholder="Ingresa tu usuario"
                          value={Usuario}
                          onChange={e => setUsuario(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Contraseña</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3">
                          <img src={gif} alt="" width={20} height={20} />
                        </div>
                        <input
                          type="password"
                          className="input input-bordered w-full pl-12"
                          placeholder="Ingresa tu contraseña"
                          value={Password}
                          onChange={e => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {mostrarNotificacion && (
                      <div className="alert alert-error shadow-lg animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><b>Campos Vacíos!</b> Favor de completarlos.</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="modal-action mt-8">
                    <button 
                      className="btn btn-ghost hover:scale-105 transition-transform"
                      onClick={() => {
                        setShowLoginModal(false)
                        setUsuario('')
                        setPassword('')
                      }}
                    >
                      Cancelar
                    </button>
                    <button 
                      className="btn btn-primary hover:scale-105 transition-transform"
                      onClick={handleLogin}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        'Confirmar'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Modal de Detalles - GLOBAL */}
        {showDetailsModal && detailsData && (
          <div className="fixed inset-0 z-[10001]">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDetailsModal(false)} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative bg-gradient-to-br from-base-100 to-base-200 border border-white/20 shadow-2xl rounded-xl md:rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <button 
                  className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 hover:scale-110 transition-transform z-10"
                  onClick={() => setShowDetailsModal(false)}
                >
                  ✕
                </button>
                
                <div className="p-6">
                  <h3 className="font-bold text-2xl mb-6 text-center text-primary">Detalles del Producto Terminado</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr className="bg-base-300">
                          <th className="text-center">Bito</th>
                          <th className="text-center">Material</th>
                          <th className="text-center">Descripción</th>
                          <th className="text-center">SP</th>
                          <th className="text-center">Suministro</th>
                          <th className="text-center">Puesto</th>
                          <th className="text-center">Check</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailsData.data.map((item, index) => (
                          <tr key={index} className="hover">
                            <td className="text-center">{item.bito}</td>
                            <td className="text-center font-mono">{item.material}</td>
                            <td className="max-w-xs truncate" title={item.descripcion}>{item.descripcion}</td>
                            <td className="text-center">{item.sp}</td>
                            <td className="text-center">{item.suministro}</td>
                            <td className="text-center">{item.puesto}</td>
                            <td className="text-center">
                              <input 
                                type="checkbox" 
                                className="checkbox checkbox-xs checkbox-primary" 
                                disabled
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="modal-action mt-6">
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowDetailsModal(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Notificación */}
        {ShowNotification && (
          <div className="fixed top-4 right-4 z-[10002] max-w-[90vw]">
            <div className="alert alert-error shadow-lg animate-fade-in-up">
              <div className="flex items-center space-x-3">
                <div className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-error opacity-75"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.698-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="font-bold text-lg">¡Atención!</h3>
                  <div className="text-sm">Hay <span className="font-bold">{pendingCount}</span> elemento(s) pendientes</div>
                </div>
                <button 
                  className="btn btn-xs btn-circle btn-ghost hover:bg-error/20"
                  onClick={() => setshowNotification(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Footer */}
        <footer className="w-full bg-base-100/90 backdrop-blur-sm py-2 md:py-3 px-3 md:px-4 z-40 flex-shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-xs">
                <span className="font-bold text-primary">KanBan System</span> v2.0
              </p>
              <p className="text-[10px] md:text-xs opacity-70">
                © 2025 Kayser Automotive Systems.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="badge badge-outline badge-xs md:badge-sm">
                <span className="loading loading-dots loading-xs mr-1"></span>
                En línea
              </div>
              <div className="text-[10px] md:text-xs opacity-70">
                Actualizado: {formatearHora(new Date())}
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

export default Home