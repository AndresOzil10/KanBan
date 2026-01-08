import { useCallback, useEffect, useState } from "react"
import add from "../assets/gif/add.gif"
import CloseIcon from "../icons/close"
import SaveIcon from "../icons/saveIcon"
import user from "../assets/gif/user.gif"
import gif from "../assets/gif/password.gif"
import Swal from "sweetalert2"
import { QRCodeCanvas } from "qrcode.react"

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

const LineChanges = ({updateTrigger, onOpenModal, onOpenLogin }) => {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [nombreNomina, setNombreNomina] = useState('')
    const [npProducto, setNpProducto] = useState('')
    const [ordenProduccion, setOrdenProduccion] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [showInfo, setShowInfo] = useState([])
    const [login, setLogin] = useState(false)
    const [info, setInfo] = useState(false)
    const [mostrarNotificacion, setMostrarNotificacion] = useState(false)
    const [Error, setError] = useState(null)
    const [Dato, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [recordsPerPage] = useState(10) 
    const [Usuario, setUsuario] = useState('')
    const [Password, setPassword] = useState('')
    const [selectedId, setSelectedId] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(null)

    const fetchData = useCallback(async () => {
        const info = { aksi: "LineChange" }
        try {
            const response = await enviarData(url, info)
            setData(response.data)
        } catch (error) {
            setError("Error al obtener los datos. Intenta de nuevo más tarde.")
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [updateTrigger])

    const agregarRegistro = async () => {
        if (!nombreNomina || !npProducto || !ordenProduccion) {
            setMostrarNotificacion(true);
            setTimeout(() => setMostrarNotificacion(false), 3000)
            return;
        }
        const info = {
            aksi: "addLineChange",
            nn: nombreNomina,
            np: npProducto,
            op: ordenProduccion,
        };
        setIsLoading(true)
        const response = await enviarData(url, info)
        if (response.status === 'error') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.message,
            });
        } else if (response.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.message,
            });
            setIsLoading(false)
            fetchData()
        }
        setNombreNomina('')
        setNpProducto('')
        setOrdenProduccion('')
    }

    const searchData = async (id) => {
        const info = { aksi: "DetailsPT", pt: id }
        try {
            const response = await enviarData(url, info)
            setShowInfo(response.data)
            // Usar la función del padre para abrir el modal global
            if (onOpenModal) {
                onOpenModal({ data: response.data, title: "Detalles del Producto Terminado" })
            } else {
                // Fallback al modal local si no hay función del padre
                setInfo(true)
            }
        } catch (error) {
            console.error("Error al buscar los datos:", error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los detalles'
            })
        }
    }

    const CloseInfo = () => {
        setInfo(false)
        fetchData()
    }

    const agregarRegister = async (selectedId, selectedStatus) => {
        if (!Usuario || !Password) {
          setMostrarNotificacion(true);
          setTimeout(() => setMostrarNotificacion(false), 3000);
          return;
        }
        const info = { aksi: "login",
          username: Usuario,
          password: Password,
          id : selectedId,
          estatus: selectedStatus,
          tipo: "Cambio"
         }
        setIsLoading(true)
          const response = await enviarData(url, info)
          if(response.status ==='error'){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message,
            })
          } else if(response.status === 'success'){
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: response.message,
            })
            setLogin(false);
            fetchData();
          }
        setPassword('')
        setUsuario('')
        setIsLoading(false)
      }

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = Dato.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(Dato.length / recordsPerPage);

    return (
        <>
            <div className="overflow-x-auto shadow-2xl">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>NP PT</th>
                            <th>Orden</th>
                            <th>info</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estatus</th>
                            <th>Check</th>
                            <th>Ayuda Visual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Array.isArray(currentRecords) ? currentRecords : []).map((item, index) => (
                            <tr key={index} >
                                <th>{item.id}</th>
                                <td style={{ backgroundColor: item.usuario === 'SC40ADUA2' || item.usuario === 'SC40ADUA4' || item.usuario === 'SC40ADUA6' ? '#FFC800' : item.usuario === 'SC40ADUA' || item.usuario === 'SC40ADUA3' || item.usuario === 'SC40ADUA5' ? '#00FF15' : ''}}>{item.np}</td>
                                <td><QRCodeCanvas value={item.op} size={48} /></td>
                                <td><button className="btn btn-ghost btn-xs" onClick={()=>searchData(item.np)}><img width="22" height="20" src="https://img.icons8.com/emoji/48/information-emoji.png" alt="information-emoji"/></button></td>
                                <td>{item.fecha}</td>
                                <td>{item.hora}</td>
                                <td>
                                    {item.estatus === "En Proceso" ? (
                                        <div className="badge badge-outline badge-warning">En Proceso</div>
                                    ) : item.estatus === "Preparado" ? (
                                        <div className="badge badge-outline badge-success">Preparado</div>
                                    ) : item.estatus === "Recibido" ? (
                                        <div className="badge badge-outline badge-info">Recibido</div>
                                    ) : null}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-ghost btn-xs"
                                        onClick={() => {
                                            if (onOpenLogin) {
                                                onOpenLogin({ 
                                                    id: item.id, 
                                                    estatus: item.estatus,
                                                    tipo: "Cambio" 
                                                });
                                            } else {
                                                // Fallback al modal local
                                                setLogin(true);
                                                setSelectedId(item.id);
                                                setSelectedStatus(item.estatus);
                                            }
                                        }}
                                        disabled={item.estatus === "Preparado"}
                                    >
                                        Check
                                    </button>
                                </td>
                                <td>
                                    {item.color.startsWith('#') ? 
                                        <div aria-label="status"  className="status status-xl" style={{ backgroundColor: item.color }}></div> 
                                        : item.color === 'Rev Orden' ?
                                        <div className="badge badge-outline badge-secondary">Rev Orden</div>
                                        : <div className="avatar">
                                            <div className="w-20 h-14 rounded">
                                            <img
                                            src={`/Kanban/png/${item.color}`}
                                            alt={item.color}
                                            />
                                            </div>
                                        </div>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between mt-4">
                    <button
                        className="btn"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                        className="btn"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
            
            <div className="flex justify-end">
                <button className="btn bg-transparent border-none mt-4 btn-square shadow-none" onClick={() => setOpen(true)}>
                    <img src={add} alt="" width={20} height={20} />
                </button>
            </div>
            
            {/* Modal para agregar registro */}
            {open && (
                <div className="fixed inset-0 z-[10001]">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setOpen(false)} />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="relative bg-base-100 rounded-xl shadow-2xl w-full max-w-md">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-lg text-center">Cambios de Línea</h3>
                                    <button 
                                        className="btn btn-sm btn-circle btn-ghost"
                                        onClick={() => setOpen(false)}
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Número Nómina</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            className="input input-bordered w-full" 
                                            placeholder="Ingrese número de nómina"
                                            value={nombreNomina}
                                            onChange={(e) => setNombreNomina(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">NP Producto Terminado</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            className="input input-bordered w-full" 
                                            placeholder="Ingrese NP de producto"
                                            value={npProducto}
                                            onChange={(e) => setNpProducto(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Orden de Producción</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            className="input input-bordered w-full" 
                                            placeholder="Ingrese orden de producción"
                                            value={ordenProduccion}
                                            onChange={(e) => setOrdenProduccion(e.target.value)}
                                        />
                                    </div>
                                    
                                    {mostrarNotificacion && (
                                        <div className="alert alert-error">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Campos Vacíos! Favor de Completarlos.</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="modal-action mt-6">
                                    <button 
                                        className="btn btn-ghost"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={agregarRegistro}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Guardar"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            
        </>
    );
};

export default LineChanges