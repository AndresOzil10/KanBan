import { useCallback, useEffect, useState } from "react"
import CloseIcon from "../icons/close"
import user from "../assets/gif/user.gif"
import gif from "../assets/gif/password.gif"
import Swal from "sweetalert2"
import add from "../assets/gif/add.gif"
import SaveIcon from "../icons/saveIcon"

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
      throw new Error('Error en la respuesta de la API');
    }
    return await resp.json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
}

const Material = ({ updateTrigger, onOpenLogin }) => { 
  const [Login, setLogin] = useState(false)
  const [Dato, setData] = useState([])
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(10)

  const fetchData = useCallback(async () => {
    const info = { aksi: "requested" }
    try {
      const response = await enviarData(url, info)
      setData(response.data || [])
    } catch (error) {
      setError("Error al obtener los datos. Intenta de nuevo más tarde.")
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los datos de materiales',
        timer: 3000
      })
    }
  }, [])

  useEffect(() => {
    fetchData();
  }, [updateTrigger])


  // Calcular los registros a mostrar en la página actual
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = Dato.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(Dato.length / recordsPerPage)

  return (
    <>
      <div className="overflow-x-auto shadow-2xl">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-base-300">
              <th className="font-bold">ID</th>
              <th className="font-bold">Bito</th>
              <th className="font-bold">NP</th>
              <th className="font-bold">Material</th>
              <th className="font-bold">Descripción</th>
              <th className="font-bold">SP</th>
              <th className="font-bold">Contenedor</th>
              <th className="font-bold">Orden</th>
              <th className="font-bold">Puesto Trabajo</th>
              <th className="font-bold">Fecha Hora</th>
              <th className="font-bold">Estatus</th>
              <th className="font-bold">Ayuda Visual</th>
              <th className="font-bold">Check</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(currentRecords) ? currentRecords : []).map((item, index) => (
              <tr key={index} className="hover:bg-base-200 transition-colors">
                <th className="font-mono">{item.id}</th>
                <td className="font-bold">{item.bito}</td>
                <td style={{ 
                  backgroundColor: item.usuario === 'SC40ADUA2' || item.usuario === 'SC40ADUA4' || item.usuario === 'SC40ADUA6' ? '#FFC800' : 
                  item.usuario === 'SC40ADUA' || item.usuario === 'SC40ADUA3' || item.usuario === 'SC40ADUA5' ? '#00FF15' : '' 
                }}>
                  {item.np}
                </td>
                <td className="font-mono">{item.material}</td>
                <td className="max-w-xs truncate" title={item.descripcion}>
                  {item.descripcion}
                </td>
                <td>{item.sp}</td>
                <td>{item.contenedor}</td>
                <td>{item.orden}</td>
                <td>{item.puesto_trabajo}</td>
                <td className="text-sm">
                  <div>{item.fecha}</div>
                  <div className="text-xs opacity-70">{item.hora}</div>
                </td>
                <td>
                  {item.estatus === "En Proceso" ? (
                    <div className="badge badge-warning animate-pulse">En Proceso</div>
                  ) : item.estatus === "Preparado" ? (
                    <div className="badge badge-success">Preparado</div>
                  ) : item.estatus === "Recibido" ? (
                    <div className="badge badge-info">Recibido</div>
                  ) : (
                    <div className="badge badge-ghost">Pendiente</div>
                  )}
                </td>
                <td>
                  {item.color?.startsWith('#') ? 
                    <div 
                      aria-label="status"  
                      className="status status-xl rounded-full border-2 border-white shadow-md" 
                      style={{ backgroundColor: item.color }}
                    ></div> 
                    : item.color === 'Rev Orden' ?
                    <div className="badge badge-secondary badge-outline">Rev Orden</div>
                    : item.color ? (
                      <div className="avatar">
                        <div className="w-16 h-12 rounded-lg border border-base-300 shadow-sm">
                          <img
                            src={`/Kanban/png/${item.color}`}
                            alt={item.color}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="badge badge-ghost">Sin imagen</div>
                    )
                  }
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${item.estatus === "Preparado" ? 'btn-disabled' : 'btn-primary btn-outline'}`}
                    onClick={() => {
                      if (onOpenLogin) {
                        onOpenLogin({ 
                          id: item.id, 
                          estatus: item.estatus,
                          tipo: "Material" 
                        });
                      } else {
                        setLogin(true);
                        setSelectedId(item.id);
                        setSelectedStatus(item.estatus);
                      }
                    }}
                    disabled={item.estatus === "Preparado"}
                    title={item.estatus === "Preparado" ? "Ya completado" : "Marcar como completado"}
                  >
                    {item.estatus === "Preparado" ? "✓ Listo" : "Check"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {error && (
          <div className="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {/* Paginación */}
        {Dato.length > recordsPerPage && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 p-4 border-t border-base-300">
            <div className="text-sm text-gray-600 mb-2 md:mb-0">
              Mostrando {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, Dato.length)} de {Dato.length} registros
            </div>
            <div className="join">
              <button
                className="join-item btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                «
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="join-item btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Material;